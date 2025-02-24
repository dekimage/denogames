import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";

export function createAdminApiHandler(collectionName) {
  return {
    async GET(request) {
      try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(token);

        const userDoc = await firestore
          .collection("users")
          .doc(decodedToken.uid)
          .get();
        if (!userDoc.exists || !userDoc.data().isAdmin) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const snapshot = await firestore.collection(collectionName).get();
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return NextResponse.json({ [collectionName]: items });
      } catch (error) {
        console.error(`Error in ${collectionName} API:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async POST(request) {
      try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(token);

        const userDoc = await firestore
          .collection("users")
          .doc(decodedToken.uid)
          .get();
        if (!userDoc.exists || !userDoc.data().isAdmin) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();

        if (data.id) {
          await firestore.collection(collectionName).doc(data.id).set(data);
        } else {
          const docRef = await firestore.collection(collectionName).add(data);
          data.id = docRef.id;
        }

        return NextResponse.json({ success: true, item: data });
      } catch (error) {
        console.error(`Error in ${collectionName} API:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },

    async DELETE(request) {
      try {
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await auth.verifyIdToken(token);

        const userDoc = await firestore
          .collection("users")
          .doc(decodedToken.uid)
          .get();
        if (!userDoc.exists || !userDoc.data().isAdmin) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
          await firestore.collection(collectionName).doc(id).delete();
        } else {
          const snapshot = await firestore.collection(collectionName).get();
          const batch = firestore.batch();
          snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
          });
          await batch.commit();
        }

        return NextResponse.json({ success: true });
      } catch (error) {
        console.error(`Error in ${collectionName} API:`, error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    },
  };
}
