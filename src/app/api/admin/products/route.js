import { NextResponse } from "next/server";
import { auth, firestore } from "@/firebaseAdmin";
import { createAdminApiHandler } from "@/lib/admin-api-handler";

// Use the generic admin API handler for products collection
export const { GET, POST, DELETE } = createAdminApiHandler("products");
