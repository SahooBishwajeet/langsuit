import db from "@/db/drizzle";
import { userProgress } from "@/db/schema";

/**
 * @swagger
 * /api/user/{username}/progress:
 *   get:
 *     summary: Get user's learning progress
 *     description: Retrieves all progress data for a specific user
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
 *         description: User progress retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   courseId:
 *                     type: integer
 *                   progress:
 *                     type: number
 *                   lastAccessed:
 *                     type: string
 *                     format: date-time
 */

export async function GET(req: Request) {
  const { username } = req.params;
  const progress = await db
    .select()
    .from(userProgress)
    .where(userProgress.userId.eq(username));

  return new Response(JSON.stringify(progress));
}
