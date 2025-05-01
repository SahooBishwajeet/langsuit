"use client";

import Header from "../_components/Header";
import ConnectedAccounts from "./_components/ConnectedAccounts";
import DangerZone from "./_components/DangerZone";
import Notifications from "./_components/Notifications";
import Profile from "./_components/Profile";
import Security from "./_components/Security";

const SettingsPage = () => {
  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gray-900">
      <Header title="Settings" />
      <main className="max-w-4xl mx-auto py-6 px-4 lg:px-8">
        <Profile />
        <Notifications />
        <Security />
        <ConnectedAccounts />
        <DangerZone />
      </main>
    </div>
  );
};
export default SettingsPage;
