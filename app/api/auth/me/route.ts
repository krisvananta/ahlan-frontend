import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { fetchViewer, getUserPurchases } from "@/lib/api";
import { jwtVerify } from "jose";
import { parseWpHasAllAccess } from "@/lib/access";

export async function GET() {
  try {
    // 1. Securely grab HTTP-only cookie using Next.js built-in cookie store (SEC-03)
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No authentication token found" },
        { status: 401 }
      );
    }

    // 2. Verify token cryptographically
    if (!process.env.JWT_SECRET_KEY) {
      console.warn("JWT_SECRET_KEY is missing in environment variables.");
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY || "");
    const { payload } = await jwtVerify(token, secret);

    // 3. Hydrate session against WordPress server
    let viewer = null;
    try {
      viewer = await fetchViewer(token);
    } catch (err) {
      console.error("Failed to fetch viewer during session hydration", err);
    }

    // 4. Rebuild abstract User State
    const rawRoles = viewer?.roles?.nodes || [];
    const roleMapping = rawRoles.length > 0 ? rawRoles[0].name.toLowerCase() : "subscriber";

    const hasAllAccess = parseWpHasAllAccess(viewer?.userMembership);
    const jwtData = payload.data as { user?: Record<string, unknown> } | undefined;

    const userData = {
      id: viewer?.id || (jwtData?.user?.id ? String(jwtData.user.id) : undefined),
      name: viewer?.name || (jwtData?.user?.name ? String(jwtData.user.name) : "User"),
      nickname: viewer?.nickname || (jwtData?.user?.nickname ? String(jwtData.user.nickname) : undefined),
      email: viewer?.email || (jwtData?.user?.email ? String(jwtData.user.email) : undefined),
      role: roleMapping,
      avatar: "https://www.gravatar.com/avatar/?d=mp",
      has_all_access: hasAllAccess || roleMapping === "administrator",
      purchased_magazines: (await getUserPurchases(token)).map((m) => m.id),
    };

    return NextResponse.json({
      user: userData,
      token,
    });
  } catch (error: unknown) {
    console.error("Session verification failed:", error);
    return NextResponse.json(
      { error: "Session Expired or Invalid" },
      { status: 401 }
    );
  }
}
