"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "@/app/components/sidebar"
import Header from "@/app/components/header"

export default function ProfilePage() {
  const { userName } = useParams<{ userName: string }>()
  const [data, setData] = useState<any>(null)
  useEffect(() => { fetch(`/api/profile/${encodeURIComponent(userName)}`).then(async (response) => { const payload = await response.json(); setData(response.ok ? payload : { error: payload.message || "Profile not found" }) }).catch(() => setData({ error: "Could not load profile" })) }, [userName])
  const content = !data ? <p className="p-8">Loading profile…</p> : data.error ? <p className="p-8 text-red-600">{data.error}</p> : data.private ? <main className="mx-auto max-w-md p-12 text-center"><img className="mx-auto h-20 w-20 rounded-full" src={data.profilePic || "/images/profile.jpg"} alt="Profile"/><h1 className="mt-4 text-xl font-semibold">@{data.userName}</h1><p className="mt-2 text-sm text-gray-500">This account is private. Follow this person to see their posts.</p></main> : <main className="mx-auto max-w-3xl p-6"><header className="flex items-center gap-5"><img className="h-24 w-24 rounded-full object-cover" src={data.profile.profilePic || "/images/profile.jpg"} alt="Profile"/><div><h1 className="text-xl font-semibold">@{data.profile.userName}</h1><p>{data.profile.fullName}</p><p className="text-sm text-gray-500">{data.profile.followers} followers · {data.profile.following} following</p><p className="mt-2 text-sm">{data.profile.bio}</p></div></header><div className="mt-8 grid grid-cols-3 gap-1">{data.posts.map((post: any) => <img key={post._id} src={post.media?.[0]?.src || post.src} className="aspect-square w-full object-cover" alt={post.caption || "Post"}/>)}</div></main>
  return <div className="flex h-screen overflow-hidden bg-gray-50"><Sidebar /><div className="min-w-0 flex-1 overflow-y-auto">{content}</div><aside className="hidden w-80 border-l bg-white xl:block"><Header /></aside></div>
}
