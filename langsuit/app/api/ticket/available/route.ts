import db from "@/db/drizzle";
import { tickets } from "@/db/schema";
import { getCachedResponse } from "@/lib/cache";
import { and, eq } from "drizzle-orm";

/**
 * @swagger
 * /api/ticket/available:
 *   get:
 *     summary: Get available tickets for a course
 *     description: Retrieves all available (unbooked) ticket locations for a specific course
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved available tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availableTickets:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal server error
 */

export async function GET(req: Request) {
  try {
    const { courseId } = await req.json(); // Ensure this is inside try-catch

    return Response.json(
      await getCachedResponse(`get_available_tickets_${courseId}`, async () => {
        const availableTickets = await db
          .select({
            row: tickets.row,
            column: tickets.column,
          })
          .from(tickets)
          .where(
            and(eq(tickets.isBooked, false), eq(tickets.courseId, courseId)),
          ); // Fix `eq` order

        const locations = availableTickets.map(
          (ticket) => `${ticket.row}${ticket.column}`,
        );

        return { availableTickets: locations };
      }),
      { status: 200 }, // Explicit status
    );
  } catch (error) {
    console.error("Error fetching available tickets:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
