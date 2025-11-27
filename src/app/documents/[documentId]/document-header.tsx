"use client";

import { useEditorStore } from "@/store/use-editor-store";
import { useState, useEffect } from "react";

export const DocumentHeader = () => {
    const { editor } = useEditorStore();
    const [title, setTitle] = useState("Untitled Document");
    const [wordCount, setWordCount] = useState(0);
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        if (!editor) return;

        const updateCounts = () => {
            const text = editor.getText();
            const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
            const chars = text.length;

            setWordCount(words);
            setCharCount(chars);
        };

        // Update on editor changes
        editor.on("update", updateCounts);
        updateCounts(); // Initial count

        return () => {
            editor.off("update", updateCounts);
        };
    }, [editor]);

    return (
        <div className="flex flex-col gap-2 px-4 pt-4 pb-2 bg-white border-b">
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
    );
};
