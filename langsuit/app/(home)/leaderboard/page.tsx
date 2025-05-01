"use client";

import { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Trophy, Medal, Award } from "lucide-react";

const getUserProgress = async () => {
  return {
    hearts: 30,
    points: 1500,
    hasActiveSubscription: true,
    activeCourse: {
      title: "Spanish",
      imageSrc: "/ES - Spain.svg",
    },
    userName: "Akshat",
    userImageSrc: "/avatar-placeholder.png",
  };
};

const getTopTenUsers = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/leaderboard`);
    if (!response.ok) {
      return [
        { userId: 1, userName: "Alice", points: 2000 },
        { userId: 2, userName: "Bob", points: 1800 },
        { userId: 3, userName: "Charlie", points: 1600 },
        { userId: 4, userName: "Diana", points: 1400 },
        { userId: 5, userName: "Eve", points: 1300 },
        { userId: 6, userName: "Frank", points: 1200 },
        { userId: 7, userName: "Grace", points: 1100 },
        { userId: 8, userName: "Hank", points: 1000 },
        { userId: 9, userName: "Ivy", points: 900 },
        { userId: 10, userName: "Jack", points: 800 },
      ];
    }
    const res_data = await response.json();
    if (res_data && Array.isArray(res_data.data)) {
      return res_data.data;
    }
  } catch (error) {
    console.log(error);
    return [
      { userId: 1, userName: "Alice", points: 2000 },
      { userId: 2, userName: "Bob", points: 1800 },
      { userId: 3, userName: "Charlie", points: 1600 },
      { userId: 4, userName: "Diana", points: 1400 },
      { userId: 5, userName: "Eve", points: 1300 },
      { userId: 6, userName: "Frank", points: 1200 },
      { userId: 7, userName: "Grace", points: 1100 },
      { userId: 8, userName: "Hank", points: 1000 },
      { userId: 9, userName: "Ivy", points: 900 },
      { userId: 10, userName: "Jack", points: 800 },
    ];
  }
};

const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 50%)`;
};

const FloatingLetter = ({ children, delay = 0 }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      y: ["0%", "100%"],
      x: ["0%", `${Math.random() * 100}%`],
      opacity: [0.7, 0],
      transition: {
        duration: 15 + Math.random() * 10,
        ease: "linear",
        repeat: Infinity,
        delay: delay * 5,
      },
    });
  }, [controls, delay]);

  return (
    <motion.div
      animate={controls}
      className="absolute text-4xl font-bold text-primary/10"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    >
      {children}
    </motion.div>
  );
};

const LeaderboardPage = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [view, setView] = useState("list");

  useEffect(() => {
    const fetchData = async () => {
      const [progress, board] = await Promise.all([
        getUserProgress(),
        getTopTenUsers(),
      ]);
      setUserProgress(progress);
      setLeaderboard(
        board.map((user) => ({ ...user, color: getRandomColor() })),
      );
    };
    fetchData();
  }, []);

  const MotionCard = motion(Card);

  const floatingLetters = [
    "A",
    "Б",
    "C",
    "Д",
    "E",
    "Ф",
    "G",
    "Ж",
    "I",
    "Й",
    "K",
    "Л",
    "あ",
    "い",
    "う",
    "え",
    "お",
    "か",
    "き",
    "く",
    "け",
    "こ",
    "你",
    "我",
    "他",
    "她",
    "它",
    "们",
    "好",
    "是",
    "不",
    "在",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4 md:p-8 relative overflow-hidden">
      {floatingLetters.map((letter, index) => (
        <FloatingLetter key={index} delay={index}>
          {letter}
        </FloatingLetter>
      ))}

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 tracking-tight">
            Leaderboard
          </h1>
          <p className="text-lg md:text-xl text-primary/80">
            See where you stand among other language learners in our global
            community.
          </p>
        </motion.div>

        <div className="mb-6 md:mb-8 flex justify-center space-x-4">
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            className="font-semibold"
          >
            List View
          </Button>
          <Button
            variant={view === "graph" ? "default" : "outline"}
            onClick={() => setView("graph")}
            className="font-semibold"
          >
            Graph View
          </Button>
        </div>

        {view === "list" ? (
          <MotionCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-background/60 shadow-lg"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-primary">
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard.map((user, index) => (
                <motion.div
                  key={user.userId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center hover:bg-primary/5 rounded-lg transition-colors duration-200 mb-4 p-4"
                >
                  <div className="mr-4 text-2xl">
                    {index === 0 ? (
                      <Trophy className="text-yellow-400" />
                    ) : index === 1 ? (
                      <Medal className="text-gray-400" />
                    ) : index === 2 ? (
                      <Award className="text-orange-400" />
                    ) : (
                      <span className="font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div
                    className="w-12 h-12 rounded-full mr-4 flex items-center justify-center text-white font-bold text-lg shadow-md"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.userName[0]}
                  </div>
                  <p className="flex-1 font-semibold text-primary">
                    {user.userName}
                  </p>
                  <p className="font-bold text-secondary">{user.points} XP</p>
                </motion.div>
              ))}
            </CardContent>
          </MotionCard>
        ) : (
          <MotionCard
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-background/60 shadow-lg"
          >
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center text-primary">
                Points Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaderboard}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--primary)"
                      opacity={0.1}
                    />
                    <XAxis dataKey="userName" stroke="var(--primary)" />
                    <YAxis stroke="var(--primary)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--background)",
                        borderRadius: "8px",
                        border: "1px solid var(--primary)",
                        color: "var(--primary)",
                      }}
                    />
                    <Bar
                      dataKey="points"
                      label={{ position: "top", fill: "var(--primary)" }}
                    >
                      {leaderboard.map((entry, index) => (
                        <Bar key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </MotionCard>
        )}

        {userProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 md:mt-8"
          >
            <Card className="backdrop-blur-md bg-background/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
                  <div>
                    <p className="text-sm text-primary/60">Active Course</p>
                    <p className="font-semibold text-primary">
                      {userProgress.activeCourse.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-primary/60">Hearts</p>
                    <p className="font-semibold text-red-500">
                      {userProgress.hearts}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-primary/60">Points</p>
                    <p className="font-semibold text-secondary">
                      {userProgress.points} XP
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
