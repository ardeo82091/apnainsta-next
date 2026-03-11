"use client"

import { useState } from "react"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    message: true,
    friendRequest: false,
    email: true,
    marketing: false,
    security: true,
  })

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = () => {
    console.log("Saved settings:", settings)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div>
        <h2 className="text-3xl font-semibold">
          Notification Settings
        </h2>

        <p className="text-gray-500 mt-1">
          Dear user, choose how you want to be notified. You can change these preferences anytime.
        </p>
      </div>

      {/* ---------------- IN-APP NOTIFICATIONS ---------------- */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          In-App Notifications
        </h3>

        <SettingToggle
          title="New Message Alerts"
          description="Get notified instantly when someone sends you a message."
          enabled={settings.message}
          onToggle={() => toggle("message")}
        />

        <SettingToggle
          title="Friend Request Alerts"
          description="Receive alerts when someone sends you a friend request."
          enabled={settings.friendRequest}
          onToggle={() => toggle("friendRequest")}
        />
      </div>

      {/* ---------------- EMAIL NOTIFICATIONS ---------------- */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          Email Notifications
        </h3>

        <SettingToggle
          title="Email Updates"
          description="Receive important updates and summaries via email."
          enabled={settings.email}
          onToggle={() => toggle("email")}
        />

        <SettingToggle
          title="Marketing Emails"
          description="Receive product updates, tips, and offers."
          enabled={settings.marketing}
          onToggle={() => toggle("marketing")}
        />
      </div>

      {/* ---------------- SECURITY ---------------- */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          Security Alerts
        </h3>

        <SettingToggle
          title="Security Notifications"
          description="Get alerts for login attempts and account changes."
          enabled={settings.security}
          onToggle={() => toggle("security")}
        />
      </div>

      {/* ---------------- SAVE BUTTON ---------------- */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-yellow-500 text-white px-8 py-3 rounded-lg hover:bg-yellow-600 transition"
        >
          Save Notification Preferences
        </button>
      </div>

    </div>
  )
}

/* ---------- Reusable Toggle Component ---------- */

type ToggleProps = {
  title: string
  description: string
  enabled: boolean
  onToggle: () => void
}

function SettingToggle({ title, description, enabled, onToggle }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-none">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <button
        onClick={onToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-yellow-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
            enabled ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  )
}