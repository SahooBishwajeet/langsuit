/**
 * @swagger
 * /api/units/{unitId}:
 *   get:
 *     summary: Get a unit by ID
 *     description: Retrieves a specific unit by ID. Requires admin access.
 *     tags: [Units]
 *     parameters:
 *       - in: path
 *         name: unitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the unit
 *     responses:
 *       200:
 *         description: Successfully retrieved unit
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
 *       401:
 *         description: Unauthorized - Admin access required
 *   put:
 *     summary: Update a unit
 *     description: Updates an existing unit by ID. Requires admin access.
 *     tags: [Units]
 *     parameters:
 *       - in: path
 *         name: unitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the unit to update
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
 *     responses:
 *       200:
 *         description: Unit updated successfully
 *       401:
 *         description: Unauthorized - Admin access required
 *   delete:
 *     summary: Delete a unit
 *     description: Deletes a unit by ID. Requires admin access.
 *     tags: [Units]
 *     parameters:
 *       - in: path
 *         name: unitId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the unit to delete
 *     responses:
 *       200:
 *         description: Unit deleted successfully
 *       401:
 *         description: Unauthorized - Admin access required
 */

import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";

import db from "@/db/drizzle";
import { units } from "@/db/schema";
import { getIsAdmin } from "@/lib/admin";

export const GET = async (
  _req: NextRequest,
  { params }: { params: { unitId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db.query.units.findFirst({
    where: eq(units.id, params.unitId),
  });

  return NextResponse.json(data);
};

export const PUT = async (
  req: NextRequest,
  { params }: { params: { unitId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const body = (await req.json()) as typeof units.$inferSelect;
  const data = await db
    .update(units)
    .set({
      ...body,
    })
    .where(eq(units.id, params.unitId))
    .returning();

  return NextResponse.json(data[0]);
};

export const DELETE = async (
  _req: NextRequest,
  { params }: { params: { unitId: number } },
) => {
  const isAdmin = getIsAdmin();
  if (!isAdmin) return new NextResponse("Unauthorized.", { status: 401 });

  const data = await db
    .delete(units)
    .where(eq(units.id, params.unitId))
    .returning();

  return NextResponse.json(data[0]);
};
