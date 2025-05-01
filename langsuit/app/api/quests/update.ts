import { db } from "@/db/drizzle"; // Adjust the import according to your setup
import { Quests } from "@/db/schema"; // Adjust the import according to your schema file
import { NextApiRequest, NextApiResponse } from "next";

/**
 * @swagger
 * /api/quests/update:
 *   put:
 *     summary: Update a quest
 *     description: Updates an existing quest's details
 *     tags:
 *       - Quests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *                 description: Quest ID
 *               title:
 *                 type: string
 *                 description: Quest title
 *               description:
 *                 type: string
 *                 description: Quest description
 *               rewardPoints:
 *                 type: number
 *                 description: Points awarded for completing the quest
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Quest expiration date
 *     responses:
 *       200:
 *         description: Quest successfully updated
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Server error while updating quest
 */
export default async function updateQuest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, title, description, rewardPoints, expiresAt } = req.body;

  try {
    const updatedQuest = await db
      .update(Quests)
      .set({
        title,
        description,
        reward_points: rewardPoints,
        expires_at: expiresAt,
      })
      .where({ id })
      .returning();

    return res.status(200).json(updatedQuest);
  } catch (error) {
    return res.status(500).json({ message: "Error updating quest", error });
  }
}
