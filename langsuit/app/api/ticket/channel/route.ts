import db from "@/db/drizzle";
import { courses, tickets, sales } from "@/db/schema";
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
        value: sql<number>`sum(${sales.amount})`.as("total_sales"), // Sum actual payment amounts
      })
      .from(sales)
      .innerJoin(courses, sql`${sales.courseId} = ${courses.id}`) // Correct relationship
      .where(sql`${sales.courseId} IS NOT NULL`) // Only include course sales
      .groupBy(courses.id, courses.title) // Group by primary key + title
      .orderBy(sql`total_sales DESC`);

    return Response.json({ data: courseSales }, { status: 200 });
  } catch (error) {
    console.error("Error calculating course sales:", error);
    return Response.json(
      { error: "Failed to calculate course sales" },
      { status: 500 }
    );
  }
}