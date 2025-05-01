"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import StatCard from "../_components/StatCard";
import Header from "../_components/Header";
import SalesOverviewChart from "./_components/SalesOverviewChart";
import CategoryDistributionChart from "./_components/CategoryDistributionChart";
import SalesChannelChart from "./_components/SalesChannelChart";

const OverviewPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [isCourseLoading, setIsCourseLoading] = useState(true);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const handleAddCourse = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/courses/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: courseName,
          category: courseCategory,
          price: parseFloat(coursePrice),
        }),
      });

      if (response.ok) {
        alert("Course added successfully!");
        setCourseName("");
        setCourseCategory("");
        setCoursePrice("");
        setIsModalOpen(false);
      } else {
        alert("Failed to add course.");
      }
    } catch (error) {
      console.error("Error adding course:", error);
      alert("An error occurred while adding the course.");
    }
  };

  const [courseCount, setCourseCount] = useState(0);
  const [fetchError, setFetchError] = useState("");

  const [userCount, setUserCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchCourseCount = async () => {
      try {
        const response = await fetch("/api/courses/available");

        if (response.ok) {
          const data = await response.json();
          setCourseCount(data.courses.length); // Assuming the API returns { count: number }
          setIsCourseLoading(false);
        } else {
          setFetchError("Failed to fetch course count");
          setIsCourseLoading(false);
        }
      } catch (error) {
        console.error("Error fetching course count:", error);
        setFetchError("An error occurred while fetching course count");
        setIsCourseLoading(false);
      }
    };

    fetchCourseCount();
  }, []);

  useEffect(() => {
    const fetchUserCount = async () => {
      setIsUserLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/user/available");

        if (!response.ok) {
          throw new Error("Failed to fetch user count");
        }

        const data = await response.json();
        setUserCount(data.count);
      } catch (err) {
        console.error("Error fetching user count:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsUserLoading(false);
      }
    };

    fetchUserCount();
  }, []); // Empty dependency array means this runs once on component mount

  if (isCourseLoading || isUserLoading) return <div>Loading ...</div>;
  if (fetchError || error) return <div>Error in Fetch</div>;
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* <StatCard name="Total Sales" icon={"Zap"} value={"$5000"} color="#6366F1" /> */}
          <StatCard
            name="Total Users"
            icon={"Users"}
            value={userCount}
            color="#8B5CF6"
          />
          <StatCard
            name="Total Courses"
            icon={"ShoppingBag"}
            value={courseCount}
            color="#EC4899"
          />
          <StatCard
            name="Conversion Rate"
            icon={"BarChart2"}
            value={"15%"}
            color="#10B981"
          />
        </motion.div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add New Course
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white text-black rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add New Course</h2>
              <form onSubmit={handleAddCourse}>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="courseName"
                  >
                    Course Name
                  </label>
                  <input
                    id="courseName"
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-black bg-gray-100"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="courseCategory"
                  >
                    Course Category
                  </label>
                  <input
                    id="courseCategory"
                    type="text"
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-black bg-gray-100"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-1"
                    htmlFor="coursePrice"
                  >
                    Course Price ($)
                  </label>
                  <input
                    id="coursePrice"
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-black bg-gray-100"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-md bg-gray-200 text-black"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md text-white ${
                      isLoading ? "bg-gray-400" : "bg-green-500"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "Adding..." : "Add Course"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <SalesOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
