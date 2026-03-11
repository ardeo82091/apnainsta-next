"use client";

import { useState } from "react";
import { GeneralSettings } from "./GeneralSettings";
import { PrivacySettings } from "./PrivacySettings";
import { SecuritySettings } from "./SecuritySettings";
import { NotificationSettings } from "./NotificationSettings";
import { AccountSettings } from "./AccountSettings";

type Tab = "general" | "privacy" | "security" | "notifications" | "account";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <aside className="w-64 bg-white shadow-md p-6 space-y-4 h-full">
        <h2 className="text-xl font-bold mb-6">⚙️ Settings</h2>
        <nav className="flex flex-col gap-2">
          <button
            className={`text-left px-3 py-2 rounded-lg ${
              activeTab === "general" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>

          <button
            className={`text-left px-3 py-2 rounded-lg ${
              activeTab === "privacy" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </button>

          <button
            className={`text-left px-3 py-2 rounded-lg ${
              activeTab === "security" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>

          <button
            className={`text-left px-3 py-2 rounded-lg ${
              activeTab === "notifications" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>

          <button
            className={`text-left px-3 py-2 rounded-lg ${
              activeTab === "account" ? "bg-blue-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-8">
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "privacy" && <PrivacySettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "account" && <AccountSettings />}
      </main>
    </div>
  );
}