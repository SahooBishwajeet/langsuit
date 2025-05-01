import dashboardOrchestration from "@/utils/dashboard/adminOrchestration";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/dashboard/admin/{section}/{chart}:
 *   get:
 *     summary: Get admin dashboard data
 *     description: Retrieves chart data or stat card information for the admin dashboard based on section and chart type
 *     tags: [Admin Dashboard]
 *     security:
 *       - AdminAuth: []
 *     parameters:
 *       - in: path
 *         name: section
 *         required: true
 *         schema:
 *           type: string
 *           enum: [oversview, courses, sales, users]
 *         description: Dashboard section to retrieve data for
 *       - in: path
 *         name: chart
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pie, bar, statcard, table]
 *         description: Type of chart or statcard to fetch
 *     responses:
 *       200:
 *         description: Successfully retrieved dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   description: Stat card data
 *                   properties:
 *                     title:
 *                       type: string
 *                     value:
 *                       type: number
 *                     change:
 *                       type: number
 *                     type:
 *                       type: string
 *                 - type: object
 *                   description: Chart data
 *                   properties:
 *                     labels:
 *                       type: array
 *                       items:
 *                         type: string
 *                     datasets:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           label:
 *                             type: string
 *                           data:
 *                             type: array
 *                             items:
 *                               type: number
 *       404:
 *         description: Section or chart type not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error while fetching data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export async function GET(
  req: NextRequest,
  { params }: { params: { section: string; chart: string } }
) {
  const { section, chart } = params;

  const sectionInstance = dashboardOrchestration.getSection(section);
  if (!sectionInstance) {
    return NextResponse.json({ error: "Section not found" }, { status: 404 });
  }

  try {
    if (chart === "statcard") {
      if (
        "getStatCardData" in sectionInstance &&
        typeof sectionInstance.getStatCardData === "function"
      ) {
        const data = await sectionInstance.getStatCardData();
        return NextResponse.json(data, { status: 200 });
      } else {
        return NextResponse.json(
          { error: "Stat card data not available for this section" },
          { status: 404 }
        );
      }
    }
    // console.log(sectionInstance);
    // console.log(chart);
    // console.log(sectionInstance.getCharts());
    // console.log("Database");
    const chartInstance = sectionInstance.getCharts().get(chart);
    if (!chartInstance) {
      return NextResponse.json({ error: "Chart not found" }, { status: 404 });
    }

    const data = await chartInstance.fetchData();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
