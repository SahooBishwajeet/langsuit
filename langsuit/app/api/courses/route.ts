import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieves all courses from the database. Requires admin access.
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Successfully retrieved courses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   category:
 *                     type: string
 *                   price:
 *                     type: number
 *                   level:
 *                     type: string
 *                   imageSrc:
 *                     type: string
 *                   instructorId:
 *                     type: integer
 *                   visits:
 *                     type: integer
 *       401:
 *         description: Unauthorized - Admin access required
 *   post:
 *     summary: Create a new course
 *     description: Creates a new course in the database. Requires admin access.
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               level:
 *                 type: string
 *               imageSrc:
 *                 type: string
 *               instructorId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Course created successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */

export const GET = async () => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.courses.findMany();

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof courses.$inferSelect;

  const data = await db
    .insert(courses)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
