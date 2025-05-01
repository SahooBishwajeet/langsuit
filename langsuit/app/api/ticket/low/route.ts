import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { asc } from "drizzle-orm";

/**
 * @swagger
 * /api/ticket/low:
 *   get:
 *     summary: Get least visited course
 *     description: Retrieves the course with the lowest number of visits
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Successfully retrieved least visited course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leastVisitedCourse:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     visits:
 *                       type: integer
 *       404:
 *         description: No courses found
 *       500:
 *         description: Internal server error
 */

export async function GET() {
  try {
    const result = await db
      .select({
        title: courses.title,
        visits: courses.visits,
      })
      .from(courses)
      .orderBy(asc(courses.visits))
      .limit(1);

    if (!result.length) {
      return Response.json({ error: "No courses found" }, { status: 404 });
    }

    return Response.json({
      leastVisitedCourse: {
        title: result[0].title,
        visits: result[0].visits,
      },
    });
  } catch (error) {
    console.error("Error fetching least visited course:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
