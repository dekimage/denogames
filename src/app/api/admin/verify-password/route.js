import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Simple in-memory store for rate limiting
// In a production/scaled environment, consider using Redis or a database
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes

function getClientIp() {
  const headersList = headers();
  // Prefer 'x-forwarded-for' if behind a proxy, otherwise 'x-real-ip' or remote address
  const forwarded = headersList.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  // For Vercel, check 'x-vercel-forwarded-for'
  const vercelForwarded = headersList.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    return vercelForwarded.trim();
  }
  // Note: Request object might have ip property in some environments, but headers are more standard
  return "unknown"; // Fallback or handle cases where IP is not available
}

export async function POST(request) {
  const ip = getClientIp();

  if (ip === "unknown") {
    // Decide how to handle requests where IP cannot be determined
    console.log("Warning: Could not determine client IP for rate limiting.");
    // Option 1: Allow the request (less secure)
    // Option 2: Deny the request (more secure, but might block legitimate users behind certain proxies)
    // return NextResponse.json({ success: false, message: "Could not verify request origin." }, { status: 400 });
  }

  const now = Date.now();
  const attemptData = loginAttempts.get(ip) || {
    count: 0,
    firstAttemptTime: now,
  };

  // Reset count if lockout duration has passed since the first attempt of the current block
  if (now - attemptData.firstAttemptTime > LOCKOUT_DURATION) {
    loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
  } else {
    attemptData.count++;
    loginAttempts.set(ip, attemptData);
  }

  if (attemptData.count > MAX_ATTEMPTS) {
    console.log(`Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json(
      {
        success: false,
        message: "Too many login attempts. Please try again later.",
      },
      { status: 429 } // 429 Too Many Requests
    );
  }

  try {
    const { username, password } = await request.json();

    // Ensure environment variables are set
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.log(
        "Error: ADMIN_USERNAME or ADMIN_PASSWORD environment variables not set."
      );
      return NextResponse.json(
        { success: false, message: "Server configuration error." },
        { status: 500 }
      );
    }

    // Compare with private environment variables
    if (username === adminUsername && password === adminPassword) {
      // Reset attempts on successful login
      loginAttempts.delete(ip);
      return NextResponse.json({ success: true });
    }

    // Log failed attempt (optional, be mindful of logging sensitive info)
    console.log(
      `Failed login attempt for username: ${username} from IP: ${ip}`
    );

    return NextResponse.json(
      { success: false, message: "Invalid credentials." },
      { status: 401 }
    );
  } catch (error) {
    console.log("Login API error:", error); // Use console.log as per rules
    // Don't reveal specific error details to the client
    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
