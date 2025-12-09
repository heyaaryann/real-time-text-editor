import { auth } from "@/lib/auth";

export async function getServerSession() {
    return await auth();
}

export async function getCurrentUser() {
    const session = await getServerSession();
    return session?.user;
}

export async function requireAuth() {
    const session = await getServerSession();
    if (!session?.user) {
        throw new Error("Unauthorized");
    }
    return session.user;
}
