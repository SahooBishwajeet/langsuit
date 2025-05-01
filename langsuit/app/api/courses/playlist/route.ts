import db from "@/db/drizzle";
import { videos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/courses/playlist:
 *   post:
 *     summary: Get course playlist
 *     description: Retrieves all videos associated with a specific course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *             properties:
 *               courseId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved course playlist
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
 *                   url:
 *                     type: string
 *                   courseId:
 *                     type: integer
 *                   order:
 *                     type: integer
 *       400:
 *         description: Course ID is required
 *       500:
 *         description: Failed to retrieve course playlist
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }

    const courseVideos = await db.query.videos.findMany({
      where: eq(videos.courseId, Number(courseId)),
      orderBy: (videos, { asc }) => [asc(videos.order)],
    });

    return NextResponse.json(courseVideos);
  } catch (error) {
    console.error("Failed to fetch course playlist:", error);
    return NextResponse.json(
      { error: "Failed to retrieve course playlist" },
      { status: 500 },
    );
  }
}
