/**
 * @swagger
 * /api/stream:
 *   get:
 *     summary: Get all live streams
 *     description: Retrieves all live stream sessions from the database
 *     tags: [LiveStream]
 *     responses:
 *       200:
 *         description: Successfully retrieved live streams
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
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   instructorId:
 *                     type: integer
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/stream:
 *   post:
 *     summary: Create a new live stream
 *     description: Creates a new live stream session in the database
 *     tags: [LiveStream]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - date
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Live stream created successfully
 *       500:
 *         description: Internal Server Error
 */

import db from "@/db/drizzle";
import { liveStream } from "@/db/schema";

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    // const { title:text,date:date } = body;
    const newStream: typeof liveStream.$inferInsert = {
      instructorId: 1,
      ...body,
    };
    await db.insert(liveStream).values(newStream);
    return Response.json(
      { message: "liveStream created successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const GET = async (req: Request, res: Response) => {
  try {
    const data = await db.query.liveStream.findMany();
    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
};
