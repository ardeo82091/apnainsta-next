
import Sidebar from "../../sidebar";
import Header from "../../header";
import ViewMyFeed from "../ViewFeed"

export default function Page() {
  return (
    <div className="flex h-screen">

      <Sidebar />
        {/* Profile Scroll Area */}
        <div className="flex-1 ml-40 bg-white overflow-y-auto">
          <ViewMyFeed />
        </div>

      </div>
  )
}