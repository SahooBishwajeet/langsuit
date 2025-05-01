import db from "@/db/drizzle";
import { languageProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/user/{username}/languages:
 *   get:
 *     summary: Get all user's language progress
 *     description: Retrieves progress for all languages a user is learning
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *     responses:
 *       200:
 *         description: Language progress data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   languageId:
 *                     type: integer
 *                   progress:
 *                     type: number
 *       400:
 *         description: Username is not present
 *       500:
 *         description: Internal server error
 */

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        {
          message: "UserName is not present",
        },
        { status: 400 },
      );
    }

    const userQuestsData = await db
      .select()
      .from(languageProgress)
      .where(eq(languageProgress.username, username));

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
}
