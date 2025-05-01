"use client";

import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false },
);

// Dummy data for demonstration purposes
const dummyLeaderboardData = [
  { username: "User1", points: 150 },
  { username: "User2", points: 120 },
  { username: "Akshat", points: 100 }, // Current user
  { username: "User4", points: 80 },
  { username: "User5", points: 60 },
];

const dummyLanguagesData = {
  languages: [
    { name: "Spanish", progress: 70 },
    { name: "French", progress: 50 },
    { name: "German", progress: 30 },
  ],
  totalLanguages: 3,
};

const dummyQuestsData = {
  completed: 5,
  total: 10,
  quests: [
    { title: "Quest 1", status: "Completed" },
    { title: "Quest 2", status: "In Progress" },
  ],
};

const dummyProgressData = {
  overallProgress: 75,
  recentActivities: [
    { activity: "Completed lesson in Spanish", date: "2024-09-25" },
    { activity: "Started learning French", date: "2024-09-24" },
  ],
};

interface PageProps {
  params: {
    username: string;
  };
}

const UserPage = ({ params }: PageProps) => {
  const { username } = params;
  // Calculate combined progress data
  const overallPoints = dummyLeaderboardData.reduce(
    (acc, user) => acc + user.points,
    0,
  );
  const currentUserPoints =
    dummyLeaderboardData.find((user) => user.username === username)?.points ||
    0;
  const userRank =
    dummyLeaderboardData.findIndex((user) => user.username === username) + 1;

  return (
    <MotionDiv
      className="p-6 bg-gray-900 min-h-screen relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background animation */}
      <MotionDiv
        className="absolute top-0 left-0 w-full h-full"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent 70%)",
          zIndex: 0,
        }}
      />

      {/* Floating circles animation */}
      <MotionDiv
        className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full opacity-20"
        animate={{ y: [0, 50, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ zIndex: 0 }}
      />
      <MotionDiv
        className="absolute bottom-20 right-20 w-48 h-48 bg-purple-400 rounded-full opacity-20"
        animate={{ x: [-30, 30, -30], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ zIndex: 0 }}
      />

      <h1 className="text-4xl font-semibold text-white mb-8 text-center relative z-10">
        Welcome to Your Dashboard, {username}!
      </h1>

      <MotionDiv
        className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.3,
            },
          },
        }}
      >
        {/* Leaderboard Overview */}
        <MotionDiv
          className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Leaderboard</h2>
          <p className="text-white mb-2">
            Your current points:{" "}
            <span className="font-semibold">{currentUserPoints}</span> /{" "}
            {overallPoints}
          </p>
          <p className="text-white mb-4">
            Your rank: <span className="font-semibold">{userRank}</span> out of{" "}
            {dummyLeaderboardData.length} users.
          </p>
          <ul className="text-white">
            {dummyLeaderboardData.map((user, index) => (
              <MotionDiv
                key={index}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="mb-1"
              >
                <span className="font-semibold">{user.username}</span>:{" "}
                {user.points} points
              </MotionDiv>
            ))}
          </ul>
        </MotionDiv>

        {/* Languages Overview */}
        <MotionDiv
          className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut", bounce: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-300 mb-2">
            Language Progress
          </h2>
          <p className="text-white mb-2">
            You are learning{" "}
            <span className="font-semibold">
              {dummyLanguagesData.totalLanguages}
            </span>{" "}
            languages:
          </p>
          <ul className="text-white">
            {dummyLanguagesData.languages.map((lang, index) => (
              <MotionDiv
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.2 }}
                className="mb-1"
              >
                <span className="font-semibold">{lang.name}</span>:{" "}
                {lang.progress}% complete
              </MotionDiv>
            ))}
          </ul>
        </MotionDiv>

        {/* Quests Overview */}
        <MotionDiv
          className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Quests</h2>
          <p className="text-white mb-2">
            You have completed{" "}
            <span className="font-semibold">{dummyQuestsData.completed}</span>{" "}
            out of {dummyQuestsData.total} quests.
          </p>
          <ul className="text-white">
            {dummyQuestsData.quests.map((quest, index) => (
              <MotionDiv
                key={index}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.2 }}
                className="mb-1"
              >
                <span className="font-semibold">{quest.title}</span>:{" "}
                {quest.status}
              </MotionDiv>
            ))}
          </ul>
        </MotionDiv>

        {/* Recent Activities */}
        <MotionDiv
          className="p-4 bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <h2 className="text-2xl font-bold text-gray-300 mb-2">
            Recent Activities
          </h2>
          <ul className="text-white">
            {dummyProgressData.recentActivities.map((activity, index) => (
              <MotionDiv
                key={index}
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="mb-1"
              >
                <span className="font-semibold">{activity.date}:</span>{" "}
                {activity.activity}
              </MotionDiv>
            ))}
          </ul>
        </MotionDiv>
      </MotionDiv>
    </MotionDiv>
  );
};

export default UserPage;
