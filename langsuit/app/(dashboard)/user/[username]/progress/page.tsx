"use client";

import axios from "axios";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBookOpen, FaHeart, FaStar } from "react-icons/fa"; // Importing icons
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const ProgressPage = () => {
  const { username } = useParams();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  // Colors for charts
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#a4de6c"];

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(`/api/user/${username}/progress`);
        setProgress(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching progress:", error);
        setLoading(false);
      }
    };

    fetchProgress();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Fallback to dummy data if no progress data is available
  const dummyProgress = {
    hearts: 5,
    points: 1000,
    activeCourseID: "N/A",
    totalLanguages: 3,
  };

  const displayProgress = progress || dummyProgress;

  // Pie chart data
  const pieData = [
    { name: "Languages Completed", value: displayProgress.totalLanguages },
    { name: "Remaining Hearts", value: displayProgress.hearts },
  ];

  // Dummy data for points per course
  const dummyBarData = [
    { name: "Course 1", points: 2400 },
    { name: "Course 2", points: 1398 },
    { name: "Course 3", points: 9800 },
    { name: "Course 4", points: 3908 },
  ];

  return (
    <div
      style={{
        color: "#f0f4fc",
        padding: "20px",
        background: "#1c1c1c",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {Array.from({ length: 30 }).map((_, index) => (
          <motion.div
            key={index}
            style={{
              position: "absolute",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.1)",
              width: `${Math.random() * 50 + 20}px`,
              height: `${Math.random() * 50 + 20}px`,
              bottom: "-50px",
              left: `${Math.random() * 100}vw`,
            }}
            animate={{
              y: ["-100px", "100vh"],
              x: [0, `${Math.random() * 50 - 25}px`],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", fontSize: "2.5rem" }}
      >
        Progress Overview
      </motion.h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
        }}
      >
        {/* Textual Summary Card */}
        <motion.div
          style={{
            width: "45%",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.5))",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2 style={{ display: "flex", alignItems: "center" }}>
            <FaStar style={{ marginRight: "10px", color: "#ffc107" }} />
            Your Stats
          </h2>
          <div
            style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
          >
            <FaHeart style={{ marginRight: "10px", color: "#ff6f61" }} />
            <span>Total Hearts: {displayProgress.hearts}</span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
          >
            <FaBookOpen style={{ marginRight: "10px", color: "#6c757d" }} />
            <span>Total Points: {displayProgress.points}</span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
          >
            <FaBookOpen style={{ marginRight: "10px", color: "#6c757d" }} />
            <span>Active Course ID: {displayProgress.activeCourseID}</span>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", margin: "10px 0" }}
          >
            <FaBookOpen style={{ marginRight: "10px", color: "#6c757d" }} />
            <span>Total Languages: {displayProgress.totalLanguages}</span>
          </div>
        </motion.div>

        {/* Pie Chart Card */}
        <motion.div
          style={{
            width: "50%",
            height: "300px",
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.5))",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(10px)",
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h2>Progress Breakdown</h2>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div style={{ marginTop: "40px" }}>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Course Points Distribution
        </motion.h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dummyBarData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#f0f4fc" />
            <YAxis stroke="#f0f4fc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="points" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Information Card */}
      <motion.div
        style={{
          marginTop: "40px",
          lineHeight: "1.6",
          background:
            "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.5))",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(10px)",
        }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <h2>Additional Information</h2>
        <p>
          In this section, you can track your overall progress, monitor the
          points you&apos;ve accumulated, and visualize the languages you have
          learned. Every course completed adds to your total points, while
          hearts represent your progress health. Stay consistent, and aim to
          maintain your hearts as you unlock new languages and skills.
        </p>
        <p>
          Continue your journey with us, and see how you stack up against others
          on the leaderboard!
        </p>
      </motion.div>
    </div>
  );
};

export default ProgressPage;
