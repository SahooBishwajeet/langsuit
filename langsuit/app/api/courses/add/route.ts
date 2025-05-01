import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import redis from "@/lib/redis";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/courses/add:
 *   post:
 *     summary: Add a new course
 *     description: Creates a new course in the database and invalidates the cache
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
 *               imageSrc:
 *                 type: string
 *               instructorId:
 *                 type: integer
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               level:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 course:
 *                   type: object
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to add course
 */

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse the JSON body

    const {
      title,
      imageSrc,
      instructorId,
      category,
      price,
      description,
      level,
    } = body;

    // Validate required fields
    if (!title || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Insert into the database
    const newCourse = await db.insert(courses).values({
      title,
      imageSrc: "/hearts.svg",
      instructorId: instructorId || 2,
      category,
      price: price || 0,
      description: description || null,
      level: level || null,
    });
    // Remove from the cache
    await redis.del("get_available_courses");
    // Return success response
    return NextResponse.json(
      { message: "Course added successfully", course: newCourse },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { error: "Failed to add course" },
      { status: 500 },
    );
  }
}
