interface Props {
  caption: string;
  setCaption: React.Dispatch<
    React.SetStateAction<string>
  >;
  hashtags: string[];
  darkMode?: boolean;
}

export default function CaptionSection({
  caption,
  setCaption,
  hashtags,
  darkMode,
}: Props) {
  return (
    <div className={`
      ${darkMode ? 'bg-gray-900' : 'bg-white'}
      rounded-3xl
      p-5
      border
    `}>

      <textarea
        rows={5}
        value={caption}
        onChange={(e) =>
          setCaption(e.target.value)
        }
        placeholder="Write a caption..."
        className={`
          w-full
          resize-none
          outline-none
          ${darkMode ? 'bg-gray-900' : 'bg-white'}
        `}
      />

      <div className="flex flex-wrap gap-2 mt-4">
        {hashtags.map((tag) => (
          <span
            key={tag}
            className={`
              px-3
              py-1
              ${darkMode ? 'bg-gray-600' : 'bg-blue-50'}
              ${darkMode ? 'text-blue-400' : 'text-blue-600'}
              rounded-full
              text-sm
            `}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className={`
        text-right
        text-sm
        ${darkMode ? 'text-gray-500' : 'text-zinc-400'}
        mt-3
      `}>
        {caption.length}/2200
      </div>
    </div>
  );
}