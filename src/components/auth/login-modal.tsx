"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chrome } from "lucide-react";

interface LoginModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [signInData, setSignInData] = useState({
        email: "",
        password: "",
    });

    const [signUpData, setSignUpData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError("");
        try {
            await signIn("google", { callbackUrl: "/" });
        } catch (error) {
            setError("Failed to sign in with Google");
            setIsLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                email: signInData.email,
                password: signInData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
                return;
            }

            onOpenChange(false);
            router.refresh();
        } catch (error) {
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signUpData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to create account");
                setIsLoading(false);
                return;
            }

            // Auto sign in after registration
            const result = await signIn("credentials", {
                email: signUpData.email,
                password: signUpData.password,
                redirect: false,
            });

            if (result?.error) {
                setError("Account created but failed to sign in");
                setIsLoading(false);
                return;
            }

            onOpenChange(false);
            router.refresh();
        } catch (error) {
            setError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Welcome to Docs Editor</DialogTitle>
                    <DialogDescription>
                        Sign in to create and manage your documents
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signin">Sign In</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="signin" className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            <Chrome className="mr-2 h-4 w-4" />
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSignIn} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signin-email">Email</Label>
                                <Input
                                    id="signin-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={signInData.email}
                                    onChange={(e) =>
                                        setSignInData({ ...signInData, email: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signin-password">Password</Label>
                                <Input
                                    id="signin-password"
                                    type="password"
                                    value={signInData.password}
                                    onChange={(e) =>
                                        setSignInData({ ...signInData, password: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup" className="space-y-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading}
                        >
                            <Chrome className="mr-2 h-4 w-4" />
                            Continue with Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-muted-foreground">
                                    Or create account with email
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-name">Name</Label>
                                <Input
                                    id="signup-name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={signUpData.name}
                                    onChange={(e) =>
                                        setSignUpData({ ...signUpData, name: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={signUpData.email}
                                    onChange={(e) =>
                                        setSignUpData({ ...signUpData, email: e.target.value })
                                    }
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input
                                    id="signup-password"
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    value={signUpData.password}
                                    onChange={(e) =>
                                        setSignUpData({ ...signUpData, password: e.target.value })
                                    }
                                    required
                                    minLength={6}
                                    disabled={isLoading}
                                />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Creating account..." : "Create Account"}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
