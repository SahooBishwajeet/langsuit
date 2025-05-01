"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
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

const LanguageDetailsPage = () => {
  const { username, languageId } = useParams(); // Get both username and languageId from URL params
  const [languageProgress, setLanguageProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dummyData, setDummyData] = useState([]); // Dummy data for chart

  useEffect(() => {
    const fetchLanguageProgress = async () => {
      try {
        const response = await axios.get(
          `/api/user/${username}/languages/${languageId}`,
        );
        setLanguageProgress(response.data);
        setLoading(false);
        setDummyData(generateDummyData()); // Generate dummy data
      } catch (error) {
        console.error("Error fetching language progress:", error);
        setLoading(false);
      }
    };

    fetchLanguageProgress();
  }, [username, languageId]);

  const generateDummyData = () => {
    return Array.from({ length: 10 }, (_, index) => ({
      topic: `Topic ${index + 1}`,
      progress: Math.floor(Math.random() * 100), // Random progress percentage
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!languageProgress) {
    return <div>No progress found for this language.</div>;
  }

  const completedTopics = dummyData.filter(
    (data) => data.progress === 100,
  ).length;
  const remainingTopics = dummyData.length - completedTopics;

  const pieData = [
    { name: "Completed Topics", value: completedTopics },
    { name: "Remaining Topics", value: remainingTopics },
  ];

  return (
    <div style={{ color: "#f0f4fc", padding: "20px" }}>
      <h1>{languageProgress.languageName}</h1>
      <p>Course: {languageProgress.courseTitle}</p>
      <p>Progress: {languageProgress.progress}%</p>

      {/* Pie Chart for topic completion */}
      <div style={{ marginTop: "20px", width: "100%", height: "300px" }}>
        <h2>Topic Completion Overview</h2>
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
      </div>

      {/* Bar Chart for topic progress distribution */}
      <div style={{ marginTop: "40px" }}>
        <h2>Topic Progress Distribution</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dummyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="topic" stroke="#f0f4fc" />
            <YAxis stroke="#f0f4fc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="progress" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LanguageDetailsPage;
