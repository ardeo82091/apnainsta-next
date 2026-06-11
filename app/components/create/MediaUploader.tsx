import { MediaItem } from "@/lib/users";

interface Props {
  media: MediaItem[];
  onUpload: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  darkMode?: boolean;
}

export default function MediaUploader({
  media,
  onUpload,
  darkMode,
}: Props) {
  if (media.length > 0) return null;

  return (
    <label
      className={`
        h-[420px]
        ${darkMode ? 'bg-gray-900' : 'bg-white'}
        rounded-3xl
        border-2
      border-dashed
      flex
      flex-col
      items-center
      justify-center
      cursor-pointer
      ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-zinc-200'}
      transition
      duration-300
    `
    }
    >
      <div className="text-6xl">
        📸
      </div>

      <h2 className="mt-4 text-xl font-semibold">
        Upload Photos & Videos
      </h2>

      <p className="text-gray-500">
        Drag files here or click to browse
      </p>

      <input
        hidden
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={onUpload}
      />
    </label>
  );
}