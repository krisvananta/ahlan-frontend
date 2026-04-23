import { NextResponse } from "next/server";
import { loginWithGraphQL } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // 1. Authenticate with WordPress
    const authData = await loginWithGraphQL(email, password);

    // 2. Format User response mapping WordPress roles onto our UI tracking Schema
    const rawRoles = authData.user?.roles?.nodes || [];
    const roleMapping = rawRoles.length > 0 ? rawRoles[0].name.toLowerCase() : "subscriber";

    const userData = {
      id: authData.user.id,
      name: authData.user.name,
      nickname: authData.user.nickname,
      email: authData.user.email,
      role: roleMapping,
      avatar: "https://www.gravatar.com/avatar/?d=mp", // Fallback avatar
      has_all_access: authData.user.hasAllAccess > 0 || roleMapping === "administrator",
    };

    // 3. Build response with HTTP-only cookie
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
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Invalid credentials" },
      { status: 401 },
    );
  }
}
