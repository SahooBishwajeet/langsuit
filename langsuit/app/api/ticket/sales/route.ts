import db from "@/db/drizzle";
import { tickets } from "@/db/schema";
import { sql } from "drizzle-orm";

/**
 * @swagger
 * /api/ticket/sales:
 *   get:
 *     summary: Get monthly sales data
 *     description: Retrieves monthly sales revenue for the last 12 months
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Successfully retrieved monthly sales data
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
 *                         description: Month name (e.g., "Jan")
 *                       sales:
 *                         type: number
 *                         description: Total sales amount for the month
 *       500:
 *         description: Failed to calculate monthly revenue
 */

export async function GET() {
  try {
    const monthlyRevenue = await db
      .select({
        yearMonth: sql<string>`to_char(${tickets.purchasedAt}, 'YYYY-MM')`,
        name: sql<string>`to_char(${tickets.purchasedAt}, 'Mon')`,
        sales: sql<number>`count(*) * 100`,
      })
      .from(tickets)
      .where(sql`${tickets.isBooked} = true`)
      .where(sql`${tickets.purchasedAt} >= NOW() - INTERVAL '12 months'`)
      .groupBy(
        sql`to_char(${tickets.purchasedAt}, 'YYYY-MM'), to_char(${tickets.purchasedAt}, 'Mon')`,
      )
      .orderBy(sql`to_char(${tickets.purchasedAt}, 'YYYY-MM')`);

    const formattedData = monthlyRevenue
      .sort(
        (a, b) =>
          new Date(b.yearMonth).getTime() - new Date(a.yearMonth).getTime(),
      )
      .slice(0, 12)
      .reverse()
      .map(({ name, sales }) => ({ name, sales }));

    return Response.json({ data: formattedData }, { status: 200 });
  } catch (error) {
    console.error("Error calculating monthly revenue:", error);
    return Response.json(
      { error: "Failed to calculate monthly revenue" },
      { status: 500 },
    );
  }
}
