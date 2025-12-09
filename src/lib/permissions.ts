import { db } from "@/lib/db";
import { PermissionRole } from "@prisma/client";

export async function checkDocumentAccess(userId: string, documentId: string) {
    const document = await db.document.findUnique({
        where: { id: documentId },
        include: {
            permissions: {
                where: { userId },
            },
        },
    });

    if (!document) {
        return null;
    }

    // Owner has full access
    if (document.ownerId === userId) {
        return { document, role: PermissionRole.OWNER };
    }

    // Check permissions
    const permission = document.permissions[0];
    if (!permission) {
        return null;
    }

    return { document, role: permission.role };
}

export async function getDocumentRole(userId: string, documentId: string) {
    const access = await checkDocumentAccess(userId, documentId);
    return access?.role || null;
}

export async function canEdit(userId: string, documentId: string) {
    const role = await getDocumentRole(userId, documentId);
    return role === PermissionRole.OWNER || role === PermissionRole.EDITOR;
}

export async function canShare(userId: string, documentId: string) {
    const role = await getDocumentRole(userId, documentId);
    return role === PermissionRole.OWNER;
}

export async function getUserDocuments(userId: string) {
    // Get documents owned by user
    const ownedDocuments = await db.document.findMany({
        where: { ownerId: userId },
        orderBy: { updatedAt: "desc" },
    });

    // Get documents shared with user
    const sharedPermissions = await db.documentPermission.findMany({
        where: { userId },
        include: {
            document: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const sharedDocuments = sharedPermissions.map((p) => ({
        ...p.document,
        role: p.role,
    }));

    return {
        owned: ownedDocuments,
        shared: sharedDocuments,
    };
}
