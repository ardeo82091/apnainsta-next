"use client";

import { RootState } from "@/redux/store";
import { useState } from "react";
import {
  FaUserMinus,
  FaUserPlus,
  FaUserFriends,
  FaUserCheck,
  FaMinus,
} from "react-icons/fa";
import { useSelector } from "react-redux";

export default function FriendsTabs() {
  const users = useSelector((state: RootState) => state.user);

  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );

  const followers = users.friendAndRequests?.followers || [];

  const filteredFollowers =
    activeTab === "followers"
      ? followers.filter((follower) => follower.isFollowed)
      : followers.filter((follower) => follower.isFollowing);

  return (
    <div className="flex flex-1 flex-col ml-40 h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">Friends</h1>
      </div>

      {/* TABS */}
      <div className="px-6 pt-4">
        <div className="flex bg-gray-100 rounded-xl p-1 w-fit">

          <button
            onClick={() => setActiveTab("followers")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition
              ${
                activeTab === "followers"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            <FaUserFriends />
            Followers
          </button>

          <button
            onClick={() => setActiveTab("following")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition
              ${
                activeTab === "following"
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            <FaUserCheck />
            Following
          </button>

        </div>
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">

        {filteredFollowers.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            No users found
          </div>
        )}

        {filteredFollowers.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
          >

            {/* USER INFO */}
            <div className="flex items-center gap-4">

              <div className="relative">
                <img
                  src={user.person.img}
                  alt={user.person.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                {user.isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>

              <div>
                <p className="font-medium text-gray-800">
                  {user.person.name}
                </p>
                <p className="text-xs text-gray-500">
                  @{user.person.username || "username"}
                </p>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-2">

              {activeTab === "followers" && (
                <>
                  <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition">
                    <FaMinus />
                    Remove
                  </button>

                  {user.isFollowing ? (
                    <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                      <FaUserMinus />
                      Unfollow
                    </button>
                  ) : (
                    <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">
                      <FaUserPlus />
                      Follow
                    </button>
                  )}
                </>
              )}

              {activeTab === "following" && (
                <button className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                  <FaUserMinus />
                  Unfollow
                </button>
              )}

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}