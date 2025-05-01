import csrf from "csrf";
import { NextApiRequest } from "next";
import { serialize, parse } from "cookie";
const tokens = new csrf();

const CSRF_SECRET = process.env.CSRF_SECRET || "my-csrf-secret";
const COOKIE_NAME = "csrf_token";

export function generateCsrfToken() {
  const secret = CSRF_SECRET;
  const token = tokens.create(secret);

  // Create a cookie with the CSRF token
  const cookie = serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return { token, cookie };
}

export function validateCsrfToken(req: NextApiRequest | Request) {
  const secret = CSRF_SECRET;

  let cookieHeader;
  let incomingToken;

  if ("headers" in req) {
    // Handling NextApiRequest
    cookieHeader = req.headers.cookie;
    incomingToken = req.headers["x-csrf-token"];
  } else {
    // Handling Request object from app directory
    cookieHeader = req.headers.get("cookie");
    incomingToken = req.headers.get("x-csrf-token");
  }

  if (!cookieHeader) return false;

  const cookies = parse(cookieHeader);
  const storedToken = cookies[COOKIE_NAME];

  console.log(incomingToken);

  if (!storedToken || !incomingToken) return false;

  return tokens.verify(secret, incomingToken);
}
