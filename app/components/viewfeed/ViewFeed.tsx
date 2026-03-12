"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BiComment } from "react-icons/bi";

type PostType = "posts" | "friends";

interface Post {
  id: number;
  type: PostType;
  imageUrl: string;
  description: string;
  liked: boolean;
  likedCount: number;
  commentCount: number;
  author: string;
  time: string;
}

interface Comment {
  id: number;
  text: string;
  user: string;
}

const createPosts = (start: number): Post[] =>
  Array.from({ length: 16 }, (_, i) => ({
    id: start + i,
    type: (start + i) % 2 === 0 ? "posts" : "friends",
    imageUrl: `https://picsum.photos/500?random=${start + i}`,
    description: "Sample description similar to Instagram / LinkedIn feed.",
    liked: false,
    likedCount: Math.floor(Math.random() * 200),
    commentCount: Math.floor(Math.random() * 50),
    author: "Ankit Raj",
    time: "2h ago"
  }));

export default function ViewMyFeed() {

  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tab, setTab] = useState<PostType>("posts");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setPosts(createPosts(1));
  }, []);

  const filteredPosts = posts.filter(p => p.type === tab);

  const likePost = (id: number) => {
    setPosts(prev =>
      prev.map(p =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likedCount: p.liked ? p.likedCount - 1 : p.likedCount + 1
            }
          : p
      )
    );
  };

  const loadMorePosts = () => {
    setPosts(prev => [...prev, ...createPosts(prev.length + 1)]);
  };

  const nextPost = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % filteredPosts.length);
  };

  const prevPost = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (selectedIndex - 1 + filteredPosts.length) % filteredPosts.length
    );
  };

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [posts]);

  const addComment = () => {
    if (!newComment.trim()) return;

    setComments(prev => [
      ...prev,
      { id: Date.now(), text: newComment, user: "You" }
    ]);

    setNewComment("");
  };

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen bg-gray-100">

      {/* TABS */}
      <div className="flex gap-6 p-4 bg-white border-b sticky top-0 z-20">

        <button
          onClick={() => setTab("posts")}
          className={`font-medium ${tab === "posts" && "text-blue-600"}`}
        >
          Posts
        </button>

        <button
          onClick={() => setTab("friends")}
          className={`font-medium ${tab === "friends" && "text-blue-600"}`}
        >
          Friends
        </button>

      </div>

      {/* GRID VIEW */}
      {selectedIndex === null && (
        <>
          <div className="grid grid-cols-4 gap-4 p-6">

            {filteredPosts.map((post, index) => (

              <div
                key={post.id}
                onDoubleClick={() => likePost(post.id)}
                className="bg-white rounded-lg shadow hover:shadow-lg cursor-pointer transition"
              >

                <img
                  src={post.imageUrl}
                  alt="post"
                  width={400}
                  height={300}
                  onClick={() => setSelectedIndex(index)}
                  className="w-full h-[200px] object-cover rounded-t-lg"
                />

                <div className="p-3">

                  <p className="text-xs text-gray-500">
                    {post.author} • {post.time}
                  </p>

                  <p className="text-sm text-gray-700 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex gap-4 mt-2">

                    <button
                      onClick={() => likePost(post.id)}
                      className="flex items-center gap-1"
                    >
                      {post.liked ? (
                        <AiFillHeart className="text-red-500" />
                      ) : (
                        <AiOutlineHeart />
                      )}
                      {post.likedCount}
                    </button>

                    <button
                      onClick={() => setShowComments(true)}
                      className="flex items-center gap-1"
                    >
                      <BiComment />
                      {post.commentCount}
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Infinite Scroll Loader */}
          <div ref={loaderRef} className="h-20 flex items-center justify-center">
            <p className="text-gray-400">Loading more posts...</p>
          </div>
        </>
      )}

      {/* SINGLE POST VIEW */}
      {selectedIndex !== null && (
        <div className="relative flex justify-center items-center pt-16 pb-10">

          <button
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 left-6 bg-white text-red-500 px-4 py-2 rounded-full shadow hover:bg-red-50"
          >
            Go Back
          </button>

          <button
            onClick={prevPost}
            className="absolute left-6 top-1/2 bg-white w-10 h-10 rounded-full shadow"
          >
            ←
          </button>

          <button
            onClick={nextPost}
            className="absolute right-6 top-1/2 bg-white w-10 h-10 rounded-full shadow"
          >
            →
          </button>

          <div className="w-[450px] bg-white rounded-lg shadow">

            <img
              src={filteredPosts[selectedIndex].imageUrl}
              alt="post"
              width={450}
              height={450}
              className="w-full h-[450px] object-cover"
            />

            <div className="p-4">

              <div className="flex gap-6 mb-3">

                <button
                  onClick={() =>
                    likePost(filteredPosts[selectedIndex].id)
                  }
                  className="flex items-center gap-2"
                >
                  {filteredPosts[selectedIndex].liked ? (
                    <AiFillHeart className="text-red-500 text-xl" />
                  ) : (
                    <AiOutlineHeart className="text-xl" />
                  )}

                  {filteredPosts[selectedIndex].likedCount}
                </button>

                <button
                  onClick={() => setShowComments(true)}
                  className="flex items-center gap-2"
                >
                  <BiComment className="text-xl" />
                  {filteredPosts[selectedIndex].commentCount}
                </button>

              </div>

              <p>{filteredPosts[selectedIndex].description}</p>

            </div>

          </div>

        </div>
      )}

      {/* COMMENT DRAWER */}
      {showComments && (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg rounded-t-xl h-[40vh] p-4 z-30">

          <div className="flex justify-between mb-3">
            <h3 className="font-semibold">Comments</h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-red-500"
            >
              Close
            </button>
          </div>

          <div className="overflow-y-auto h-[60%]">

            {comments.map(c => (
              <p key={c.id} className="text-sm mb-2">
                <b>{c.user}</b>: {c.text}
              </p>
            ))}

          </div>

          <div className="flex gap-2 mt-3">

            <input
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              className="border flex-1 p-2 rounded"
              placeholder="Add a comment..."
            />

            <button
              onClick={addComment}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Post
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
