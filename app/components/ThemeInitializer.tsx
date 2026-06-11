'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { initializeTheme } from '@/redux/themeSlice';

const ThemeInitializer = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(initializeTheme());
    }, [dispatch]);

    return null;
};

export default ThemeInitializer;