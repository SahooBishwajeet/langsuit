import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { challenges } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

/**
 * @swagger
 * /api/challenges:
 *   get:
 *     summary: Get all challenges
 *     description: Retrieves all challenges from the database. Requires admin access.
 *     tags: [Challenges]
 *     responses:
 *       200:
 *         description: Successfully retrieved challenges
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   type:
 *                     type: string
 *                   lessonId:
 *                     type: integer
 *       401:
 *         description: Unauthorized - Admin access required
 *   post:
 *     summary: Create a new challenge
 *     description: Creates a new challenge in the database. Requires admin access.
 *     tags: [Challenges]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - type
 *               - lessonId
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
 *         description: Challenge created successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */

export const GET = async () => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.challenges.findMany();

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof challenges.$inferSelect;

  const data = await db
    .insert(challenges)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
