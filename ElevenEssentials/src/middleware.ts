import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "./lib/redis";

export async function middleware(request: NextRequest) {
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    const ip = request.ip ?? "127.0.0.1";
    const key = `rate_limit:${ip}`;
    
    try {
      // Basic rate limiting: 100 requests per minute
      const requests = await (redis as any).get(key);
      
      if (requests && parseInt(requests) > 100) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
      
      const newCount = await (redis as any).incr(key);
      if (newCount === 1) {
          await (redis as any).expire(key, 60);
      }

    } catch (e) {
      console.error("Rate Limit Error:", e);
      // Fail open to ensure site stays functional if Redis is down
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
