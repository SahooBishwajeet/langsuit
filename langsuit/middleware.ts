import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import morgan from "./utils/morganLogger";
import { cors } from "./middlewares/cors";

const logger = morgan({
  format: "combined",
  stream: {
    write: (message) => console.log(`[API] ${message}`),
  },
});

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

// Rate limit settings
const rateLimit = new Map();
const RATE_LIMIT_TIME_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Maximum requests per window

export default clerkMiddleware(async (auth, request) => {
  const response = NextResponse.next();

  await logger(request);

  const ip = request.ip ?? "127.0.0.1";
  const now = Date.now();

  const _response = cors(request);
  // if (_response) return _response;

  // Get current rate limit data for this IP
  const rateLimitData = rateLimit.get(ip) ?? { count: 0, startTime: now };

  // Reset count if time window has passed
  if (now - rateLimitData.startTime > RATE_LIMIT_TIME_WINDOW) {
    rateLimitData.count = 0;
    rateLimitData.startTime = now;
  }

  // Increment request count
  rateLimitData.count++;
  rateLimit.set(ip, rateLimitData);

  // Check if rate limit exceeded
  if (rateLimitData.count > MAX_REQUESTS) {
    // return new NextResponse("Rate limit exceeded", { status: 429 });
    // Removed due to deployment error
  }

  // Continue with auth protection
  if (!isPublicRoute(request)) {
    auth().protect();
  }

  return response;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
