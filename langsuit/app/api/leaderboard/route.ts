import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     summary: Get top 10 users leaderboard
 *     description: Retrieves top 10 users sorted by points in descending order
 *     tags: [Leaderboard]
 *     responses:
 *       200:
 *         description: Successfully retrieved leaderboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: integer
 *                       userName:
 *                         type: string
 *                       points:
 *                         type: integer
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 */

export async function GET(req: NextRequest) {
  try {
    const userProgressData = await db
      .select({
        userId: userProgress.userId,
        userName: userProgress.userName,
        points: userProgress.points,
      })
      .from(userProgress)
      .orderBy(userProgress.points)
      .limit(10);
    const orderedData = userProgressData.reverse();

    return NextResponse.json({
      status: true,
      data: orderedData,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: false,
      message: error?.message,
    });
  }
}
