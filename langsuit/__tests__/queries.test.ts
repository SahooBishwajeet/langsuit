import db from "@/db/drizzle";
import {
  getCourseById,
  getCourseProgress,
  getCourses,
  getLesson,
  getLessonPercentage,
  getTopTenUsers,
  getUnits,
  getUserProgress,
  getUserSubscription,
} from "@/db/queries";
import { auth } from "@clerk/nextjs/server";

// Mock the external dependencies
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

jest.mock("@/db/drizzle", () => ({
  query: {
    userProgress: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    courses: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    userSubscription: {
      findFirst: jest.fn(),
    },
    units: {
      findMany: jest.fn(),
    },
    lessons: {
      findFirst: jest.fn(),
    },
  },
}));

describe("Query Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getTopTenUsers", () => {
    it("should return empty array when no user is authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const result = await getTopTenUsers();

      expect(result).toEqual([]);
      expect(db.query.userProgress.findMany).not.toHaveBeenCalled();
    });

    it("should return top 10 users when user is authenticated", async () => {
      const mockUsers = [
        {
          userId: "1",
          userName: "User1",
          userImageSrc: "img1.jpg",
          points: 100,
        },
        {
          userId: "2",
          userName: "User2",
          userImageSrc: "img2.jpg",
          points: 90,
        },
      ];

      (auth as jest.Mock).mockResolvedValue({ userId: "test-user" });
      (db.query.userProgress.findMany as jest.Mock).mockResolvedValue(
        mockUsers
      );

      const result = await getTopTenUsers();

      expect(result).toEqual(mockUsers);
      expect(db.query.userProgress.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCourses", () => {
    it("should return all courses", async () => {
      const mockCourses = [
        { id: 1, title: "Course 1" },
        { id: 2, title: "Course 2" },
      ];

      (db.query.courses.findMany as jest.Mock).mockResolvedValue(mockCourses);

      const result = await getCourses();

      expect(result).toEqual(mockCourses);
      expect(db.query.courses.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUserProgress", () => {
    it("should return null when no user is authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const result = await getUserProgress();

      expect(result).toBeNull();
      expect(db.query.userProgress.findFirst).not.toHaveBeenCalled();
    });

    it("should return user progress when user is authenticated", async () => {
      const mockProgress = { userId: "test-user", points: 50 };

      (auth as jest.Mock).mockResolvedValue({ userId: "test-user" });
      (db.query.userProgress.findFirst as jest.Mock).mockResolvedValue(
        mockProgress
      );

      const result = await getUserProgress();

      expect(result).toEqual(mockProgress);
      expect(db.query.userProgress.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe("getCourseById", () => {
    it("should return course when valid id is provided", async () => {
      const mockCourse = { id: 1, title: "Test Course" };

      (db.query.courses.findFirst as jest.Mock).mockResolvedValue(mockCourse);

      const result = await getCourseById(1);

      expect(result).toEqual(mockCourse);
      expect(db.query.courses.findFirst).toHaveBeenCalledTimes(1);
    });

    it("should return undefined when course is not found", async () => {
      (db.query.courses.findFirst as jest.Mock).mockResolvedValue(undefined);

      const result = await getCourseById(999);

      expect(result).toBeUndefined();
      expect(db.query.courses.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUserSubscription", () => {
    it("should return null when no user is authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });

      const result = await getUserSubscription();

      expect(result).toBeNull();
      expect(db.query.userSubscription.findFirst).not.toHaveBeenCalled();
    });

    it("should return subscription status with isActive true when subscription is valid", async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // 7 days in future

      const mockSubscription = {
        userId: "test-user",
        stripePriceId: "price_123",
        stripeCurrentPeriodEnd: futureDate,
      };

      (auth as jest.Mock).mockResolvedValue({ userId: "test-user" });
      (db.query.userSubscription.findFirst as jest.Mock).mockResolvedValue(
        mockSubscription
      );

      const result = await getUserSubscription();

      expect(result).toEqual({
        ...mockSubscription,
        isActive: true,
      });
      expect(db.query.userSubscription.findFirst).toHaveBeenCalledTimes(1);
    });

    it("should return subscription status with isActive false when subscription is expired", async () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7); // 7 days in past

      const mockSubscription = {
        userId: "test-user",
        stripePriceId: "price_123",
        stripeCurrentPeriodEnd: pastDate,
      };

      (auth as jest.Mock).mockResolvedValue({ userId: "test-user" });
      (db.query.userSubscription.findFirst as jest.Mock).mockResolvedValue(
        mockSubscription
      );

      const result = await getUserSubscription();

      expect(result).toEqual({
        ...mockSubscription,
        isActive: false,
      });
      expect(db.query.userSubscription.findFirst).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUnits", () => {
    it("should return empty array when no user is authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const result = await getUnits();
      expect(result).toEqual([]);
    });

    it("should return units with lesson completion status", async () => {
      const mockUser = { userId: "test-user", activeCourseId: 1 };
      const mockUnits = [
        {
          id: 1,
          order: 1,
          lessons: [
            {
              id: 1,
              order: 1,
              challenges: [
                {
                  id: 1,
                  order: 1,
                  challengeProgress: [{ completed: true }],
                },
              ],
            },
          ],
        },
      ];

      (auth as jest.Mock).mockResolvedValue({ userId: "test-user" });
      (db.query.userProgress.findFirst as jest.Mock).mockResolvedValue(
        mockUser
      );
      (db.query.units.findMany as jest.Mock).mockResolvedValue(mockUnits);

      const result = await getUnits();
      expect(result[0].lessons[0].completed).toBe(true);
    });
  });

  describe("getCourseProgress", () => {
    it("should return null when no user is authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const result = await getCourseProgress();
      expect(result).toBeNull();
    });

    it("should return first uncompleted lesson", async () => {
      const mockUser = { userId: "test-user", activeCourseId: 1 };
      const mockUnits = [
        {
          lessons: [
            {
              id: 1,
              challenges: [{ challengeProgress: [{ completed: true }] }],
            },
            {
              id: 2,
              challenges: [{ challengeProgress: [{ completed: false }] }],
            },
          ],
        },
      ];

      (auth as jest.Mock).mockResolvedValue({ userId: "test-user" });
      (db.query.userProgress.findFirst as jest.Mock).mockResolvedValue(
        mockUser
      );
      (db.query.units.findMany as jest.Mock).mockResolvedValue(mockUnits);

      const result = await getCourseProgress();
      expect(result?.activeLessonId).toBe(2);
    });
  });

  describe("getLesson", () => {
    it("should return null when no user is authenticated", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const result = await getLesson(1);
      expect(result).toBeNull();
    });

    it("should return lesson with challenge completion status", async () => {
      const mockLesson = {
        id: 1,
        challenges: [
          {
            id: 1,
            challengeOptions: [],
            challengeProgress: [{ completed: true }],
          },
        ],
      };

      (auth as jest.Mock).mockResolvedValue({ userId: "test-user" });
      (db.query.lessons.findFirst as jest.Mock).mockResolvedValue(mockLesson);

      const result = await getLesson(1);
      expect(result?.challenges[0].completed).toBe(true);
    });
  });

  describe("getLessonPercentage", () => {
    it("should return 0 when no active lesson", async () => {
      (auth as jest.Mock).mockResolvedValue({ userId: null });
      const result = await getLessonPercentage();
      expect(result).toBe(0);
    });
  });
});
