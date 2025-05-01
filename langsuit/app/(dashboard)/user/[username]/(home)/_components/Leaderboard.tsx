"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = ({ username }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/leaderboard?username=${username}`,
        );
        setLeaderboardData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="text-xl font-semibold text-white">Leaderboard</h2>
      <ul className="mt-2">
        {leaderboardData.map((user, index) => (
          <li key={user.id} className="text-white">
            {index + 1}. {user.username} - {user.points} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;
