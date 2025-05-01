import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { challengeOptions } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

/**
 * @swagger
 * /api/challengeOptions:
 *   get:
 *     summary: Get all challenge options
 *     description: Retrieves all challenge options from the database. Requires admin access.
 *     tags: [Challenge Options]
 *     responses:
 *       200:
 *         description: Successfully retrieved challenge options
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   text:
 *                     type: string
 *                   isCorrect:
 *                     type: boolean
 *                   challengeId:
 *                     type: integer
 *       401:
 *         description: Unauthorized - Admin access required
 *   post:
 *     summary: Create a new challenge option
 *     description: Creates a new challenge option in the database. Requires admin access.
 *     tags: [Challenge Options]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - isCorrect
 *               - challengeId
 *             properties:
 *               text:
 *                 type: string
 *               isCorrect:
 *                 type: boolean
 *               challengeId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Challenge option created successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */

export const GET = async () => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.challengeOptions.findMany();

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof challengeOptions.$inferSelect;

  const data = await db
    .insert(challengeOptions)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
