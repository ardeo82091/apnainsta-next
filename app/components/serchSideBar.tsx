"use client"

import { FC, useEffect, useState } from "react"
import { FaTimes, FaSearch, FaCheckCircle, FaUserPlus, FaUserMinus } from "react-icons/fa"
import axios from "axios"
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

interface SearchSlideProps {
  isOpen: boolean
  onClose: () => void
}

const SearchSlideBar: FC<SearchSlideProps> = ({ isOpen, onClose }) => {

  const [searchUser, setSearchUser] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState("")

  const myUserName = useSelector((state: RootState) => state.user.userName)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchUser)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchUser])

  useEffect(() => {
    const fetchUsers = async () => {

      if (debouncedSearch.trim().length < 2) {
        setResults([])
        return
      }

      try {
        const { data } = await axios.get("/api/search", {
          params: {
            query: debouncedSearch,
            exclude: myUserName
          }
        })

        setResults(data)

      } catch (error) {
        console.error(error)
      }
    }

    fetchUsers()

  }, [debouncedSearch, myUserName])

  const toggleFollow = async (user: any) => {

    try {

      if (user.isFollowing) {
        await axios.post("/api/frndreq", {
          action: "unfollow",
          myUserName,
          targetUserName: user.userName
        })

        setResults(prev =>
          prev.map(u =>
            u.userName === user.userName
              ? { ...u, isFollowing: false }
              : u
          )
        )
      } else if (user.requestSent) {
        await axios.post("/api/frndreq", {
          action: "cancel",
          myUserName,
          targetUserName: user.userName
        })

        setResults(prev =>
          prev.map(u =>
            u.userName === user.userName
              ? { ...u, requestSent: false }
              : u
          )
        )
      } else {
        await axios.post("/api/frndreq", {
          action: "follow",
          myUserName,
          targetUserName: user.userName
        })

        setResults(prev =>
          prev.map(u =>
            u.userName === user.userName
              ? { ...u, requestSent: true }
              : u
          )
        )

      }

    } catch (error) {
      console.error(error)
    }
  }

  const acceptRequest = async (targetUserName: string) => {
    await axios.post("/api/frndreq", {
      action: "accept",
      myUserName,
      targetUserName
    })

    setResults(prev =>
      prev.map(u =>
        u.userName === targetUserName
          ? { ...u, isFollowing: true, acceptReq: false }
          : u
      )
    )
  }

  const rejectRequest = async (targetUserName: string) => {
    await axios.post("/api/frndreq", {
      action: "reject",
      myUserName,
      targetUserName
    })

    setResults(prev =>
      prev.map(u =>
        u.userName === targetUserName
          ? { ...u, acceptReq: false }
          : u
      )
    )
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Search</h2>

          <FaTimes
            className="cursor-pointer text-gray-500 hover:text-black"
            onClick={onClose}
          />
        </div>

        <div className="p-4">
          <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg">
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

        <div className="overflow-y-auto px-4 pb-6 space-y-3">

          {results.length === 0 && searchUser.length > 1 && (
            <p className="text-gray-500 text-sm">
              No users found
            </p>
          )}

          {results.map((user) => (
            <div
              key={user.userName}
              className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:shadow-sm hover:bg-gray-50 transition"
            >
              <div className="flex items-center gap-3">

                <div className="relative">
                  <img
                    src={user.img}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                    ${user.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                  />
                </div>

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

                  <span className="text-xs text-gray-400">
                    {user.followers} followers • {user.mutualFriends} mutual
                  </span>

                </div>
              </div>

              <div className="flex items-center gap-2">
                {user.acceptReq ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => acceptRequest(user.userName)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => rejectRequest(user.userName)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleFollow(user)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition
                      ${
                        user.isFollowing
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : user.requestSent
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                  >
                    {user.isFollowing ? (
                      <>
                        <FaUserMinus />
                        Unfollow
                      </>
                    ) : user.requestSent ? (
                      <>Cancel Request</>
                    ) : (
                      <>
                        <FaUserPlus />
                        Follow
                      </>
                    )}
                  </button>
                )}

              </div>
            </div>
          ))}

        </div>
      </div>
    </>
  )
}

export default SearchSlideBar