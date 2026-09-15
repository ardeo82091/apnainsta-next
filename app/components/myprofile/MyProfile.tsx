'use client'

import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useEffect, useState } from "react"
import { FaHeart, FaComment, FaPlay } from "react-icons/fa"
import { FaCamera } from "react-icons/fa";
import { setUser } from "@/redux/userSlice";
import { useToast } from "@/app/components/ui/ToastProvider";

export default function MyProfile() {

  const user = useSelector((state: RootState) => state.user)
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)
  const dispatch = useDispatch()
  const toast = useToast()

  const [activeTab, setActiveTab] = useState("posts")
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPrivate, setEditPrivate] = useState(false);
  const [databasePosts, setDatabasePosts] = useState<any[]>([])
  const [highlights, setHighlights] = useState<any[]>([])
  const [availableStories, setAvailableStories] = useState<any[]>([])

  const saveProfile = async () => {
    const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: editName, bio: editBio, isPrivate: editPrivate }) });
    const data = await response.json();
    if (!response.ok) return toast(data.message || "Could not save profile", "error");
    dispatch(setUser(data.user)); setEditing(false); toast("Profile updated");
  };
  const shareProfile = async () => { await navigator.clipboard.writeText(`${window.location.origin}/components/profile/${user.userName}`); toast("Profile link copied"); };
  const togglePin = async (postId: string) => {
    const response = await fetch(`/api/posts/${postId}/pin`, { method: "PATCH" });
    const data = await response.json();
    if (!response.ok) return toast(data.message || "Could not update pin", "error");
    setDatabasePosts((items) => items.map((post) => post._id === postId ? { ...post, isPinned: data.isPinned } : post));
    toast(data.isPinned ? "Post pinned" : "Post unpinned");
  };

  const handleProfileUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { toast("Choose a profile photo smaller than 2 MB", "error"); return; }
    const reader = new FileReader();
    reader.onload = async () => {
      const profilePic = String(reader.result);
      const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ profilePic }) });
      const data = await response.json();
      if (!response.ok) return toast(data.message || "Could not update photo", "error");
      setProfileImage(profilePic); dispatch(setUser(data.user)); toast("Profile photo updated");
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setCoverImage(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (!user.userName) return
    fetch(`/api/profile/${user.userName}`).then((response) => response.json()).then((data) => setDatabasePosts(data.posts || []) ).catch(() => undefined)
  }, [user.userName])
  useEffect(() => { fetch("/api/highlights").then((response) => response.json()).then((data) => { setHighlights(data.highlights || []); setAvailableStories(data.stories || []) }).catch(() => undefined) }, [])
  const addHighlight = async () => {
    if (!availableStories[0]) return toast("Share a story first", "error")
    const title = window.prompt("Highlight name")?.trim()
    if (!title) return
    const response = await fetch("/api/highlights", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, storyId: availableStories[0]._id }) })
    const data = await response.json(); if (!response.ok) return toast(data.message || "Could not add highlight", "error")
    setHighlights((items) => [data.highlight, ...items]); toast("Highlight added")
  }

  const posts: any[] = databasePosts.length ? databasePosts : user.posts || []

  const videos = posts.filter((p: any) => (p.media || []).some((m: any) => m.isVideo))

  const likedPosts =
    posts.filter((p: any) =>
      p.likes?.some((l: any) => l.userName === user.userName)
    )

  const archivedPosts = posts.slice(-25)

  const pinnedPosts = posts.filter((post: any) => post.isPinned).slice(0, 8)

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

            <button onClick={() => { setEditName(user.fullName); setEditBio(user.bio || ""); setEditPrivate(Boolean((user as any).isPrivate)); setEditing(true); }} className={`px-4 py-2 text-sm border rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              Edit Profile
            </button>

            <button onClick={shareProfile} className={`px-4 py-2 text-sm border rounded-md ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
              Share
            </button>

          </div>

        </div>


        {/* BIO */}
        <div className={`mt-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} max-w-xl`}>
          {user.bio || "Add a bio to tell people about yourself."}
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

          <button onClick={addHighlight} className="flex flex-col items-center"><div className="w-16 h-16 rounded-full border flex items-center justify-center text-lg">+</div><p className="text-xs mt-1">New</p></button>
          {highlights.map((item: any) => (

            <div
              key={item._id}
              className="flex flex-col items-center"
            >

              <img src={item.coverUrl || "/images/profile.jpg"} className="w-16 h-16 rounded-full border object-cover" alt={item.title}/>

              <p className="text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}">
                {item.title}
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

              <span className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white">Pinned</span>

              {(post.media || []).some((m: any) => m.isVideo) && (

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

              {!(post.media || []).some((m: any) => m.isVideo) && post._id && (
                <button onClick={() => togglePin(post._id)} className="absolute left-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white">{post.isPinned ? "Unpin" : "Pin"}</button>
              )}

              {(post.media || []).some((m: any) => m.isVideo) && (

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
      {editing && <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/50 p-4"><div className={`w-full max-w-md rounded-2xl p-5 ${darkMode ? "bg-gray-900" : "bg-white"}`}><h2 className="font-semibold">Edit profile</h2><label className="mt-4 block text-sm">Name<input value={editName} onChange={(event) => setEditName(event.target.value)} className="mt-1 w-full rounded border p-2 text-black"/></label><label className="mt-3 block text-sm">Bio<textarea value={editBio} onChange={(event) => setEditBio(event.target.value)} maxLength={150} className="mt-1 w-full rounded border p-2 text-black"/></label><label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={editPrivate} onChange={(event) => setEditPrivate(event.target.checked)}/> Private account</label><div className="mt-5 flex justify-end gap-3"><button onClick={() => setEditing(false)}>Cancel</button><button onClick={saveProfile} className="rounded bg-blue-600 px-3 py-2 text-white">Save</button></div></div></div>}
    </div>
  )
}
