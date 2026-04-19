import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "./lib/redis";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Role-based Protection for /admin
  if (pathname.startsWith("/admin")) {
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token || token.role !== "ADMIN") {
      const url = new URL("/login", request.url);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // 2. Rate Limiting for API routes
  if (pathname.startsWith("/api")) {
    const ip = request.ip ?? "127.0.0.1";
    const key = `rate_limit:${ip}`;
    
    try {
      const requests = await (redis as any).get(key);
      
      if (requests && parseInt(requests) > 100) {
        return new NextResponse(
          JSON.stringify({ error: "Too many requests. Please try again later." }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
      
      await (redis as any).incr(key);
      await (redis as any).expire(key, 60);

    } catch (e) {
      console.error("Rate Limit Error:", e);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
