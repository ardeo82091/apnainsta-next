"use client";

import { FaComments } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function MobileChatLauncher({ userName }: { userName?: string }) {
  const router = useRouter();

  if (!userName) return null;
  return <div className="md:hidden fixed bottom-20 right-4 z-50">
    <button aria-label="Open chats" onClick={() => router.push(`/components/chat/${userName}`)} className="grid h-14 w-14 place-items-center rounded-full bg-blue-600 text-xl text-white shadow-lg"><FaComments /></button>
  </div>;
}
