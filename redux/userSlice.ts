import { User } from "@/lib/users";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActionPayload {
  action: string;
  targetUserName: string;
  user?: any; // full user object
}

const initialState: User = {
  email: "",
  userName: "",
  password: "",
  dob: null as any,
  bio: "",
  profilePic: "",
  fullName: "",
  phoneNumber: "",
  isActive: true,
  role: "",
  friendAndRequests: {
    requests: [],
    followers: [],
    followings: [],
  },
  posts: [],
  notifications: [],
  viewedBy: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => action.payload,
    clearUser: () => initialState,

    updatePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },

    markNotificationRead: (state, action: PayloadAction<number>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },

    markAllNotificationsRead: (state) => {
      state.notifications.forEach((n) => (n.read = true));
    },

    updateAction: (state, action: PayloadAction<ActionPayload>) => {
      const { action: type, targetUserName, user } = action.payload;

      switch (type) {
        case "follow": {
          const exists = state.friendAndRequests.requests.some(
            (r) => r.person.userName === targetUserName
          );

          if (!exists) {
            state.friendAndRequests.requests.push({
              person: user,
              type: "sent",
              createdAt: new Date(),
            });
          }
          break;
        }

        case "cancel": {
          state.friendAndRequests.requests =
            state.friendAndRequests.requests.filter(
              (r) => r.person.userName !== targetUserName
            );
          break;
        }

        case "accept": {
          // remove request
          state.friendAndRequests.requests =
            state.friendAndRequests.requests.filter(
              (r) => r.person.userName !== targetUserName
            );

          // add follower
          const existsFollower = state.friendAndRequests.followers.some(
            (f) => f.person.userName === targetUserName
          );

          if (!existsFollower) {
            state.friendAndRequests.followers.push({
              person: user,
              createdAt: new Date(),
            });
          }

          const existsFollowing = state.friendAndRequests.followings.some(
            (f) => f.person.userName === targetUserName
          );

          if (!existsFollowing) {
            state.friendAndRequests.followings.push({
              person: user,
              createdAt: new Date(),
            });
          }

          break;
        }

        case "reject": {
          state.friendAndRequests.requests =
            state.friendAndRequests.requests.filter(
              (r) => r.person.userName !== targetUserName
            );
          break;
        }

        case "unfollow": {
          state.friendAndRequests.followings =
            state.friendAndRequests.followings.filter(
              (f) => f.person.userName !== targetUserName
            );
          break;
        }

        case "remove": {
          state.friendAndRequests.followers =
            state.friendAndRequests.followers.filter(
              (f) => f.person.userName !== targetUserName
            );
          break;
        }
      }
    },

    updateFromSocket: (
      state,
      action: PayloadAction<{ action: string; from: string; user?: any }>
    ) => {
      const { action: type, from, user } = action.payload;

      switch (type) {
        case "follow": {
          const exists = state.friendAndRequests.requests.some(
            (r) => r.person.userName === from
          );

          if (!exists) {
            state.friendAndRequests.requests.push({
              person: user || { userName: from },
              type: "received",
              createdAt: new Date(),
            });
          }
          break;
        }

        case "cancel":
        case "reject": {
          state.friendAndRequests.requests =
            state.friendAndRequests.requests.filter(
              (r) => r.person.userName !== from
            );
          break;
        }

        case "accept": {
          // remove request
          state.friendAndRequests.requests =
            state.friendAndRequests.requests.filter(
              (r) => r.person.userName !== from
            );

          // add follower
          const existsFollower = state.friendAndRequests.followers.some(
            (f) => f.person.userName === from
          );

          if (!existsFollower) {
            state.friendAndRequests.followers.push({
              person: user || { userName: from },
              createdAt: new Date(),
            });
          }

          // 🔥 ALSO add to followings
          const existsFollowing = state.friendAndRequests.followings.some(
            (f) => f.person.userName === from
          );

          if (!existsFollowing) {
            state.friendAndRequests.followings.push({
              person: user || { userName: from },
              createdAt: new Date(),
            });
          }

          break;
        }

        case "unfollow": {
          state.friendAndRequests.followers =
            state.friendAndRequests.followers.filter(
              (f) => f.person.userName !== from
            );
          break;
        }

        case "remove": {
          state.friendAndRequests.followers =
            state.friendAndRequests.followers.filter(
              (f) => f.person.userName !== from
            );
          break;
        }
      }
    },

    rollbackAction: () => {
    },
  },
});

export const {
  setUser,
  clearUser,
  updatePassword,
  markNotificationRead,
  markAllNotificationsRead,
  rollbackAction,
  updateAction,
  updateFromSocket,
} = userSlice.actions;

export default userSlice.reducer;
