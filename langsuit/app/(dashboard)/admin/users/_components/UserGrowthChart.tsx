import { motion } from "framer-motion";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useEffect, useState } from "react";

const userGrowthDat = [
  { month: "Jan", users: 1000 },
  { month: "Feb", users: 1500 },
  { month: "Mar", users: 2000 },
  { month: "Apr", users: 3000 },
  { month: "May", users: 4000 },
  { month: "Jun", users: 5000 },
];

const UserGrowthChart = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [userGrowthData, useUserGrowthData] = useState(userGrowthDat);

  useEffect(() => {
    const fetchStatCardData = async () => {
      try {
        const response = await fetch("/api/dashboard/admin/users/line");
        if (!response.ok) {
          throw new Error("Failed to fetch stat card data");
        }
        const data = await response.json();
        setIsLoading(false);
        console.log(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
        useUserGrowthData(data);
      } catch (error) {
        console.error("Error fetching stat card data:", error);
      }
    };

    fetchStatCardData();
  }, []);

  if (isLoading) return <div>Loding..</div>;

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">User Growth</h2>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={userGrowthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#8B5CF6"
              strokeWidth={2}
              dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
export default UserGrowthChart;
