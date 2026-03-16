"use client"

import { FC, useEffect, useState } from "react"
import axios from "axios"
import { User } from "@/lib/users"

interface ChatSidebarProps {
  userName?: string
  isOpen: boolean
  onClose: () => void
}

const ChatSidebar: FC<ChatSidebarProps> = ({
  userName,
  isOpen,
  onClose
}) => {

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!userName) return
      const res = await axios.get(`/api/users/${userName}`)
      setUser(res.data)
    }
    fetchUser()
  }, [userName])

  if (!isOpen) return null

  return (
    <div className="w-1/4 bg-white border-l p-4">
      <button
        onClick={onClose}
        className="text-red-500 mb-4"
      >
        Close
      </button>

      <div className="flex flex-col items-center">
        <img
          src={user?.profilePic || "/images/profile.jpg"}
          className="w-24 h-24 rounded-full"
        />
        <h2 className="font-bold mt-3">
          {user?.fullName}
        </h2>
        <p className="text-gray-500">
          @{user?.userName}
        </p>
      </div>
    </div>
  )
}

export default ChatSidebar