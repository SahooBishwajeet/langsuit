import db from "@/db/drizzle";
import { guidance, instructor, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/guidance/available:
 *   get:
 *     summary: Get all available guidance courses
 *     description: Retrieves all available guidance courses with instructor details
 *     tags: [Guidance]
 *     responses:
 *       200:
 *         description: Successfully retrieved guidance courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       price:
 *                         type: number
 *                       durationInHours:
 *                         type: integer
 *                       instructorName:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: No guidance available
 *       500:
 *         description: Internal server error
 */

export async function GET(req: NextRequest) {
  try {
    const result = await db
      .select({
        id: guidance.id,
        name: guidance.name,
        description: guidance.description,
        price: guidance.price,
        durationInHours: guidance.durationInHours,
        instructorName: users.username,
        createdAt: guidance.createdAt,
        updatedAt: guidance.updatedAt,
      })
      .from(guidance)
      .leftJoin(instructor, eq(guidance.instructorId, instructor.id))
      .leftJoin(users, eq(instructor.userId, users.id));

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: "No guidance available" },
        { status: 404 },
      );
    }
    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching guidance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
