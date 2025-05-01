/**
 * @swagger
 * /api/ticket/booked:
 *   post:
 *     summary: Get booked tickets
 *     description: Retrieves all booked ticket locations for a specific guidance course
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guidanceId
 *             properties:
 *               guidanceId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved booked tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookedTickets:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Health check
 *     description: Simple health check endpoint
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: API route is working
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

import db from "@/db/drizzle";
import { tickets } from "@/db/schema";
import { getCachedResponse } from "@/lib/cache";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { guidanceId } = await req.json(); // Changed from courseId to guidanceId
    console.log(guidanceId);
    return Response.json(
      await getCachedResponse(`get_booked_tickets_${guidanceId}`, async () => {
        const bookedTickets = await db
          .select({
            row: tickets.row,
            column: tickets.column,
          })
          .from(tickets)
          .where(
            and(eq(guidanceId, tickets.guidanceId), eq(true, tickets.isBooked)),
          ); // Updated field names

        const locations = bookedTickets.map(
          (ticket) => `${ticket.row}${ticket.column}`,
        );

        return { bookedTickets: locations };
      }),
    );
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export async function GET() {
  return NextResponse.json({ message: "API route works!" });
}
