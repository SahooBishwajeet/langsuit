import db from "@/db/drizzle";
import dashboardOrchestration, {
  DashboardOrchestration,
} from "@/utils/dashboard/adminOrchestration";

// Mock the database
jest.mock("@/db/drizzle", () => ({
  execute: jest.fn(),
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
}));

describe("Dashboard Orchestration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Singleton Pattern", () => {
    it("should return the same instance", () => {
      const instance1 = dashboardOrchestration;
      const instance2 = DashboardOrchestration.getInstance();
      expect(instance1).toBe(instance2);
    });
  });

  describe("Section Registration", () => {
    it("should have overview section registered", () => {
      const section = dashboardOrchestration.getSection("overview");
      expect(section).toBeDefined();
    });

    it("should have courses section registered", () => {
      const section = dashboardOrchestration.getSection("courses");
      expect(section).toBeDefined();
    });

    it("should have users section registered", () => {
      const section = dashboardOrchestration.getSection("users");
      expect(section).toBeDefined();
    });

    it("should have sales section registered", () => {
      const section = dashboardOrchestration.getSection("sales");
      expect(section).toBeDefined();
    });

    it("should return undefined for unregistered section", () => {
      const section = dashboardOrchestration.getSection("nonexistent");
      expect(section).toBeUndefined();
    });
  });

  describe("Overview Section", () => {
    const overviewSection = dashboardOrchestration.getSection("overview");

    it("should have correct chart types", () => {
      const charts = overviewSection?.getCharts();
      expect(charts?.get("pie")).toBeDefined();
      expect(charts?.get("bar")).toBeDefined();
      expect(charts?.get("line")).toBeUndefined();
    });
  });

  describe("Users Section", () => {
    const usersSection = dashboardOrchestration.getSection("users");

    it("should have correct chart types", () => {
      const charts = usersSection?.getCharts();
      expect(charts?.get("pie")).toBeDefined();
      expect(charts?.get("line")).toBeDefined();
      expect(charts?.get("table")).toBeDefined();
      expect(charts?.get("bar")).toBeUndefined();
    });

    it("should fetch user statistics", async () => {
      const mockUserStats = {
        rows: [{ total_users: "100" }],
      };
      (db.execute as jest.Mock).mockResolvedValue(mockUserStats);

      jest.spyOn(Promise, "all").mockResolvedValueOnce([100, 5, 75, 0.25]);

      const data = await usersSection?.getStatCardData();

      expect(data).toEqual({
        totalUsers: 100,
        todayNewUsers: 5,
        ActiveUsers: 75,
        curnRate: 0.25,
      });
    });
  });

  describe("Sales Section Charts", () => {
    const salesSection = dashboardOrchestration.getSection("sales");

    it("should fetch pie chart data correctly", async () => {
      const mockData = [
        { category: "Category1", totalSales: "1000" },
        { category: "Category2", totalSales: "2000" },
      ];

      (db.select as jest.Mock).mockReturnThis();
      (db.from as jest.Mock).mockReturnThis();
      (db.innerJoin as jest.Mock).mockReturnThis();
      (db.groupBy as jest.Mock).mockResolvedValue(mockData);

      const charts = salesSection?.getCharts();
      const pieChart = charts?.get("pie");
      const data = await pieChart?.fetchData();

      expect(data).toEqual([
        { name: "Category1", value: 1000 },
        { name: "Category2", value: 2000 },
      ]);
    });

    it("should fetch bar chart data with correct structure", async () => {
      const mockData = [
        { dayOfWeek: 1, category: "Category1", totalSales: "1000" },
      ];

      (db.select as jest.Mock).mockReturnThis();
      (db.innerJoin as jest.Mock).mockReturnThis();
      (db.groupBy as jest.Mock).mockResolvedValue(mockData);

      const charts = salesSection?.getCharts();
      const barChart = charts?.get("bar");
      const data = await barChart?.fetchData();

      expect(data.length).toBe(7); // Should have data for all days of week
      expect(data[0]).toHaveProperty("name");
      expect(data[0]).toHaveProperty("sales");
    });
  });
});
