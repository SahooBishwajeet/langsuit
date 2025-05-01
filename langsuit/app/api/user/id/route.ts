import { auth } from "@clerk/nextjs/server";

/**
 * @swagger
 * /api/user/id:
 *   get:
 *     summary: Get current user ID
 *     description: Retrieves the authenticated user's ID from Clerk
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully retrieved user ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *       401:
 *         description: User not authenticated
 *       500:
 *         description: Internal server error
 */

export const GET = async (req: Request) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response(
        JSON.stringify({ message: "User not authenticated" }),
        { status: 401 },
      );
    }

    return new Response(JSON.stringify({ userId }), { status: 200 });
  } catch (err) {
    console.error("Error fetching userId:", err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
