"use client"

import { FC, useEffect, useState } from "react"
import axios from "axios"
import { ChatPreview } from "../../../lib/users"

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

  const [chats, setChats] = useState<ChatPreview[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchChats = async () => {
      if (!userName) return

      try {
        setLoading(true)
        const res = await axios.get(`/api/chats/${userName}`)
        setChats(res.data)
      } catch (err) {
        console.error("Error fetching chats", err)
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [userName])

  if (!isOpen) return null

  return (
    <div className="w-1/4 bg-white border-l p-4 overflow-y-auto">
      <button
        onClick={onClose}
        className="text-red-500 mb-4"
      >
        Close
      </button>

      <h2 className="font-bold text-lg mb-4">Chats</h2>

      {loading && <p>Loading...</p>}

      {!loading && chats.length === 0 && (
        <p className="text-gray-500">No chats yet</p>
      )}

      <div className="flex flex-col gap-3">
        {chats.map((chat) => (
          <div
            key={chat.chatId}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <img
              src={chat.person.img || "/images/profile.jpg"}
              className="w-10 h-10 rounded-full"
            />

            <div className="flex-1">
              <h3 className="font-semibold">
                {chat.person.name}
              </h3>

              <p className="text-sm text-gray-500 truncate">
                {chat.lastMessage?.text || "No messages yet"}
              </p>
            </div>

            <span className="text-xs text-gray-400">
              {chat.lastMessage?.timestamp
                ? new Date(chat.lastMessage.timestamp).toLocaleTimeString()
                : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChatSidebar