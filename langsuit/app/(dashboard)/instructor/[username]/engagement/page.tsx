"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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
  background: "#1f2937", // Dark gray for the background
  cardBackground: "#374151", // Slightly lighter dark gray for cards
  text: "#e5e7eb", // Light gray for text
  highlightText: "#d1d5db", // Slightly darker gray for smaller text
  axisLine: "#9ca3af", // Color for X and Y axis lines
  tooltipBackground: "#333333", // Tooltip background color
};

const StudentEngagement = () => {
  const totalFollowers = 500;
  const activeUsers = 700;
  const inactiveUsers = 300;

  const data = [
    { name: "Active", value: activeUsers },
    { name: "Inactive", value: inactiveUsers },
  ];

  const COLORS = ["#00C49F", "#FFBB28"];

  // Custom label formatter
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={darkThemeColors.text}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${data[index].name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

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
            Student Engagement
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  Total Followers
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  {totalFollowers}
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
                  Active Students
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  {activeUsers}
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
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel} // Custom label rendering
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkThemeColors.tooltipBackground,
                  border: "none",
                  color: darkThemeColors.text,
                }}
                formatter={(value, name) => [`${value} users`, `${name}`]} // Format the tooltip text
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </MotionCard>
    </div>
  );
};

export default StudentEngagement;
