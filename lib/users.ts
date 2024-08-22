import UsersData from './users.json';

export interface User {
  email: string;
  userName: string;
  password: string;
  dob: Date;
  fullName: string;
  phoneNumber: string;
  isActive: boolean;
  role: string;
  followers: Followers[];
  following: Following[];
  chatPerson: ChatPerson[];
  posts: Posts[];
  notifications: Notification[];
}

export interface ChatPerson {
  person: {
    username: string;
    name: string;
  };
  messages: Messages[];
}

export interface Posts {
  id: number;
  src: string;
  isVideo?: boolean;
  likes?: LikedBy[];
  comments?: Comments[];
}

export interface Notification {
  id: number;
  type: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface Comments {
  userName: string;
  comment: Replies[];
}

export interface Replies {
  userName: string;
  replies: string;
}

export interface LikedBy {
  userName: string;
}

export interface Followers {
  userName: string;
}

export interface Following {
  userName: string;
}

export interface Messages {
  sender: string;
  content: string;
  read: boolean;
}

let users: User[] = [];

users.push(...UsersData.map(user => ({
  ...user,
  dob: new Date(user.dob),
  notifications: user.notifications.map(notification => ({
    ...notification,
    timestamp: new Date(notification.timestamp),
  })),
})));

export const addUser = (user: User) => {
  users.push(user);
  return [true, user];
};

export const findUser = (emailorUserName: string): [boolean, User | null] => {
  const user = users.find(user => (user.email === emailorUserName || user.userName === emailorUserName));
  return user?.isActive ? [true, user] : [false, null];
};

export const passwordCorrect = (emailorUserName: string, password: string) => {
  const user = users.find(user => (user.email === emailorUserName || user.userName === emailorUserName));
  return (user?.password === password && user?.isActive) ? [true, user] : [false, null];
};

export const getUsers = () => {
  if (users.length > 0) {
    return [true, users];
  }
  return [false, users];
};

export const deleteUser = (userName: string) => {
  const indexOfUser = users.findIndex(user => (user.userName === userName));
  if (indexOfUser !== -1) {
    users.splice(indexOfUser, 1);
    return [true, "User Deleted Successfully"];
  }
  return [false, "User not found"];
};

export const deactivateUser = (userName: string) => {
  const user = users.find(user => user.userName === userName);
  if (user && user.isActive === true) {
    user.isActive = false;
    return [true, "User Deactivated Successfully"];
  }
  return [false, "User not Found"];
};

export const activateUser = (userName: string) => {
  const user = users.find(user => user.userName === userName);
  if (user && user.isActive === false) {
    user.isActive = true;
    return [true, "User Activated Successfully"];
  }
  return [false, "User not Found"];
};

export const updateUser = (userName: string, action: string) => {
  switch (action) {
    case 'activateUser':
      var [isActionPerformed, message] = activateUser(userName);
      return [isActionPerformed, message];

    case 'deactivateUser':
      var [isActionPerformed, message] = deactivateUser(userName);
      return [isActionPerformed, message];

    case 'deleteUser':
      var [isActionPerformed, message] = deleteUser(userName);
      return [isActionPerformed, message];

    default:
      return [false, "Invalid Action"];
  }

}

export const addMessages = (myUserName: string, userName: string, message: string) => {
  const [isUserExist, user] = findUser(userName);
  const [ismyUserExist, meuser] = findUser(myUserName);
  if (isUserExist && ismyUserExist && (user) && meuser) {
    let chatPerson = user.chatPerson.find((user) => user.person.username === userName);
    let mychat = meuser.chatPerson.find((user) => user.person.username === myUserName);
    if (!chatPerson) {
      chatPerson = ({ person: {username: userName, name: user.fullName}, messages: [] });
      user.chatPerson.push(chatPerson);
    }
    chatPerson.messages.push({sender: userName, content: message, read: false});
    if (!mychat) {
      mychat = ({ person: {username: myUserName, name: meuser.fullName}, messages: [] });
      meuser.chatPerson.push(mychat);
    }
    mychat.messages.push({sender: myUserName, content: message, read: false});
    return [true, "Successfully Done "]
  }
  else {
    return [false, "Not Done "]
  }
}