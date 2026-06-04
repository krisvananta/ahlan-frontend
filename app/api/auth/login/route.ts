import { NextResponse } from "next/server";
import { loginWithGraphQL, fetchViewer } from "@/lib/api";
import { jwtVerify } from "jose";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json(); // email is actually the identifier

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email/Username and password are required" },
        { status: 400 },
      );
    }

    // 1. Authenticate with WordPress
    const authData = await loginWithGraphQL(email, password);

    // 2. Verify token cryptographically
    if (!process.env.JWT_SECRET_KEY) {
      console.warn("JWT_SECRET_KEY is missing in environment variables.");
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY || "");
    const { payload } = await jwtVerify(authData.authToken, secret);

    // 3. Format User response mapping WordPress roles onto our UI tracking Schema
    // In case WPGraphQL JWT doesn't return the user object directly, we fallback to fetchViewer
    let wpUser = authData.user;
    if (!wpUser) {
      try {
        wpUser = await fetchViewer(authData.authToken);
      } catch (err) {
        console.error("Failed to fetch viewer during login", err);
      }
    }

    const rawRoles = wpUser?.roles?.nodes || [];
    const roleMapping = rawRoles.length > 0 ? rawRoles[0].name.toLowerCase() : "subscriber";

    const userData = {
      id: wpUser?.id || payload.data?.user?.id,
      name: wpUser?.name || payload.data?.user?.name || "User",
      nickname: wpUser?.nickname || payload.data?.user?.nickname,
      email: wpUser?.email || payload.data?.user?.email,
      role: roleMapping,
      avatar: "https://www.gravatar.com/avatar/?d=mp", // Fallback avatar
      has_all_access: !!wpUser?.hasAllAccess || roleMapping === "administrator",
    };

    // 4. Build response with HTTP-only cookie
    const response = NextResponse.json({
      user: userData,
      token: authData.authToken,
    });

    // We securely push the JWT back into the browser's cookies.
    // Setting HTTPOnly prevents XSS injection tracking.
    response.cookies.set("auth_token", authData.authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    console.error("Login Error:", error);
    const err = error as Error;
    return NextResponse.json(
      { error: err?.message || "Invalid credentials" },
      { status: 401 },
    );
  }
}
