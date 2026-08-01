'use client'

import Image from "next/image"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useState } from "react"
import { FaHeart, FaComment, FaPlay } from "react-icons/fa"
import { FaCamera } from "react-icons/fa";

export default function MyProfile() {

  const user = useSelector((state: RootState) => state.user)
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)

  const [activeTab, setActiveTab] = useState("posts")
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleProfileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setProfileImage(URL.createObjectURL(file));
  };

  const handleCoverUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(URL.createObjectURL(file));
  };

  const posts = user.posts || []

  const videos = posts.filter((p) => p.media.some((m) => m.isVideo))

  const likedPosts =
    posts.filter((p) =>
      p.likes?.some((l) => l.userName === user.userName)
    )

  const archivedPosts = posts.slice(-25)

  const pinnedPosts = posts.slice(0, 8)

  const displayPosts =
    activeTab === "posts"
      ? posts
      : activeTab === "videos"
        ? videos
        : activeTab === "liked"
          ? likedPosts
          : archivedPosts

  return (

    <div className="w-full overflow-y-auto pb-20">
      <div className="relative w-full h-72">

        {/* COVER IMAGE */}
        <div className="relative w-full h-full group">

          {coverImage ? (
            <Image
              src={coverImage}
              alt="cover"
              fill
              className="object-cover"
            />
          ) : (
            <div
              className={`
                w-full
                h-full
                flex
                flex-col
                items-center
                justify-center
                ${
                  darkMode
                    ? "bg-gray-800"
                    : "bg-gray-200"
                }
              `}
            >
              <FaCamera
                size={40}
                className="opacity-70"
              />

              <p className="mt-2 text-sm">
                Add Cover Photo
              </p>
            </div>
          )}

          {/* COVER CAMERA */}
          <label
            className="
              absolute
              top-4
              right-4
              w-11
              h-11
              rounded-full
              bg-black/60
              flex
              items-center
              justify-center
              text-white
              cursor-pointer
              opacity-0
              group-hover:opacity-100
              transition
            "
          >
            <FaCamera />

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
            />
          </label>

        </div>

        {/* PROFILE IMAGE */}
        <div className="absolute -bottom-16 left-10">

          <div className="relative">

            {profileImage ? (
              <div
                onClick={() =>
                  setShowProfileModal(true)
                }
                className={`
                  relative
                  w-[140px]
                  h-[140px]
                  rounded-full
                  overflow-hidden
                  cursor-pointer
                  border-4
                  ${
                    darkMode
                      ? "border-gray-900"
                      : "border-white"
                  }
                `}
              >
                <Image
                  src={profileImage}
                  alt="profile"
                  fill
                  sizes="140px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className={`
                  w-[140px]
                  h-[140px]
                  rounded-full
                  flex
                  items-center
                  justify-center
                  border-4
                  ${
                    darkMode
                      ? "bg-gray-800 border-gray-900"
                      : "bg-gray-100 border-white"
                  }
                `}
              >
                <FaCamera size={32} />
              </div>
            )}

            {/* PROFILE CAMERA */}
            <label
              className="
                absolute
                bottom-2
                right-2
                w-10
                h-10
                rounded-full
                bg-blue-500
                flex
                items-center
                justify-center
                text-white
                shadow-lg
                cursor-pointer
                hover:scale-105
                transition
              "
            >
              <FaCamera size={14} />

              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
              />
            </label>

          </div>

        </div>

      </div>

      <div className="px-10 pt-20">

        <div className="flex justify-between items-start">

          <div>

            <h2 className="text-2xl font-bold">
              {user.fullName}
            </h2>

            <p className="text-gray-500 text-sm">
              @{user.userName}
            </p>

          </div>

          <div className="flex gap-3">

            <button className={`px-4 py-2 text-sm border rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              Edit Profile
            </button>

            <button className={`px-4 py-2 text-sm border rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              Share
            </button>

          </div>

        </div>


        {/* BIO */}
        <div className={`mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-xl`}>
          Passionate developer building social media apps.
        </div>


        {/* INFO */}
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-2 space-y-1`}>

          <p>📍 India</p>

          <p>🌐 www.ankitraj.dev</p>

          <p>📅 Joined Aug 2024</p>

        </div>


        {/* STATS */}
        <div className="flex gap-16 mt-6">

          <div className="text-center">

            <p className="font-bold text-lg">
              {posts.length}
            </p>

            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              Posts
            </p>

          </div>

          <div className="text-center">

            <p className="font-bold text-lg">
              {user.friendAndRequests?.followers?.length || 0}
            </p>

            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              Followers
            </p>

          </div>

          <div className="text-center">

            <p className="font-bold text-lg">
              {user.friendAndRequests?.followings?.length || 0}
            </p>

            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
              Following
            </p>

          </div>

        </div>


        {/* STORY HIGHLIGHTS */}
        <div className="flex gap-8 mt-10">

          {["Travel", "Work", "Friends", "Events"].map((item) => (

            <div
              key={item}
              className="flex flex-col items-center"
            >

              <div className="w-16 h-16 rounded-full border flex items-center justify-center text-lg">
                +
              </div>

              <p className="text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}">
                {item}
              </p>

            </div>

          ))}

        </div>

      </div>

      <div className="px-10 mt-12">

        <h3 className="font-semibold mb-4">
          Pinned Posts
        </h3>

        <div className="flex overflow-x-auto gap-4 pb-4">

          {pinnedPosts.map((post) => (

            <div
              key={post.id}
              className="min-w-[220px] h-[220px] rounded-xl overflow-hidden relative group flex-shrink-0"
            >

              <img
                src={post.media[0].src}
                className="w-full h-full object-cover"
              />

              {post.media.some((m) => m.isVideo) && (

                <FaPlay className="absolute top-2 right-2 ${darkMode ? 'text-white' : 'text-black'}" />

              )}

            </div>

          ))}

        </div>

      </div>

      <div className="sticky top-0 ${darkMode ? 'bg-gray-900' : 'bg-white'} z-30 px-10 mt-10 border-b">

        <div className="flex gap-10 py-3">

          <button
            onClick={() => setActiveTab("posts")}
            className={`
              pb-2
              transition-colors
              ${
                activeTab === "posts"
                  ? darkMode
                    ? "border-b-2 border-white text-white font-semibold"
                    : "border-b-2 border-black text-black font-semibold"
                  : darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
              }
            `}
          >
            Posts
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`
              pb-2
              transition-colors
              ${
                activeTab === "videos"
                  ? darkMode
                    ? "border-b-2 border-white text-white font-semibold"
                    : "border-b-2 border-black text-black font-semibold"
                  : darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
              }
            `}
          >
            Videos
          </button>

          <button
            onClick={() => setActiveTab("liked")}
            className={`
              pb-2
              transition-colors
              ${
                activeTab === "liked"
                  ? darkMode
                    ? "border-b-2 border-white text-white font-semibold"
                    : "border-b-2 border-black text-black font-semibold"
                  : darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
              }
            `}
          >
            Liked
          </button>

          <button
            onClick={() => setActiveTab("archive")}
            className={`
              pb-2
              transition-colors
              ${
                activeTab === "archive"
                  ? darkMode
                    ? "border-b-2 border-white text-white font-semibold"
                    : "border-b-2 border-black text-black font-semibold"
                  : darkMode
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-500 hover:text-gray-900"
              }
            `}
          >
            Archive
          </button>

        </div>

      </div>

      <div className="px-10 mt-6">

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">

          {displayPosts.slice(0, 25).map((post) => (

            <div
              key={post.id}
              className="relative aspect-square overflow-hidden rounded-lg group"
            >

              <img
                src={post.media[0].src}
                className="w-full h-full object-cover"
              />

              {post.media.some((m) => m.isVideo) && (

                <FaPlay className="absolute top-2 right-2 text-white" />

              )}

              {/* HOVER */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-6 text-white transition">

                <span className="flex items-center gap-1">

                  <FaHeart />

                  {post.likes?.length || 0}

                </span>

                <span className="flex items-center gap-1">

                  <FaComment />

                  {post.comments?.length || 0}

                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

      {showProfileModal && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            bg-black/90
            flex
            items-center
            justify-center
            p-4
          "
          onClick={() => setShowProfileModal(false)}
        >
          <button
            onClick={() =>
              setShowProfileModal(false)
            }
            className="
              absolute
              top-6
              right-6
              text-white
              text-4xl
              font-light
              hover:scale-110
              transition
            "
          >
            ×
          </button>

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              relative
              max-w-[700px]
              max-h-[700px]
              w-full
              aspect-square
            "
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt="Profile"
                fill
                className="
                  object-cover
                  rounded-2xl
                "
              />
            ) : (
              <div
                className={`
                  w-full
                  h-full
                  rounded-2xl
                  flex
                  items-center
                  justify-center
                  ${
                    darkMode
                      ? "bg-gray-800"
                      : "bg-white"
                  }
                `}
              >
                <FaCamera size={80} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}