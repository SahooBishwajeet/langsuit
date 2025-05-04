import db from "@/db/drizzle";
import { guidance } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { guidanceId: string } }
) {
  try {
    const guidanceId = parseInt(params.guidanceId);

    await db
      .update(guidance)
      .set({ isApproved: true })
      .where(eq(guidance.id, guidanceId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[GUIDANCE_APPROVE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 