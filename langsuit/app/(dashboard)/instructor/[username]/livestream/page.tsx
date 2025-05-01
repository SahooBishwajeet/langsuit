"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
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
  background: "#1f2937", // Dark gray for the background
  cardBackground: "#374151", // Slightly lighter dark gray for cards
  text: "#e5e7eb", // Light gray for text
  highlightText: "#d1d5db", // Slightly darker gray for smaller text
  axisLine: "#9ca3af", // Color for X and Y axis lines
  lineColor: "#82ca9d", // New color for the line chart
};

const LiveStreamAnalytics = () => {
  const streams = [
    { id: 1, date: "2024-09-15", attendees: 150 },
    { id: 2, date: "2024-09-20", attendees: 200 },
    { id: 3, date: "2024-09-25", attendees: 100 },
  ];

  const totalAttendees = streams.reduce(
    (sum, stream) => sum + stream.attendees,
    0,
  );
  const avgAttendees = (totalAttendees / streams.length).toFixed(2);

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
            Live Stream Analytics
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
                  Total Streams
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  {streams.length}
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
                  Total Attendees
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  {totalAttendees}
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
                  Avg. Attendees/Stream
                </p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: darkThemeColors.text }}
                >
                  {avgAttendees}
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
            <LineChart data={streams}>
              <XAxis dataKey="date" stroke={darkThemeColors.axisLine} />
              <YAxis stroke={darkThemeColors.axisLine} />
              <Tooltip
                contentStyle={{
                  backgroundColor: darkThemeColors.background,
                  border: "none",
                  color: darkThemeColors.text,
                }}
              />
              <Line
                type="monotone"
                dataKey="attendees"
                stroke={darkThemeColors.lineColor}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </MotionCard>
    </div>
  );
};

export default LiveStreamAnalytics;
