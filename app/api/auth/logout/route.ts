import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Delete the cookie bypassing its expiration date to exactly epoch zero
  response.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, 
    path: "/",
  });

  return response;
}
