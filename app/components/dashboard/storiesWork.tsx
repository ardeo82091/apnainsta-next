'use client'

import Image from "next/image";
import { useRef, MouseEvent } from "react";

const StoriesAndWork = () => {

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
      

      // const posts = [
      //   {
      //     id: 1,
      //     title: 'Post 1',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 1',
      //   },
      //   {
      //     id: 2,
      //     title: 'Post 2',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 2',
      //   },
      //   {
      //     id: 1,
      //     title: 'Post 1',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 1',
      //   },
      //   {
      //     id: 2,
      //     title: 'Post 2',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 2',
      //   },
      //   {
      //     id: 1,
      //     title: 'Post 1',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 1',
      //   },
      //   {
      //     id: 2,
      //     title: 'Post 2',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 2',
      //   },
      //   {
      //     id: 1,
      //     title: 'Post 1',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 1',
      //   },
      //   {
      //     id: 2,
      //     title: 'Post 2',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 2',
      //   },
      //   {
      //     id: 1,
      //     title: 'Post 1',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 1',
      //   },
      //   {
      //     id: 2,
      //     title: 'Post 2',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 2',
      //   },
      //   {
      //     id: 1,
      //     title: 'Post 1',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 1',
      //   },
      //   {
      //     id: 2,
      //     title: 'Post 2',
      //     imageUrl: '/images/profile.jpg',
      //     description: 'This is the description for post 2',
      //   },
      // ];
      
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
      
      const ScrollableGrid: React.FC<ScrollableGridProps> = ({ posts }) => {
        const scrollRef = useRef<HTMLDivElement | null>(null);
      
        const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
          if (!scrollRef.current) return;
          
          const slider = scrollRef.current;
          slider.style.cursor = "grabbing";
          slider.dataset.mouseDownAt = e.clientY.toString();
          slider.dataset.scrollTop = slider.scrollTop.toString();
        };
      
        const handleMouseUp = () => {
          if (!scrollRef.current) return;
      
          const slider = scrollRef.current;
          slider.style.cursor = "grab";
          slider.dataset.mouseDownAt = "0";
        };
      
        const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
          if (!scrollRef.current) return;
      
          const slider = scrollRef.current;
          if (slider.dataset.mouseDownAt === "0") return;
      
          const mouseDelta = e.clientY - parseFloat(slider.dataset.mouseDownAt || "0");
          slider.scrollTop = parseFloat(slider.dataset.scrollTop || "0") - mouseDelta;
        };

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
            <div className="h-[calc(100vh-68px)] overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 w-[100%] h-auto">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                    <p className="text-gray-600 text-sm mt-2">{post.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
    );
};
};


export default StoriesAndWork;