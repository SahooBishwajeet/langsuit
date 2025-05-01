import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

/**
 * @swagger
 * /api/challengeOptions/{challengeOptionId}:
 *   get:
 *     summary: Get a challenge option by ID
 *     description: Retrieves a specific challenge option by its ID. Requires admin access.
 *     tags: [Challenge Options]
 *     parameters:
 *       - in: path
 *         name: challengeOptionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the challenge option to retrieve
 *     responses:
 *       200:
 *         description: Challenge option found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 text:
 *                   type: string
 *                 isCorrect:
 *                   type: boolean
 *                 challengeId:
 *                   type: integer
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Challenge option not found
 *   put:
 *     summary: Update a challenge option
 *     description: Updates an existing challenge option by its ID. Requires admin access.
 *     tags: [Challenge Options]
 *     parameters:
 *       - in: path
 *         name: challengeOptionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the challenge option to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               isCorrect:
 *                 type: boolean
 *               challengeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Challenge option updated successfully
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Challenge option not found
 *   delete:
 *     summary: Delete a challenge option
 *     description: Deletes a challenge option by its ID. Requires admin access.
 *     tags: [Challenge Options]
 *     parameters:
 *       - in: path
 *         name: challengeOptionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the challenge option to delete
 *     responses:
 *       200:
 *         description: Challenge option deleted successfully
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Challenge option not found
 */

export const GET = async (
  _req: NextRequest,
  { params }: { params: { challengeOptionId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.challengeOptions.findFirst({
    where: eq(challengeOptions.id, params.challengeOptionId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { challengeOptionId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof challengeOptions.$inferSelect;
  const data = await db
    .update(challengeOptions)
    .set({
      ...body,
    })
    .where(eq(challengeOptions.id, params.challengeOptionId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { challengeOptionId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db
    .delete(challengeOptions)
    .where(eq(challengeOptions.id, params.challengeOptionId))
    .returning();

  return NextResponse.json(data[0]);
};
