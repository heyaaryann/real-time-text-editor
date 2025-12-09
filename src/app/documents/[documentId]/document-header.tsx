"use client";

import { useEditorStore } from "@/store/use-editor-store";
import { useState, useEffect } from "react";
import { Download, FileText, FileCode, FileType, Share2 } from "lucide-react";
import {
    downloadAsPDF,
    downloadAsDOCX,
    downloadAsTXT,
    downloadAsMarkdown,
    downloadAsHTML
} from "@/utils/download";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ShareDialog } from "@/components/share-dialog";
import { Button } from "@/components/ui/button";

export const DocumentHeader = ({ documentId }: { documentId: string }) => {
    const { editor } = useEditorStore();
    const [title, setTitle] = useState("Untitled Document");
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showShareDialog, setShowShareDialog] = useState(false);


    useEffect(() => {
        if (!editor) return;

        const updateCounts = () => {
            const text = editor.getText();
            const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            const chars = text.length;

            setWordCount(words);
            setCharCount(chars);
        };

        // Debounce the update to avoid running on every keystroke
        let timeoutId: NodeJS.Timeout;
        const debouncedUpdate = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(updateCounts, 300);
        };

        // Update on editor changes
        editor.on("update", debouncedUpdate);
        updateCounts(); // Initial count

        return () => {
            editor.off("update", debouncedUpdate);
            clearTimeout(timeoutId);
        };
    }, [editor]);

    const handleDownload = async (format: string) => {
        if (!editor) return;

        setIsDownloading(true);
        try {
            const filename = title || "document";

            switch (format) {
                case "pdf":
                    downloadAsPDF(editor, filename);
                    break;
                case "docx":
                    await downloadAsDOCX(editor, filename);
                    break;
                case "txt":
                    downloadAsTXT(editor, filename);
                    break;
                case "markdown":
                    downloadAsMarkdown(editor, filename);
                    break;
                case "html":
                    downloadAsHTML(editor, filename);
                    break;
            }
        } catch (error) {
            console.error("Download error:", error);
            alert("Failed to download document");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex items-center justify-between px-4 pt-4 pb-2 bg-white border-b">
            <div className="flex flex-col gap-2 flex-1">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-normal outline-none border-none focus:outline-none px-2 py-1 rounded hover:bg-gray-50 transition-colors max-w-2xl"
                    placeholder="Untitled Document"
                />
                <div className="flex items-center gap-4 text-xs text-gray-500 px-2">
                    <span>{wordCount} words</span>
                    <span>•</span>
                    <span>{charCount} characters</span>
                    <span>•</span>
                    <span>Last edited: Just now</span>
                </div>
            </div>

            {/* Share and Download Buttons */}
            <div className="flex gap-2">
                <Button
                    onClick={() => setShowShareDialog(true)}
                    variant="outline"
                    className="flex items-center gap-2 px-4 py-2"
                >
                    <Share2 className="size-4" />
                    <span>Share</span>
                </Button>

                {/* Download Button */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            disabled={isDownloading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="size-4" />
                            <span>{isDownloading ? "Downloading..." : "Download"}</span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48 p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-2">
                        <DropdownMenuItem
                            onClick={() => handleDownload("pdf")}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            <FileText className="size-4 text-red-600" />
                            <span className="text-sm font-medium">PDF</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDownload("docx")}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            <FileText className="size-4 text-blue-600" />
                            <span className="text-sm font-medium">DOCX</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDownload("txt")}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            <FileType className="size-4 text-gray-600" />
                            <span className="text-sm font-medium">TXT</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDownload("markdown")}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            <FileCode className="size-4 text-purple-600" />
                            <span className="text-sm font-medium">Markdown</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleDownload("html")}
                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                        >
                            <FileCode className="size-4 text-orange-600" />
                            <span className="text-sm font-medium">HTML</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <ShareDialog
                documentId={documentId}
                open={showShareDialog}
                onOpenChange={setShowShareDialog}
            />
        </div>
    );
};
