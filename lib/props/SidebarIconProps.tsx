import { FC } from 'react';

interface SidebarIconProps {
  icon: FC<{ className: string }>;
  label: string;
  color?: string;
  onClick?: () => void;
}

export const SidebarIcon: FC<SidebarIconProps> = ({ icon: Icon, label, color, onClick }) => (
  <div onClick={onClick} className="cursor-pointer flex items-center space-x-3 hover:text-white">
    <Icon
      className={`h-6 w-6 ${color || 'text-gray-400'} hover:text-white`}
    />
    <span className="text-white">{label}</span>
  </div>
);
