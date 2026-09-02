import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import Comment from "@/models/Comment";

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  let filter = {};
  if (session?.user?.id) {
    const user = await User.findById(session.user.id);
    if (user) {
      const following = user.friendAndRequests?.followings?.map((item: any) => item.person.userName) || [];
      filter = { userName: { $in: [user.userName, ...following] }, isArchived: { $ne: true } };
    }
  }
  const posts = await Post.find(filter).sort({ createdAt: -1 }).limit(50).lean();
  const ids = posts.map((post: any) => post._id);
  const counts = await Comment.aggregate([
    { $match: { postId: { $in: ids } } },
    { $group: { _id: "$postId", count: { $sum: 1 } } }
  ]);
  const commentCounts = new Map(counts.map((item: any) => [item._id.toString(), item.count]));
  return NextResponse.json({ posts: posts.map((post: any) => ({ ...post, commentCount: commentCounts.get(post._id.toString()) || 0 })) });
}

export async function POST(
  request: NextRequest
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ message: "Sign in to publish" }, { status: 401 });

  const body = await request.json();
  const media = Array.isArray(body.media) ? body.media : [];
  const caption = typeof body.caption === "string" ? body.caption.trim() : "";
  if (!caption && media.length === 0) return NextResponse.json({ message: "A caption or media item is required" }, { status: 400 });
  if (caption.length > 2200 || media.some((item: unknown) => !item || typeof (item as { src?: unknown }).src !== "string")) {
    return NextResponse.json({ message: "Invalid post content" }, { status: 400 });
  }

  await connectDB();
  const user = await User.findById(session.user.id);
  if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
  const post = await Post.create({
    userName: user.userName,
    caption,
    media: media.map((item: { src: string; isVideo?: boolean; thumbnail?: string; order?: number }, index: number) => ({
      src: item.src,
      isVideo: Boolean(item.isVideo),
      thumbnail: item.thumbnail,
      order: item.order ?? index
    })),
    // Keep legacy readers working while posts migrate to the media array.
    src: media[0]?.src,
    isVideo: Boolean(media[0]?.isVideo),
    allowComments: body.allowComments !== false,
    // Reels/videos cannot be pinned. Only a photo post can be pinned.
    isPinned: body.isPinned === true && media.length > 0 && media.every((item: any) => !item.isVideo),
    audience: body.audience || "everyone"
    ,hashtags: Array.isArray(body.hashtags) ? body.hashtags.map((tag: unknown) => String(tag).toLowerCase().slice(0, 50)).slice(0, 30) : []
  });

  return NextResponse.json({
    success: true,
    post
  }, { status: 201 });
}
