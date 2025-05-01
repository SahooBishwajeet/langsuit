"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Progress = ({ username }) => {
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/${username}/progress`,
        );
        setProgressData(response.data);
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

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="text-xl font-semibold text-white">Progress</h2>
      <ul className="mt-2">
        {progressData.map((course) => (
          <li key={course.id} className="text-white">
            {course.title}: {course.progress}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Progress;
