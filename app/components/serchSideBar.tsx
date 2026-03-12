"use client"

import { FC, useState } from "react"
import { FaTimes, FaSearch, FaCheckCircle } from "react-icons/fa"
import UserInSearch from "../../lib/users.json"
import { FaUserPlus, FaUserMinus } from "react-icons/fa";

interface SearchSlideProps {
  isOpen: boolean
  onClose: () => void
}

const SearchSlideBar: FC<SearchSlideProps> = ({ isOpen, onClose }) => {

  const [searchUser, setSearchUser] = useState("")
  const [results, setResults] = useState<any[]>([])

  const handleSearch = (value: string) => {

    setSearchUser(value)

    if (value.length < 2) {
      setResults([])
      return
    }

    const filtered = UserInSearch.filter((u) =>
      u.userName.toLowerCase().includes(value.toLowerCase())
    )

    setResults(filtered)
  }

  const toggleFollow = (userName: string) => {

    setResults((prev) =>
      prev.map((u) =>
        u.userName === userName
          ? { ...u, isFollowing: !u.isFollowing }
          : u
      )
    )

  }

  return (
    <>
      {/* BACKDROP */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* SLIDER */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">

          <h2 className="text-lg font-semibold">
            Search
          </h2>

          <FaTimes
            className="cursor-pointer text-gray-500 hover:text-black"
            onClick={onClose}
          />

        </div>


        {/* SEARCH INPUT */}
        <div className="p-4">

          <div className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-lg">

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search users..."
              className="bg-transparent outline-none flex-1 text-sm"
              value={searchUser}
              onChange={(e) => handleSearch(e.target.value)}
            />

          </div>

        </div>


        {/* RESULTS */}
        <div className="overflow-y-auto px-4 pb-6 space-y-3">

          {results.length === 0 && searchUser.length > 1 && (
            <p className="text-gray-500 text-sm">
              No users found
            </p>
          )}

          {results.map((user, index) => (

            <div
              key={index}
              className="flex items-center justify-between gap-3 p-3 border rounded-lg hover:shadow-sm hover:bg-gray-50 transition"
            >

              {/* LEFT SIDE */}
              <div className="flex items-center gap-3">

                {/* AVATAR */}
                <div className="relative">

                  <img
                    src={user.img}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {/* ONLINE DOT */}
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
                    ${user.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                  />

                </div>


                {/* USER INFO */}
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


              {/* ACTION BUTTONS */}
              <div className="flex items-center gap-2">

                {/* FOLLOW / UNFOLLOW */}
                <button
                    onClick={() => toggleFollow(user.userName)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition
                    ${
                        user.isFollowing
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                    >
                    {user.isFollowing ? (
                        <>
                        <FaUserMinus />
                        Unfollow
                        </>
                    ) : (
                        <>
                        <FaUserPlus />
                        Follow
                        </>
                    )}
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </>
  )
}

export default SearchSlideBar