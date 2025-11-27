'use client';

import { useOthers, useSelf } from '@/liveblocks.config';

export function ActiveUsers() {
    const others = useOthers();
    const currentUser = useSelf();
    const allUsers = [currentUser, ...others].filter(Boolean);

    return (
        <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
                {allUsers.slice(0, 3).map((user, index) => {
                    const name = user?.presence?.name || 'Anonymous';
                    const color = user?.presence?.color || '#000000';
                    const initials = name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                    return (
                        <div
                            key={user?.connectionId || index}
                            className="relative group"
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                                title={name}
                            >
                                {initials}
                            </div>
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                {name}
                            </div>
                        </div>
                    );
                })}
                {allUsers.length > 3 && (
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-600 text-xs font-semibold border-2 border-white shadow-sm"
                        title={`${allUsers.length - 3} more`}
                    >
                        +{allUsers.length - 3}
                    </div>
                )}
            </div>
            {allUsers.length > 0 && (
                <span className="text-sm text-gray-600">
                    {allUsers.length} {allUsers.length === 1 ? 'user' : 'users'} online
                </span>
            )}
        </div>
    );
}
