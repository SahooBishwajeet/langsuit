import db from "@/db/drizzle"; // Adjusted based on the tree structure
import { Quests, userQuests } from "@/db/schema"; // Adjusted path
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /api/user/{username}/quests:
 *   get:
 *     summary: Get user's quests
 *     description: Retrieves all quests assigned to a specific user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *     responses:
 *       200:
 *         description: User quests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   rewardPoints:
 *                     type: integer
 *                   expiresAt:
 *                     type: string
 *                     format: date-time
 *                   progress:
 *                     type: number
 *                   completed:
 *                     type: boolean
 */

export async function GET(
  req: Request,
  { params }: { params: { username: string } },
) {
  const { username } = params;

  const userQuestsData = await db
    .select({
      id: Quests.id,
      title: Quests.title,
      description: Quests.description,
      rewardPoints: Quests.rewardPoints,
      expiresAt: Quests.expiresAt,
      progress: userQuests.progress,
      completed: userQuests.completed,
    })
    .from(userQuests)
    .leftJoin(Quests, eq(userQuests.questId, Quests.id))
    .where(eq(userQuests.userId, username));

  return new Response(JSON.stringify(userQuestsData));
}
