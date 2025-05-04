"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const YourProgress = ({ username }) => {
  const [yourProgress, setYourProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchYourProgress = async () => {
      try {
        const response = await axios.get(
          `/api/user/${username}/your-progress`,
        );
        setYourProgress(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching your progress:", error);
        setLoading(false);
      }
    };

    fetchYourProgress();
  }, [username]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="text-xl font-semibold text-white">Your Progress</h2>
      <ul className="mt-2">
        {yourProgress.map((progress) => (
          <li key={progress.id} className="text-white">
            {progress.course}: {progress.progress}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YourProgress;
