'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Tasklist from '@tiptap/extension-task-list';
import Taskitem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import { LineHeight } from '@/extensions/line-height';
import { FontSize } from '@/extensions/font-size';
import { Comment } from '@/extensions/comment';
import { useEditorStore } from '@/store/use-editor-store';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface EditorProps {
  initialContent?: string;
}

export const Editor = ({ initialContent }: EditorProps = {}) => {
  const params = useParams();
  const documentId = params?.documentId as string;

  // Load content synchronously on mount
  const [initialEditorContent] = useState(() => {
    if (typeof window !== 'undefined' && documentId) {
      const storedContent = localStorage.getItem(`document_content_${documentId}`);
      if (storedContent) {
        // Clear it after loading
        localStorage.removeItem(`document_content_${documentId}`);
        return storedContent;
      }
    }
    return '';
  });

  const { setEditor } = useEditorStore();

  const editor = useEditor({
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      // Force re-render on content updates to keep toolbar state in sync
      setEditor(editor);
    },
    onSelectionUpdate({ editor }) {
      // Force re-render on selection changes to update active states
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        style: "padding-left:56px; padding-right:56px;",
        class: "tiptap focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1123px] w-[816px] pt-10 pr-14 pb-10 cursor-text shadow-lg",
      },
    },
    extensions: [
      StarterKit,
      Taskitem.configure({ nested: true }),
      FontFamily,
      TextStyle,
      Tasklist,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      Image,
      ImageResize,
      Underline,
      Strike,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
      }),
      LineHeight.configure({
        types: ['heading', 'paragraph'],
        defaultLineHeight: 'normal',
      }),
      FontSize,
      Comment,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      HorizontalRule,

    ],
    content: initialEditorContent || ``,

  });

  if (!editor) return null;

  return (
    <div className="min-h-screen w-full bg-[#F9FBFD] py-10 print:py-0 print:bg-white">
      <div className="flex justify-center w-full px-4 print:px-0">
        <div className="flex flex-col gap-4 print:gap-0">
          <EditorContent
            editor={editor}
            className="shadow-lg print:shadow-none"
          />
        </div>
      </div>
    </div>
  );
};

