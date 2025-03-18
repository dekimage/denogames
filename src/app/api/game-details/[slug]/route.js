import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";

export async function GET(request, { params }) {
  try {
    // Get the slug from the params
    const { slug } = params;

    // Verify auth token
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get user document to check purchased products and unlocked rewards
    const userDoc = await firestore.collection("users").doc(userId).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userData = userDoc.data();
    const purchasedProducts = userData.purchasedProducts || [];
    const unlockedRewards = userData.unlockedRewards || [];

    // Get the base game document
    const gamesSnapshot = await firestore
      .collection("products")
      .where("slug", "==", slug)
      .get();

    if (gamesSnapshot.empty) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const gameDoc = gamesSnapshot.docs[0];
    const game = { id: gameDoc.id, ...gameDoc.data() };

    // Check if user owns the base game
    if (!purchasedProducts.includes(game.id)) {
      return NextResponse.json({ error: "Game not owned" }, { status: 403 });
    }

    // Get all related expansions
    const relatedExpansionIds = game.relatedExpansions || [];
    let expansions = [];

    if (relatedExpansionIds.length > 0) {
      for (const expansionId of relatedExpansionIds) {
        const expansionDoc = await firestore
          .collection("products")
          .doc(expansionId)
          .get();
        if (expansionDoc.exists) {
          const expansion = { id: expansionDoc.id, ...expansionDoc.data() };
          const isOwned = purchasedProducts.includes(expansion.id);

          // Process each expansion's provided components
          const components = (expansion.providedComponents || [])
            .filter((component) => component.fileUrl) // Only include components with fileUrls
            .map((component) => ({
              ...component,
              title: component.name,
              image: component.image,
              description:
                component.description || `Component from ${expansion.name}`,
              // Only include fileUrl if user owns this expansion
              fileUrl: isOwned ? component.fileUrl : null,
              isLocked: !isOwned,
              lockReason: `Requires ${expansion.name} expansion`,
              requirements: {
                type: "purchase",
                value: expansion.id,
              },
              price: expansion.price,
              productSlug: expansion.slug,
              type: "expansion",
              sourceName: expansion.name,
            }));

          expansion.components = components;
          expansion.isOwned = isOwned;
          expansions.push(expansion);
        }
      }
    }

    // Get all related add-ons
    const relatedAddonIds = game.relatedAddons || [];
    let addons = [];

    if (relatedAddonIds.length > 0) {
      for (const addonId of relatedAddonIds) {
        const addonDoc = await firestore
          .collection("products")
          .doc(addonId)
          .get();
        if (addonDoc.exists) {
          const addon = { id: addonDoc.id, ...addonDoc.data() };
          const isOwned = unlockedRewards.includes(addon.id);

          // Process each addon's provided components
          const components = (addon.providedComponents || [])
            .filter((component) => component.fileUrl) // Only include components with fileUrls
            .map((component) => ({
              ...component,
              title: component.name,
              image: component.image,
              description:
                component.description || `Component from ${addon.name}`,
              // Only include fileUrl if user owns this addon
              fileUrl: isOwned ? component.fileUrl : null,
              isLocked: !isOwned,
              lockReason: `Requires ${addon.name} add-on`,
              requirements: {
                type: "achievement",
                value: addon.id,
              },
              productSlug: addon.slug,
              type: "addon",
              sourceName: addon.name,
            }));

          addon.components = components;
          addon.isOwned = isOwned;
          addons.push(addon);
        }
      }
    }

    // Process game components
    const gameComponents = (game.providedComponents || [])
      .filter((component) => component.fileUrl)
      .map((component) => ({
        ...component,
        title: component.name,
        image: component.image,
        description: component.description || `Component from ${game.name}`,
        fileUrl: component.fileUrl,
        isLocked: false,
        type: "base",
        sourceName: game.name,
      }));

    // Combine all components into a structured response
    const result = {
      game,
      baseComponents: gameComponents,
      expansions: expansions,
      addons: addons,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching game details:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
