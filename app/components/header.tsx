"use client"

import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/redux/store"
import { useState, useEffect } from "react"
import { FaBell, FaHeart, FaComment, FaUserPlus } from "react-icons/fa"
import { formatDistanceToNow } from "date-fns"

import { markNotificationRead, markAllNotificationsRead } from "@/redux/userSlice"

const Sidebar = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)

  const notifications = user?.notifications || []

  const [showNotifications, setShowNotifications] = useState(false)
  const [showExactTime, setShowExactTime] = useState<number | null>(null)

  // Force update every 30s to refresh "x minutes ago"
  const [, forceUpdate] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => forceUpdate(v => v + 1), 30000)
    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  // Group notifications by type + postId
  const groupNotifications = (notifications: any[]) => {
    const grouped: Record<string, any[]> = {}
    notifications.forEach(n => {
      const key = `${n.type}-${n.postId || n.id}`
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(n)
    })
    return Object.values(grouped)
  }

  const grouped = groupNotifications(notifications)

  const handleMarkRead = (notifId: number) => {
    dispatch(markNotificationRead(notifId))
  }

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead())
  }

  return (
    <div className="h-screen w-[320px] pr-6 pl-4 py-4 ml-2 border-r bg-white flex flex-col">

      {/* PROFILE */}
      <div className="border-b pb-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.profilePic || "https://i.pravatar.cc/150"}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-lg">{user?.fullName}</p>
            <p className="text-sm text-gray-500">@{user?.userName}</p>
          </div>

          {/* BELL */}
          <div
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative cursor-pointer"
          >
            <FaBell className="text-xl text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>

        {/* STATS */}
        <div className="flex justify-between mt-5 text-center">
          <div>
            <p className="font-semibold">{user?.posts?.length || 0}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div>
            <p className="font-semibold">
              {user.friendAndRequests?.followers.filter(f => f.isFollowed).length || 0}
            </p>
            <p className="text-xs text-gray-500">Followers</p>
          </div>
          <div>
            <p className="font-semibold">
              {user.friendAndRequests?.followers.filter(f => f.isFollowing).length || 0}
            </p>
            <p className="text-xs text-gray-500">Following</p>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {showNotifications && (
        <div className="border-b py-4">
          <div className="flex justify-between mb-3">
            <p className="font-semibold">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-500 hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-[260px] overflow-y-auto">
            {grouped.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-4">
                No notifications
              </p>
            )}

            {grouped.map((group: any, i: number) => {
              const names = group.map((n: any) => n.user?.userName || "Someone")
              let message = ""

              const first = group.find((n: any) => n)

              if (!first) return null

              if (first.type === "like") {
                if (names.length === 1) message = `${names[0]} liked your post`
                else if (names.length === 2) message = `${names[0]} and ${names[1]} liked your post`
                else message = `${names[0]}, ${names[1]} and ${names.length - 2} others liked your post`
              }

              if (first.type === "comment") message = `${names[0]} commented on your post`
              if (first.type === "follow") message = `${names[0]} started following you`

              return (
                <div
                  key={i}
                  onClick={() => handleMarkRead(first.id)}
                  onDoubleClick={() => setShowExactTime(first.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition
                    ${first.type === "like" && "bg-rose-50 border-rose-200"}
                    ${first.type === "comment" && "bg-sky-50 border-sky-200"}
                    ${first.type === "follow" && "bg-teal-50 border-teal-200"}
                    ${!first.read ? "font-semibold" : "opacity-70"}
                  `}
                >
                  <div className="flex items-center gap-2">
                    {!first.read && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                    {first.type === "like" && <FaHeart className="text-red-500" />}
                    {first.type === "comment" && <FaComment className="text-blue-500" />}
                    {first.type === "follow" && <FaUserPlus className="text-green-500" />}
                    <span className="text-sm">{message}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {showExactTime === first.id
                      ? new Date(first.timestamp).toLocaleString()
                      : formatDistanceToNow(new Date(first.timestamp), { addSuffix: true })}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* SUGGESTED USERS */}
      <div className="flex-1 p-5 overflow-y-auto">
        <p className="font-semibold mb-3">Suggested for you</p>
        <div className="space-y-3">
          {["Rahul", "Divya", "Aman", "Priya"].map((u, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={`https://i.pravatar.cc/150?img=${i + 10}`}
                  className="w-10 h-10 rounded-full"
                />
                <p className="text-sm font-medium">{u}</p>
              </div>
              <button className="text-xs px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
