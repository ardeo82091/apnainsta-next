import { FC } from 'react';

interface SidebarIconProps {
  icon: FC<{ className: string }>;
  color?: string;
  onClick?: () => void;
}

export const SidebarIcon: FC<SidebarIconProps> = ({ icon: Icon, color, onClick }) => (
  <div onClick={onClick} className="cursor-pointer">
    <Icon
      className={`h-6 w-6 ${color || 'text-gray-400'} hover:text-white`}
    />
  </div>
);
