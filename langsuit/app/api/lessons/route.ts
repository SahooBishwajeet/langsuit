import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

/**
 * @swagger
 * /api/lessons:
 *   get:
 *     summary: Get all lessons
 *     description: Retrieves all lessons from the database. Requires admin access.
 *     tags: [Lessons]
 *     responses:
 *       200:
 *         description: Successfully retrieved lessons
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
 *                   languageId:
 *                     type: integer
 *       401:
 *         description: Unauthorized - Admin access required
 *   post:
 *     summary: Create a new lesson
 *     description: Creates a new lesson in the database. Requires admin access.
 *     tags: [Lessons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - languageId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               languageId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lesson created successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */

export const GET = async () => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.lessons.findMany();

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof lessons.$inferSelect;

  const data = await db
    .insert(lessons)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
