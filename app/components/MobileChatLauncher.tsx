"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowLeft, FaComments, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

type Preview = { chatId: string; person: { userName: string; name: string; img?: string }; lastMessage?: { text?: string } };

export default function MobileChatLauncher({ userName }: { userName?: string }) {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState<Preview[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!open || !userName) return;
    axios.get(`/api/chats/${userName}`).then(({ data }) => setChats(data)).catch(() => setChats([]));
  }, [open, userName]);

  if (!userName) return null;
  return <div className="md:hidden fixed bottom-20 right-4 z-50">
    {open && <section className="mb-3 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <button aria-label="Close chat list" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-gray-100"><FaArrowLeft /></button>
        <strong>Chats</strong>
        <button aria-label="Close chat popup" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-gray-100"><FaTimes /></button>
      </header>
      <div className="max-h-80 overflow-y-auto p-2">
        {chats.length === 0 ? <p className="p-5 text-center text-sm text-gray-500">No chats yet</p> : chats.map((chat) => <button key={chat.chatId} onClick={() => router.push(`/components/chat/${userName}`)} className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-gray-50">
          <img className="h-10 w-10 rounded-full object-cover" src={chat.person.img || "/images/profile.jpg"} alt="" />
          <span className="min-w-0"><b className="block truncate text-sm">{chat.person.name || chat.person.userName}</b><small className="block truncate text-gray-500">{chat.lastMessage?.text || "No messages yet"}</small></span>
        </button>)}
      </div>
    </section>}
    <button aria-label="Open chats" onClick={() => setOpen(!open)} className="grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-xl text-white shadow-lg"><FaComments /></button>
  </div>;
}