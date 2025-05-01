import db from "@/db/drizzle";
import { users } from "@/db/schema"; // Adjust import path based on your schema location
import { count } from "drizzle-orm";

/**
 * @swagger
 * /api/user/available:
 *   get:
 *     summary: Get total user count
 *     description: Retrieves the total number of users in the system
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved user count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *       500:
 *         description: Failed to fetch user count
 */

export async function GET() {
  try {
    const [result] = await db.select({ count: count() }).from(users);

    return Response.json({ count: result.count }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return Response.json(
      { error: "Failed to fetch user count" },
      { status: 500 },
    );
  }
}
