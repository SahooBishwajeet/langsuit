"use client";

import { motion } from "framer-motion";
import { ArrowRight, Database, LineChart, Settings, Users } from "lucide-react";
import Link from "next/link";

const DashboardCard = ({
  title,
  description,
  icon: Icon,
  href,
  delay,
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
    >
      <Link href={href} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-cyan-600" />
          <ArrowRight className="h-5 w-5 text-gray-400" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default function DashboardClient({ isAdmin }: { isAdmin: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto py-16 px-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Langsuit Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Select a dashboard to manage your resources
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <DashboardCard
            title="User Dashboard"
            description="View your learning progress, achievements, and manage your profile"
            icon={Users}
            href="/user/dashboard"
            delay={0.2}
          />

          <DashboardCard
            title="Instructor Dashboard"
            description="Manage your courses, track student progress, and view analytics"
            icon={LineChart}
            href="/instructor/dashboard"
            delay={0.4}
          />

          {isAdmin && (
            <>
              <DashboardCard
                title="Admin Dashboard"
                description="Manage users, courses, and system settings"
                icon={Settings}
                href="/admin"
                delay={0.6}
              />

              <DashboardCard
                title="Admin CRUD"
                description="Advanced database management and content operations"
                icon={Database}
                href="/admincrud"
                delay={0.8}
              />
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
