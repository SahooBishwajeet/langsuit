import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check API health status
 *     description: Returns the current health status of the API and server timestamp
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T00:00:00.000Z
 */

export const GET = async () => {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
};

export const POST = async () => {
  return new NextResponse("Method not allowed", { status: 405 });
};
