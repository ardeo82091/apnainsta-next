
import Sidebar from "../../sidebar";
import Header from "../../header";
import MyProfile from "../MyProfile"

export default function Page() {
  return (
    <div className="flex h-screen">

      <Sidebar />

      <div className="flex flex-row-reverse flex-1">

        {/* Right Side Header */}
        <Header />

        {/* Profile Scroll Area */}
        <div className="flex-1 ml-40 bg-white overflow-y-auto">
          <MyProfile />
        </div>

      </div>

    </div>
  )
}