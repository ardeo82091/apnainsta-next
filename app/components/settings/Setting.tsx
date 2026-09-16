"use client";

import { useState } from "react";
import { GeneralSettings } from "./GeneralSettings";
import { PrivacySettings } from "./PrivacySettings";
import { SecuritySettings } from "./SecuritySettings";
import { NotificationSettings } from "./NotificationSettings";
import { AccountSettings } from "./AccountSettings";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

type Tab = "general" | "privacy" | "security" | "notifications" | "account";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className={`flex h-full min-h-screen flex-col duration-300 md:h-screen md:flex-row ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <aside className={`w-full shrink-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b p-4 shadow-md md:h-full md:w-64 md:border-b-0 md:p-6`}>
        <h2 className="mb-3 text-xl font-bold md:mb-6">⚙️ Settings</h2>
        <nav className="grid grid-cols-3 gap-2 md:flex md:flex-col">
          <button
            className={`min-w-0 text-center text-sm px-2 py-2 rounded-lg md:text-left md:px-3
              ${activeTab === "general"
                ? darkMode
                  ? "bg-blue-800 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                  ? "text-white hover:bg-gray-800"
                  : "text-black hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>

          <button
            className={`min-w-0 text-center text-sm px-2 py-2 rounded-lg md:text-left md:px-3 ${
              activeTab === "privacy" 
                ? darkMode
                  ? "bg-blue-800 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                  ? "text-white hover:bg-gray-800"
                  : "text-black hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </button>

          <button
            className={`min-w-0 text-center text-sm px-2 py-2 rounded-lg md:text-left md:px-3 ${
              activeTab === "security"
                ? darkMode
                  ? "bg-blue-800 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                  ? "text-white hover:bg-gray-800"
                  : "text-black hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>

          <button
            className={`min-w-0 text-center text-sm px-2 py-2 rounded-lg md:text-left md:px-3 ${
              activeTab === "notifications"
                ? darkMode
                  ? "bg-blue-800 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                  ? "text-white hover:bg-gray-800"
                  : "text-black hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>

          <button
            className={`min-w-0 text-center text-sm px-2 py-2 rounded-lg md:text-left md:px-3 ${
              activeTab === "account"
                ? darkMode
                  ? "bg-blue-800 text-white"
                  : "bg-blue-500 text-white"
                : darkMode
                  ? "text-white hover:bg-gray-800"
                  : "text-black hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
        </nav>
      </aside>

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 md:p-8">
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "privacy" && <PrivacySettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "account" && <AccountSettings />}
      </main>
    </div>
  );
}
