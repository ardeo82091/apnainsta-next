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
        <div className="flex space-between bg-white p-6 rounded-lg shadow-lg w-100 m-5 gap-8">
          <div className='w-100'>
          <Image
                    src={'/images/profile.jpg'}
                    alt='Hi'
                    width={800}
                    height={600}
                    className="w-full object-cover"
                  />
          </div>
          <div className='flex overflow-y-auto'>
            <div className='flex'>
              <div>
              {comments.map((commen)=> (
                <ol><span className='text-green-600'>{commen.username}</span> : {commen.comment}
                {commen.replies.map((reply)=>(
                  <li className='ml-12'>
                    <span className='text-blue-500'>{reply.username} </span>: {reply.comment}</li>
                ))}
                </ol>
                
              ))}
              </div>
              <FaTimes className="cursor-pointer hover:text-red-500 text-lg" onClick={onClose} />
            </div>
            <div>
              <input type="text" />
            </div>
          </div>
        </div>
      </div>
    );
  }

export default CommentModal;
  