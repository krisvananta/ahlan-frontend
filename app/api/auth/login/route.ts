import { NextResponse } from "next/server";
import { loginWithGraphQL, fetchViewer, getUserPurchases } from "@/lib/api";
import { jwtVerify } from "jose";
import { parseWpHasAllAccess } from "@/lib/access";

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

    const hasAllAccess = parseWpHasAllAccess(wpUser?.userMembership);
    const jwtData = payload.data as { user?: Record<string, unknown> } | undefined;

    const userData = {
      id: wpUser?.id || (jwtData?.user?.id ? String(jwtData.user.id) : undefined),
      name: wpUser?.name || (jwtData?.user?.name ? String(jwtData.user.name) : "User"),
      nickname: wpUser?.nickname || (jwtData?.user?.nickname ? String(jwtData.user.nickname) : undefined),
      email: wpUser?.email || (jwtData?.user?.email ? String(jwtData.user.email) : undefined),
      role: roleMapping,
      avatar: "https://www.gravatar.com/avatar/?d=mp", // Fallback avatar
      has_all_access: hasAllAccess || roleMapping === "administrator",
      purchased_magazines: (await getUserPurchases(authData.authToken)).map((m) => m.id),
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
    const rawMessage = (error as Error)?.message || "";

    // Map raw WordPress/GraphQL error messages to clean, user-friendly text.
    // WP returns HTML-laden strings like '<strong>Error:</strong> The password...'
    // which must never be exposed to the frontend.
    let userMessage = "Email atau password salah. Silakan coba lagi.";

    const lower = rawMessage.toLowerCase();
    if (lower.includes("password") && lower.includes("incorrect")) {
      userMessage = "Password yang Anda masukkan salah. Silakan coba lagi.";
    } else if (lower.includes("unknown email") || lower.includes("unknown username") || lower.includes("not registered") || lower.includes("invalid username")) {
      userMessage = "Akun dengan email tersebut tidak ditemukan.";
    } else if (lower.includes("too many") || lower.includes("rate limit")) {
      userMessage = "Terlalu banyak percobaan login. Silakan tunggu beberapa menit.";
    } else if (lower.includes("jwt") || lower.includes("token")) {
      userMessage = "Terjadi masalah autentikasi server. Silakan coba lagi nanti.";
    }

    return NextResponse.json(
      { error: userMessage },
      { status: 401 },
    );
  }
}
