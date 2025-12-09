import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { db } from "@/lib/db";
import { checkDocumentAccess, canEdit, canShare } from "@/lib/permissions";

interface RouteParams {
    params: Promise<{ documentId: string }>;
}

// GET /api/documents/:id - Get document with permission check
export async function GET(req: Request, { params }: RouteParams) {
    try {
        const user = await requireAuth();
        const { documentId } = await params;

        const access = await checkDocumentAccess(user.id!, documentId);

        if (!access) {
            return NextResponse.json(
                { error: "Document not found or access denied" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            document: access.document,
            role: access.role,
        });
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

// PATCH /api/documents/:id - Update document
export async function PATCH(req: Request, { params }: RouteParams) {
    try {
        const user = await requireAuth();
        const { documentId } = await params;
        const { title, content } = await req.json();

        const hasEditAccess = await canEdit(user.id!, documentId);

        if (!hasEditAccess) {
            return NextResponse.json(
                { error: "You don't have permission to edit this document" },
                { status: 403 }
            );
        }

        const document = await db.document.update({
            where: { id: documentId },
            data: {
                ...(title !== undefined && { title }),
                ...(content !== undefined && { content }),
            },
        });

        return NextResponse.json(document);
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

// DELETE /api/documents/:id - Delete document (owner only)
export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const user = await requireAuth();
        const { documentId } = await params;

        const isOwner = await canShare(user.id!, documentId);

        if (!isOwner) {
            return NextResponse.json(
                { error: "Only the owner can delete this document" },
                { status: 403 }
            );
        }

        await db.document.delete({
            where: { id: documentId },
        });

        return NextResponse.json({ success: true });
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
