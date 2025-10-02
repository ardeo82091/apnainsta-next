'use client'

import Image from "next/image";
import { useRef, MouseEvent } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useState } from "react";
import { BiComment } from "react-icons/bi";
import CommentModal from "../modal/commentModal"

const StoriesAndWork = () => {
  const initialPosts = [
    {
      id: 1,
      title: 'Post 1',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 1',
      likedCount: 0,
      liked: false,
      commentCount: 7,
    },
    {
      id: 2,
      title: 'Post 2',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 2',
      likedCount: 2,
      liked: true,
      commentCount: 15,
    },
    {
      id: 3,
      title: 'Post 1',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 1',
      likedCount: 5,
      liked: false,
      commentCount: 3,
    },
    {
      id: 4,
      title: 'Post 2',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 2',
      likedCount: 2,
      liked: false,
      commentCount: 11,
    },
    {
      id: 5,
      title: 'Post 1',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 1',
      likedCount: 19,
      liked: false,
      commentCount: 0,
    },
    {
      id: 6,
      title: 'Post 2',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 2',
      likedCount: 2,
      liked: true,
      commentCount: 18,
    },
    {
      id: 7,
      title: 'Post 1',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 1',
      likedCount: 3,
      liked: false,
      commentCount: 9,
    },
    {
      id: 8,
      title: 'Post 2',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 2',
      likedCount: 4,
      liked: true,
      commentCount: 20,
    },
    {
      id: 9,
      title: 'Post 1',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 1',
      likedCount: 0,
      liked: false,
      commentCount: 2,
    },
    {
      id: 10,
      title: 'Post 2',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 2',
      likedCount: 1,
      liked: false,
      commentCount: 13,
    },
    {
      id: 11,
      title: 'Post 1',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 1',
      likedCount: 9,
      liked: false,
      commentCount: 5,
    },
    {
      id: 12,
      title: 'Post 2',
      imageUrl: '/images/profile.jpg',
      description: 'This is the description for post 2',
      likedCount: 1,
      liked: true,
      commentCount: 17,
    },
  ];

  const [posts, setPosts] = useState(initialPosts);
  const [openAddComments, setAddComments] = useState(false);

    interface Story {
        id: number;
        userName: string;
        storySeen: boolean;
        comment: string;
        like: boolean;
      }
      
      const stories: Story[] = [
        {
            id: 1,
            userName: "Amandeep",
            storySeen: true,
            comment: "Amazing trip!",
            like: true
        },
        {
            id: 2,
            userName: "Divya",
            storySeen: false,
            comment: "Beautiful day!",
            like: false
        },
        {
            id: 3,
            userName: "Akash",
            storySeen: true,
            comment: "Great workout session!",
            like: true
        },
        {
            id: 4,
            userName: "Aatohi",
            storySeen: false,
            comment: "Loved the sunset.",
            like: false
        },
        {
            id: 5,
            userName: "Abhishek",
            storySeen: true,
            comment: "Awesome work!",
            like: true
        }
      ];
      
      interface ScrollableGridProps {
        posts : [
          {
            id: 1,
            title: 'Post 1',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 1',
          },
          {
            id: 2,
            title: 'Post 2',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 2',
          },
          {
            id: 1,
            title: 'Post 1',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 1',
          },
          {
            id: 2,
            title: 'Post 2',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 2',
          },
          {
            id: 1,
            title: 'Post 1',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 1',
          },
          {
            id: 2,
            title: 'Post 2',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 2',
          },
          {
            id: 1,
            title: 'Post 1',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 1',
          },
          {
            id: 2,
            title: 'Post 2',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 2',
          },
          {
            id: 1,
            title: 'Post 1',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 1',
          },
          {
            id: 2,
            title: 'Post 2',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 2',
          },
          {
            id: 1,
            title: 'Post 1',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 1',
          },
          {
            id: 2,
            title: 'Post 2',
            imageUrl: '/images/profile.jpg',
            description: 'This is the description for post 2',
          },
        ];
      }

      const likeCount = (postId : number, isLiked: boolean) => {
        const newposts = posts.map((post)=> 
          post.id == postId 
          ? isLiked
          ? {...post, likedCount: post.likedCount+1, liked: isLiked}
          : {...post, likedCount: post.likedCount-1, liked: isLiked}
          : post
        )
        setPosts(newposts);
      }
      
      // const ScrollableGrid: React.FC<ScrollableGridProps> = ({ posts }) => {
      //   const scrollRef = useRef<HTMLDivElement | null>(null);
      
      //   const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
      //     if (!scrollRef.current) return;
          
      //     const slider = scrollRef.current;
      //     slider.style.cursor = "grabbing";
      //     slider.dataset.mouseDownAt = e.clientY.toString();
      //     slider.dataset.scrollTop = slider.scrollTop.toString();
      //   };
      
      //   const handleMouseUp = () => {
      //     if (!scrollRef.current) return;
      
      //     const slider = scrollRef.current;
      //     slider.style.cursor = "grab";
      //     slider.dataset.mouseDownAt = "0";
      //   };
      
      //   const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
      //     if (!scrollRef.current) return;
      
      //     const slider = scrollRef.current;
      //     if (slider.dataset.mouseDownAt === "0") return;
      
      //     const mouseDelta = e.clientY - parseFloat(slider.dataset.mouseDownAt || "0");
      //     slider.scrollTop = parseFloat(slider.dataset.scrollTop || "0") - mouseDelta;
      //   };
      // };

    return (
        <div className="ml-4 mt-2 mr-4">
            <div className="flex space-x-4">
                <div className="flex w-16 h-16 border-4 border-gray-600 rounded-full mt-2">
                    <div className="bg-white border-2 border-dashed border-blue-500 text-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-sm font-bold">
                        +
                    </div>
                </div>
                {stories.map((story) => (
                    <div key={story.id} className="flex flex-col items-center">
                        <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center border-4 ${
                            story.storySeen ? 'border-gray-400' : 'border-blue-500'
                            }`}
                        >
                            <span className="text-xl font-semibold">{story.userName.charAt(0)}</span>
                        </div>
                        
                        <p className="mt-1 text-sm font-semibold">{story.userName}</p>
                    </div>
                ))}
            </div>
            <div className="border border-dashed border-black mt-1"/>
            <div className="grid grid-cols-1 justify-items-center gap-8 py-6 h-[calc(100vh-68px)] overflow-y-auto">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="w-[400px] bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={400}
                    height={400}
                    className="w-full h-[480px] object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="flex gap-6 text-lg font-semibold text-gray-800 mb-2">
                      <button
                        onClick={() => likeCount(post.id, !post.liked)}
                        className="flex items-center gap-2"
                      >
                        {post.liked ? (
                          <>
                            <HeartSolid className="h-6 w-6 text-red-500" />
                            <span>{post.likedCount}</span>
                          </>
                        ) : (
                          <>
                            <HeartOutline className="h-6 w-6 text-gray-500" />
                            <span>{post.likedCount}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setAddComments(true)}
                        className="flex items-center gap-2"
                      >
                        <BiComment className="h-6 w-6 text-gray-500" />
                        <span>{post.commentCount || 0}</span>
                      </button>
                    </h3>
                    <p className="text-gray-600 text-sm">{post.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
            <CommentModal
            isOpen={openAddComments}
            onClose={() => setAddComments(false)}
            content='Hi bjh vjh bj vhj khujh'
          />
            </div>
        </div>
    );
};


export default StoriesAndWork;