"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { updatePassword } from "@/redux/userSlice"

export function SecuritySettings() {

  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user)

  const [twoFactor, setTwoFactor] = useState(false)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [currentPassword, setCurrentPassword] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleUpdatePassword = () => {
    dispatch(updatePassword(password))
    setPassword("")
    setConfirmPassword("")
  }

  const handleForgotPassword = () => {
    console.log("Send reset link to:", user.email)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div>
        <h2 className="text-3xl font-semibold">
          Security Settings
        </h2>

        <p className="text-gray-500 mt-1">
          Dear user, manage your account protection, password recovery, and security alerts.
        </p>
      </div>

      {/* ---------------- CHANGE PASSWORD ---------------- */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          Change Password
        </h3>

        <div className="space-y-4 max-w-md">

          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg"
          />

          <button
            onClick={handleUpdatePassword}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 w-full"
          >
            Update Password
          </button>

        </div>
      </div>


      {/* ---------------- FORGOT PASSWORD ---------------- */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          Forgot Password
        </h3>

        <p className="text-gray-500 mb-4 text-sm">
          If you cannot access your account, we will send a password reset link to your email.
        </p>

        <div className="space-y-4 max-w-md">

          <input
            type="email"
            name="email"
            value={user.email}
            disabled
            className="w-full border px-4 py-2 rounded-lg bg-gray-50"
          />

          <button
            onClick={handleForgotPassword}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full"
          >
            Send Reset Link
          </button>

        </div>
      </div>


      {/* ---------------- SECURITY OPTIONS ---------------- */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">
          Account Protection
        </h3>

        <SecurityToggle
          title="Two-Factor Authentication"
          description="Add an extra layer of protection to your account."
          enabled={twoFactor}
          onToggle={() => setTwoFactor(!twoFactor)}
        />

        <SecurityToggle
          title="Login Alerts"
          description="Receive alerts when your account is accessed from a new device."
          enabled={loginAlerts}
          onToggle={() => setLoginAlerts(!loginAlerts)}
        />
      </div>

    </div>
  )
}


/* ---------- Toggle Component ---------- */

type ToggleProps = {
  title: string
  description: string
  enabled: boolean
  onToggle: () => void
}

function SecurityToggle({ title, description, enabled, onToggle }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b last:border-none">

      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <button
        onClick={onToggle}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          enabled ? "bg-purple-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
            enabled ? "translate-x-6" : ""
          }`}
        />
      </button>

    </div>
  )
}