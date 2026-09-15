export interface User {
  email: string;
  userName: string;
  password: string;
  dob: Date;
  fullName: string;
  profilePic: string;
  phoneNumber: string;
  isActive: boolean;
  role: string;
  bio?: string;

  friendAndRequests: FriendsAndRequests;
  posts: Posts[];
  notifications: Notification[];
  viewedBy: Viewer[];
}

export interface MediaItem {
  id: string;
  src: string;
  isVideo: boolean;
  thumbnail?: string;
  order: number;
}

export interface Posts {
  id: number;
  author: Person;
  caption?: string;
  media: MediaItem[];
  likes: LikedBy[];
  comments: Comments[];
  audience: "everyone" | "followers" | "selected" | "closeFriends";
  selectedUsers?: string[];
  location?: string;
  taggedUsers?: string[];
  hashtags?: string[];
  allowComments: boolean;
  allowSharing: boolean;
  hideLikes: boolean;
  isEdited: boolean;
  isPinned: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Notification {
  id: number;
  type: "like" | "comment" | "follow";
  user: Person;
  postId?: number;
  comment?: string;
  timestamp: Date;
  read: boolean;
}

export interface Comments {
  userName: string;
  comment: string;
  replies?: Replies[];
}

export interface Replies {
  userName: string;
  replies: string;
}

export interface LikedBy {
  userName: string;
}

export interface FriendsAndRequests {
  requests: Requests[];
  followers: Followers[];
  followings: Followings[];
}

export interface Followers {
  person: Person;
  createdAt: Date;
}

export interface Followings {
  person: Person;
  createdAt: Date;
}

export interface Requests {
  person: Person;
  type: "sent" | "received";
  createdAt: Date;
}

export interface Person {
  userName: string;
  name: string;
  img: string;
}

export interface Messages {
  tempId?: string;
  _id?: string
  chatId: string
  sender: string
  content: string
  type?: "text" | "image" | "video"
  readBy?: string[]
  createdAt: Date
}

export interface ChatPerson {
  chatId: string;
  person: Person;
  messages: Messages[];
}

export interface Viewer {
  username: string;
  name: string;
  img: string;
  viewedAt: Date;
}

export interface Chat {
  _id: string
  participants: {
    _id: string
    userName: string
    fullName: string
    profilePic?: string
  }[]
  lastMessage?: {
    text: string
    sender: string
    timestamp: Date
  }
  updatedAt: Date
}

export interface ChatPreview {
  chatId: string
  person: {
    _id: string
    userName: string
    name: string
    img?: string
  }
  lastMessage?: {
    text: string
    sender: string
    timestamp: string
  }
  updatedAt: string
}