import UsersData from "./users.json";

/* =========================
   Interfaces
========================= */

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
  chatPerson: ChatPerson[];
  posts: Posts[];
  notifications: Notification[];
  viewedBy: Viewer[];
}

export interface ChatPerson {
  person: Person;
  messages: Messages[];
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
  isFollowed: boolean;
}

export interface Followings {
  id: number;
  person: Person;
  isOnline: boolean;
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
  sender: string;
  recipient: string;
  content: string;
  read: boolean;
  timestamp?: Date;
}

export interface Viewer {
  username: string;
  name: string;
  img: string;
  viewedAt: Date;
}

/* =========================
   Convert JSON → Typed Data
========================= */

let users: User[] = UsersData.map((user) => ({
  ...user,

  bio: user.bio || "",

  dob: new Date(user.dob),

  notifications: (user.notifications || []).map((notification) => ({
    ...notification,
    type: notification.type as "like" | "comment" | "follow",
    timestamp: new Date(notification.timestamp),
  })),

  friendAndRequests: {
    requests: user.friendAndRequests?.requests || [],
    followers: user.friendAndRequests?.followers || [],
    followings: user.friendAndRequests?.followings || [],
  },

  chatPerson: (user.chatPerson || []).map((chat) => ({
    person: {
      userName: chat.person.userName,
      name: chat.person.name,
      img: chat.person.img || "",
    },

    messages: (chat.messages || []).map((message) => ({
      sender: message.sender,
      recipient: message.recipient,
      content: message.content,
      read: message.read ?? false,
      timestamp: message.timestamp
        ? new Date(message.timestamp)
        : new Date(),
    })),
  })),
  posts: (user.posts || []).map((post) => ({
    id: post.id,
    src: post.src ?? "",
    isVideo: post.isVideo ?? false,

    likes: Array.isArray(post.likes) ? post.likes : [],
    comments: Array.isArray(post.comments) ? post.comments : [],

    createdAt: post.createdAt ? new Date(post.createdAt) : new Date(),
  })),

  viewedBy : (user.viewedBy || []).map((viewer) => ({
  username: viewer.userName ?? "",
  name: viewer.name ?? "",
  img: viewer.img ?? "",
  viewedAt: viewer.viewedAt ? new Date(viewer.viewedAt) : new Date(),
}))


}));

/* =========================
   User CRUD
========================= */

export const addUser = (user: User) => {
  users.push(user);
  return [true, user];
};

export const findUser = (
  emailorUserName: string
): [boolean, User | null] => {
  const user = users.find(
    (user) =>
      user.email === emailorUserName ||
      user.userName === emailorUserName
  );

  if (!user || !user.isActive) return [false, null];

  return [true, user];
};

export const passwordCorrect = (
  emailorUserName: string,
  password: string
): [boolean, User | null] => {
  const user = users.find(
    (user) =>
      user.email === emailorUserName ||
      user.userName === emailorUserName
  );

  if (!user || !user.isActive || user.password !== password)
    return [false, null];

  return [true, user];
};

export const getUsers = (): [boolean, User[]] => {
  return users.length ? [true, users] : [false, []];
};

/* =========================
   User Actions
========================= */

export const deleteUser = (userName: string) => {
  const indexOfUser = users.findIndex(
    (user) => user.userName === userName
  );

  if (indexOfUser !== -1) {
    users.splice(indexOfUser, 1);
    return [true, "User Deleted Successfully"];
  }

  return [false, "User not found"];
};

export const deactivateUser = (userName: string) => {
  const user = users.find((user) => user.userName === userName);

  if (user && user.isActive) {
    user.isActive = false;
    return [true, "User Deactivated Successfully"];
  }

  return [false, "User not Found"];
};

export const activateUser = (userName: string) => {
  const user = users.find((user) => user.userName === userName);

  if (user && !user.isActive) {
    user.isActive = true;
    return [true, "User Activated Successfully"];
  }

  return [false, "User not Found"];
};

export const updateUser = (userName: string, action: string) => {
  switch (action) {
    case "activateUser":
      return activateUser(userName);

    case "deactivateUser":
      return deactivateUser(userName);

    case "deleteUser":
      return deleteUser(userName);

    default:
      return [false, "Invalid Action"];
  }
};

/* =========================
   Chat System
========================= */

export const addMessages = (
  myUserName: string,
  userName: string,
  message: string
) => {
  const [isUserExist, user] = findUser(userName);
  const [isMyUserExist, meuser] = findUser(myUserName);

  if (!isUserExist || !isMyUserExist || !user || !meuser)
    return [false, "User not found"];

  let chatPerson = user.chatPerson.find(
    (p) => p.person.userName === myUserName
  );

  let mychat = meuser.chatPerson.find(
    (p) => p.person.userName === userName
  );

  if (!chatPerson) {
    chatPerson = {
      person: {
        userName: myUserName,
        name: meuser.fullName,
        img: "",
      },
      messages: [],
    };

    user.chatPerson.push(chatPerson);
  }

  const newMessage: Messages = {
    sender: myUserName,
    recipient: userName,
    content: message,
    read: false,
    timestamp: new Date(),
  };

  chatPerson.messages.push(newMessage);

  if (!mychat) {
    mychat = {
      person: {
        userName: userName,
        name: user.fullName,
        img: "",
      },
      messages: [],
    };

    meuser.chatPerson.push(mychat);
  }

  mychat.messages.push(newMessage);

  return [true, "Message Sent"];
};