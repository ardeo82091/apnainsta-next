"use client";

import { RootState } from "@/redux/store";
import { useState } from "react";
import { FaCheck, FaInbox, FaPaperPlane, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";

const FriendRequest = () => {
  const user = useSelector((state: RootState) => state.user);

  const [selectedTab, setSelectedTab] = useState<"received" | "sent">("received");

  const requests = user.friendAndRequests?.requests || [];

  const filteredUsers =
    selectedTab === "received"
      ? requests.filter((r) => !r.isSent)
      : requests.filter((r) => r.isSent);

  const OnTabClick = (tab: "received" | "sent") => {
    setSelectedTab(tab);
  };

  return (
    <div className="flex flex-col h-screen w-1/3 bg-gray-50 ml-1">

      {/* HEADER */}
      <div className="bg-white px-6 py-4 border-b shadow-sm">
        <h2 className="font-semibold text-xl text-gray-800">
          Friend Requests
        </h2>
      </div>

      {/* TABS */}
      <div className="px-6 pt-4">
        <div className="flex bg-gray-100 rounded-xl p-1 w-full">

          <button
            onClick={() => OnTabClick("received")}
            className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition
              ${
                selectedTab === "received"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            <FaInbox />
            Received
          </button>

          <button
            onClick={() => OnTabClick("sent")}
            className={`flex items-center justify-center gap-2 flex-1 py-2 rounded-lg transition
              ${
                selectedTab === "sent"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            <FaPaperPlane />
            Sent
          </button>

        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">

        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No friend requests
          </div>
        )}

        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
          >

            {/* USER INFO */}
            <div className="flex items-center gap-4">
              <img
                src={user.person.img}
                alt={user.person.name}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div>
                <p className="font-medium text-gray-800">
                  {user.person.name}
                </p>
                <p className="text-xs text-gray-500">
                  @{user.person.userName || "userName"}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            {selectedTab === "received" ? (
              <div className="flex items-center gap-2">

                <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                  <FaCheck />
                  Accept
                </button>

                <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                  <FaTimes />
                  Reject
                </button>

              </div>
            ) : (
              <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                <FaTimes />
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendRequest;