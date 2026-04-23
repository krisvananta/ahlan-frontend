import { NextResponse } from "next/server";
import { fetchViewer } from "@/lib/api";

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

    // 2. Hydrate session against WordPress server
    const viewer = await fetchViewer(token);

    // 3. Rebuild abstract User State
    const rawRoles = viewer?.roles?.nodes || [];
    const roleMapping = rawRoles.length > 0 ? rawRoles[0].name.toLowerCase() : "subscriber";

    const userData = {
      id: viewer.id,
      name: viewer.name,
      nickname: viewer.nickname,
      email: viewer.email,
      role: roleMapping,
      avatar: "https://www.gravatar.com/avatar/?d=mp",
      has_all_access: viewer.hasAllAccess > 0 || roleMapping === "administrator",
    };

    return NextResponse.json({
      user: userData,
      token,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Session Expired or Invalid" },
      { status: 401 }
    );
  }
}
