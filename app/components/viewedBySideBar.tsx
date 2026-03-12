"use client"

import { FC } from "react"
import { FaTimes } from "react-icons/fa"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { formatDistanceToNow } from "date-fns"
import { Viewer } from "@/lib/users"

interface ViewedBySlideBarProps {
  isOpen: boolean
  onClose: () => void
}

const ViewedBySlideBar: FC<ViewedBySlideBarProps> = ({ isOpen, onClose }) => {
  // Get current user from Redux
  const user = useSelector((state: RootState) => state.user)

  if (!isOpen) return null

  // Normalize viewedBy array
  const viewers: Viewer[] = (user.viewedBy || []).map((v) => ({
    username: v.username ?? "",
    name: v.name ?? "",
    img: v.img ?? "/images/profile.jpg",
    viewedAt: v.viewedAt ? new Date(v.viewedAt) : new Date()
  }))

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* Slide-in Sidebar */}
      <div
        className={`fixed right-0 top-0 h-screen w-80 bg-white z-50 shadow-xl flex flex-col p-4 transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center text-gray-800 text-lg font-semibold mb-4 border-b pb-2">
          <span>Last Viewed</span>
          <FaTimes
            className="cursor-pointer text-gray-600 hover:text-red-500"
            onClick={onClose}
          />
        </div>

        {/* Viewer List */}
        <div className="flex flex-col gap-3 overflow-y-auto">
          {viewers.length === 0 && (
            <p className="text-gray-400 text-sm text-center mt-4">
              No profile views yet
            </p>
          )}

          {viewers.slice(0, 20).map((viewer, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
            >
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={viewer.img}
                    alt={viewer.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {/* Online indicator */}
                </div>

                <div className="flex flex-col text-sm">
                  <span className="font-semibold text-gray-800">
                    {viewer.name}
                  </span>
                  <span className="text-gray-500 text-xs">
                    @{viewer.username}
                  </span>
                </div>
              </div>

              {/* Right: ViewedAt */}
              <span className="text-gray-400 text-xs">
                {formatDistanceToNow(viewer.viewedAt, { addSuffix: true })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ViewedBySlideBar
