import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization token" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // WordPress REST API URL for media uploading
    // Removing /graphql from NEXT_PUBLIC_WORDPRESS_URL config, replacing with REST route
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL 
      ? process.env.NEXT_PUBLIC_WORDPRESS_URL.replace("/graphql", "") 
      : "http://ahlan-backend.local";
    const mediaEndpoint = `${wpUrl}/wp-json/wp/v2/media`;

    const wpFormData = new FormData();
    wpFormData.append("file", file);
    if (title) wpFormData.append("title", title);

    const res = await fetch(mediaEndpoint, {
      method: "POST",
      headers: {
        Authorization: authHeader,
      },
      body: wpFormData,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`WordPress API returned ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return NextResponse.json({
      id: data.id,
      url: data.source_url,
    });
  } catch (error: any) {
    console.error("Failed to proxy media upload:", error);
    return NextResponse.json({ error: error.message || "Failed to upload" }, { status: 500 });
  }
}
