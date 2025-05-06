import { type NextRequest, NextResponse } from "next/server";

import db from "@/db/drizzle";
import { lessons } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";
import { getCachedResponse } from "@/lib/cache";
import { invalidateCache } from "@/lib/cache-utils";

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

export async function GET() {
  try {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const lessons = await getCachedResponse(
      'lessons',
      async () => {
        const result = await db.query.lessons.findMany();
        return result;
      },
      900 // 15 minutes cache
    );

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 },
    );
  }
};

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await getIsAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const lesson = await db.insert(lessons).values(body).returning().get();

    // Invalidate cache for lessons
    await invalidateCache('lessons');

    return NextResponse.json(lesson);
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 },
    );
  }
};
