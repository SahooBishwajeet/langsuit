import db from "@/db/drizzle";
import { tickets } from "@/db/schema";
import { and, eq } from "drizzle-orm";

/**
 * @swagger
 * /api/ticket/hasPurchased:
 *   post:
 *     summary: Check if user has purchased a course
 *     description: Verifies if a user has already purchased a specific guidance course
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - guidanceId
 *               - userId
 *             properties:
 *               guidanceId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully checked purchase status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hasPurchased:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 */

export const POST = async (req: Request) => {
  try {
    const { guidanceId, userId } = await req.json();

    const userTicket = await db
      .select()
      .from(tickets)
      .where(
        and(
          and(eq(guidanceId, tickets.guidanceId), eq(userId, tickets.userId)),
          eq(true, tickets.isBooked),
        ),
      )
      .limit(1);

    const hasPurchased = userTicket.length > 0;

    return Response.json({ hasPurchased }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
