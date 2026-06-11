interface Props {
  saveDraft: () => void;
  publishPost: () => void;
}

export default function PublishBar({
  saveDraft,
  publishPost,
  darkMode,
}: Props & { darkMode: boolean }) {
  return (
    <div
      className="bottom-0 p-4 z-20"
    >
      <div className="max-w-2xl mx-auto flex gap-3">

        <button
          onClick={saveDraft}
          className={`${
            darkMode ? "bg-gray-800 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          } flex-1 py-3 border rounded-full`}
        >
          Save Draft
        </button>

        <button
          onClick={publishPost}
          className={`${
            darkMode ? "bg-gray-800 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
          } flex-1 py-3 border rounded-full
            bg-black
            text-white
          `}
        >
          Share Post
        </button>

      </div>
    </div>
  );
}