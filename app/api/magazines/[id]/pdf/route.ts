import { NextResponse } from "next/server";
import { getMagazineById, fetchViewer, getUserPurchases } from "@/lib/api";
import { jwtVerify } from "jose";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Secure PDF proxy endpoint.
 *
 * Fetches the PDF from WordPress and streams it as a blob.
 * This prevents the client from ever seeing the direct WP media URL.
 *
 * In production:
 * - Verify auth token (JWT) before serving
 * - Verify the user has purchased this magazine
 * - Set proper cache headers
 */
export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    // 1. Fetch magazine metadata to get the PDF URL
    const magazine = await getMagazineById(id);

    if (!magazine || !magazine.pdfUrl) {
      return NextResponse.json(
        { error: "Magazine not found" },
        { status: 404 },
      );
    }

    // Auth check — verify JWT from headers
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    try {
      const tokenString = authHeader.split(" ")[1];

      // 1. Verify cryptographic JWT signature
      if (!process.env.JWT_SECRET_KEY) {
        console.warn("JWT_SECRET_KEY is missing in environment variables.");
      }
      const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY || "");
      await jwtVerify(tokenString, secret); // This validates the token isn't forged

      // 2. Hydrate session against WordPress server to get role & metadata
      const viewer = await fetchViewer(tokenString);

      // 3. Determine roles/access
      const rawRoles = viewer?.roles?.nodes || [];
      const roleMapping = rawRoles.length > 0 ? rawRoles[0].name.toLowerCase() : "subscriber";
      const isAdmin = roleMapping === "administrator";
      const hasAllAccess = viewer?.userMembership?.hasAllAccess === true || viewer?.userMembership?.hasAllAccess === "true";

      // 4. Check purchased magazines
      const purchases = await getUserPurchases();
      const hasPurchased = purchases.some((m) => m.id === id);

      if (!isAdmin && !hasAllAccess && !hasPurchased) {
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

    // In a real WP app, we would verify the token cryptographically here OR proxy the token to WP
    // For now, we will forward the token to WordPress directly during the fetch!
    
    // 2. Fetch the PDF from WordPress
    const pdfResponse = await fetch(magazine.pdfUrl, {
      headers: {
        Accept: "application/pdf",
        Authorization: authHeader,
      },
    });

    if (!pdfResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch PDF from source" },
        { status: 502 },
      );
    }

    const pdfBuffer = await pdfResponse.arrayBuffer();

    // 3. Return as blob with security headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline", // Never "attachment" — prevents download prompt
        "Cache-Control": "private, no-store, no-cache, must-revalidate",
        "X-Content-Type-Options": "nosniff",
        // Prevent embedding in iframes from other origins
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
