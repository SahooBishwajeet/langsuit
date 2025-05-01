import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

/**
 * @swagger
 * /api/challenges/{challengeId}:
 *   get:
 *     summary: Get a challenge by ID
 *     description: Retrieves a specific challenge by its ID. Requires admin access.
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the challenge to retrieve
 *     responses:
 *       200:
 *         description: Challenge found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 type:
 *                   type: string
 *                 lessonId:
 *                   type: integer
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Challenge not found
 *   put:
 *     summary: Update a challenge
 *     description: Updates an existing challenge by its ID. Requires admin access.
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the challenge to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *               lessonId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Challenge updated successfully
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Challenge not found
 *   delete:
 *     summary: Delete a challenge
 *     description: Deletes a challenge by its ID. Requires admin access.
 *     tags: [Challenges]
 *     parameters:
 *       - in: path
 *         name: challengeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the challenge to delete
 *     responses:
 *       200:
 *         description: Challenge deleted successfully
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Challenge not found
 */

export const GET = async (
  _req: NextRequest,
  { params }: { params: { challengeId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.challenges.findFirst({
    where: eq(challenges.id, params.challengeId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { challengeId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof challenges.$inferSelect;
  const data = await db
    .update(challenges)
    .set({
      ...body,
    })
    .where(eq(challenges.id, params.challengeId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { challengeId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db
    .delete(challenges)
    .where(eq(challenges.id, params.challengeId))
    .returning();

  return NextResponse.json(data[0]);
};
