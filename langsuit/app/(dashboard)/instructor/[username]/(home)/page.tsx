"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import AddCourseModal from "./_components/AddCourseModal";
const MotionCard = motion(Card);

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const chartVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.8, ease: "easeOut" },
  },
};

const darkThemeColors = {
  background: "#1f2937", // Dark gray for the background
  cardBackground: "#374151", // Slightly lighter dark gray for cards
  text: "#e5e7eb", // Light gray for text
  highlightText: "#d1d5db", // Slightly darker gray for smaller text
  axisLine: "#9ca3af", // Color for X and Y axis lines
  tooltipBackground: "#333333", // Tooltip background color
};

interface Course {
  id: number;
  title: string;
  visits: number;
  price: number;
}

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { username } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (!username) throw new Error("Username is required");

        const response = await fetch("/api/guidance/instructor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch course data");
        }

        const data = await response.json();
        setCourses(data.courses || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchCourses();
  }, [username]);

  const totalVisits = courses.reduce((sum, course) => sum + course.visits, 0);
  const avgPrice =
    courses.length > 0
      ? (
          courses.reduce((sum, course) => sum + course.price, 0) /
          courses.length /
          100
        ).toFixed(2)
      : "0.00";

  const handleAddCourse = (newCourse: Course) => {
    setCourses((prevCourses) => [...prevCourses, newCourse]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-lg">Loading course details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-red-500">
        <div className="text-center">
          <h2 className="text-2xl mb-4">Error Loading Courses</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="space-y-4"
      style={{
        backgroundColor: darkThemeColors.background,
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      {/* Summary Cards */}
      <MotionCard
        className="w-full"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        style={{ backgroundColor: darkThemeColors.cardBackground }}
      >
        <CardHeader>
          <h2
            className="text-2xl font-bold"
            style={{ color: darkThemeColors.text }}
          >
            Course Management
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Courses */}
            <MotionCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ backgroundColor: darkThemeColors.cardBackground }}
            >
              <CardContent>
                <p
                  className="text-lg font-semibold"
                  style={{ color: darkThemeColors.highlightText }}
                >
                  Total Courses
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  {courses.length}
                </p>
              </CardContent>
            </MotionCard>

            {/* Total Visits */}
            <MotionCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ backgroundColor: darkThemeColors.cardBackground }}
            >
              <CardContent>
                <p
                  className="text-lg font-semibold"
                  style={{ color: darkThemeColors.highlightText }}
                >
                  Total Visits
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  {totalVisits}
                </p>
              </CardContent>
            </MotionCard>

            {/* Average Price */}
            <MotionCard
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              style={{ backgroundColor: darkThemeColors.cardBackground }}
            >
              <CardContent>
                <p
                  className="text-lg font-semibold"
                  style={{ color: darkThemeColors.highlightText }}
                >
                  Avg. Price
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  ${avgPrice}
                </p>
              </CardContent>
            </MotionCard>
          </div>
        </CardContent>
      </MotionCard>

      {/* Bar Chart */}
      <MotionCard
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        style={{ backgroundColor: darkThemeColors.cardBackground }}
      >
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courses}>
              <XAxis dataKey="title" stroke={darkThemeColors.axisLine} />
              <YAxis stroke={darkThemeColors.axisLine} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkThemeColors.tooltipBackground,
                  color: darkThemeColors.text,
                }}
                itemStyle={{ color: darkThemeColors.text }}
              />
              <Legend />
              <Bar dataKey="visits" fill="#82ca9d" name="Visits" />
              <Bar dataKey="price" fill="#8884d8" name="Price" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </MotionCard>

      <div>
        <CardHeader>
          <h2>Course Management</h2>
          <Button onClick={() => setIsModalOpen(true)}>Add New Course</Button>
        </CardHeader>

        <AddCourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddCourse={handleAddCourse}
        />
      </div>
    </div>
  );
};

export default CourseManagement;
