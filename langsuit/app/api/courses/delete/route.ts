import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import redis from "@/lib/redis";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/courses/delete:
 *   delete:
 *     summary: Delete a course
 *     description: Deletes a specific course and clears related cache
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
 *         description: Course deleted successfully
 *       400:
 *         description: Course ID is required
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */

export async function DELETE(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { courseId } = body;

    console.log(courseId);

    // Validate input
    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 },
      );
    }

    // Check if the course exists
    const existingCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (existingCourse.length === 0) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Delete the course
    await db.delete(courses).where(eq(courses.id, courseId));

    // Remove from the cache
    await redis.del("get_available_courses");
    // Return success response
    return NextResponse.json(
      { message: "Course deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Course deletion error:", error);

    // Handle different types of errors
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unexpected error",
      },
      { status: 500 },
    );
  }
}
