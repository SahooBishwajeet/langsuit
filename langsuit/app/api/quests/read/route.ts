import db from "@/db/drizzle";
import { userQuests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/quests/read:
 *   get:
 *     summary: Get user quests
 *     description: Retrieves all quests associated with a specific user
 *     tags:
 *       - Quests
 *     parameters:
 *       - in: query
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to fetch quests for
 *     responses:
 *       200:
 *         description: List of user quests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: number
 *       400:
 *         description: User ID is not present
 *       500:
 *         description: Internal server error
 */

// GET handler
export const GET = async (req: NextRequest) => {
  try {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json(
        {
          message: "User Id is not present",
        },
        { status: 400 },
      );
    }
    const userQuestsData = await db
      .select()
      .from(userQuests)
      .where(eq(userQuests.userId, user_id));

    return NextResponse.json(userQuestsData, { status: 200 });
  } catch (err) {
    console.error("Error in GET method:", err);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 },
    );
  }
};
