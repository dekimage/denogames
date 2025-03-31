import { admin, firestore } from "@/firebaseAdmin"; // Use your Firebase Admin instance
import { NextResponse } from "next/server"; // Import NextResponse for app router
import { sendEmail } from "@/lib/helpers/emailHelper";
import { welcomeEmailTemplate } from "@/lib/email/templates";
import { EMAIL_CONFIG } from "@/lib/email/config";

async function checkAndClaimBacker(email) {
  try {
    const backerSnapshot = await firestore
      .collection("backers")
      .where("email", "==", email.toLowerCase())
      .where("isClaimed", "==", false)
      .limit(1)
      .get();

    if (backerSnapshot.empty) return null;

    const backerDoc = backerSnapshot.docs[0];
    return {
      id: backerDoc.id,
      ...backerDoc.data(),
    };
  } catch (error) {
    console.error("Error checking backer status:", error);
    return null;
  }
}

export async function POST(req) {
  try {
    const { email, uid, username } = await req.json(); // Get email, userId, and username from the request body

    // Get a reference to the user document in Firestore
    const userDocRef = firestore.collection("users").doc(uid);

    // Fetch the user document from Firestore
    const userDoc = await userDocRef.get();

    // Check if user is a backer
    const backer = await checkAndClaimBacker(email);

    let newUserProfile = {};

    // Check if the user document exists (correct usage: `exists` is a property)
    if (!userDoc.exists) {
      // <-- No parentheses here, just access the property
      newUserProfile = {
        createdAt: new Date(),
        username: username || "New User",
        email: email,
        uid: uid,
        purchasedProducts: backer ? [...backer.productIds] : [], // Include backer products if exists
        tags: backer ? [`${backer.source}_backer`] : [], // Add backer tag if exists
      };

      // Create the new user document in Firestore
      await userDocRef.set(newUserProfile);

      // Send welcome email only for new users
      try {
        const emailResult = await sendEmail({
          to: email,
          from: EMAIL_CONFIG.from,
          subject: "Welcome to Deno Games! 🎮",
          html: welcomeEmailTemplate({
            username: username || "Gamer",
            isBackerUser: !!backer, // Pass this to customize message for backers
          }),
        });
        console.log("Welcome email sent:", emailResult);
      } catch (emailError) {
        // Log but don't fail the signup if email fails
        console.error("Error sending welcome email:", emailError);
      }
    } else {
      // If the user already exists, fetch their data
      newUserProfile = userDoc.data();
    }

    // Now handle any pending orders
    const pendingOrdersSnapshot = await firestore
      .collection("orders")
      .where("customerEmail", "==", email)
      .where("isPending", "==", true)
      .get();

    const batch = firestore.batch();

    if (!pendingOrdersSnapshot.empty) {
      let purchasedProductIds = [];

      pendingOrdersSnapshot.forEach((doc) => {
        const orderData = doc.data();
        purchasedProductIds = [
          ...purchasedProductIds,
          ...orderData.cartItems.map((item) => item.id),
        ];

        // Update the order
        const orderRef = firestore.collection("orders").doc(doc.id);
        batch.update(orderRef, {
          userId: uid,
          isPending: false,
        });
      });

      // Merge purchased products with any backer products
      const allProductIds = [
        ...new Set([...purchasedProductIds, ...(backer?.productIds || [])]),
      ];

      // Update user's purchasedProducts
      batch.update(userDocRef, {
        purchasedProducts: admin.firestore.FieldValue.arrayUnion(
          ...allProductIds
        ),
        ...(backer && {
          tags: admin.firestore.FieldValue.arrayUnion(
            `${backer.source}_backer`
          ),
        }),
      });
    } else if (backer) {
      // If no pending orders but user is a backer, just update with backer info
      batch.update(userDocRef, {
        purchasedProducts: admin.firestore.FieldValue.arrayUnion(
          ...backer.productIds
        ),
        tags: admin.firestore.FieldValue.arrayUnion(`${backer.source}_backer`),
      });
    }

    // If there's a backer, mark their record as claimed
    if (backer) {
      const backerRef = firestore.collection("backers").doc(backer.id);
      batch.update(backerRef, {
        isClaimed: true,
        claimedBy: uid,
        claimedAt: new Date(),
      });
    }

    await batch.commit();

    // Update newUserProfile with the final state
    if (backer) {
      newUserProfile.purchasedProducts = [
        ...new Set([...newUserProfile.purchasedProducts, ...backer.productIds]),
      ];
      newUserProfile.tags = newUserProfile.tags || [];
      if (!newUserProfile.tags.includes(`${backer.source}_backer`)) {
        newUserProfile.tags.push(`${backer.source}_backer`);
      }
    }

    return NextResponse.json({ success: true, user: newUserProfile }); // Return user document
  } catch (error) {
    console.error("Error during signup and merging pending orders:", error);
    return NextResponse.json(
      { error: "Failed to handle signup or pending orders" },
      { status: 500 }
    );
  }
}
