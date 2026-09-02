"use client"

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { FaComment, FaHeart, FaRegHeart, FaTimes, FaEllipsisH } from "react-icons/fa"
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useToast } from "@/app/components/ui/ToastProvider"
import { useRouter } from "next/navigation"

type Comment = { _id: string; authorUserName: string; text: string; createdAt: string; likes: { userName: string }[]; replies?: Comment[] }
type FeedPost = { _id: string; userName: string; caption?: string; media?: { src: string; isVideo: boolean }[]; src?: string; isVideo?: boolean; likes: { userName: string }[]; commentCount: number; createdAt: string }
type Story = { _id: string; userName: string; mediaUrl: string; mediaType: "image" | "video"; viewed?: boolean; viewedBy?: { userName: string }[] }

export default function Feed({ showStories = true }: { showStories?: boolean }) {
  const user = useSelector((state: RootState) => state.user)
  const darkMode = useSelector((state: RootState) => state.theme.darkMode)
  const toast = useToast()
  const router = useRouter()
  const fileInput = useRef<HTMLInputElement>(null)
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [filter, setFilter] = useState<"all" | "photos" | "reels">("all")
  const [stories, setStories] = useState<Story[]>([])
  const [selected, setSelected] = useState<FeedPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState("")
  const [message, setMessage] = useState("")
  const [appealRequired, setAppealRequired] = useState(false)
  const [story, setStory] = useState<Story | null>(null)
  const [replyTo, setReplyTo] = useState<Comment | null>(null)
  const [menuPostId, setMenuPostId] = useState<string | null>(null)
  const [storyReply, setStoryReply] = useState("")

  useEffect(() => { fetch("/api/posts").then((r) => r.json()).then((data) => setPosts(data.posts || [])).catch(() => setMessage("Could not load posts.")) }, [])
  useEffect(() => { fetch("/api/stories").then((r) => r.json()).then((data) => setStories(data.stories || [])) }, [])
  useEffect(() => {
    if (!selected) return
    fetch(`/api/comments?postId=${selected._id}`).then((r) => r.json()).then((data) => setComments(data.comments || []))
  }, [selected])

  const like = async (post: FeedPost) => {
    const response = await fetch(`/api/posts/${post._id}/like`, { method: "POST" })
    if (!response.ok) return setMessage((await response.json()).message || "Could not like this post.")
    const result = await response.json()
    setPosts((items) => items.map((item) => item._id === post._id ? { ...item, likes: result.liked ? [...item.likes, { userName: user.userName }] : item.likes.filter((like) => like.userName !== user.userName) } : item))
    toast(result.liked ? "Post liked" : "Like removed")
  }

  const submitComment = async (event: FormEvent) => {
    event.preventDefault()
    if (!selected || !text.trim()) return
    const response = await fetch("/api/comments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ postId: selected._id, text, parentCommentId: replyTo?._id }) })
    const result = await response.json()
    if (!response.ok) {
      setMessage(result.requiresAdminAppeal ? `${result.message} Email: admin@example.com` : result.message || "Could not publish comment.")
      setAppealRequired(Boolean(result.requiresAdminAppeal))
      return
    }
    setComments((items) => replyTo ? items.map((comment) => comment._id === replyTo._id ? { ...comment, replies: [...(comment.replies || []), result.comment] } : comment) : [result.comment, ...items])
    setPosts((items) => items.map((item) => item._id === selected._id ? { ...item, commentCount: item.commentCount + 1 } : item))
    setText(""); setReplyTo(null)
    toast("Comment posted")
  }
  const likeComment = async (comment: Comment) => {
    const response = await fetch(`/api/comments/${comment._id}/like`, { method: "POST" }); if (!response.ok) return
    const data = await response.json(); const update = (item: Comment): Comment => item._id === comment._id ? { ...item, likes: data.liked ? [...(item.likes || []), { userName: user.userName }] : (item.likes || []).filter((like) => like.userName !== user.userName) } : { ...item, replies: item.replies?.map(update) }
    setComments((items) => items.map(update))
  }
  const postAction = async (post: FeedPost, action: "delete" | "archive" | "pin") => {
    const url = action === "pin" ? `/api/posts/${post._id}/pin` : `/api/posts/${post._id}`; const response = await fetch(url, { method: action === "delete" ? "DELETE" : "PATCH", headers: action === "archive" ? { "Content-Type": "application/json" } : undefined, body: action === "archive" ? JSON.stringify({ action }) : undefined }); const data = await response.json()
    if (!response.ok) return toast(data.message || "Could not update post", "error")
    if (action === "delete" || action === "archive") setPosts((items) => items.filter((item) => item._id !== post._id)); else setPosts((items) => items.map((item) => item._id === post._id ? { ...item, isPinned: data.isPinned } as FeedPost : item)); setMenuPostId(null); toast(action === "delete" ? "Post deleted" : action === "archive" ? "Post archived" : data.isPinned ? "Post pinned" : "Post unpinned")
  }
  const interactWithStory = async (type: "like" | "reaction" | "reply", value?: string) => {
    if (!story) return; const response = await fetch(`/api/stories/${story._id}/interact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, text: value }) }); const data = await response.json()
    if (!response.ok) return toast(data.message || "Could not send", "error")
    if (type === "like") { setStories((items) => items.map((item: any) => item._id === story._id ? { ...item, likes: data.liked ? [...(item.likes || []), { userName: user.userName }] : (item.likes || []).filter((like: any) => like.userName !== user.userName) } : item)); toast(data.liked ? "Story liked" : "Like removed") } else { setStoryReply(""); toast("Sent in chat") }
  }

  const createStory = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) return toast("Choose an image smaller than 5 MB", "error")
    const mediaUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(file) })
    const response = await fetch("/api/stories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mediaUrl, mediaType: "image" }) })
    const result = await response.json()
    if (!response.ok) return toast(result.message || "Could not add story", "error")
    setStories((items) => [result.story, ...items])
    toast("Story shared")
  }

  return <main className={`mx-auto w-full max-w-[620px] px-3 py-5 ${darkMode ? "text-white" : "text-gray-900"}`}>
    {message && <div role="alert" className="mb-3 flex items-center justify-between rounded-xl bg-red-50 p-3 text-sm text-red-700"><span>{message}</span><button onClick={() => setMessage("")} aria-label="Dismiss"><FaTimes /></button></div>}
    {showStories && <><input ref={fileInput} hidden type="file" accept="image/*" onChange={createStory} /><section className="mb-5 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm"><p className="mb-3 text-sm font-semibold text-gray-800">Stories</p><div className="flex gap-3 overflow-x-auto pb-1"><button onClick={() => fileInput.current?.click()} className="flex w-16 shrink-0 flex-col items-center gap-1 text-xs text-gray-700"><span className="grid h-14 w-14 place-items-center rounded-full border-2 border-dashed border-blue-500 text-2xl text-blue-500">+</span>Your story</button>{Array.from(new Map(stories.map((item) => [item.userName, item])).values()).map((item) => <button key={item._id} onClick={() => setStory(item)} className="flex w-16 shrink-0 flex-col items-center gap-1 text-xs text-gray-700"><span className={`h-14 w-14 overflow-hidden rounded-full border-2 p-0.5 ${item.viewed ? "border-gray-300" : "border-pink-500"}`}><img src={item.mediaUrl} className="h-full w-full rounded-full object-cover" alt={`${item.userName}'s story`} /></span><span className="w-full truncate">{item.userName === user.userName ? "Your story" : item.userName}</span></button>)}</div></section></>}
    <div className="mb-4 flex gap-2 text-sm"><button onClick={() => setFilter("all")} className={`rounded-full px-3 py-1 ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>All</button><button onClick={() => setFilter("photos")} className={`rounded-full px-3 py-1 ${filter === "photos" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Posts</button><button onClick={() => setFilter("reels")} className={`rounded-full px-3 py-1 ${filter === "reels" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Reels</button></div>
    <div className="space-y-5">
      {posts.length === 0 && <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center"><p className="font-medium">Your feed is quiet</p><p className="mt-1 text-sm text-gray-500">Follow people or create a post to see photos, reels and videos here.</p></div>}
      {posts.filter((post) => filter === "all" || filter === "reels" ? filter === "all" || Boolean(post.media?.[0]?.isVideo || post.isVideo) : !Boolean(post.media?.[0]?.isVideo || post.isVideo)).map((post) => {
        const media = post.media?.[0] || (post.src ? { src: post.src, isVideo: post.isVideo } : null)
        const liked = post.likes.some((like) => like.userName === user.userName)
        return <article key={post._id} className={`overflow-hidden rounded-xl border ${darkMode ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"}`}>
          <div className="flex items-center justify-between px-4 py-3 text-sm font-semibold"><button onClick={() => router.push(`/components/profile/${post.userName}`)} className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-xs text-white">{post.userName[0]?.toUpperCase()}</span>@{post.userName}</button>{post.userName === user.userName && <div className="relative"><button onClick={() => setMenuPostId(menuPostId === post._id ? null : post._id)}><FaEllipsisH /></button>{menuPostId === post._id && <div className="absolute right-0 top-7 z-20 w-36 rounded-lg bg-white py-1 text-left text-sm text-gray-800 shadow-lg"><button className="block w-full px-3 py-2 hover:bg-gray-100" onClick={() => postAction(post, "delete")}>Delete</button><button className="block w-full px-3 py-2 hover:bg-gray-100" onClick={() => postAction(post, "archive")}>Archive</button>{!media?.isVideo && <button className="block w-full px-3 py-2 hover:bg-gray-100" onClick={() => postAction(post, "pin")}>Pin / Unpin</button>}</div>}</div>}</div>
          {media && (media.isVideo ? <video controls className="max-h-[580px] w-full bg-black object-contain" src={media.src} /> : <img className="max-h-[580px] w-full object-cover" src={media.src} alt={post.caption || "Post"} />)}
          <div className="px-4 py-3"><div className="flex gap-4 text-xl"><button onClick={() => like(post)} aria-label="Like post">{liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}</button><button onClick={() => setSelected(post)} aria-label="View comments"><FaComment /></button></div><p className="mt-2 text-sm font-semibold">{post.likes.length} likes</p>{post.caption && <p className="mt-1 text-sm"><b>@{post.userName}</b> {post.caption}</p>}<button onClick={() => setSelected(post)} className="mt-2 text-sm text-gray-500">View all {post.commentCount} comments</button></div>
        </article>
      })}
    </div>
    {selected && <div className="fixed inset-0 z-50 flex items-end bg-black/45 sm:items-center sm:justify-center" onClick={() => setSelected(null)}><section onClick={(event) => event.stopPropagation()} className={`max-h-[80vh] w-full max-w-lg rounded-t-2xl p-4 sm:rounded-2xl ${darkMode ? "bg-gray-900" : "bg-white"}`}><div className="mb-3 flex justify-between"><b>Comments</b><button onClick={() => setSelected(null)} aria-label="Close comments"><FaTimes /></button></div><div className="max-h-[48vh] space-y-4 overflow-y-auto">{comments.map((comment) => <div key={comment._id} className="text-sm"><p><button onClick={() => router.push(`/components/profile/${comment.authorUserName}`)} className="font-semibold">@{comment.authorUserName}</button> {comment.text}</p><div className="mt-1 flex gap-3 text-xs text-gray-500"><button onClick={() => likeComment(comment)}>{(comment.likes || []).some((like) => like.userName === user.userName) ? "♥" : "♡"} {(comment.likes || []).length || ""}</button><button onClick={() => { setReplyTo(comment); setText(`@${comment.authorUserName} `) }}>Reply</button></div>{comment.replies?.map((reply) => <div key={reply._id} className="ml-6 mt-2"><button onClick={() => router.push(`/components/profile/${reply.authorUserName}`)} className="font-semibold">@{reply.authorUserName}</button> {reply.text}<button onClick={() => likeComment(reply)} className="ml-3 text-xs text-gray-500">♡ {(reply.likes || []).length || ""}</button></div>)}</div>)}{comments.length === 0 && <p className="text-sm text-gray-500">No comments yet.</p>}</div><form onSubmit={submitComment} className="mt-4 flex gap-2 border-t pt-3"><input value={text} maxLength={1000} onChange={(event) => setText(event.target.value)} placeholder={replyTo ? `Reply to @${replyTo.authorUserName}` : "Add a comment…"} className="min-w-0 flex-1 bg-transparent text-sm outline-none"/><button className="text-sm font-semibold text-blue-500">Post</button></form></section></div>}
    {story && <div className="fixed inset-0 z-[55] grid place-items-center bg-black/80 p-4" onClick={() => setStory(null)}><div className="relative max-h-[90vh] w-full max-w-md" onClick={(event) => event.stopPropagation()}><button className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-2 text-white" onClick={() => setStory(null)}><FaTimes /></button><img onLoad={() => { if (story.userName !== user.userName) { fetch(`/api/stories/${story._id}/view`, { method: "POST" }); setStories((items) => items.map((item) => item._id === story._id ? { ...item, viewed: true } : item)) } }} src={story.mediaUrl} className="max-h-[72vh] w-full rounded-xl object-contain" alt={`${story.userName}'s story`} /><p className="mt-2 text-center text-sm text-white">@{story.userName}</p>{story.userName === user.userName ? <p className="mt-2 text-center text-xs text-white">Seen by {story.viewedBy?.length || 0}{story.viewedBy?.length ? ` · ${story.viewedBy.map((view) => `@${view.userName}`).join(", ")}` : ""}</p> : <><div className="mt-3 flex justify-center gap-3"><button onClick={() => interactWithStory("like")} className="rounded-full bg-white/20 px-4 py-2 text-white">♥ Like</button>{["🔥", "😍", "😂"].map((reaction) => <button key={reaction} onClick={() => interactWithStory("reaction", reaction)} className="rounded-full bg-white/20 px-3 py-2 text-white">{reaction}</button>)}</div><form onSubmit={(event) => { event.preventDefault(); interactWithStory("reply", storyReply) }} className="mt-3 flex gap-2"><input value={storyReply} onChange={(event) => setStoryReply(event.target.value)} placeholder="Reply to story…" className="min-w-0 flex-1 rounded-full px-4 py-2 text-sm text-black"/><button className="rounded-full bg-white px-4 text-sm font-semibold">Send</button></form></>}</div></div>}
    {appealRequired && <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"><section className="w-full max-w-sm rounded-2xl bg-white p-5 text-gray-900 shadow-xl"><h2 className="font-semibold">Comment access blocked</h2><p className="mt-2 text-sm text-gray-600">Tell our team why your account should be reviewed.</p><div className="mt-5 flex justify-end gap-3"><button onClick={() => setAppealRequired(false)} className="text-sm">Cancel</button><a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com"}?subject=Comment%20access%20appeal`} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Email support</a></div></section></div>}
  </main>
}
