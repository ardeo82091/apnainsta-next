import { FC } from 'react';

interface ProfileStatsProps {
    label: string;
    value: number;
}
  
export const StatItem: FC<ProfileStatsProps> = ({ label, value }) => (
    <div className="flex flex-col h-4 w-24 pl-4">
        <div className="text-white text-lg font-bold">{label}</div>
        <div className="text-white text-lg font-bold ml-4">{value}</div>
    </div>
);