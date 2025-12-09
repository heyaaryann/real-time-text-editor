import { Server } from '@hocuspocus/server';

const server = new Server({
    port: process.env.PORT ? Number(process.env.PORT) : 1234,

    onConnect: (data) => {
        console.log(`Client connected: ${data.documentName}`);
    },

    onDisconnect: (data) => {
        console.log(`Client disconnected: ${data.documentName}`);
    },

    onLoadDocument: async (data) => {
        console.log(`Loading document: ${data.documentName}`);
        // In production, load document from database here
        return data.document;
    },

    onStoreDocument: async (data) => {
        console.log(`Storing document: ${data.documentName}`);
        // In production, save document to database here
    },

    async onAuthenticate(data) {
        // Optional: Add authentication logic here
        // For now, allow all connections
        return {
            user: {
                id: data.token || 'anonymous',
                name: data.token || 'Anonymous User',
            },
        };
    },
});

server.listen();

console.log('🚀 Hocuspocus WebSocket server running on ws://localhost:1234');
console.log('📝 Ready for collaborative editing!');
