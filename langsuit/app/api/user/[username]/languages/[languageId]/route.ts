import db, { courses, languageProgress } from "@/db/drizzle";

/**
 * @swagger
 * /api/user/{username}/languages/{languageId}:
 *   get:
 *     summary: Get user's language progress
 *     description: Retrieves progress details for a specific language and user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username of the user
 *       - in: path
 *         name: languageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the language
 *     responses:
 *       200:
 *         description: Language progress details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 progress:
 *                   type: number
 *                 languageName:
 *                   type: string
 *                 courseTitle:
 *                   type: string
 *       404:
 *         description: No progress found
 */

export async function GET(req: Request) {
  const { username, languageId } = req.params;

  // Fetch progress of the specific language for the user
  const languageDetails = await db
    .select({
      progress: languageProgress.progress,
      languageName: "Language Placeholder", // Assuming you don't have a language name, you'll need to replace this
      courseTitle: courses.title,
    })
    .from(languageProgress)
    .join(courses, courses.id.eq(languageProgress.courseId))
    .where(languageProgress.userId.eq(username))
    .andWhere(languageProgress.languageId.eq(parseInt(languageId)));

  if (languageDetails.length === 0) {
    return new Response("No progress found", { status: 404 });
  }

  return new Response(JSON.stringify(languageDetails[0]));
}
