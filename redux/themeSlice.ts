import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
    darkMode: boolean;
}

const initialState: ThemeState = {
    darkMode: false,
};

const themeSlice = createSlice({
    name: 'theme',

    initialState,

    reducers: {
        initializeTheme: (state) => {
            if (typeof window !== 'undefined') {
                const savedTheme =
                    localStorage.getItem('theme');

                state.darkMode =
                    savedTheme === 'dark';

                if (state.darkMode) {
                    document.documentElement.classList.add(
                        'dark'
                    );
                } else {
                    document.documentElement.classList.remove(
                        'dark'
                    );
                }
            }
        },

        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;

            localStorage.setItem(
                'theme',
                state.darkMode
                    ? 'dark'
                    : 'light'
            );

            if (state.darkMode) {
                document.documentElement.classList.add(
                    'dark'
                );
            } else {
                document.documentElement.classList.remove(
                    'dark'
                );
            }
        },
    },
});

export const {
    toggleTheme,
    initializeTheme,
} = themeSlice.actions;

export default themeSlice.reducer;