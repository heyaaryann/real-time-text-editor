import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { db } from "@/lib/db";
import { canShare } from "@/lib/permissions";
import { PermissionRole } from "@prisma/client";

interface RouteParams {
    params: Promise<{ documentId: string }>;
}

// GET /api/documents/:id/permissions - List document permissions
export async function GET(req: Request, { params }: RouteParams) {
    try {
        const user = await requireAuth();
        const { documentId } = await params;

        const isOwner = await canShare(user.id!, documentId);

        if (!isOwner) {
            return NextResponse.json(
                { error: "Only the owner can view permissions" },
                { status: 403 }
            );
        }

        const permissions = await db.documentPermission.findMany({
            where: { documentId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(permissions);
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST /api/documents/:id/permissions - Grant access to user
export async function POST(req: Request, { params }: RouteParams) {
    try {
        const user = await requireAuth();
        const { documentId } = await params;
        const { email, role } = await req.json();

        const isOwner = await canShare(user.id!, documentId);

        if (!isOwner) {
            return NextResponse.json(
                { error: "Only the owner can share this document" },
                { status: 403 }
            );
        }

        // Find user by email
        const targetUser = await db.user.findUnique({
            where: { email },
        });

        if (!targetUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Check if user is the owner
        const document = await db.document.findUnique({
            where: { id: documentId },
        });

        if (document?.ownerId === targetUser.id) {
            return NextResponse.json(
                { error: "Cannot change owner's permissions" },
                { status: 400 }
            );
        }

        // Create or update permission
        const permission = await db.documentPermission.upsert({
            where: {
                documentId_userId: {
                    documentId,
                    userId: targetUser.id,
                },
            },
            update: {
                role: role as PermissionRole,
            },
            create: {
                documentId,
                userId: targetUser.id,
                role: role as PermissionRole,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        return NextResponse.json(permission, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
