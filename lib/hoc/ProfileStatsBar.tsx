import { FC } from 'react';

interface ProfileStatsProps {
    label: string;
    value: number;
}
  
export const StatItem: FC<ProfileStatsProps> = ({ label, value }) => (
    <div className="flex flex-col h-auto w-auto p-4">
        <div className="text-white text-base sm:text-md font-bold">{label}</div>
        <div className="text-white text-base sm:text-md font-bold ml-2">{value}</div>
    </div>
);