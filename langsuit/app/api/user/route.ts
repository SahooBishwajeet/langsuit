import { getAuth } from "@clerk/nextjs/server";

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Get user details
 *     description: Retrieves user details from Clerk by username
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized - User not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { username } = body; // Assuming 'role' is no longer needed with Clerk
    console.log(body);

    // Authenticate the request
    const { userId } = getAuth(req);
    if (!userId) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      });
    }

    // Fetch all users from Clerk (you may want to filter more efficiently if Clerk supports it)
    const response = await fetch(`https://api.clerk.dev/v1/users`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users from Clerk.");
    }

    const users = await response.json();

    // Find the user with the matching username
    const user = users.find((user: any) => user.username === username);

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
    });
  }
};
