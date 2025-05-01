import db from "@/db/drizzle";
import { courses, tickets } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * @swagger
 * /api/ticket/channel:
 *   get:
 *     summary: Get course sales statistics
 *     description: Retrieves sales data for each course, showing total revenue per course
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Successfully retrieved course sales data
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
 *                       name:
 *                         type: string
 *                       value:
 *                         type: number
 *       500:
 *         description: Failed to calculate course sales
 */

export async function GET() {
  try {
    const courseSales = await db
      .select({
        name: courses.title,
        value: sql<number>`count(*) * 100`,
      })
      .from(tickets)
      .innerJoin(courses, eq(tickets.courseId, courses.id))
      .where(sql`${tickets.isBooked} = true`)
      .groupBy(courses.title)
      .orderBy(sql`count(*) DESC`); // Order by highest sales first

    return Response.json({ data: courseSales }, { status: 200 });
  } catch (error) {
    console.error("Error calculating course sales:", error);
    return Response.json(
      { error: "Failed to calculate course sales" },
      { status: 500 },
    );
  }
}
