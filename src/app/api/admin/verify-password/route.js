import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { password } = await request.json();

    // Compare with private environment variable
    if (password === process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
