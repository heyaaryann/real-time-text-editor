'use client';

import { ReactNode } from 'react';
import { RoomProvider } from '@/liveblocks.config';
import { ClientSideSuspense } from '@liveblocks/react';

interface CollaborativeRoomProps {
    children: ReactNode;
    roomId: string;
}

// Generate random user info for demo purposes
const getRandomColor = () => {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomName = () => {
    const adjectives = ['Happy', 'Clever', 'Bright', 'Swift', 'Bold', 'Calm'];
    const nouns = ['Panda', 'Fox', 'Eagle', 'Dolphin', 'Tiger', 'Wolf'];
    return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
};

export function CollaborativeRoom({ children, roomId }: CollaborativeRoomProps) {
    return (
        <RoomProvider
            id={roomId}
            initialPresence={{
                cursor: null,
                name: getRandomName(),
                color: getRandomColor(),
            }}
        >
            <ClientSideSuspense fallback={
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading collaborative editor...</p>
                    </div>
                </div>
            }>
                {children}
            </ClientSideSuspense>
        </RoomProvider>
    );
}
