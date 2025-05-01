"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const LanguagesPage = () => {
  const { userId } = useAuth();
  const { user } = useUser();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for demonstration purposes
  const dummyData = [
    { languageId: 1, languageName: "English", progress: 100 },
    { languageId: 2, languageName: "Spanish", progress: 75 },
    { languageId: 3, languageName: "French", progress: 50 },
    { languageId: 4, languageName: "German", progress: 25 },
    { languageId: 5, languageName: "Italian", progress: 0 },
  ];

  useEffect(() => {
    const fetchLanguages = async () => {
      if (!user || !userId) {
        console.error("User not authenticated");
        setLanguages(dummyData); // Use dummy data if user is not authenticated
        setLoading(false);
        return;
      }

      try {
        const username =
          user.username || user.primaryEmailAddress?.emailAddress;
        const response = await axios.get(`/api/user/${username}/languages`);
        if (response.data && response.data.length > 0) {
          setLanguages(response.data);
        } else {
          console.warn("No data received from API, using dummy data");
          setLanguages(dummyData); // Use dummy data if API returns no data
        }
      } catch (error) {
        console.error("Error fetching languages:", error);
        setLanguages(dummyData); // Use dummy data on error
      } finally {
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [user, userId]);

  const dataToDisplay = languages;

  const completedLanguages = dataToDisplay.filter(
    (lang) => lang.progress === 100,
  ).length;
  const remainingLanguages = dataToDisplay.length - completedLanguages;

  const pieData = [
    { name: "Completed Languages", value: completedLanguages },
    { name: "Remaining Languages", value: remainingLanguages },
  ];

  if (loading) {
    return (
      <div style={{ color: "#f0f4fc", textAlign: "center", marginTop: "20px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        color: "#f0f4fc",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
        background: "#1c1c1c",
      }}
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", fontSize: "2.5rem" }}
      >
        Your Languages
      </motion.h1>

      {/* Pie Chart */}
      <div style={{ marginTop: "20px", width: "100%", height: "300px" }}>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ textAlign: "center", fontSize: "2rem" }}
        >
          Language Completion Overview
        </motion.h2>
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
                  fill={index === 0 ? "#82ca9d" : "#d0ed57"}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        {dataToDisplay.length === 0 && <div>No language data available.</div>}
      </div>

      {/* Bar Chart */}
      <div style={{ marginTop: "40px" }}>
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ textAlign: "center", fontSize: "2rem" }}
        >
          Language Progress Distribution
        </motion.h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dataToDisplay}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="languageName" stroke="#f0f4fc" />
            <YAxis stroke="#f0f4fc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        {dataToDisplay.length === 0 && <div>No language data available.</div>}
      </div>
    </div>
  );
};

export default LanguagesPage;
