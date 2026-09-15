"use client"

import { useEffect, useState } from "react"
import { FaTimes } from "react-icons/fa"

type Post = { _id: string; userName: string; caption?: string; media?: { src: string; isVideo: boolean }[]; src?: string; isVideo?: boolean }

/** Discovery grid: 4 columns on desktop, tapping opens the post full-size. */
export default function ViewMyFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [recommendedReels, setRecommendedReels] = useState<Post[]>([])
  const [selected, setSelected] = useState<Post | null>(null)
  useEffect(() => { fetch("/api/posts").then((response) => response.json()).then((data) => setPosts(data.posts || [])) }, [])
  useEffect(() => { fetch("/api/reels/recommended").then((response) => response.json()).then((data) => setRecommendedReels(data.reels || [])) }, [])
  const renderTile = (post: Post) => { const media = post.media?.[0] || (post.src ? { src: post.src, isVideo: post.isVideo } : null); return <button key={post._id} onClick={() => setSelected(post)} className="relative aspect-square overflow-hidden bg-gray-100">{media?.isVideo ? <video src={media.src} className="h-full w-full object-cover" muted /> : <img src={media?.src} className="h-full w-full object-cover" alt={post.caption || "Post"}/>} {media?.isVideo && <span className="absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-xs text-white">REEL</span>}</button> }
  return <main className="min-h-screen overflow-y-auto bg-white p-3 sm:p-5"><h1 className="mb-4 text-xl font-semibold">Explore</h1>{recommendedReels.length > 0 && <><h2 className="mb-2 text-sm font-semibold text-gray-600">Reels picked for you</h2><div className="mb-6 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">{recommendedReels.slice(0, 8).map(renderTile)}</div></>}<h2 className="mb-2 text-sm font-semibold text-gray-600">All posts</h2><div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">{posts.map(renderTile)}</div>{posts.length === 0 && <p className="py-20 text-center text-sm text-gray-500">No posts to explore yet.</p>}{selected && <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4" onClick={() => setSelected(null)}><article onClick={(event) => event.stopPropagation()} className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white"><button onClick={() => setSelected(null)} className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white"><FaTimes /></button>{(selected.media?.[0]?.isVideo || selected.isVideo) ? <video controls autoPlay onEnded={() => fetch(`/api/reels/${selected._id}/view`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ completed: true }) })} src={selected.media?.[0]?.src || selected.src} className="max-h-[75vh] w-full bg-black"/> : <img src={selected.media?.[0]?.src || selected.src} className="max-h-[75vh] w-full object-contain" alt={selected.caption || "Post"}/>}<div className="p-4"><b>@{selected.userName}</b><p className="mt-2 text-sm">{selected.caption}</p></div></article></div>}</main>
}
