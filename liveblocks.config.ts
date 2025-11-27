import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
    publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY || "",
    throttle: 16,
});

type Presence = {
    cursor: { x: number; y: number } | null;
    name: string;
    color: string;
};

type Storage = {
    // Yjs document will be stored here
};

type UserMeta = {
    id: string;
    info: {
        name: string;
        color: string;
        avatar?: string;
    };
};

type RoomEvent = {};

export const {
    suspense: {
        RoomProvider,
        useRoom,
        useMyPresence,
        useUpdateMyPresence,
        useSelf,
        useOthers,
        useOthersMapped,
        useOthersConnectionIds,
        useOther,
        useBroadcastEvent,
        useEventListener,
        useErrorListener,
        useStorage,
        useMutation,
        useStatus,
        useLostConnectionListener,
    },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
