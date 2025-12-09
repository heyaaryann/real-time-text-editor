"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { UserAvatar } from "./auth/user-avatar";
import { X, Share2 } from "lucide-react";
import { useSession } from "next-auth/react";

interface ShareDialogProps {
    documentId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface Permission {
    id: string;
    role: string;
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
    };
}

export function ShareDialog({ documentId, open, onOpenChange }: ShareDialogProps) {
    const { data: session } = useSession();
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("EDITOR");
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) {
            loadPermissions();
        }
    }, [open, documentId]);

    const loadPermissions = async () => {
        try {
            const response = await fetch(`/api/documents/${documentId}/permissions`);
            if (response.ok) {
                const data = await response.json();
                setPermissions(data);
            }
        } catch (error) {
            console.error("Failed to load permissions:", error);
        }
    };

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/documents/${documentId}/permissions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to share document");
                setIsLoading(false);
                return;
            }

            setEmail("");
            setRole("EDITOR");
            await loadPermissions();
        } catch (error) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemove = async (permissionId: string) => {
        try {
            const response = await fetch(
                `/api/documents/${documentId}/permissions/${permissionId}`,
                {
                    method: "DELETE",
                }
            );

            if (response.ok) {
                await loadPermissions();
            }
        } catch (error) {
            console.error("Failed to remove permission:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5" />
                        Share Document
                    </DialogTitle>
                    <DialogDescription>
                        Invite others to view or edit this document
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleShare} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="colleague@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Access level</Label>
                        <Select value={role} onValueChange={setRole} disabled={isLoading}>
                            <SelectTrigger id="role">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="VIEWER">Viewer (can view only)</SelectItem>
                                <SelectItem value="EDITOR">Editor (can edit)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Sharing..." : "Share"}
                    </Button>
                </form>

                {permissions.length > 0 && (
                    <div className="mt-6 space-y-2">
                        <Label className="text-sm font-medium">People with access</Label>
                        <div className="space-y-2">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.id}
                                    className="flex items-center justify-between p-2 rounded-lg border"
                                >
                                    <div className="flex items-center gap-3">
                                        <UserAvatar
                                            name={permission.user.name}
                                            image={permission.user.image}
                                            className="h-8 w-8"
                                        />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">
                                                {permission.user.name || "Unknown"}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {permission.user.email}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">
                                            {permission.role === "EDITOR" ? "Editor" : "Viewer"}
                                        </span>
                                        {permission.user.email !== session?.user?.email && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemove(permission.id)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
