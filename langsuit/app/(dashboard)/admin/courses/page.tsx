"use client";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";
import Header from "../_components/Header";
import StatCard from "../_components/StatCard";

import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";

import SalesTrendChart from "./_components/SalesTrendChart";
import CoursesTable from "./_components/CoursesTable";
import CategoryDistributionChart from "../(home)/_components/CategoryDistributionChart";

interface StatCardData {
  totalCourses: number;
  topSelling: number;
  lowestVisit: number;
  totalRevenue: number;
}

const ProductsPage = () => {
  const [statCardData, setStatCardData] = useState<StatCardData | null>(null);

  useEffect(() => {
    const fetchStatCardData = async () => {
      try {
        const response = await fetch("/api/dashboard/admin/courses/statcard");
        if (!response.ok) {
          throw new Error("Failed to fetch stat card data");
        }
        const data = await response.json();
        console.log(data);
        setStatCardData(data);
      } catch (error) {
        console.error("Error fetching stat card data:", error);
      }
    };

    fetchStatCardData();
  }, []);
  const [topcourseTitle, settopCourseTitle] = useState<string | null>(null);
  const [toploading, settopLoading] = useState<boolean>(true);
  const [toperror, settopError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMostSoldCourse = async () => {
      try {
        settopLoading(true);
        settopError(null);

        const response = await fetch("/api/ticket/top");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        settopCourseTitle(data.topCourse.title);
      } catch (err: any) {
        console.error("Error fetching most sold course:", err);
        settopError(err.message || "Failed to fetch data");
      } finally {
        settopLoading(false);
      }
    };

    fetchMostSoldCourse();
  }, []);

  const [lowcourse, setlowCourse] = useState<LeastVisitedCourse | null>(null);
  const [lowloading, setlowLoading] = useState(false);
  const [lowerror, setlowError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeastVisitedCourse = async () => {
      try {
        setlowLoading(true);
        setlowError(null);

        const response = await fetch("/api/ticket/low");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setlowCourse(data.leastVisitedCourse.title);
      } catch (err) {
        setlowError("Failed to fetch course data");
        console.error("Error fetching least visited course:", err);
      } finally {
        setlowLoading(false);
      }
    };

    fetchLeastVisitedCourse();
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

  if (toploading || lowloading || revloading) return <div>Loading ...</div>;
  if (toperror || lowerror || reverror) return <div>Failed to Fetch</div>;

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Courses" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Courses"
            icon={Package}
            value={statCardData?.totalCourses}
            color="#6366F1"
          />
          <StatCard
            name="Top Selling"
            icon={TrendingUp}
            value={topcourseTitle}
            color="#10B981"
          />
          <StatCard
            name="Lowest Visit"
            icon={AlertTriangle}
            value={lowcourse}
            color="#F59E0B"
          />
          <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={"₹" + stats}
            color="#EF4444"
          />
        </motion.div>

        <CoursesTable />

        <div className="grid grid-col-1 lg:grid-cols-2 gap-8">
          <SalesTrendChart />
          <CategoryDistributionChart />
        </div>
      </main>
    </div>
  );
};
export default ProductsPage;
