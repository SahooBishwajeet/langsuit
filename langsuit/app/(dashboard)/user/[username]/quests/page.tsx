"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
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

const dummyQuests = [
  {
    id: 1,
    title: "Learn Spanish Basics",
    progress: 80,
    description: "Complete the beginner Spanish quest.",
    rewardPoints: 100,
    difficulty: "Easy",
    timeSpent: 5,
    completed: false,
    expiresAt: "2024-10-01",
  },
  {
    id: 2,
    title: "Master Mandarin",
    progress: 50,
    description: "DO 5advanced concepts in Mandarin.",
    rewardPoints: 150,
    difficulty: "Hard",
    timeSpent: 15,
    completed: false,
    expiresAt: "2024-11-01",
  },
  {
    id: 3,
    title: "Complete one beginner path",
    progress: 100,
    description: "Complete one beginner course.",
    rewardPoints: 200,
    difficulty: "Medium",
    timeSpent: 10,
    completed: true,
    expiresAt: "2024-12-01",
  },
];

const COLORS = ["#FFEC99", "#FFD700", "#FFB6C1"];

const QuestsPage = () => {
  const { username } = useParams();
  const [quests, setQuests] = useState(dummyQuests);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:3000/api/quests/read?user_id=1`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quests");
        }

        const data = await response.json();
        setQuests(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  const pieData = quests.map((quest, index) => ({
    name: quest.title,
    value: quest.progress,
    color: COLORS[index % COLORS.length],
  }));

  const barData = quests.map((quest) => ({
    name: quest.title,
    progress: quest.progress,
    timeSpent: quest.timeSpent,
  }));

  return (
    <div
      style={{
        background: "#1c1c1c",
        color: "#f0f4fc",
        padding: "20px",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>Quests</h1>

        {}
        <div
          style={{
            marginBottom: "2rem",
            borderRadius: "8px",
            padding: "20px",
            background: "#2c2c2c",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <h2>Quest Completion Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {}
        <div
          style={{
            marginBottom: "2rem",
            borderRadius: "8px",
            padding: "20px",
            background: "#2c2c2c",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <h2>Quest Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="progress" fill="#8884d8" name="Progress (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {}
        <div
          style={{
            borderRadius: "8px",
            padding: "20px",
            background: "#2c2c2c",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <h2>{username}&apos;s Quest Details</h2>
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Progress (%)</th>
                <th>Reward Points</th>
              </tr>
            </thead>
            <tbody>
              {quests.map((quest) => (
                <tr key={quest.id}>
                  <td style={{ padding: "10px" }}>{quest.title}</td>
                  <td style={{ padding: "10px" }}>{quest.description}</td>
                  <td style={{ padding: "10px" }}>{quest.progress}%</td>
                  <td style={{ padding: "10px" }}>{quest.rewardPoints}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </motion.div>

      {}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            'url("https://www.transparenttextures.com/patterns/black-paper.png")',
          opacity: 0.05,
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};

export default QuestsPage;
