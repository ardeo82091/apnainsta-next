"use client";

import { useState } from "react";

type Tab = "general" | "privacy" | "security" | "notifications" | "account";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 space-y-4">
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

      {/* Main Content */}
      <main className="flex-1 p-8">
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "privacy" && <PrivacySettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "account" && <AccountSettings />}
      </main>
    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function GeneralSettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">General Settings</h2>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          type="text"
          placeholder="Username"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function PrivacySettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Privacy Settings</h2>
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          Show Online Status
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Allow Friend Requests
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          Allow Messages from Anyone
        </label>
        <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
          Update Privacy
        </button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Security</h2>
      <div className="space-y-4 max-w-md">
        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border px-4 py-2 rounded-lg"
        />
        <button className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600">
          Update Password
        </button>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Notification Settings</h2>
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          New Message Alerts
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          Friend Request Alerts
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked />
          Email Notifications
        </label>
        <button className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600">
          Save Notifications
        </button>
      </div>
    </div>
  );
}

function AccountSettings() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
      <p className="mb-4 text-gray-700">
        Manage your account preferences or deactivate your account.
      </p>
      <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
        Deactivate Account
      </button>
    </div>
  );
}
