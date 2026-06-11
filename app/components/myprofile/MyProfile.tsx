'use client'

import Image from "next/image"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useState } from "react"
import { FaHeart, FaComment, FaPlay } from "react-icons/fa"

import profilePic from "@/public/images/profile.jpg"
import bannerPic from "@/public/images/bkg.jpg"

export default function MyProfile() {

  const user = useSelector((state: RootState) => state.user)

  const [activeTab, setActiveTab] = useState("posts")

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

      {/* COVER + PROFILE */}
      <div className="relative w-full h-64">

        <Image
          src={bannerPic}
          alt="cover"
          fill
          className="object-cover"
          style={{ objectFit: 'cover' }}
        />

        {/* PROFILE IMAGE */}
        <div className="absolute -bottom-16 left-10">

          <Image
            src={profilePic}
            alt="profile"
            width={140}
            height={140}
            className="rounded-full border-4 border-white shadow-xl"
          />

        </div>

      </div>


      {/* PROFILE INFO */}
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

            <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">
              Edit Profile
            </button>

            <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">
              Share
            </button>

          </div>

        </div>


        {/* BIO */}
        <div className="mt-4 text-sm text-gray-700 max-w-xl">
          Passionate developer building social media apps.
        </div>


        {/* INFO */}
        <div className="text-sm text-gray-500 mt-2 space-y-1">

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

            <p className="text-gray-500 text-sm">
              Posts
            </p>

          </div>

          <div className="text-center">

            <p className="font-bold text-lg">
              {user.friendAndRequests?.followers?.length || 0}
            </p>

            <p className="text-gray-500 text-sm">
              Followers
            </p>

          </div>

          <div className="text-center">

            <p className="font-bold text-lg">
              {user.friendAndRequests?.followings?.length || 0}
            </p>

            <p className="text-gray-500 text-sm">
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

              <p className="text-xs mt-1 text-gray-600">
                {item}
              </p>

            </div>

          ))}

        </div>

      </div>


      {/* PINNED POSTS */}
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

                <FaPlay className="absolute top-2 right-2 text-white" />

              )}

            </div>

          ))}

        </div>

      </div>


      {/* TABS */}
      <div className="sticky top-0 bg-white z-30 px-10 mt-10 border-b">

        <div className="flex gap-10 py-3">

          <button
            onClick={() => setActiveTab("posts")}
            className={`pb-2 ${activeTab === "posts"
                ? "border-b-2 border-black font-semibold"
                : "text-gray-500"
              }`}
          >
            Posts
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`pb-2 ${activeTab === "videos"
                ? "border-b-2 border-black font-semibold"
                : "text-gray-500"
              }`}
          >
            Videos
          </button>

          <button
            onClick={() => setActiveTab("liked")}
            className={`pb-2 ${activeTab === "liked"
                ? "border-b-2 border-black font-semibold"
                : "text-gray-500"
              }`}
          >
            Liked
          </button>

          <button
            onClick={() => setActiveTab("archive")}
            className={`pb-2 ${activeTab === "archive"
                ? "border-b-2 border-black font-semibold"
                : "text-gray-500"
              }`}
          >
            Archive
          </button>

        </div>

      </div>


      {/* POSTS GRID */}
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

    </div>

  )

}