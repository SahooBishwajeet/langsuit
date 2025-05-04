"use client";

import { UserCheck, UserPlus, UsersIcon, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

import Header from "../_components/Header";
import StatCard from "../_components/StatCard";
import UsersTable from "./_components/UserTable";
import UserGrowthChart from "./_components/UserGrowthChart";
import UserActivityHeatmap from "./_components/UserActivityHeatmap";
import UserDemographicsChart from "./_components/UserDemographicsChart";

interface StatCardData {
  totalUsers: number;
  todayNewUsers: number;
  ActiveUsers: number;
  curnRate: number;
}

const UsersPage = () => {
  const [statCardData, setStatCardData] = useState<StatCardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchStatCardData = async () => {
      try {
        const response = await fetch("/api/dashboard/admin/users/statcard");
        if (!response.ok) {
          throw new Error("Failed to fetch stat card data");
        }
        const data = await response.json();
        setIsLoading(false);
        console.log(data);
        setStatCardData(data);
      } catch (error) {
        setError("Failed to fetch stat card data");
        console.error("Error fetching stat card data:", error);
      }
    };

    fetchStatCardData();
  }, []);

  const [stats, setStats] = useState(null);
  const [revloading, setRevloading] = useState(false);
  const [reverror, setReverror] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenueStats = async () => {
      try {
        setRevloading(true);
        setReverror(null);

        const response = await fetch("/api/ticket/total");
        if (!response.ok) {
          throw new Error("Failed to fetch revenue data");
        }

        const data = await response.json();
        setStats(data.statistics.totalRevenue);
      } catch (err) {
        setReverror("Failed to fetch revenue statistics");
        console.error("Error fetching revenue stats:", err);
      } finally {
        setRevloading(false);
      }
    };

    fetchRevenueStats();
  }, []); // Empty dependency array means this effect runs once on mount

  if (isLoading || revloading) return <div>Loding..</div>;
  if (error || reverror) return <div>Failed to Fetch</div>;
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Users" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Users"
            icon={UsersIcon}
            value={statCardData.totalUsers.toLocaleString()}
            color="#6366F1"
          />
          <StatCard
            name="New Users Today"
            icon={UserPlus}
            value={statCardData.todayNewUsers}
            color="#10B981"
          />
          <StatCard
            name="Active Users"
            icon={UserCheck}
            value={statCardData.ActiveUsers.toLocaleString()}
            color="#F59E0B"
          />
          <StatCard
            name="Churn Rate"
            icon={UserX}
            value={statCardData.curnRate}
            color="#EF4444"
          />
        </motion.div>

        <UsersTable />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* <UserGrowthChart /> */}
          {/* <UserActivityHeatmap /> */}
          <UserDemographicsChart />
        </div>
      </main>
    </div>
  );
};
export default UsersPage;
