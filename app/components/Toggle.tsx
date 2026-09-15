export function ToggleSelect({ title, desc, darkMode, value, onChange }: any) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{desc}</p>
      </div>

      <button
        onClick={onChange}
        className={`
          w-12
          h-6
          rounded-full
          ${value ? "bg-green-500" : "bg-gray-300"}
        `}
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