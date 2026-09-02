"use client";

import { useState, useEffect, useRef } from "react";
import ChatTab from "../chat";
import Sidebar from "../../sidebar";
import ChatSidebar from "../ChatProfileBar";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ChatPerson, Messages } from "@/lib/users";
import { Socket } from "socket.io-client";
import { getSocket } from "../socket";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useToast } from "@/app/components/ui/ToastProvider";

let socket: Socket;

const ChatWithPerson: React.FC = () => {

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const toast = useToast();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<number>(0);
  const [multipleActiveTab, setMultipleActiveTab] = useState<ChatPerson[]>([]);
  const [formattedMessages, setFormattedMessages] = useState<Messages[]>([]);
  const [messageInput, setMessageInput] = useState<string>("");
  const [chatPersons, setChatPersons] = useState<ChatPerson[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isChatProfileOpen, setIsChatProfileOpen] = useState(false);
  const [chatProfileUserName, setChatProfileUserName] = useState("");

  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { userName } = useParams();
  const myUserName = Array.isArray(userName) ? userName[0] : userName;

  const viewChatProfile = () => {
    setIsChatProfileOpen(!isChatProfileOpen);
  };

  // FETCH CHATS
  useEffect(() => {
    const fetchChats = async () => {
      const response = await axios.get(`/api/chats/${myUserName}`);
      setChatPersons(response.data);
    };

    if (myUserName) fetchChats();
  }, [myUserName]);

  // Socket events arrive instantly; polling is a reliable fallback when the
  // socket service is temporarily unreachable on another device.
  useEffect(() => {
    if (!myUserName) return
    const refresh = () => axios.get(`/api/chats/${myUserName}`).then((response) => setChatPersons(response.data)).catch(() => undefined)
    const timer = window.setInterval(refresh, 4000)
    return () => window.clearInterval(timer)
  }, [myUserName])

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [formattedMessages]);

  // SOCKET CONNECTION
  useEffect(() => {
    if (!myUserName) return;

    socket = getSocket();
    socket.emit("registerUser", myUserName);

    // ONLINE USERS
    socket.on("onlineUsers", (users: string[]) => {
      setOnlineUsers(users);
    });

    // TYPING
    socket.on("typing", ({ user }: { user: string }) => {
      setTypingUsers((prev) => Array.from(new Set([...prev, user])));
    });

    socket.on("stopTyping", ({ user }: { user: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

    const handleReceiveMessage = (message: Messages) => {
      setChatPersons((prev) => {
        let exists = false;

        let updated = prev.map((chat) => {
          // NEW CHAT
          if (!chat.chatId) {
            if (chat.person.userName === message.sender) {
              exists = true;
              return {
                ...chat,
                chatId: message.chatId,
                messages: [message],
              };
            }
          }

          // EXISTING CHAT
          if (chat.chatId === message.chatId) {
            exists = true;

            const already = chat.messages.some((m) => m._id === message._id || m.tempId === message.tempId);
            if (already) return chat;

            return {
              ...chat,
              messages: [...chat.messages, message],
            };
          }

          return chat;
        });

        // NEW CHAT COMES
        if (!exists) {
          updated = [
            {
              chatId: message.chatId,
              person: {
                userName: message.sender,
                name: message.sender,
                img: "",
              },
              messages: [message],
            },
            ...updated,
          ];
        }

        // MOVE TO TOP
        return [...updated].sort((a, b) => {
          const aTime =
            a.messages[a.messages.length - 1]?.createdAt || 0;
          const bTime =
            b.messages[b.messages.length - 1]?.createdAt || 0;

          return (
            new Date(bTime).getTime() - new Date(aTime).getTime()
          );
        });
      });

      // TABS
      setMultipleActiveTab((prev) =>
        prev.map((tab) => {
          if (tab.chatId === message.chatId) {
            const already = tab.messages.some(
              (m) => m._id === message._id
            );
            if (already) return tab;

            return {
              ...tab,
              messages: [...tab.messages, message],
            };
          }
          return tab;
        })
      );

      // ACTIVE CHAT
      setFormattedMessages((prev) => {
        const already = prev.some((m) => m._id === message._id || m.tempId === message.tempId);
        if (already) return prev;

        return [...prev, message];
      });
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("onlineUsers");
    };
  }, [myUserName]);

  // SEARCH USERS
  const searchUsers = async (value: string) => {
    setSearchValue(value);
    if (!value) {
      setSearchResults([]);
      return;
    }

    const res = await axios.get("/api/search", {
      params: {
        query: value,
        exclude: myUserName,
      },
    });

    setSearchResults(res.data);
  };

  // OPEN CHAT TAB + MARK READ
  const openChatTab = async (chat: ChatPerson) => {
    const isOpen = multipleActiveTab.findIndex(
      (tab) => tab.chatId === chat.chatId
    );

    const updatedMessages = chat.messages.map((msg) =>
      msg.sender !== myUserName
        ? {
            ...msg,
            readBy: Array.from(
              new Set([...(msg.readBy ?? []), myUserName])
            ),
          }
        : msg
    );

    const updatedChat = { ...chat, messages: updatedMessages };

    if (chat.chatId) {
      await axios.patch("/api/messages/read", {
        chatId: chat.chatId,
        myUserName,
      });
    }

    if (isOpen === -1) {
      if (multipleActiveTab.length < 5) {
        setMultipleActiveTab([...multipleActiveTab, updatedChat]);
        setActiveTab(multipleActiveTab.length);
      }
    } else {
      setActiveTab(isOpen);
      setMultipleActiveTab((prev) =>
        prev.map((t) => (t.chatId === chat.chatId ? updatedChat : t))
      );
    }

    setFormattedMessages(updatedMessages);

    setChatPersons((prev) =>
      prev.map((c) => (c.chatId === chat.chatId ? updatedChat : c))
    );
  };

  // START NEW CHAT
  const startNewChat = async (userData: any) => {
    try {
      const { data } = await axios.post("/api/chats", { userName: userData.userName });
      const chat: ChatPerson = { ...data, messages: [] };
      setChatPersons((current) => current.some((item) => item.chatId === chat.chatId) ? current : [chat, ...current]);
      openChatTab(chat);
      toast("Chat ready");
    } catch {
      // The API response is the source of truth; do not open a non-persistent chat tab.
      toast("Could not start chat", "error");
    }
  };

  // CLOSE TAB
  const closeChatTab = (index: number) => {
    const updatedTabs = multipleActiveTab.filter((_, i) => i !== index);
    setMultipleActiveTab(updatedTabs);

    if (index === activeTab) {
      if (updatedTabs.length > 0) {
        const newIndex = index === 0 ? 0 : index - 1;
        setActiveTab(newIndex);
        setFormattedMessages(updatedTabs[newIndex].messages);
      } else {
        setActiveTab(0);
        setFormattedMessages([]);
      }
    }
  };

  // SEND MESSAGE
  const sendMessage = (chat: ChatPerson, content: string) => {
    if (!myUserName) return;

    const message: Messages & { recipient: string } = {
      tempId: crypto.randomUUID(),
      chatId: chat.chatId,
      sender: myUserName,
      recipient: chat.person.userName,
      content,
      readBy: [myUserName],
      createdAt: new Date(),
    };

    socket.emit("sendMessage", message);

    setFormattedMessages((prev) => [...prev, message]);

    setMultipleActiveTab((prev) =>
      prev.map((tab) =>
        tab.chatId === chat.chatId
          ? { ...tab, messages: [...tab.messages, message] }
          : tab
      )
    );

    setChatPersons((prev) =>
      prev.map((currentChat) =>
        currentChat.chatId === chat.chatId
          ? { ...currentChat, messages: [...currentChat.messages, message] }
          : currentChat
      )
    );

    setMessageInput("");
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Sidebar />

      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
          {/* TABS */}
          <div className={`flex border-b text-sm ${darkMode ? 'border-gray-800 bg-black' : 'border-gray-200 bg-white'}`}>
            {multipleActiveTab.map((chat, index) => (
              <ChatTab
                key={chat.chatId}
                label={chat.person.name}
                isActive={activeTab === index}
                onClick={() => openChatTab(chat)}
                onClose={() => closeChatTab(index)}
              />
            ))}
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 overflow-y-auto">
            {formattedMessages.map((message, idx) => {
              const isSeenByOthers = (message.readBy ?? []).some(
                (u) => u !== myUserName
              );

              return (
                <div
                  key={message._id || message.tempId}
                  className={`mb-2 flex ${
                    message.sender === myUserName
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className={`p-2 rounded-lg text-sm max-w-[70%] ${message.sender === myUserName ? 'bg-blue-500 text-white' : darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
                    <div className="flex items-center gap-1">
                      <span>{message.content}</span>

                      {message.sender === myUserName && (
                        <span className="text-xs">
                          {isSeenByOthers ? "✔✔" : "✔"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {typingUsers.length > 0 && (
              <div className="text-xs text-gray-500">
                {typingUsers.join(", ")} typing...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className={`p-4 flex gap-2 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
            <input
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);

                const chat = multipleActiveTab[activeTab];
                if (!chat) return;

                socket.emit("typing", {
                  chatId: chat.chatId,
                  user: myUserName,
                });

                setTimeout(() => {
                  socket.emit("stopTyping", {
                    chatId: chat.chatId,
                    user: myUserName,
                  });
                }, 1000);
              }}
              className={`flex-1 p-3 rounded-xl outline-none ${darkMode ? 'bg-gray-800 text-white border-gray-600' : 'bg-white text-black border-gray-300'}`}
            />

            <button
              onClick={() => {
                const chat = multipleActiveTab[activeTab];
                if (chat && messageInput.trim()) {
                  sendMessage(chat, messageInput);
                }
              }}
              className="bg-blue-500 text-white px-5 rounded-xl"
            >
              Send
            </button>
          </div>
        </div>
      </div>

        {/* RIGHT SIDEBAR */}
        <div className={`w-[350px] border-l flex flex-col p-4 overflow-y-auto ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="font-bold mb-4">Messages</div>

          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => searchUsers(e.target.value)}
            className={`w-full p-3 mb-4 rounded-xl outline-none ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-black'}`}
          />

          {searchValue && (
            <div className="mb-4">
              {searchResults.map((u) => {
                const existingChat = chatPersons.find(
                  (c) => c.person.userName === u.userName
                );

                return (
                  <div
                    key={u.userName}
                    className={`flex gap-3 p-2 hover:${darkMode ? 'bg-gray-600' : 'bg-gray-200'} cursor-pointer`}
                    onClick={() => {
                      if (existingChat) openChatTab(existingChat);
                      else startNewChat(u);

                      setSearchValue("");
                      setSearchResults([]);
                    }}
                  >
                  <img src={u.img} className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="font-semibold text-sm">{u.userName}</div>
                      <div className="text-xs text-gray-500">{u.name}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CHAT LIST */}
          <div className="flex-1 overflow-y-auto">
            {chatPersons.map((chat) => {
              const lastMessage = chat.messages[chat.messages.length - 1];

              const unreadCount = chat.messages.filter(
                (msg) =>
                  !(msg.readBy ?? []).includes(myUserName) &&
                  msg.sender !== myUserName
              ).length;

              const isOnline = onlineUsers.includes(chat.person.userName);

              return (
                <div
                  key={chat.chatId}
                  className="border-b py-2 flex items-center"
                >
                  <img
                    src={chat.person.img}
                    className="w-10 h-10 rounded-full mr-3 cursor-pointer"
                    onClick={() => {
                      router.push(`/components/profile/${chat.person.userName}`);
                    }}
                  />

                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => openChatTab(chat)}
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-sm">
                        {chat.person.name}
                      </span>

                      {unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-2 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <div
                      className={`text-xs ${
                        lastMessage &&
                        lastMessage.sender !== myUserName &&
                        !(lastMessage.readBy ?? []).includes(myUserName)
                          ? "font-bold"
                          : "text-gray-500"
                      }`}
                    >
                      {lastMessage?.content}
                    </div>

                    {isOnline && (
                      <div className="text-green-500 text-xs">● online</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PROFILE */}
        {isChatProfileOpen && (
          <ChatSidebar
            userName={chatProfileUserName}
            isOpen={isChatProfileOpen}
            onClose={viewChatProfile}
          />
        )}
    </div>
  );
};

export default ChatWithPerson;
