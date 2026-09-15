"use client"

import { RootState } from "@/redux/store"
import { title } from "process"
import { useMemo, useState } from "react"
import { useSelector } from "react-redux"

type Friend = {
  id: number
  userName: string
  name: string
  isOnline: boolean
}

const mockFriends: Friend[] = [
  { id: 1, userName: "rahul_dev", name: "Rahul Sharma", isOnline: true },
  { id: 2, userName: "sneha_ui", name: "Sneha Patel", isOnline: false },
  { id: 3, userName: "aman_js", name: "Aman Verma", isOnline: true },
  { id: 4, userName: "priya_css", name: "Priya Singh", isOnline: false },
  { id: 5, userName: "vikas_node", name: "Vikas Yadav", isOnline: true },
  { id: 6, userName: "neha_next", name: "Neha Gupta", isOnline: true },
  { id: 7, userName: "rohit_ts", name: "Rohit Kumar", isOnline: false },
]

export function PrivacySettings() {

  const darkMode = useSelector((state: RootState) => state.theme.darkMode);
  const [friends] = useState(mockFriends)

  const [allowFriendRequests, setAllowFriendRequests] = useState(true)
  const [allowMessagesFromAnyone, setAllowMessagesFromAnyone] = useState(true)

  const [storyRestricted, setStoryRestricted] = useState<string[]>([])
  const [postRestricted, setPostRestricted] = useState<string[]>([])

  const [onlineVisible, setOnlineVisible] = useState(true)
  const [onlineAudience, setOnlineAudience] = useState<"everyone" | "selected" | "nobody">("everyone")
  const [onlineHiddenUsers, setOnlineHiddenUsers] = useState<string[]>([])

  const [showStoryPopup, setShowStoryPopup] = useState(false)
  const [showPostPopup, setShowPostPopup] = useState(false)
  const [showOnlinePopup, setShowOnlinePopup] = useState(false)

  const [blockedUsers, setBlockedUsers] = useState([
    "spam_user1",
    "fake_acc2",
    "troll_king",
    "bot_007",
    "annoying_guy",
    "xyz_blocked",
    "random_blocked",
  ])

  const [selectedBlocked, setSelectedBlocked] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(blockedUsers.length / pageSize)

  const paginatedBlocked = useMemo(() => {
    const start = (page - 1) * pageSize
    return blockedUsers.slice(start, start + pageSize)
  }, [blockedUsers, page])

  const toggleRestrict = (
    userName: string,
    type: "story" | "post" | "online"
  ) => {
    const setter =
      type === "story"
        ? setStoryRestricted
        : type === "post"
        ? setPostRestricted
        : setOnlineHiddenUsers

    setter(prev =>
      prev.includes(userName)
        ? prev.filter(u => u !== userName)
        : [...prev, userName]
    )
  }

  const unblockUser = () => {
    if (!selectedBlocked) return
    setBlockedUsers(prev => prev.filter(u => u !== selectedBlocked))
    setSelectedBlocked(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-semibold">Privacy Settings</h2>
        <p className="text-gray-500 mt-1">
          Dear user, manage your visibility and interaction preferences.
        </p>
      </div>

      <div className={`${darkMode ? "bg-gray-900" : "bg-white"} rounded-2xl shadow-sm border p-6 space-y-5`}>
        <SettingToggle
          title="Friend Requests"
          desc="Allow people to send you requests"
          darkMode={darkMode}
          value={allowFriendRequests}
          onChange={() => setAllowFriendRequests(!allowFriendRequests)}
        />

        <SettingToggle
          title="Messages From Anyone"
          desc="Receive messages from non-friends"
          darkMode={darkMode}
          value={allowMessagesFromAnyone}
          onChange={() => setAllowMessagesFromAnyone(!allowMessagesFromAnyone)}
        />
      </div>

      <div className={`${darkMode ? "bg-gray-900" : "bg-white"} rounded-2xl shadow-sm border p-6 space-y-5`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Online Status</h3>
            <p className="text-sm text-gray-500">Show when you are active</p>
          </div>

          <button
            onClick={() => setOnlineVisible(!onlineVisible)}
            className={`w-12 h-6 rounded-full ${
              onlineVisible ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`w-5 h-5 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-full shadow transform ${
                onlineVisible ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {onlineVisible && (
          <div className="space-y-3 pt-2">

            <AudienceOption
              active={"selected"}
              title="Hide from Users"
              onClick={() => setOnlineAudience("selected")}
              extra={`${onlineHiddenUsers.length}`}
              darkMode={darkMode}
              setShowOnlinePopup={setShowOnlinePopup}
              onlineAudience={onlineAudience}
            />

            <AudienceOption
              active={"everyone"}
              title="Visible to everyone"
              onClick={() => setOnlineAudience("everyone")}
              darkMode={darkMode}
              setShowOnlinePopup={setShowOnlinePopup}
              onlineAudience={onlineAudience}
            />

            {/* {onlineAudience === "selected" && (
              <button
                onClick={() => setShowOnlinePopup(true)}
                className="text-sm border px-4 py-2 rounded-lg w-fit"
              >
                Manage Users
              </button>
            )} */}

            <AudienceOption
              active={"nobody"}
              title="Hide from everyone"
              onClick={() => setOnlineAudience("nobody")}
              darkMode={darkMode}
              setShowOnlinePopup={setShowOnlinePopup}
              onlineAudience={onlineAudience}
            />
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <ActionCard
          title="Story Privacy"
          desc="Hide stories from selected people"
          count={storyRestricted.length}
          onClick={() => setShowStoryPopup(true)}
          darkMode={darkMode}
        />

        <ActionCard
          title="Post Privacy"
          desc="Hide posts from selected people"
          count={postRestricted.length}
          onClick={() => setShowPostPopup(true)}
          darkMode={darkMode}
        />
      </div>

      <div className={`${darkMode ? "bg-gray-900" : "bg-white"} rounded-2xl shadow-sm border p-6`}>
        <h3 className="text-lg font-semibold mb-4">Blocked Users</h3>

        <div className="space-y-2">
          {paginatedBlocked.map(user => (
            <button
              key={user}
              onClick={() => setSelectedBlocked(user)}
              className={`${darkMode ? "bg-gray-800 hover:bg-gray-600" : "bg-white hover:bg-gray-200"} w-full flex justify-between items-center border rounded-xl px-4 py-3`}
            >
              <span>{user}</span>
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-md">
                Blocked
              </span>
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-5">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="border px-4 py-2 rounded-lg disabled:opacity-40">
              Prev
            </button>
            <span className="text-sm text-gray-500">{page} / {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="border px-4 py-2 rounded-lg disabled:opacity-40">
              Next
            </button>
          </div>
        )}
      </div>

      {showStoryPopup && (
        <Popup title="Hide Story From" darkMode={darkMode}>
          <FriendPicker
            friends={friends}
            restricted={storyRestricted}
            onToggle={(u:string) => toggleRestrict(u, "story")}
            onClose={() => setShowStoryPopup(false)}
            darkMode={darkMode}
          />
        </Popup>
      )}

      {showPostPopup && (
        <Popup title="Hide Post From" darkMode={darkMode}>
          <FriendPicker
            friends={friends}
            restricted={postRestricted}
            onToggle={(u:string) => toggleRestrict(u, "post")}
            onClose={() => setShowPostPopup(false)}
            darkMode={darkMode}
          />
        </Popup>
      )}

      {showOnlinePopup && (
        <Popup title="Hide Online Status From" darkMode={darkMode}>
          <FriendPicker
            friends={friends}
            restricted={onlineHiddenUsers}
            onToggle={(u:string) => toggleRestrict(u, "online")}
            onClose={() => setShowOnlinePopup(false)}
            darkMode={darkMode}
          />
        </Popup>
      )}

      {selectedBlocked && (
        <Popup title="Unblock User" darkMode={darkMode}>
          <div className="space-y-4">
            <p className={`${darkMode ? "text-gray-200" : "text-gray-600"}`}>
              Do you want to unblock <b>{selectedBlocked}</b>?
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedBlocked(null)} className={`border px-4 py-2 rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}>
                Cancel
              </button>
              <button onClick={unblockUser} className={`bg-red-600 text-white px-4 py-2 rounded-lg ${darkMode ? "hover:bg-red-700" : "hover:bg-red-500"}`}>
                Unblock
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  )
}

function SettingToggle({ title, desc, darkMode, value, onChange }: any) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>

      <button
        onClick={onChange}
        className={`w-12 h-6 rounded-full ${
          value ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-5 h-5 ${darkMode ? "bg-gray-800" : "bg-white"} rounded-full shadow transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}

function AudienceOption({ title, active, onClick, extra, darkMode, setShowOnlinePopup, onlineAudience }: any) {
  const isCurrent = active === onlineAudience
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center border rounded-xl px-4 py-3 ${
        isCurrent ? darkMode ? "bg-gray-800 border-white" : "bg-gray-200 border-gray-900" : ""
      }`}
    >
      {active === "selected" ? (
        <div className="flex items-center justify-between w-full gap-3">
          <span>{title}</span>

          <div className="flex items-center gap-2">
            {isCurrent && (
              <span
                className={`text-sm font-bold px-3 py-2 rounded-lg ${
                  darkMode
                    ? "text-white"
                    : "text-gray-800"
                }`}
              >
                {extra} Selected
              </span>
            )}

            {onlineAudience === "selected" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOnlinePopup(true);
                }}
              className={`text-sm border px-4 py-2 rounded-lg ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}
            >
              Manage Users
            </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center w-full">
          <span>{title}</span>

          <span
            className={`text-sm ${
              darkMode
                ? "text-white font-bold"
                : "text-gray-800 font-bold"
            }`}
          >
            {isCurrent ? "Active" : extra}
          </span>
        </div>
      )}
    </button>
  );
}

function ActionCard({ title, desc, count, onClick, darkMode }: any) {
  return (
    <button
      onClick={onClick}
      className={`${darkMode ? "bg-gray-900" : "bg-white"} border rounded-2xl p-6 text-left hover:shadow-md`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{title}</h3>
        {count > 0 && (
          <span className={`text-xs ${darkMode ? "bg-gray-700 text-gray-300" : "bg-blue-50 text-blue-600"} px-2 py-1 rounded-md`}>
            {count} restricted
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500">{desc}</p>
    </button>
  )
}

function FriendPicker({ friends, restricted, onToggle, onClose, darkMode }: any) {
  const [search, setSearch] = useState("")

  const filtered = friends.filter((f:any) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.userName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`space-y-4 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <input
        value={search}
        onChange={(e:any) => setSearch(e.target.value)}
        placeholder="Search people..."
        className={`w-full border rounded-xl px-4 py-2 ${darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-white text-gray-800 border-gray-300"}`}
      />

      <div className="max-h-[420px] overflow-y-auto space-y-2">
        {filtered.map((user:any) => {
          const active = restricted.includes(user.userName)

          return (
            <button
              key={user.id}
              onClick={() => onToggle(user.userName)}
              className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 ${
                active ? 
                darkMode ? "border-white bg-gray-800" : "border-gray-800 bg-gray-100" : darkMode ? "border-gray-600 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {user.name[0]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className={`text-xs ${darkMode ? "text-gray-200" : "text-gray-500"}`}>@{user.userName}</p>
                </div>
              </div>

              {active && <span className={`text-xs font-bold ${darkMode ? "text-white" : "text-gray-500"}`}>Hidden</span>}
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button onClick={onClose} className={`px-5 py-2 rounded-lg ${darkMode ? "bg-gray-700 text-white" : "bg-black text-white"}`}>
          Done
        </button>
      </div>
    </div>
  )
}

function Popup({ title, children, darkMode }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`w-[500px] rounded-2xl p-6 shadow-lg ${darkMode ? "bg-gray-900" : "bg-white"}`}>
        <h3 className={`font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>{title}</h3>
        {children}
      </div>
    </div>
  )
}