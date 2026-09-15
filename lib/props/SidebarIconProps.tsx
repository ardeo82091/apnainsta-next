import { IconType } from 'react-icons';
interface SidebarIconProps {
    icon: IconType;
    label: string;
    darkMode?: boolean;
    onClick: () => void;
    badge?: number;
}

export const SidebarIcon = ({ icon: Icon, label, darkMode, onClick, badge }: SidebarIconProps) => {
  return (
    <button
        onClick={onClick}
        className={`flex items-center transition-all duration-200 rounded-xl p-3 w-full overflow-hidden
            ${darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'}`
        }>
        <span className="relative"><Icon size={22} />{Boolean(badge) && <span className="absolute -right-3 -top-2 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] text-white">{badge! > 9 ? "9+" : badge}</span>}</span>
        {label && (
            <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden
                ${label ? 'opacity-100 ml-4 w-auto' : 'opacity-0 ml-0 w-0'}`}>
                {label}
            </span>
        )}
    </button>
  );
};
