import db from "@/db/drizzle";
import { courses, tickets, sales } from "@/db/schema";
import { sql } from "drizzle-orm";

/**
 * @swagger
 * /api/ticket/top:
 *   get:
 *     summary: Get top selling course
 *     description: Retrieves the course with the highest number of tickets sold
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Successfully retrieved top selling course
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topCourse:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     totalTickets:
 *                       type: integer
 *       404:
 *         description: No courses found with tickets
 *       500:
 *         description: Internal server error
 */

export async function GET() {
  try {
    // Get course sales data through the sales table
    const result = await db
      .select({
        courseTitle: courses.title,
        salesCount: sql<number>`count(${sales.id})`.as("sales_count"),
      })
      .from(sales)
      .innerJoin(courses, sql`${sales.courseId} = ${courses.id}`)
      .groupBy(courses.id)
      .orderBy(sql`sales_count DESC`)
      .limit(1);

    if (!result.length) {
      return Response.json(
        { error: "No course sales found" },
        { status: 404 }
      );
    }

    return Response.json({
      topCourse: {
        title: result[0].courseTitle,
        totalSales: result[0].salesCount,
      },
    });
  } catch (error) {
    console.error("Error fetching top selling course:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
