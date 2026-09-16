"use client";

import { useState } from "react";
import { FaArrowLeft, FaChevronRight, FaCog } from "react-icons/fa";
import { GeneralSettings } from "./GeneralSettings";
import { PrivacySettings } from "./PrivacySettings";
import { SecuritySettings } from "./SecuritySettings";
import { NotificationSettings } from "./NotificationSettings";
import { AccountSettings } from "./AccountSettings";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

type Tab = "general" | "privacy" | "security" | "notifications" | "account";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  const tabs: { id: Tab; label: string; description: string }[] = [
    { id: "general", label: "General", description: "Profile and preferences" },
    { id: "privacy", label: "Privacy", description: "Account visibility and controls" },
    { id: "security", label: "Security", description: "Password and login protection" },
    { id: "notifications", label: "Notifications", description: "Push and email alerts" },
    { id: "account", label: "Account", description: "Deactivate or delete your account" },
  ];

  return (
    <div className={`flex h-full min-h-screen flex-col duration-300 md:h-screen md:flex-row ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <aside className={`hidden w-full shrink-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} border-b p-4 shadow-md md:block md:h-full md:w-64 md:border-b-0 md:p-6`}>
        <h2 className="mb-3 text-xl font-bold md:mb-6">⚙️ Settings</h2>
        <nav className="flex flex-col gap-2">{tabs.map((tab) => <button key={tab.id} className={`rounded-lg px-3 py-2 text-left ${activeTab === tab.id ? "bg-blue-500 text-white" : darkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>)}</nav>
      </aside>

      {!activeTab && <main className="w-full p-4 pb-24 md:hidden"><h1 className="mb-5 flex items-center gap-3 text-2xl font-bold"><FaCog /> Settings</h1><section className={`overflow-hidden rounded-2xl border ${darkMode ? "border-gray-800 bg-gray-900" : "bg-white"}`}>{tabs.map((tab) => <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex w-full items-center justify-between border-b p-4 text-left last:border-0 ${darkMode ? "border-gray-800" : "border-gray-100"}`}><span><b className="block">{tab.label}</b><small className="text-gray-500">{tab.description}</small></span><FaChevronRight className="text-gray-400" /></button>)}</section></main>}
      {activeTab && <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4 pb-24 sm:p-6 sm:pb-24 md:p-8"><button onClick={() => setActiveTab(null)} className="mb-5 flex items-center gap-2 text-sm font-semibold md:hidden"><FaArrowLeft /> Settings</button>
        {activeTab === "general" && <GeneralSettings />}
        {activeTab === "privacy" && <PrivacySettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "account" && <AccountSettings />}</main>}
    </div>
  );
}
