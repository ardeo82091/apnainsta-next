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

export interface Posts {
  id: number;
  src: string;
  isVideo: boolean;
  likes: LikedBy[];
  comments: Comments[];
  createdAt: Date;
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
  id: number;
  person: Person;
  isOnline: boolean;
  isFollowing: boolean;
}

export interface Followings {
  id: number;
  person: Person;
  isOnline: boolean;
  isFollowed: boolean;
}

export interface Requests {
  id: number;
  person: Person;
  isAdded: boolean;
  isSent: boolean;
}

export interface Person {
  userName: string;
  name: string;
  img: string;
}

export interface Messages {
  _id?: string
  chatId?: string
  sender: string;
  recipient: string;
  content: string;
  read: boolean;
  timestamp?: Date;
}

export interface ChatPerson {
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
  _id?: string
  participants: string[]
  lastMessage?: string
  updatedAt: Date
}
