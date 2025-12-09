import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/session";
import { db } from "@/lib/db";
import { getUserDocuments } from "@/lib/permissions";

// GET /api/documents - List user's documents
export async function GET() {
    try {
        const user = await requireAuth();
        const documents = await getUserDocuments(user.id!);

        return NextResponse.json({
            owned: documents.owned,
            shared: documents.shared,
        });
    } catch (error) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

// POST /api/documents - Create new document
export async function POST(req: Request) {
    try {
        const user = await requireAuth();
        const { title } = await req.json();

        const document = await db.document.create({
            data: {
                title: title || "Untitled Document",
                ownerId: user.id!,
            },
        });

        return NextResponse.json(document, { status: 201 });
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
