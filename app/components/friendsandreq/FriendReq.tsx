"use client";

import axios from "axios";
import { RootState } from "@/redux/store";
import { useState } from "react";
import { FaCheck, FaInbox, FaPaperPlane, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../chat/socket";

const FriendRequest = () => {
  const dispatch = useDispatch();
  const socket = getSocket();

  const user = useSelector((state: RootState) => state.user);
  const myUserName = user.userName || "";

  const [selectedTab, setSelectedTab] = useState<"received" | "sent">("received");
  const [loadingUser, setLoadingUser] = useState<string | null>(null);

  const requests = user.friendAndRequests?.requests || [];

  const filteredUsers =
    selectedTab === "received"
      ? requests.filter((r: any) => r.type === "received")
      : requests.filter((r: any) => r.type === "sent");

  const handleAction = async (action: string, reqUser: any) => {
    const targetUserName = reqUser.person.userName;

    setLoadingUser(targetUserName);

    dispatch({
      type: "user/updateAction",
      payload: {
        action,
        targetUserName,
        user: reqUser.person,
      },
    });

    try {
      await axios.post("/api/frndreq", {
        action,
        myUserName,
        targetUserName,
      });

      socket.emit("frnd_action", {
        action,
        from: myUserName,
        to: targetUserName,
      });

    } catch (err) {
      console.error(err);

      dispatch({
        type: "user/rollbackAction",
        payload: { action, targetUserName },
      });
    } finally {
      setLoadingUser(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 ml-1">

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
            onClick={() => setSelectedTab("received")}
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
            onClick={() => setSelectedTab("sent")}
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

        {filteredUsers.map((reqUser: any) => {
          const isLoading = loadingUser === reqUser.person.userName;

          return (
            <div
              key={reqUser.person.userName}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >

              {/* USER INFO */}
              <div className="flex items-center gap-4">
                <img
                  src={reqUser.person.img}
                  alt={reqUser.person.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-medium text-gray-800">
                    {reqUser.person.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{reqUser.person.userName}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              {selectedTab === "received" ? (
                <div className="flex items-center gap-2">

                  <button
                    disabled={isLoading}
                    onClick={() => handleAction("accept", reqUser)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition
                      ${
                        isLoading
                          ? "bg-green-50 text-green-400 cursor-not-allowed"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                  >
                    <FaCheck />
                    Accept
                  </button>

                  <button
                    disabled={isLoading}
                    onClick={() => handleAction("reject", reqUser)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition
                      ${
                        isLoading
                          ? "bg-red-50 text-red-400 cursor-not-allowed"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                  >
                    <FaTimes />
                    Reject
                  </button>

                </div>
              ) : (
                <button
                  disabled={isLoading}
                  onClick={() => handleAction("cancel", reqUser)}
                  className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition
                    ${
                      isLoading
                        ? "bg-red-50 text-red-400 cursor-not-allowed"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                >
                  <FaTimes />
                  Cancel
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FriendRequest;