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
    friendAndRequests: {
        requests: [],
        followers: []
    },
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
        updatePassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload
        },
    },
});

export const { setUser, clearUser, updatePassword } = userSlice.actions;
export default userSlice.reducer;
