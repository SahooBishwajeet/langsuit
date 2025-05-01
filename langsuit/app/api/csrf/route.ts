import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/csrf";

export async function GET() {
  const { token, cookie } = generateCsrfToken();

  // Set the token in a cookie
  const response = NextResponse.json({ csrfToken: token });
  response.headers.set("Set-Cookie", cookie);

  return response;
}
