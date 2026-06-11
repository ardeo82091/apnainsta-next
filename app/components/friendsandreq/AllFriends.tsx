"use client";

import axios from "axios";
import { RootState } from "@/redux/store";
import { useState, useEffect, useMemo, FC } from "react";
import {
  FaUserMinus,
  FaUserPlus,
  FaUserFriends,
  FaUserCheck,
  FaMinus,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../ui/Modal/ConfirmModal";
import { getSocket } from "../chat/socket";
interface AllFriendsProps {
    darkMode: boolean;
}

const AllFriends = ({}) => {
  const dispatch = useDispatch();
  const socket = getSocket();

  const users = useSelector((state: RootState) => state.user);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  
  const myUserName = users.userName || "";

  const requests = users.friendAndRequests?.requests || [];
  const followers = users.friendAndRequests?.followers || [];
  const followings = users.friendAndRequests?.followings || [];

  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const filteredUsers =
    activeTab === "followers" ? followers : followings;

  //  FAST LOOKUPS
  const followingSet = useMemo(
    () => new Set(followings.map((f: any) => f.person.userName)),
    [followings]
  );

  const requestSentSet = useMemo(
    () =>
      new Set(
        requests
          .filter((r: any) => r.type === "sent")
          .map((r: any) => r.person.userName)
      ),
    [requests]
  );

  // SOCKET LISTENER
  useEffect(() => {
    if (!myUserName) return;

    socket.emit("join", myUserName);

    socket.on("frnd_action_update", (data) => {
      dispatch({
        type: "user/updateFromSocket",
        payload: data,
      });
    });

    return () => {
      socket.off("frnd_action_update");
    };
  }, [myUserName, socket, dispatch]);

  // HANDLE ACTION
  const handleAction = async (action: string, person: any) => {
    const targetUserName = person.userName;

    dispatch({
      type: "user/updateAction",
      payload: { action, targetUserName, user: person },
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
        payload: { action, targetUserName, user: person },
      });
    }
  };

  return (
    <div className={`flex flex-1 flex-col h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>

      {/* HEADER */}
      <div className={`px-6 py-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
        <h1 className="text-2xl font-semibold">Connections</h1>
      </div>

      {/* TABS */}
      <div className="px-6 pt-4">
        <div className={`flex ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-xl p-1 w-fit`}>

          <button
            onClick={() => setActiveTab("followers")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition
              ${activeTab === "followers"
                ? darkMode
                  ? "bg-gray-800 shadow text-blue-400"
                  : "bg-gray-200 shadow text-blue-600"
                : darkMode
                  ? "bg-gray-900 text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
          >
            <FaUserFriends />
            Followers
          </button>

          <button
            onClick={() => setActiveTab("following")}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg transition
              ${activeTab === "following"
                ? darkMode
                  ? "bg-gray-800 shadow text-blue-400"
                  : "bg-gray-200 shadow text-blue-600"
                : darkMode
                  ? "bg-gray-900 text-gray-400 hover:text-white"
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

        {filteredUsers.length === 0 && (
          <div className={`text-center ${darkMode ? 'text-white' : 'text-gray-500'} mt-20`}>
            No users found
          </div>
        )}

        {filteredUsers.map((user: any) => {
          const userName = user.person.userName;

          const isFollowing = followingSet.has(userName);
          const requestSent = requestSentSet.has(userName);

          return (
            <div
              key={userName}
              className={`flex items-center justify-between p-4 rounded-xl shadow-sm hover:shadow-md transition ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
            >

              {/* USER INFO */}
              <div className="flex items-center gap-4">

                <img
                  src={user.person.img}
                  alt={user.person.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {user.person.name}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    @{userName}
                  </p>
                </div>

              </div>

              {/* ACTIONS */}
              <div className="flex items-center gap-2">

                {activeTab === "followers" && (
                  <>
                    <button
                      onClick={() => handleAction("remove", user.person)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    >
                      <FaMinus />
                      Remove
                    </button>

                    {requestSent ? (
                      <button
                        onClick={() => {
                          setSelectedUser(user.person);
                          setShowModal(true);
                        }}
                        className="bg-yellow-100 text-yellow-700 px-3 py-1.5 text-xs rounded-lg"
                      >
                        Requested
                      </button>
                    ) : isFollowing ? (
                      <button
                        onClick={() => handleAction("unfollow", user.person)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        <FaUserMinus />
                        Unfollow
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction("follow", user.person)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                      >
                        <FaUserPlus />
                        Follow
                      </button>
                    )}
                  </>
                )}

                {activeTab === "following" && (
                  <button
                    onClick={() => handleAction("unfollow", user.person)}
                    className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    <FaUserMinus />
                    Unfollow
                  </button>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      <ConfirmModal
        isOpen={showModal}
        title="Cancel Request?"
        description={`Cancel request to ${selectedUser?.userName}?`}
        confirmText="Yes, Cancel"
        cancelText="No"
        onCancel={() => {
          setShowModal(false);
          setSelectedUser(null);
        }}
        onConfirm={() => {
          if (selectedUser) {
            handleAction("cancel", selectedUser);
          }
          setShowModal(false);
          setSelectedUser(null);
        }}
      />

    </div>
  );
}

export default AllFriends;