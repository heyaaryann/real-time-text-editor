import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { db } from "@/lib/db";
import { canShare } from "@/lib/permissions";

interface RouteParams {
    params: Promise<{ documentId: string; permissionId: string }>;
}

// DELETE /api/documents/:id/permissions/:permissionId - Revoke access
export async function DELETE(req: Request, { params }: RouteParams) {
    try {
        const user = await requireAuth();
        const { documentId, permissionId } = await params;

        const isOwner = await canShare(user.id!, documentId);

        if (!isOwner) {
            return NextResponse.json(
                { error: "Only the owner can revoke permissions" },
                { status: 403 }
            );
        }

        await db.documentPermission.delete({
            where: { id: permissionId },
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
