import { NextResponse } from "next/server";
import { fetchViewer } from "@/lib/api";
import { jwtVerify } from "jose";

export async function GET(request: Request) {
  try {
    // 1. Grab cookie implicitly attached to the browser's request
    const cookieHeader = request.headers.get("cookie") || "";
    // Extremely lightweight manual cookie parser for edge environments
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );
    const token = cookies["auth_token"];

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

    const userData = {
      id: viewer?.id || payload.data?.user?.id,
      name: viewer?.name || payload.data?.user?.name || "User",
      nickname: viewer?.nickname || payload.data?.user?.nickname,
      email: viewer?.email || payload.data?.user?.email,
      role: roleMapping,
      avatar: "https://www.gravatar.com/avatar/?d=mp",
      has_all_access: !!viewer?.hasAllAccess || roleMapping === "administrator",
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
