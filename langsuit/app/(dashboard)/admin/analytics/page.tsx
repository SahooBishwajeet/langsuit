"use client";

import Header from "../_components/Header";
import AIPoweredInsights from "./_components/AIPoweredInsights";
import ChannelPerformance from "./_components/ChannelPerformance";
import CustomerSegmentation from "./_components/CustomerSegmenration";
import OverviewCards from "./_components/OverviewCards";
import ProductPerformance from "./_components/ProductPerformance";
import RevenueChart from "./_components/ProductPerformance";
import UserRetention from "./_components/UserRetention";

const AnalyticsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title={"Analytics Dashboard"} />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <OverviewCards />
        <RevenueChart />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChannelPerformance />
          <ProductPerformance />
          <UserRetention />
          <CustomerSegmentation />
        </div>

        <AIPoweredInsights />
      </main>
    </div>
  );
};
export default AnalyticsPage;
