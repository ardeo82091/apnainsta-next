import { IconType } from 'react-icons';
interface SidebarIconProps {
    icon: IconType;
    label: string;
    darkMode?: boolean;
    onClick: () => void;
}

export const SidebarIcon = ({ icon: Icon, label, darkMode, onClick }: SidebarIconProps) => {
  return (
    <button
        onClick={onClick}
        className={`flex items-center text-white transition-all duration-200 rounded-xl p-3 w-full overflow-hidden
            ${darkMode ? 'text-white hover:bg-gray-800' : 'text-black hover:bg-gray-100'}`
        }>
        <Icon size={22} />
        {label && (
            <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300 overflow-hidden
                ${label ? 'opacity-100 ml-4 w-auto' : 'opacity-0 ml-0 w-0'}`}>
                {label}
            </span>
        )}
    </button>
  );
};