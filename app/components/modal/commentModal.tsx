import React from 'react';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';
import { join } from 'path';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: string | number | boolean;
};

const comments = [
  {
    "username": "travel_jane",
    "comment": "This view is everything 😍 Where is this?",
    "replies": [
      {
        "username": "globetrotter_lee",
        "comment": "@travel_jane it's in Bali! 🏝️"
      }
    ]
  },
  {
    "username": "artbylucas",
    "comment": "Colors on point 🎨🔥",
    "replies": [
      {
        "username": "creator.mia",
        "comment": "@artbylucas agree!! This is gallery-worthy"
      },
      {
        "username": "visual_mojo",
        "comment": "Facts 💯"
      }
    ]
  },
  {
    "username": "fit.frenzy",
    "comment": "How long did this take? Looks intense 💪",
    "replies": []
  },
  {
    "username": "sunny.daze",
    "comment": "Okay this made my whole day ☀️",
    "replies": [
      {
        "username": "post.creator",
        "comment": "@sunny.daze glad to hear that!! 😊"
      }
    ]
  },
  {
    "username": "travel_jane",
    "comment": "This view is everything 😍 Where is this?",
    "replies": [
      {
        "username": "globetrotter_lee",
        "comment": "@travel_jane it's in Bali! 🏝️"
      }
    ]
  },
  {
    "username": "artbylucas",
    "comment": "Colors on point 🎨🔥",
    "replies": [
      {
        "username": "creator.mia",
        "comment": "@artbylucas agree!! This is gallery-worthy"
      },
      {
        "username": "visual_mojo",
        "comment": "Facts 💯"
      }
    ]
  },
  {
    "username": "fit.frenzy",
    "comment": "How long did this take? Looks intense 💪",
    "replies": []
  },
  {
    "username": "sunny.daze",
    "comment": "Okay this made my whole day ☀️",
    "replies": [
      {
        "username": "post.creator",
        "comment": "@sunny.daze glad to hear that!! 😊"
      }
    ]
  },
  {
    "username": "travel_jane",
    "comment": "This view is everything 😍 Where is this?",
    "replies": [
      {
        "username": "globetrotter_lee",
        "comment": "@travel_jane it's in Bali! 🏝️"
      }
    ]
  },
  {
    "username": "artbylucas",
    "comment": "Colors on point 🎨🔥",
    "replies": [
      {
        "username": "creator.mia",
        "comment": "@artbylucas agree!! This is gallery-worthy"
      },
      {
        "username": "visual_mojo",
        "comment": "Facts 💯"
      }
    ]
  },
  {
    "username": "fit.frenzy",
    "comment": "How long did this take? Looks intense 💪",
    "replies": []
  },
  {
    "username": "sunny.daze",
    "comment": "Okay this made my whole day ☀️",
    "replies": [
      {
        "username": "post.creator",
        "comment": "@sunny.daze glad to hear that!! 😊"
      }
    ]
  },
  {
    "username": "travel_jane",
    "comment": "This view is everything 😍 Where is this?",
    "replies": [
      {
        "username": "globetrotter_lee",
        "comment": "@travel_jane it's in Bali! 🏝️"
      }
    ]
  },
  {
    "username": "artbylucas",
    "comment": "Colors on point 🎨🔥",
    "replies": [
      {
        "username": "creator.mia",
        "comment": "@artbylucas agree!! This is gallery-worthy"
      },
      {
        "username": "visual_mojo",
        "comment": "Facts 💯"
      }
    ]
  },
  {
    "username": "fit.frenzy",
    "comment": "How long did this take? Looks intense 💪",
    "replies": []
  },
  {
    "username": "sunny.daze",
    "comment": "Okay this made my whole day ☀️",
    "replies": [
      {
        "username": "post.creator",
        "comment": "@sunny.daze glad to hear that!! 😊"
      }
    ]
  }
]


const CommentModal : React.FC<ModalProps> = ({ isOpen, onClose, content }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="flex bg-white p-6 rounded-lg shadow-lg w-full max-w-5xl m-5 gap-8 h-full">
          
          <div className="w-1/2">
            <Image
              src="/images/profile.jpg"
              alt="Profile"
              width={800}
              height={600}
              className="w-full h-full object-cover rounded"
            />
          </div>

          <div className="w-1/2 flex flex-col">
            <div className="overflow-y-auto max-h-[80vh]">

              <div className="mb-4 space-y-4">
                {comments.map((commen, index) => (
                  <div key={index}>
                    <p>
                      <span className="text-green-600 font-semibold">{commen.username}</span>: {commen.comment}
                    </p>
                    <ul className="ml-6 space-y-1">
                      {commen.replies.map((reply, replyIndex) => (
                        <li key={replyIndex} className="ml-6 text-sm">
                          <span className="text-blue-500">{reply.username}</span>: {reply.comment}
                        </li>
                      ))}
                    </ul>

            
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4">
              <input
                type="text"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a comment..."
              />
            </div>
          </div>

          <FaTimes className="cursor-pointer hover:text-red-500 text-lg" onClick={onClose} />
        </div>
      </div>

    );
  }

export default CommentModal;
  