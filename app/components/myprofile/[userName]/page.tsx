'use client';

import Sidebar from "../../sidebar";
import Header from "../../header";
import MyProfile from "../MyProfile"
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function Page() {
  
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
      
  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <Sidebar/>

      <div className={`flex-1 transition-all overflow-y-auto duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
          <div className={`min-h-full ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
              <MyProfile/>
          </div>
      </div>

      {/* Header */}
      <div className={`w-[320px] border-l sticky top-0 h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <Header />
      </div>
    </div>
  )
}