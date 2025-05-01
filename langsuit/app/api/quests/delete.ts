import { NextApiRequest, NextApiResponse } from "next";
import db from "@/db/drizzle";
import { Quests } from "@/db/schema";

/**
 * @swagger
 * /api/quests/delete:
 *   delete:
 *     summary: Delete a quest by ID
 *     description: Deletes an existing quest from the database
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
 *                 description: The ID of the quest to delete
 *     responses:
 *       204:
 *         description: Quest successfully deleted
 *       405:
 *         description: Method not allowed
 *       500:
 *         description: Server error while deleting quest
 */
export default async function deleteQuest(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.body;

  try {
    await db.delete(Quests).where({ id });
    return res.status(204).end();
  } catch (error) {
    return res.status(500).json({ message: "Error deleting quest", error });
  }
}
