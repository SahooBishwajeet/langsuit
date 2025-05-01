"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "../_components/StatCard";
import Header from "../_components/Header";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import SalesOverviewChart from "../(home)/_components/SalesOverviewChart";
import SalesByCategoryChart from "./_components/SalesByCategoryChart";
import DailySalesTrend from "./_components/DailySalesTrend";

interface StatCardData {
  totalRevenue: number;
  avgOrderValue: number;
  conversionRate: number;
  salesGrowth: number;
}

const SalesPage = () => {
  const [statCardData, setStatCardData] = useState<StatCardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatCardData = async () => {
      try {
        const response = await fetch("/api/dashboard/admin/sales/statcard");
        if (!response.ok) {
          throw new Error("Failed to fetch stat card data");
        }
        const data = await response.json();
        setIsLoading(false);
        console.log(data);
        setStatCardData(data);
      } catch (error) {
        console.error("Error fetching stat card data:", error);
      }
    };

    fetchStatCardData();
  }, []);

  if (isLoading) return <div>Loding..</div>;
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Sales Dashboard" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* SALES STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={statCardData.totalRevenue}
            color="#6366F1"
          />
          <StatCard
            name="Avg. Order Value"
            icon={ShoppingCart}
            value={statCardData.avgOrderValue}
            color="#10B981"
          />
          <StatCard
            name="Conversion Rate"
            icon={TrendingUp}
            value={statCardData.conversionRate}
            color="#F59E0B"
          />
          <StatCard
            name="Sales Growth"
            icon={CreditCard}
            value={statCardData.salesGrowth}
            color="#EF4444"
          />
        </motion.div>

        <SalesOverviewChart />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SalesByCategoryChart />
          <DailySalesTrend />
        </div>
      </main>
    </div>
  );
};
export default SalesPage;
