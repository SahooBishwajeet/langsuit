import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

interface StatCardData {
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  salesGrowth: number;
}

const DailySalesTrend = () => {
  const [dailySalesData, setDailySalesData] = useState<StatCardData | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatCardData = async () => {
      try {
        const response = await fetch("/api/dashboard/admin/sales/bar");
        if (!response.ok) {
          throw new Error("Failed to fetch stat card data");
        }
        const data = await response.json();
        setIsLoading(false);
        console.log(data);
        setDailySalesData(data);
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
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-4">
        Daily Sales Trend
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Bar dataKey="sales" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
export default DailySalesTrend;
