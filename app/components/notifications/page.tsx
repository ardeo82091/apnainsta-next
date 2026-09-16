'use client'

import Sidebar from '../sidebar';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FaBell } from 'react-icons/fa';

export default function NotificationsPage() {
    const notifications = useSelector((state: RootState) => state.user.notifications || []);
    return (
        <div className="flex min-h-screen bg-gray-50 pb-16 text-gray-900 md:pb-0">
            <Sidebar />
            <main className="mx-auto w-full max-w-2xl p-4 sm:p-6">
                <div className="mb-5 flex items-center gap-3"><FaBell className="text-blue-600" /><h1 className="text-xl font-bold">Notifications</h1></div>
                <div className="overflow-hidden rounded-2xl border bg-white">
                    {notifications.length === 0 ? <p className="p-10 text-center text-sm text-gray-500">You’re all caught up.</p> : notifications.map((notification: any) => <article key={notification.id} className={`border-b p-4 last:border-0 ${notification.read ? '' : 'bg-blue-50'}`}>
                        <p className="text-sm">{notification.message || `${notification.user?.userName || 'Someone'} sent you a notification`}</p>
                        {notification.timestamp && <time className="mt-1 block text-xs text-gray-500">{new Date(notification.timestamp).toLocaleString()}</time>}
                    </article>)}
                </div>
            </main>
        </div>);
}
