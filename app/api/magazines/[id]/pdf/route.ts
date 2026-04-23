import { NextResponse } from "next/server";
import { getMagazineById } from "@/lib/api";

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
       // Decode our Mock JWT payload (or standard JWT data logic)
       const tokenString = authHeader.split(" ")[1];
       const payloadBase64 = tokenString.split(".")[1];
       const userData = JSON.parse(atob(payloadBase64));

       // Access Logic Check:
       const isAdmin = userData.role === "administrator";
       const hasAllAccess = userData.has_all_access === true;
       const hasPurchased = userData.purchased_magazines?.includes(id);

       if (!isAdmin && !hasAllAccess && !hasPurchased) {
          return NextResponse.json({ error: "Access Denied. You do not own this magazine." }, { status: 403 });
       }
    } catch (err) {
       return NextResponse.json({ error: "Invalid Authorization Token" }, { status: 403 });
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
