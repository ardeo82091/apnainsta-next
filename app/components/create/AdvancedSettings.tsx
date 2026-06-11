import { ToggleSelect } from "../Toggle";

interface Props {
  allowComments: boolean;
  setAllowComments: (v: boolean) => void;

  allowSharing: boolean;
  setAllowSharing: (v: boolean) => void;

  hideLikes: boolean;
  setHideLikes: (v: boolean) => void;

  isPinned: boolean;
  setIsPinned: (v: boolean) => void;

  altText: string;
  setAltText: (v: string) => void;

  scheduleAt: string;
  setScheduleAt: (v: string) => void;

  darkMode: boolean;
}

export default function AdvancedSettings({
  allowComments,
  setAllowComments,
  allowSharing,
  setAllowSharing,
  hideLikes,
  setHideLikes,
  isPinned,
  setIsPinned,
  altText,
  setAltText,
  scheduleAt,
  setScheduleAt,
  darkMode,
}: Props) {
  return (
    <details className={`
      ${darkMode ? 'bg-gray-900' : 'bg-white'}
      rounded-3xl
      p-5
    `}>

      <summary className={`
        font-semibold
        cursor-pointer
      `}>
        Advanced Settings
      </summary>

      <div className="space-y-4 mt-5">

        <textarea
          value={altText}
          onChange={(e) =>
            setAltText(e.target.value)
          }
          placeholder="Accessibility description"
          className={`
            w-full
            border
            rounded-xl
            p-3
            ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
          `}
        />

        <input
          type="datetime-local"
          value={scheduleAt}
          onChange={(e) =>
            setScheduleAt(e.target.value)
          }
          className={`
            w-full
            border
            rounded-xl
            p-3
            ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}
          `}
        />

        <ToggleSelect
          title="Allow Comments"
          desc="Enable or disable comments on this post."
          value={allowComments}
          onChange={() => setAllowComments(!allowComments)}
          darkMode={darkMode}
        />

        <ToggleSelect
          title="Allow Sharing"
          desc="Allow others to share this post."
          value={allowSharing}
          onChange={() => setAllowSharing(!allowSharing)}
          darkMode={darkMode}
        />

        <ToggleSelect
          title="Hide Likes"
          desc="Hide the like count from this post."
          value={hideLikes}
          onChange={() => setHideLikes(!hideLikes)}
          darkMode={darkMode}
        />

        <ToggleSelect
          title="Pin Post"
          desc="Pin this post to your profile."
          value={isPinned}
          onChange={() => setIsPinned(!isPinned)}
          darkMode={darkMode}
        />

      </div>
    </details>
  );
}