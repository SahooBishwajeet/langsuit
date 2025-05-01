import { NextResponse } from "next/server";

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

export function cors(req: Request) {
  const origin = req.headers.get("origin") || req.headers.get("referer");

  // Allow same-origin requests and specific external origins
  const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];

  if (!origin || allowedOrigins.includes(origin)) {
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS",
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  }

  return new NextResponse("Not allowed", { status: 403 });
}
