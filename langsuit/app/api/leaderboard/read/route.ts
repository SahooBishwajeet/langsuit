// import { authMiddleware } from '@clerk/nextjs';
import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";
import { eq } from "drizzle-orm/expressions";
import { NextRequest, NextResponse } from "next/server";
const formatLeaderboardData = (data: any[]) => {
  return data.map((entry) => ({
    id: entry.user.id,
    userName: entry.user.username,
    points: entry.points,
  }));
};

/**
 * @swagger
 * /api/leaderboard/read:
 *   get:
 *     summary: Get leaderboard data for a specific user
 *     description: Retrieves leaderboard information for a given user ID
 *     tags: [Leaderboard]
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to fetch leaderboard data for
 *     responses:
 *       200:
 *         description: Successfully retrieved user's leaderboard data
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
 *                         type: string
 *                       points:
 *                         type: integer
 *       400:
 *         description: User ID not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 */

export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json({
        status: false,
        message: "No User Id is found",
      });
    }

    const userProgressData = await db
      .select({
        userId: userProgress.userId,
        userName: userProgress.userName,
        points: userProgress.points,
      })
      .from(userProgress)
      .where(eq(userProgress.userId, user_id));

    return NextResponse.json({
      status: true,
      data: userProgressData,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      status: false,
    });
  }
};
