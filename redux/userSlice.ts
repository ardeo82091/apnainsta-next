import { User } from '@/lib/users';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: User = {
    email: '',
    userName: '',
    password: '',
    dob: null as any,
    fullName: '',
    phoneNumber: '',
    isActive: true,
    role: '',
    followers: [],
    following: [],
    chatPerson: [],
    posts: [],
    notifications: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => action.payload,
        clearUser: () => initialState,
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
