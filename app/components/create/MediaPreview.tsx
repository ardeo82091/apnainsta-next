import { MediaItem } from "@/lib/users";

interface Props {
  media: MediaItem[];
  activeMedia: number;
  setActiveMedia: React.Dispatch<
    React.SetStateAction<number>
  >;
  removeMedia: (id: string) => void;
  moveMedia: (
    index: number,
    direction: "left" | "right"
  ) => void;
  darkMode: boolean;
}

export default function MediaPreview({
  media,
  activeMedia,
  setActiveMedia,
  removeMedia,
  moveMedia,
  darkMode,
}: Props) {
  if (!media.length) return null;

  return (
    <div className={`
      ${darkMode ? 'bg-gray-900' : 'bg-white'}
      rounded-3xl
      p-4
      space-y-4
    `}>

      <div className="aspect-square overflow-hidden rounded-3xl bg-black">

        {media[activeMedia]?.isVideo ? (
          <video
            src={media[activeMedia].src}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={media[activeMedia].src}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto">

        {media.map((item, index) => (
          <div
            key={item.id}
            className="
            relative
            shrink-0
            rounded-xl
            overflow-hidden
            border
            cursor-pointer
          "
            onClick={() =>
              setActiveMedia(index)
            }
          >
            {item.isVideo ? (
              <video
                src={item.src}
                className="w-24 h-24 object-cover"
              />
            ) : (
              <img
                src={item.src}
                alt=""
                className="w-24 h-24 object-cover"
              />
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                removeMedia(item.id);
              }}
              className="
                absolute
                top-1
                right-1
                bg-red-500
                text-white
                w-6
                h-6
                rounded-full
              "
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}