/**
 * @swagger
 * /api/user/{username}/quests:
 *   get:
 *     summary: Get user's quests
 *     description: Retrieves all quests for a specific user with their progress and details
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user whose quests to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved user's quests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   questId:
 *                     type: integer
 *                   progress:
 *                     type: number
 *                   completed:
 *                     type: boolean
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   rewardPoints:
 *                     type: integer
 *                   expiresAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

import db from "@/db/drizzle"; // Adjust the path accordingly
import { Quests, user, userQuests } from "@/db/schema"; // Adjust the path accordingly
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { username } = params;

  try {
    // First, find the user by username to get the userId
    const userResult = await db
      .select()
      .from(user)
      .where(user.username.equals(username)) // Use equals instead of eq
      .execute();

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult[0].id;

    // Then, fetch the Quests related to that user
    const userQuestData = await db
      .select({
        questId: userQuests.questId,
        progress: userQuests.progress,
        completed: userQuests.completed,
        title: Quests.title,
        description: Quests.description,
        rewardPoints: Quests.rewardPoints,
        expiresAt: Quests.expiresAt,
      })
      .from(userQuests)
      .innerJoin(Quests, Quests.id.equals(userQuests.questId)) // Use equals instead of eq
      .where(userQuests.userId.equals(userId)) // Use equals instead of eq
      .execute();

    return NextResponse.json(userQuestData);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
