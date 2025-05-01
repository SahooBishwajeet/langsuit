import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

/**
 * @swagger
 * /api/lessons/{lessonId}:
 *   get:
 *     summary: Get a lesson by ID
 *     description: Retrieves a specific lesson by its ID. Requires admin access.
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lesson to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved lesson
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
 *                 languageId:
 *                   type: integer
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Lesson not found
 *   put:
 *     summary: Update a lesson
 *     description: Updates an existing lesson by its ID. Requires admin access.
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lesson to update
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
 *               languageId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Lesson updated successfully
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Lesson not found
 *   delete:
 *     summary: Delete a lesson
 *     description: Deletes a lesson by its ID. Requires admin access.
 *     tags: [Lessons]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the lesson to delete
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       401:
 *         description: Unauthorized - Admin access required
 *       404:
 *         description: Lesson not found
 */

export const GET = async (
  _req: NextRequest,
  { params }: { params: { lessonId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, params.lessonId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { lessonId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof lessons.$inferSelect;
  const data = await db
    .update(lessons)
    .set({
      ...body,
    })
    .where(eq(lessons.id, params.lessonId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { lessonId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db
    .delete(lessons)
    .where(eq(lessons.id, params.lessonId))
    .returning();

  return NextResponse.json(data[0]);
};
