import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productIds } = await req.json();

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return NextResponse.json({ error: "No product IDs provided" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/users/sync-viewed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: (session.user as any).id,
        productIds: productIds.slice(0, 20), // Cap at 20 items
      }),
    });

    if (!res.ok) throw new Error("Backend sync failed");

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[sync-viewed] Error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
