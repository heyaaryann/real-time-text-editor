import { create } from "zustand";
import { type Editor } from "@tiptap/react";


interface EditorState {
    editor: Editor | null;
    setEditor: (editor: Editor | null) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
    editor: null,
    setEditor: (editor) => set((state) => {
        // Only update if the editor instance actually changed
        if (state.editor === editor) return state;
        return { editor };
    }),
}));