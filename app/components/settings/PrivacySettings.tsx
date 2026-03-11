"use client"

import { useMemo, useState } from "react"

type Friend = {
  id: number
  username: string
  name: string
  isOnline: boolean
}

const mockFriends: Friend[] = [
  { id: 1, username: "rahul_dev", name: "Rahul Sharma", isOnline: true },
  { id: 2, username: "sneha_ui", name: "Sneha Patel", isOnline: false },
  { id: 3, username: "aman_js", name: "Aman Verma", isOnline: true },
  { id: 4, username: "priya_css", name: "Priya Singh", isOnline: false },
  { id: 5, username: "vikas_node", name: "Vikas Yadav", isOnline: true },
  { id: 6, username: "neha_next", name: "Neha Gupta", isOnline: true },
  { id: 7, username: "rohit_ts", name: "Rohit Kumar", isOnline: false },
]

export function PrivacySettings() {
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
    username: string,
    type: "story" | "post" | "online"
  ) => {
    const setter =
      type === "story"
        ? setStoryRestricted
        : type === "post"
        ? setPostRestricted
        : setOnlineHiddenUsers

    setter(prev =>
      prev.includes(username)
        ? prev.filter(u => u !== username)
        : [...prev, username]
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

      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5">
        <SettingToggle
          title="Friend Requests"
          desc="Allow people to send you requests"
          value={allowFriendRequests}
          onChange={() => setAllowFriendRequests(!allowFriendRequests)}
        />

        <SettingToggle
          title="Messages From Anyone"
          desc="Receive messages from non-friends"
          value={allowMessagesFromAnyone}
          onChange={() => setAllowMessagesFromAnyone(!allowMessagesFromAnyone)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6 space-y-5">
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
              className={`w-5 h-5 bg-white rounded-full shadow transform ${
                onlineVisible ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {onlineVisible && (
          <div className="space-y-3 pt-2">
            <AudienceOption
              active={onlineAudience === "everyone"}
              title="Visible to everyone"
              onClick={() => setOnlineAudience("everyone")}
            />

            <AudienceOption
              active={onlineAudience === "selected"}
              title="Hide from selected users"
              onClick={() => setOnlineAudience("selected")}
              extra={`${onlineHiddenUsers.length} selected`}
            />

            {onlineAudience === "selected" && (
              <button
                onClick={() => setShowOnlinePopup(true)}
                className="text-sm border px-4 py-2 rounded-lg w-fit"
              >
                Manage Users
              </button>
            )}

            <AudienceOption
              active={onlineAudience === "nobody"}
              title="Hide from everyone"
              onClick={() => setOnlineAudience("nobody")}
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
        />

        <ActionCard
          title="Post Privacy"
          desc="Hide posts from selected people"
          count={postRestricted.length}
          onClick={() => setShowPostPopup(true)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Blocked Users</h3>

        <div className="space-y-2">
          {paginatedBlocked.map(user => (
            <button
              key={user}
              onClick={() => setSelectedBlocked(user)}
              className="w-full flex justify-between items-center border rounded-xl px-4 py-3 hover:bg-red-50"
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
        <Popup title="Hide Story From">
          <FriendPicker
            friends={friends}
            restricted={storyRestricted}
            onToggle={(u:string) => toggleRestrict(u, "story")}
            onClose={() => setShowStoryPopup(false)}
          />
        </Popup>
      )}

      {showPostPopup && (
        <Popup title="Hide Post From">
          <FriendPicker
            friends={friends}
            restricted={postRestricted}
            onToggle={(u:string) => toggleRestrict(u, "post")}
            onClose={() => setShowPostPopup(false)}
          />
        </Popup>
      )}

      {showOnlinePopup && (
        <Popup title="Hide Online Status From">
          <FriendPicker
            friends={friends}
            restricted={onlineHiddenUsers}
            onToggle={(u:string) => toggleRestrict(u, "online")}
            onClose={() => setShowOnlinePopup(false)}
          />
        </Popup>
      )}

      {selectedBlocked && (
        <Popup title="Unblock User">
          <div className="space-y-4">
            <p className="text-gray-600">
              Do you want to unblock <b>{selectedBlocked}</b>?
            </p>

            <div className="flex justify-end gap-3">
              <button onClick={() => setSelectedBlocked(null)} className="border px-4 py-2 rounded-lg">
                Cancel
              </button>
              <button onClick={unblockUser} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                Unblock
              </button>
            </div>
          </div>
        </Popup>
      )}
    </div>
  )
}

function SettingToggle({ title, desc, value, onChange }: any) {
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
          className={`w-5 h-5 bg-white rounded-full shadow transform ${
            value ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}

function AudienceOption({ title, active, onClick, extra }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex justify-between items-center border rounded-xl px-4 py-3 ${
        active ? "border-blue-500 bg-blue-50" : ""
      }`}
    >
      <span>{title}</span>
      <span className="text-sm text-gray-500">
        {active ? "Active" : extra}
      </span>
    </button>
  )
}

function ActionCard({ title, desc, count, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-white border rounded-2xl p-6 text-left hover:shadow-md"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">{title}</h3>
        {count > 0 && (
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
            {count} restricted
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500">{desc}</p>
    </button>
  )
}

function FriendPicker({ friends, restricted, onToggle, onClose }: any) {
  const [search, setSearch] = useState("")

  const filtered = friends.filter((f:any) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(e:any) => setSearch(e.target.value)}
        placeholder="Search people..."
        className="w-full border rounded-xl px-4 py-2"
      />

      <div className="max-h-[420px] overflow-y-auto space-y-2">
        {filtered.map((user:any) => {
          const active = restricted.includes(user.username)

          return (
            <button
              key={user.id}
              onClick={() => onToggle(user.username)}
              className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 ${
                active ? "border-red-500 bg-red-50" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                  {user.name[0]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">@{user.username}</p>
                </div>
              </div>

              {active && <span className="text-xs text-red-600">Hidden</span>}
            </button>
          )
        })}
      </div>

      <div className="flex justify-end">
        <button onClick={onClose} className="px-5 py-2 rounded-lg bg-black text-white">
          Done
        </button>
      </div>
    </div>
  )
}

function Popup({ title, children }: any) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-[500px] rounded-2xl p-6 shadow-lg">
        <h3 className="font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  )
}