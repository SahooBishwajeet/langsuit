import db from "@/db/drizzle";
import { courses, sales, users } from "@/db/schema";
import { sql, eq } from "drizzle-orm";

export class DashboardOrchestration {
  private static instance: DashboardOrchestration;
  private sections: Map<string, Section> = new Map();

  private constructor() {}

  public static getInstance(): DashboardOrchestration {
    if (!DashboardOrchestration.instance) {
      DashboardOrchestration.instance = new DashboardOrchestration();
    }
    return DashboardOrchestration.instance;
  }

  public registerSection(sectionName: string, section: Section) {
    this.sections.set(sectionName, section);
  }

  public getSection(sectionName: string): Section | undefined {
    return this.sections.get(sectionName);
  }
}

abstract class Section {
  protected chartFactory: ChartFactory;

  constructor(chartFactory: ChartFactory) {
    this.chartFactory = chartFactory;
  }

  abstract getCharts(): Map<string, Chart>;
}

interface ChartFactory {
  createPieChart(): PieChart;
  createBarChart(): BarChart;
  createLineChart(): LineChart;
  createTable(): Table;
}

abstract class Chart {
  abstract fetchData(): Promise<any>;
}

abstract class PieChart extends Chart {}
abstract class BarChart extends Chart {}
abstract class LineChart extends Chart {}
abstract class Table extends Chart {}

interface OverviewStatCardData {
  totalSales: number;
  newUsers: number;
  totalCourses: number;
  conversionRate: number;
}

class OverviewSection extends Section {
  constructor() {
    super(new OverviewChartFactory());
  }

  getCharts(): Map<string, Chart> {
    const charts = new Map<string, Chart>();
    charts.set("pie", this.chartFactory.createPieChart());
    charts.set("bar", this.chartFactory.createBarChart());
    return charts;
  }

  async getStatCardData(): Promise<OverviewStatCardData> {
    const [totalSales, newUsers, totalCourses, conversionRate] =
      await Promise.all([
        this.getTotalSales(),
        this.getNewUsers(),
        this.getTotalCourses(),
        this.getConversionRate(),
      ]);

    return {
      totalSales,
      newUsers,
      totalCourses,
      conversionRate,
    };
  }

  private async getTotalSales(): Promise<number> {
    const result = await db
      .select({
        totalSales: sql`COALESCE(SUM(amount), 0)::BIGINT`.as("totalSales"),
      })
      .from(sales);
    // console.log(result);
    return Number(result[0]?.totalSales) || 0;
  }

  private async getNewUsers(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const result = await db
      .select({
        newUsers: sql`COUNT(*)`.as("newUsers"),
      })
      .from(users)
      .where(sql`registered_at >= ${thirtyDaysAgo}`);
    return Number(result[0]?.newUsers) || 0;
  }

  private async getTotalCourses(): Promise<number> {
    const result = await db.execute(
      sql`SELECT COUNT(*) AS totalCourses FROM courses`,
    );

    return Number(result.rows[0]?.totalcourses) || 0;
  }

  private async getConversionRate(): Promise<number> {
    const [totalUsers, paidUsers] = await Promise.all([
      db.select({ count: sql`COUNT(*)` }).from(users),
      db
        .select({ count: sql`COUNT(*)` })
        .from(users)
        .where(sql`has_purchased = true`),
    ]);

    const totalCount = Number(totalUsers[0]?.count) || 0;
    const paidCount = Number(paidUsers[0]?.count) || 0;

    if (totalCount === 0) return 0;

    const rate = (paidCount / totalCount) * 100;
    return Number(rate.toFixed(2));
  }
}

interface CoursesStatCardData {
  totalCourses: number;
  topSelling: number;
  lowestVisit: number;
  totalRevenue: number;
}

class CoursesSection extends Section {
  constructor() {
    super(new CoursesChartFactory());
  }

  getCharts(): Map<string, Chart> {
    const charts = new Map<string, Chart>();
    // charts.set('bar', this.chartFactory.createBarChart());
    charts.set("table", this.chartFactory.createTable());
    return charts;
  }

  async getStatCardData(): Promise<CoursesStatCardData> {
    const [totalCourses, topSelling, lowestVisit, totalRevenue] =
      await Promise.all([
        this.getTotalCourses(),
        this.getTopSellingCourse(),
        this.getLowestVisitCourse(),
        this.getTotalRevenue(),
      ]);

    return {
      totalCourses,
      topSelling,
      lowestVisit,
      totalRevenue,
    };
  }

  private async getTotalCourses(): Promise<number> {
    const result = await db.execute(
      sql`SELECT COUNT(*) AS total_courses FROM courses`,
    ); // Don't Know why drizzle with neon does not support .count() or raw SQL queries
    return Number(result.rows[0]?.total_courses) || 0;
  }

  private async getTopSellingCourse(): Promise<number> {
    const result = await db
      .select({
        courseId: sales.courseId, // Ensure course ID is included for clarity
        salesCount: sql`COUNT(course_id)`.as("salesCount"),
      })
      .from(sales)
      .groupBy(sales.courseId)
      .orderBy(sql`COUNT(*)`, "desc") // First order by sales count
      .limit(1);
    // console.log(result);
    // console.log(result1);
    return Number(result[0]?.salesCount) || 0;
  }

  private async getLowestVisitCourse(): Promise<number> {
    const result = await db
      .select({
        courseId: sales.courseId, // Ensure course ID is included for clarity
        salesCount: sql`COUNT(course_id)`.as("salesCount"),
      })
      .from(sales)
      .groupBy(sales.courseId)
      .orderBy(sql`COUNT(*)`, "asc") // First order by sales count
      .limit(1);

    return Number(result[0]?.salesCount) || 0;
  }

  private async getTotalRevenue(): Promise<number> {
    const result = await db.execute(
      sql`SELECT COALESCE(SUM(amount), 0) AS totalRevenue FROM sales`,
    );
    // console.log(result);
    return Number(result.rows[0]?.totalrevenue) || 0;
  }
}

interface UsersStatCardData {
  totalUsers: number;
  todayNewUsers: number;
  ActiveUsers: number;
  curnRate: number;
}

class UsersSection extends Section {
  constructor() {
    super(new UsersChartFactory());
  }

  getCharts(): Map<string, Chart> {
    const charts = new Map<string, Chart>();
    charts.set("pie", this.chartFactory.createPieChart());
    charts.set("line", this.chartFactory.createLineChart());
    charts.set("table", this.chartFactory.createTable());
    return charts;
  }

  async getStatCardData(): Promise<UsersStatCardData> {
    const [totalUsers, todayNewUsers, activeUsers, churnRate] =
      await Promise.all([
        this.getTotalUsers(),
        this.getTodayNewUsers(),
        this.getActiveUsers(),
        this.getChurnRate(),
      ]);

    return {
      totalUsers,
      todayNewUsers,
      ActiveUsers: activeUsers,
      curnRate: churnRate,
    };
  }

  private async getTotalUsers(): Promise<number> {
    const result = await db.execute(
      sql`SELECT COUNT(*) AS total_users FROM users`,
    );
    return Number(result.rows[0]?.total_users) || 0;
  }

  private async getTodayNewUsers(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const result = await db.execute(sql`
            SELECT 
            DATE(registered_at) as date,
            COUNT(*) as user_count
            FROM ${users}
            WHERE registered_at >= ${sevenDaysAgo.toISOString()}
            GROUP BY DATE(registered_at)
            ORDER BY date ASC
        `);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const data = result.rows.map((row) => ({
      day: daysOfWeek[new Date(row.date).getDay()],
      users: Number(row.user_count),
    }));

    if (data.length > 0) {
      const todayCount = data[data.length - 1].users;
      return todayCount;
    } else {
      return 0;
    }
  }

  private async getActiveUsers(): Promise<number> {
    const result = await db.execute(sql`
            SELECT COUNT(*) AS active_users 
            FROM users
            WHERE has_purchased = true
        `);

    return Number(result.rows[0]?.active_users) || 0;
  }

  private async getChurnRate(): Promise<number> {
    const resultTotal = await db.execute(
      sql`SELECT COUNT(*) AS total_users FROM users`,
    );
    const resultChurned = await db.execute(sql`
            SELECT COUNT(*) AS churned_users 
            FROM users
            WHERE has_purchased = false
        `);

    const totalUsers = Number(resultTotal.rows[0]?.total_users) || 0;
    const churnedUsers = Number(resultChurned.rows[0]?.churned_users) || 0;

    // Calculate churn rate
    const churnRate = totalUsers === 0 ? 0 : churnedUsers / totalUsers;
    return parseFloat(churnRate.toFixed(2));
  }
}

interface SalesStatCardData {
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  salesGrowth: number;
}

class SalesSection extends Section {
  constructor() {
    super(new SalesChartFactory());
  }

  getCharts(): Map<string, Chart> {
    const charts = new Map<string, Chart>();
    charts.set("pie", this.chartFactory.createPieChart());
    charts.set("bar", this.chartFactory.createBarChart());
    return charts;
  }

  async getStatCardData(): Promise<SalesStatCardData> {
    const [totalRevenue, avgOrderValue, conversionRate, salesGrowth] =
      await Promise.all([
        this.getTotalRevenue(),
        this.getAvgOrderValue(),
        this.getConversionRate(),
        this.getSalesGrowth(),
      ]);

    return {
      totalRevenue,
      avgOrderValue,
      conversionRate,
      salesGrowth,
    };
  }

  private async getTotalRevenue(): Promise<number> {
    const result = await db
      .select({
        totalSales: sql`COALESCE(SUM(amount), 0)::BIGINT`.as("totalSales"),
      })
      .from(sales);
    // console.log(result);
    return Number(result[0]?.totalSales) || 0;
  }

  private async getAvgOrderValue(): Promise<number> {
    const result = await db
      .select({
        avgOrderValue: sql`COALESCE(AVG(amount), 0)::BIGINT`.as(
          "avgOrderValue",
        ),
      })
      .from(sales);
    return Number((result[0]?.avgOrderValue / 100).toFixed(2));
  }

  private async getConversionRate(): Promise<number> {
    const [totalUsers, paidUsers] = await Promise.all([
      db.select({ count: sql`COUNT(*)` }).from(users),
      db.select({ count: sql`COUNT(DISTINCT user_id)::INT` }).from(sales),
    ]);

    console.log(totalUsers);
    console.log(paidUsers);

    const totalCount = Number(totalUsers[0]?.count) || 0;
    const paidCount = Number(paidUsers[0]?.count) || 0;

    if (totalCount === 0) return 0;

    const rate = (paidCount / totalCount) * 100;
    return Number(rate.toFixed(2));
  }

  private async getSalesGrowth(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [currentPeriodSales, previousPeriodSales] = await Promise.all([
      db
        .select({
          total: sql`COALESCE(SUM(amount), 0)`.as("total"),
        })
        .from(sales)
        .where(sql`created_at >= ${thirtyDaysAgo}`),
      db
        .select({
          total: sql`COALESCE(SUM(amount), 0)`.as("total"),
        })
        .from(sales)
        .where(
          sql`created_at >= ${sql`${thirtyDaysAgo}::date - INTERVAL '30 days'`} AND created_at < ${thirtyDaysAgo}`,
        ),
    ]);

    const currentTotal = Number(currentPeriodSales[0]?.total) || 0;
    const previousTotal = Number(previousPeriodSales[0]?.total) || 0;

    if (previousTotal === 0) return currentTotal > 0 ? 100 : 0;

    const growthRate = ((currentTotal - previousTotal) / previousTotal) * 100;
    return Number(growthRate.toFixed(2));
  }
}

class OverviewChartFactory implements ChartFactory {
  createPieChart(): PieChart {
    return new OverviewPieChart();
  }

  createBarChart(): BarChart {
    return new OverviewBarChart();
  }

  createLineChart(): LineChart {
    throw new Error("Line chart not implemented for Overview section");
  }

  createTable(): Table {
    throw new Error("Line chart not implemented for Overview section");
  }
}

class CoursesChartFactory implements ChartFactory {
  createPieChart(): PieChart {
    throw new Error("Line chart not implemented for Overview section");
  }

  createBarChart(): BarChart {
    throw new Error("Line chart not implemented for Overview section");
  }

  createLineChart(): LineChart {
    throw new Error("Line chart not implemented for Overview section");
  }

  createTable(): Table {
    return new CoursesTable();
  }
}

class SalesChartFactory implements ChartFactory {
  createPieChart(): PieChart {
    return new SalesPieChart();
  }

  createBarChart(): BarChart {
    return new SalesBarChart();
  }

  createLineChart(): LineChart {
    return new SalesLineChart();
  }

  createTable(): Table {
    throw new Error("Line chart not implemented for Overview section");
  }
}

class UsersChartFactory implements ChartFactory {
  createPieChart(): PieChart {
    return new UsersPieChart();
  }

  createBarChart(): BarChart {
    throw new Error("Bar chart not implemented for Users section");
  }

  createLineChart(): LineChart {
    return new UsersLineChart();
  }

  createTable(): Table {
    return new UsersTable();
  }
}

class OverviewPieChart extends PieChart {
  async fetchData(): Promise<Array<{ name: string; value: number }>> {
    const result = await db
      .select({
        category: courses.category,
        count: sql`COUNT(*)`.as("count"),
      })
      .from(courses)
      .groupBy(courses.category);

    const totalCourses = result.reduce(
      (acc, curr) => acc + Number(curr.count),
      0,
    );

    return result.map((row) => ({
      name: row.category,
      value: (Number(row.count) / totalCourses) * 100, // Percentage of total
    }));
  }
}

class OverviewBarChart extends BarChart {
  async fetchData(): Promise<any> {
    return await db
      .select({
        category: courses.category,
        averageRating: sql`AVG(rating)`,
      })
      .from(courses)
      .groupBy(courses.category);
  }
}

class CoursesTable extends Table {
  async fetchData(): Promise<any> {
    const result = await db.execute(sql`SELECT * FROM courses`);
    return result.rows;
  }
}

class UsersPieChart extends PieChart {
  async fetchData(): Promise<any> {
    const result = await db.execute(sql`
            SELECT role, COUNT(*) AS value
            FROM users
            GROUP BY role;
        `);

    const data = result.rows.map((row: any) => ({
      name: row.role,
      value: Number(row.value),
    }));

    return data;
  }
}

class UsersTable extends Table {
  async fetchData(): Promise<any> {
    // console.log("Inside Table");
    const result = await db.execute(sql`SELECT * FROM users`);
    return result.rows;
  }
}

class UsersLineChart extends LineChart {
  async fetchData(): Promise<any> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const result = await db.execute(sql`
            SELECT 
            DATE(registered_at) as date,
            COUNT(*) as user_count
            FROM ${users}
            WHERE registered_at >= ${sevenDaysAgo.toISOString()}
            GROUP BY DATE(registered_at)
            ORDER BY date ASC
        `);

    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const data = result.rows.map((row) => ({
      day: daysOfWeek[new Date(row.date).getDay()],
      users: Number(row.user_count),
    }));

    return data;
  }
}
class SalesBarChart extends BarChart {
  async fetchData(): Promise<any> {
    const result = await db
      .select({
        dayOfWeek: sql`EXTRACT(DOW FROM ${sales.createdAt})`.as("dayOfWeek"),
        category: courses.category,
        totalSales: sql`SUM(${sales.amount})`.as("totalSales"),
      })
      .from(sales)
      .innerJoin(courses, eq(sales.courseId, courses.id))
      .groupBy(sql`EXTRACT(DOW FROM ${sales.createdAt})`, courses.category);

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const data = weekdays.map((day) => ({
      name: day,
      sales: 0,
    }));

    result.forEach((row) => {
      const dayIdx = Math.floor(Number(row.dayOfWeek));
      data[dayIdx].sales += Number(row.totalSales);
    });

    return data;
  }
}

class SalesLineChart extends LineChart {
  async fetchData(): Promise<any> {
    return await db
      .select({
        date: sql`DATE_TRUNC('month', courses.created_at)`,
        sales: sql`SUM(sales)`,
      })
      .from(courses)
      .groupBy(sql`DATE_TRUNC('month', courses.created_at)`);
  }
}

class SalesPieChart extends PieChart {
  async fetchData(): Promise<any> {
    const result = await db
      .select({
        category: courses.category,
        totalSales: sql`SUM(${sales.amount})`.as("totalSales"),
      })
      .from(sales)
      .innerJoin(courses, eq(sales.courseId, courses.id))
      .groupBy(courses.category);

    const data = result.map((row) => ({
      name: row.category,
      value: Number(row.totalSales),
    }));

    return data;
  }
}

const dashboardOrchestration = DashboardOrchestration.getInstance();

dashboardOrchestration.registerSection("overview", new OverviewSection());
dashboardOrchestration.registerSection("courses", new CoursesSection());
dashboardOrchestration.registerSection("users", new UsersSection());
dashboardOrchestration.registerSection("sales", new SalesSection());

export default dashboardOrchestration;
