"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { text } from "stream/consumers";

export function GeneralSettings() {

  const user = useSelector((state: any) => state.user)
  const darkMode = useSelector((state: any) => state.theme.darkMode)

  const posts = user.posts || []

  const [editing, setEditing] = useState(false)

  const [fullName, setFullName] = useState(user.fullName)
  const [userName, setUsername] = useState(user.userName)
  const [bio, setBio] = useState("")

  const [profileImage, setProfileImage] = useState<string | null>(null)

  const weeklyReach = [20, 35, 40, 60, 45, 70, 80]
  const monthlyReach = [120, 200, 260, 310, 380]

  const followerGrowth = [120, 135, 150, 180, 210, 260, 300]

  const storyAnalytics = {
    views: 540,
    replies: 23,
    shares: 12,
    exits: 8
  }

  const demographics = {
    male: 58,
    female: 39,
    other: 3
  }

  const liked = posts.slice(0, 25)

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onloadend = () => {
      setProfileImage(reader.result as string)
    }

    reader.readAsDataURL(file)
  }

  return (

    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-semibold">General Settings</h2>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}>
          Dear user, View and manage your general account settings.
        </p>
      </div>
    <div className={`h-full overflow-y-auto border rounded-xl ${darkMode ? "bg-gray-900" : "bg-white"} px-8 py-10 animate-fadeIn`}>

      <div className="max-w-6xl mx-auto space-y-12">

        {/* PROFILE */}

        <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>

          <div className="flex justify-between items-start">

            <div className="flex gap-8">

              <div className="relative group">

                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-200">

                  {profileImage ? (
                    <img src={profileImage} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      No Photo
                    </div>
                  )}

                </div>

                <label className={`absolute bottom-0 right-0 ${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"} text-white text-xs px-3 py-1 rounded-full cursor-pointer`}>
                  Change
                  <input type="file" className="hidden" onChange={handleImageChange} />
                </label>

              </div>

              <div className="space-y-3">

                {editing ? (
                  <>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="text-2xl font-semibold border-b outline-none"
                    />

                    <input
                      value={userName}
                      onChange={(e) => setUsername(e.target.value)}
                      className="text-gray-500 border-b outline-none"
                    />

                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="border-b outline-none resize-none text-sm"
                    />
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold">{fullName}</h2>
                    <p className="text-gray-500">@{userName}</p>
                    <p className="text-sm text-gray-600">{bio || "Add bio..."}</p>
                  </>
                )}

              </div>

            </div>

            <button
              onClick={() => setEditing(!editing)}
              className={`${darkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"} text-white px-6 py-2 rounded-lg hover:opacity-90`}
            >
              {editing ? "Save" : "Edit Profile"}
            </button>

          </div>

        </div>

        {/* PROFILE REACH */}

        <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"} space-y-6`}>

          <h3 className="font-semibold text-lg">Profile Reach</h3>

          <div className="grid grid-cols-2 gap-10">

            {/* WEEK */}

            <div>

              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-3`}>This Week</p>

              <div className="h-32 flex items-end gap-3">

                {weeklyReach.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-indigo-500 to-purple-400"
                    style={{ height: `${v}px` }}
                  />
                ))}

              </div>

              <p className={`text-sm mt-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Total: {weeklyReach.reduce((a, b) => a + b, 0)}
              </p>

            </div>

            {/* MONTH */}

            <div>

              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"} mb-3`}>This Month</p>

              <div className="h-32 flex items-end gap-3">

                {monthlyReach.map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-blue-500 to-cyan-400"
                    style={{ height: `${v / 2}px` }}
                  />
                ))}

              </div>

              <p className={`text-sm mt-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                Total: {monthlyReach.reduce((a, b) => a + b, 0)}
              </p>

            </div>

          </div>

        </div>

        {/* FOLLOWER GROWTH */}

        <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"} space-y-6`}>

          <h3 className={`font-semibold text-lg ${darkMode ? "text-gray-400" : "text-gray-700"}`}>Follower Growth</h3>

          <div className="h-36 flex items-end gap-3">

            {followerGrowth.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-xl bg-gradient-to-t from-pink-500 to-orange-400"
                style={{ height: `${v / 4}px` }}
              />
            ))}

          </div>

          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            +{followerGrowth[followerGrowth.length - 1] - followerGrowth[0]} followers this week
          </p>

        </div>

        {/* STORY ANALYTICS */}

        <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>

          <h3 className={`font-semibold text-lg mb-6 ${darkMode ? "text-gray-400" : "text-gray-700"}`}>Story Viewer Analytics</h3>

          <div className="grid grid-cols-4 gap-6">

            <div className={`bg-blue-50 p-4 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Views</p>
              <p className={`text-xl font-semibold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>{storyAnalytics.views}</p>
            </div>

            <div className={`bg-green-50 p-4 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Replies</p>
              <p className={`text-xl font-semibold ${darkMode ? "text-green-400" : "text-green-600"}`}>{storyAnalytics.replies}</p>
            </div>

            <div className={`bg-purple-50 p-4 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Shares</p>
              <p className={`text-xl font-semibold ${darkMode ? "text-purple-400" : "text-purple-600"}`}>{storyAnalytics.shares}</p>
            </div>

            <div className={`bg-red-50 p-4 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-white"}`}>
              <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Exits</p>
              <p className={`text-xl font-semibold ${darkMode ? "text-red-400" : "text-red-500"}`}>{storyAnalytics.exits}</p>
            </div>

          </div>

        </div>

        {/* TOP POSTS */}

        <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>

          <h3 className={`font-semibold mb-6 text-lg ${darkMode ? "text-gray-400" : "text-gray-700"}`}>Top Performing Posts</h3>

          <div className="grid grid-cols-3 gap-4">

            {posts.slice(0, 3).map((post: any) => (
              <div key={post.id} className="rounded-xl overflow-hidden bg-gray-200 hover:scale-105 transition">

                <img
                  src={post.src}
                  className="w-full h-40 object-cover"
                />

              </div>
            ))}

          </div>

        </div>

        {/* DEMOGRAPHICS */}

        <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"} space-y-6`}>

          <h3 className={`font-semibold text-lg ${darkMode ? "text-gray-400" : "text-gray-700"}`}>Audience Demographics</h3>

          <div className="space-y-4">

            <div>
              <div className="flex justify-between text-sm">
                <span>Male</span>
                <span>{demographics.male}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${demographics.male}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>Female</span>
                <span>{demographics.female}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-pink-500 h-2 rounded-full"
                  style={{ width: `${demographics.female}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>Other</span>
                <span>{demographics.other}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${demographics.other}%` }}
                />
              </div>
            </div>

          </div>

        </div>

        {/* LIKED */}

        <div className={`rounded-3xl p-8 shadow-sm ${darkMode ? "bg-gray-800" : "bg-white"}`}>

          <h3 className={`font-semibold mb-6 text-lg ${darkMode ? "text-gray-400" : "text-gray-700"}`}>Last 25 Liked</h3>

          <div className="grid grid-cols-5 gap-3">

            {posts.slice(0, 25).map((post: any) => (
              <div key={post.id} className="aspect-square rounded-lg overflow-hidden">

                <img
                  src={post.src}
                  className="w-full h-full object-cover"
                />

              </div>
            ))}

          </div>

        </div>

      </div>
      </div>

      <style jsx>{`

.animate-fadeIn{
animation:fadeIn .35s ease-in-out;
}

@keyframes fadeIn{
from{opacity:0;transform:translateY(10px)}
to{opacity:1;transform:translateY(0)}
}

`}</style>

    </div>
  )
}