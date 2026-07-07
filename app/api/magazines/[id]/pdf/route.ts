import { NextResponse } from "next/server";
import { getMagazineById, fetchViewer, getUserPurchases } from "@/lib/api";
import { jwtVerify } from "jose";
import { hasAccess, parseWpHasAllAccess } from "@/lib/access";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Secure PDF proxy endpoint.
 *
 * Returns the PDF as a **Base64-encoded JSON payload** instead of raw binary.
 * This is the industry-standard technique to prevent Internet Download Manager
 * (IDM) and similar browser extensions from intercepting the response.
 *
 * IDM hooks into the browser's network layer and hijacks any request that looks
 * like a file download (binary content types, file extensions in URL, etc.).
 * By returning `application/json` containing a Base64 string, the response is
 * invisible to IDM — it just looks like a normal API data call.
 *
 * The client decodes Base64 → Uint8Array → Blob → blob: URL → PDF.js viewer.
 *
 * Uses POST method as an additional layer of defence (IDM primarily targets GET).
 */
export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const decodedId = decodeURIComponent(id);

  try {
    // 1. Fetch magazine metadata to get the PDF URL
    const magazine = await getMagazineById(decodedId);

    if (!magazine || !magazine.pdfUrl) {
      return NextResponse.json(
        { error: "Magazine not found" },
        { status: 404 },
      );
    }

    // 2. Extract auth token from JSON body (primary) or Authorization header (fallback)
    let tokenString: string | undefined;
    try {
      const body = await request.json();
      tokenString = body?.token;
    } catch {
      // fall through
    }

    if (!tokenString) {
      const authHeader = request.headers.get("authorization");
      if (authHeader) {
        tokenString = authHeader.split(" ")[1];
      }
    }

    if (!tokenString) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // 3. Verify access
    try {
      // Verify JWT signature if secret is configured
      try {
        if (process.env.JWT_SECRET_KEY) {
          const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
          await jwtVerify(tokenString, secret);
        }
      } catch (jwtErr) {
        console.warn("[PDF Proxy] Local JWT signature check failed. Verifying session with WordPress server...", jwtErr);
      }

      // Hydrate session against WordPress
      const viewer = await fetchViewer(tokenString);

      const rawRoles = viewer?.roles?.nodes || [];
      const roleMapping = rawRoles.length > 0 ? rawRoles[0].name.toLowerCase() : "subscriber";
      const hasAllAccess = parseWpHasAllAccess(viewer?.userMembership);

      const purchases = await getUserPurchases(tokenString);
      const tempUser = {
        id: viewer?.id || "",
        name: viewer?.name || "User",
        role: roleMapping,
        has_all_access: hasAllAccess || roleMapping === "administrator",
        purchased_magazines: purchases.map((m) => m.id),
      };

      if (!hasAccess(tempUser, decodedId)) {
        return NextResponse.json(
          { error: "Access Denied. You do not own this magazine." },
          { status: 403 }
        );
      }
    } catch (err: unknown) {
      console.error("PDF Access Error:", err);
      return NextResponse.json(
        { error: "Invalid Authorization Token or Insufficient Access" },
        { status: 403 }
      );
    }

    // 4. Fetch the PDF from WordPress (static media file — no auth needed)
    const pdfResponse = await fetch(magazine.pdfUrl, {
      headers: { Accept: "application/pdf" },
    });

    if (!pdfResponse.ok) {
      console.error(`[PDF Proxy] Failed to fetch PDF from WP: ${magazine.pdfUrl} (status: ${pdfResponse.status})`);
      return NextResponse.json(
        { error: `Failed to fetch PDF from source (${pdfResponse.status})` },
        { status: 502 },
      );
    }

    // 5. Encode as Base64 and return inside JSON envelope.
    //    This makes the response invisible to IDM — it's just "application/json".
    const pdfBuffer = await pdfResponse.arrayBuffer();
    const base64 = Buffer.from(pdfBuffer).toString("base64");

    return NextResponse.json(
      { data: base64 },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store, no-cache, must-revalidate",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "SAMEORIGIN",
          "Content-Security-Policy": "frame-ancestors 'self'",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
