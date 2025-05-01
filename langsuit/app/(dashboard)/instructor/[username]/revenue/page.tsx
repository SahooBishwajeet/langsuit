"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

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
  background: "#1f2937",
  cardBackground: "#374151",
  text: "#e5e7eb",
  highlightText: "#d1d5db",
  axisLine: "#9ca3af",
  areaStroke: "#6B7280",
  areaFill: "#4B5563",
};

const RevenueOverview = () => {
  const revenueData = [
    { date: "2024-01-01", total: 5000 },
    { date: "2024-02-01", total: 7000 },
    { date: "2024-03-01", total: 6500 },
    { date: "2024-04-01", total: 8000 },
    { date: "2024-05-01", total: 9500 },
    { date: "2024-06-01", total: 11000 },
    { date: "2024-07-01", total: 10500 },
    { date: "2024-08-01", total: 12000 },
    { date: "2024-09-01", total: 13500 },
  ];

  const totalRevenue = revenueData[revenueData.length - 1].total;
  const courseRevenue = totalRevenue * 0.7; // Assuming 70% of revenue is from courses
  const streamRevenue = totalRevenue * 0.3; // Assuming 30% of revenue is from streams

  return (
    <div
      className="space-y-4"
      style={{
        backgroundColor: darkThemeColors.background,
        minHeight: "100vh",
        padding: "20px",
      }}
    >
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
            Revenue Overview
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Total Revenue
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  ${totalRevenue.toFixed(2)}
                </p>
              </CardContent>
            </MotionCard>
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
                  Course Revenue
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  ${courseRevenue.toFixed(2)}
                </p>
              </CardContent>
            </MotionCard>
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
                  Stream Revenue
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  ${streamRevenue.toFixed(2)}
                </p>
              </CardContent>
            </MotionCard>
          </div>
        </CardContent>
      </MotionCard>

      <MotionCard
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        style={{ backgroundColor: darkThemeColors.cardBackground }}
      >
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <XAxis dataKey="date" stroke={darkThemeColors.axisLine} />
              <YAxis stroke={darkThemeColors.axisLine} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkThemeColors.background,
                  border: "none",
                  color: darkThemeColors.text,
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke={darkThemeColors.areaStroke}
                fill={darkThemeColors.areaFill}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </MotionCard>
    </div>
  );
};

export default RevenueOverview;
