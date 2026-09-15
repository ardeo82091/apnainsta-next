'use client';

import Sidebar from '../../sidebar';
import Header from '../../header';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import CreatePostPage from '../createPostsPage';

const CreatePost = () => {

    const darkMode = useSelector((state: RootState) => state.theme.darkMode);

    return (
        <div className={`flex h-screen overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
            <Sidebar/>

            {/* Create Post */}
            <div className={`flex-1 overflow-y-auto transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
                <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
                    <CreatePostPage />
                </div>
            </div>

            {/* Header */}
            <div className={`w-[320px] border-l sticky top-0 h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <Header />
            </div>
        </div>
    );
};

export default CreatePost;