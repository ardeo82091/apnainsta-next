import { User } from '@/lib/users';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: User = {
    email: '',
    userName: '',
    password: '',
    dob: null as any,
    bio: '',
    profilePic: '',
    fullName: '',
    phoneNumber: '',
    isActive: true,
    role: '',
    friendAndRequests: {
        requests: [],
        followers: [],
        followings: [],
    },
    chatPerson: [],
    posts: [],
    notifications: [],
    viewedBy: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => action.payload,
        clearUser: () => initialState,
        updatePassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
        markNotificationRead: (state, action: PayloadAction<number>) => {
            const notif = state.notifications.find(n => n.id === action.payload)
            if (notif) notif.read = true
        },
        markAllNotificationsRead: (state) => {
            state.notifications.forEach(n => n.read = true)
        }
    },
});

export const { setUser, clearUser, updatePassword, markNotificationRead, markAllNotificationsRead } = userSlice.actions;
export default userSlice.reducer;
