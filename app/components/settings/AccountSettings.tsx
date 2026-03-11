"use client"

import { useState } from "react"
import { FaTimes } from "react-icons/fa"

export function AccountSettings() {
  const [showDeactivate, setShowDeactivate] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const [deactivateReason, setDeactivateReason] = useState("")
  const [deactivateOtherReason, setDeactivateOtherReason] = useState("")
  const [deleteReason, setDeleteReason] = useState("")
  const [deleteOtherReason, setDeleteOtherReason] = useState("")
  const [days, setDays] = useState("7")

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      <div>
        <h2 className="text-3xl font-semibold">Account Settings</h2>
        <p className="text-gray-500 mt-1">
          Manage account deactivation or permanent deletion.
        </p>
      </div>

      {/* ---------- DEACTIVATE ---------- */}
      <div className="bg-white border rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-2">
          Temporarily Deactivate Account
        </h3>

        <p className="text-gray-500 mb-4 text-sm">
          If you need a break, you can deactivate your account temporarily.
          Your chats and profile remain safe.
        </p>

        <button
          onClick={() => setShowDeactivate(true)}
          className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600"
        >
          Deactivate Account
        </button>
      </div>

      {/* ---------- DELETE ---------- */}
      <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-2">
          Permanently Delete Account
        </h3>

        <p className="text-gray-500 mb-4 text-sm">
          This action removes everything permanently and cannot be undone.
        </p>

        <button
          onClick={() => setShowDelete(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Delete Account Permanently
        </button>
      </div>

      {/* ---------- DEACTIVATE MODAL ---------- */}
      {showDeactivate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg w-[420px]">

            <FaTimes
              className="absolute top-4 right-4 cursor-pointer text-gray-400"
              onClick={() => setShowDeactivate(false)}
            />

            <h3 className="text-xl font-semibold mb-3">
              Deactivate Account
            </h3>

            <select
              value={deactivateReason}
              onChange={e => setDeactivateReason(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            >
              <option value="">Select a reason</option>
              <option value="break">I need a break</option>
              <option value="privacy">Privacy concerns</option>
              <option value="notUsing">Not using the platform</option>
              <option value="other">Other</option>
            </select>

            {deactivateReason === "other" && (
              <input
                type="text"
                placeholder="Please share your reason"
                value={deactivateOtherReason}
                onChange={e => setDeactivateOtherReason(e.target.value)}
                className="w-full border rounded-lg p-2 mb-3"
              />
            )}

            <label className="block text-sm mb-1">
              Deactivate for how many days?
            </label>

            <select
              value={days}
              onChange={e => setDays(e.target.value)}
              className="w-full border rounded-lg p-2 mb-4"
            >
              <option value="7">7 days</option>
              <option value="15">15 days</option>
              <option value="30">30 days</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeactivate(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                Confirm Deactivation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------- DELETE MODAL ---------- */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="relative bg-white p-6 rounded-2xl shadow-lg w-[420px]">

            <FaTimes
              className="absolute top-4 right-4 cursor-pointer text-gray-400"
              onClick={() => setShowDelete(false)}
            />

            <h3 className="text-xl font-semibold text-red-600 mb-3">
              Confirm Permanent Deletion
            </h3>

            <p className="text-sm text-gray-500 mb-3">
              Recommendation: Deactivation is safer if you may return later.
            </p>

            <select
              value={deleteReason}
              onChange={e => setDeleteReason(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3"
            >
              <option value="">Why are you leaving?</option>
              <option value="privacy">Privacy concerns</option>
              <option value="notUseful">Not useful</option>
              <option value="switching">Switching platform</option>
              <option value="other">Other</option>
            </select>

            {deleteReason === "other" && (
              <input
                type="text"
                placeholder="Please share your reason"
                value={deleteOtherReason}
                onChange={e => setDeleteOtherReason(e.target.value)}
                className="w-full border rounded-lg p-2 mb-3"
              />
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}