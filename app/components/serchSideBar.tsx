"use client";

import { FC, useEffect, useState, useMemo } from "react";
import {
  FaTimes,
  FaSearch,
  FaCheckCircle,
  FaUserPlus,
  FaUserMinus,
} from "react-icons/fa";
import axios from "axios";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "./chat/socket";

interface SearchSlideProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchSlideBar: FC<SearchSlideProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const socket = getSocket();

  const [searchUser, setSearchUser] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const users = useSelector((state: RootState) => state.user);
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const myUserName = users.userName;

  const requests = users.friendAndRequests?.requests || [];
  const followings = users.friendAndRequests?.followings || [];

  // 🔥 Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchUser);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchUser]);

  // 🔥 Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearch.trim().length < 2) {
        setResults([]);
        return;
      }

      try {
        const { data } = await axios.get("/api/search", {
          params: {
            query: debouncedSearch,
            exclude: myUserName,
          },
        });

        setResults(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, [debouncedSearch, myUserName]);

  // 🔥 FAST LOOKUPS (important)
  const followingSet = useMemo(
    () => new Set(followings.map((f: any) => f.person.userName)),
    [followings]
  );

  const sentRequestSet = useMemo(
    () =>
      new Set(
        requests
          .filter((r: any) => r.type === "sent")
          .map((r: any) => r.person.userName)
      ),
    [requests]
  );

  const receivedRequestSet = useMemo(
    () =>
      new Set(
        requests
          .filter((r: any) => r.type === "received")
          .map((r: any) => r.person.userName)
      ),
    [requests]
  );

  // ✅ CORRECT STATUS LOGIC
  const getUserStatus = (user: any) => {
    const userName = user.userName;

    if (receivedRequestSet.has(userName)) return "incoming";
    if (followingSet.has(userName)) return "following";
    if (sentRequestSet.has(userName)) return "requested";

    return "none";
  };

  // 🔥 HANDLE ACTION
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

  const statusConfig: any = {
    following: {
      label: "Unfollow",
      icon: <FaUserMinus />,
      className: "bg-gray-200 text-gray-700 hover:bg-gray-300",
      action: "unfollow",
    },

    requested: {
      label: "Cancel",
      className: "bg-red-100 text-red-700 hover:bg-red-200",
      action: "cancel",
    },

    none: {
      label: "Follow",
      icon: <FaUserPlus />,
      className:
        "bg-gradient-to-r from-teal-400 to-blue-500 text-white shadow hover:scale-[1.02]",
      action: "follow",
    },
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 shadow-2xl z-50 transform transition-transform duration-300
        ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}  
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="text-lg font-semibold">Search</h2>
          <FaTimes
            className="cursor-pointer text-gray-500 hover:text-black"
            onClick={onClose}
          />
        </div>

        {/* SEARCH INPUT */}
        <div className="p-4">
          <div className={`flex items-center gap-3 px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="bg-transparent outline-none flex-1 text-sm"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
          </div>
        </div>

        {/* RESULTS */}
        <div className="overflow-y-auto px-4 pb-6 space-y-3">
          {results.length === 0 && searchUser.length > 1 && (
            <p className={`text-sm ${darkMode ? 'text-gray-800' : 'text-white'}`}>
              No users found
            </p>
          )}

          {results.map((user) => {
            const status = getUserStatus(user);
            const config = statusConfig[status];

            return (
              <div
                key={user.userName}
                className={`flex items-center justify-between gap-3 p-3 rounded-lg hover:shadow-sm ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition`}
              >
                {/* USER INFO */}
                <div className="flex items-center gap-3">
                  <img
                    src={user.img}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">
                        {user.userName}
                      </span>
                      {user.isVerified && (
                        <FaCheckCircle className="text-blue-500 text-xs" />
                      )}
                    </div>

                    <span className="text-xs text-gray-500">
                      {user.name}
                    </span>
                  </div>
                </div>

                {/* ACTION BUTTON */}
                {status === "incoming" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction("accept", user)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleAction("reject", user)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAction(config.action, user)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition ${config.className}`}
                  >
                    {config.icon}
                    {config.label}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SearchSlideBar;