/**
 * @swagger
 * /api/units:
 *   get:
 *     summary: Get all units
 *     description: Retrieves all units from the database. Requires admin access.
 *     tags: [Units]
 *     responses:
 *       200:
 *         description: Successfully retrieved units
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
 *       401:
 *         description: Unauthorized - Admin access required
 *   post:
 *     summary: Create a new unit
 *     description: Creates a new unit in the database. Requires admin access.
 *     tags: [Units]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Unit created successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */

import { type NextRequest, NextResponse } from "next/server";
import { getCachedResponse } from "@/lib/cache";
import { invalidateCache } from "@/lib/cache-utils";

import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export async function GET() {
  try {
    const isAdmin = getIsAdmin();
    if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

    const units = await getCachedResponse(
      'units',
      async () => {
        const result = await db.query.units.findMany();
        return result;
      },
      900 // 15 minutes cache
    );

    return NextResponse.json(units);
  } catch (error) {
    console.error("Error fetching units:", error);
    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof units.$inferSelect;

  const data = await db
    .insert(units)
    .values({
      ...body,
    })
    .returning();

  return NextResponse.json(data[0]);
};
