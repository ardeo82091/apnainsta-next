
import Sidebar from "../../sidebar";
import Header from "../../header";
import ViewMyFeed from "../ViewFeed"

export default function Page() {
  return (
    <div className="flex h-screen">
      <Sidebar />
        <div className="flex-1 bg-white overflow-y-auto pb-16 md:pb-0">
          <ViewMyFeed />
        </div>

      </div>
  )
}