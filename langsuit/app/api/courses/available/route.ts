// `app/api/courses/available/route.ts`

import db from "@/db/drizzle";
import { courses } from "@/db/schema";
import { getCachedResponse } from "@/lib/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/courses/available:
 *   get:
 *     summary: Get all available courses
 *     description: Retrieves all available courses with their details, cached for performance
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Successfully retrieved available courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       date:
 *                         type: string
 *                       time:
 *                         type: string
 *                       price:
 *                         type: number
 *                       category:
 *                         type: string
 *                       level:
 *                         type: string
 *                       imageSrc:
 *                         type: string
 *                       visits:
 *                         type: integer
 *                 total:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */

export async function GET(request: NextRequest) {
  try {
    return Response.json(
      await getCachedResponse("get_available_courses", async () => {
        // Fetch all courses with basic information
        const availableCourses = await db
          .select({
            id: courses.id,
            title: courses.title,
            description: courses.description,
            category: courses.category,
            price: courses.price,
            level: courses.level,
            imageSrc: courses.imageSrc,
            visits: courses.visits,
          })
          .from(courses)
          .orderBy(courses.visits); // Example: order by most visited courses

        // Transform the data to match the expected frontend structure
        const formattedCourses = availableCourses.map((course) => ({
          id: course.id.toString(), // Ensure ID is a string
          title: course.title,
          description: course.description || "",
          date: new Date().toISOString().split("T")[0], // Default to current date
          time: "19:30", // Default time
          price: course.price || 0,
          category: course.category,
          level: course.level,
          imageSrc: course.imageSrc,
          visits: course.visits, // Include visits for frontend usage
        }));

        return {
          courses: formattedCourses,
          total: formattedCourses.length,
        };
      }),
    );
  } catch (error) {
    console.error("Error fetching courses:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch courses",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
