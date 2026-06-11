export default function CreateHeader({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center">
        <h1 className={`font-bold text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Create Post
        </h1>
      </div>
    </div>
  );
}