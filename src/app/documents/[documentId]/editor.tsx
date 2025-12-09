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
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { useEditorStore } from '@/store/use-editor-store';
import { LineHeightExtension } from '@/extensions/line-height';
import { FontSizeExtension } from '@/extensions/font-size';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

type EditorProps = {
  provider: HocuspocusProvider;
  documentId: string;
  userName?: string;
  userColor?: string;
};

const EditorContent_Internal = ({ provider, documentId, userName, userColor }: EditorProps) => {
  const { setEditor } = useEditorStore();

  const editor = useEditor({
    immediatelyRender: false,
    onCreate({ editor }) {
      setEditor(editor);
    },
    onDestroy() {
      setEditor(null);
    },
    onUpdate({ editor }) {
      // Editor state is handled locally by components subscribing to events
    },
    onSelectionUpdate({ editor }) {
      // Editor state is handled locally by components subscribing to events
    },
    onTransaction({ editor }) {
      // Editor state is handled locally by components subscribing to events
    },
    onFocus({ editor }) {
      // Editor state is handled locally by components subscribing to events
    },
    onBlur({ editor }) {
      // Editor state is handled locally by components subscribing to events
    },
    onContentError({ editor }) {
      // Editor state is handled locally by components subscribing to events
    },
    editorProps: {
      attributes: {
        style: "padding-left:56px; padding-right:56px;",
        class: "tiptap focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
      StarterKit.configure({
        history: false,
      }),
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
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      HorizontalRule,
      LineHeightExtension.configure({
        types: ["heading", "paragraph"],
        defaultLineHeight: "normal",
      }),
      FontSizeExtension,
      Collaboration.configure({
        document: provider.document,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: userName || `Anonymous User`,
          color: userColor || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        },
      }),
    ],
  });

  // Handle initial content from file upload
  useEffect(() => {
    if (editor && documentId) {
      console.log("Editor and documentId available, checking for initial content...");

      const loadInitialContent = () => {
        const initialContent = localStorage.getItem(`document-${documentId}-initial`);
        console.log("Initial content check:", initialContent ? `Found (${initialContent.length} chars)` : "Not found");

        if (initialContent) {
          console.log("Setting initial content to editor");
          editor.commands.setContent(initialContent);
          localStorage.removeItem(`document-${documentId}-initial`);
          console.log("Initial content set and localStorage cleared");
        }
      };

      if (provider.synced) {
        loadInitialContent();
      } else {
        const handleSynced = () => {
          console.log("Provider synced event fired");
          loadInitialContent();
        };

        provider.on('synced', handleSynced);

        // Fallback: Load content after 2 seconds even if not synced
        const timeoutId = setTimeout(() => {
          console.log("Timeout reached, loading content anyway");
          loadInitialContent();
        }, 2000);

        return () => {
          provider.off('synced', handleSynced);
          clearTimeout(timeoutId);
        };
      }
    }
  }, [editor, documentId, provider]);

  if (!editor) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <main className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible]">
        <div className='min-w-max justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
          <EditorContent editor={editor} />
        </div>
      </main>
    </div>
  );
};

export const Editor = ({ userName, userColor }: { userName?: string; userColor?: string }) => {
  const params = useParams();
  const documentId = params?.documentId as string;
  const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const yDoc = new Y.Doc();
    const yProvider = new HocuspocusProvider({
      url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:1234',
      name: documentId,
      document: yDoc,
    });

    setProvider(yProvider);

    return () => {
      yProvider?.destroy();
      yDoc?.destroy();
    };
  }, [documentId]);

  if (!provider || !documentId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return <EditorContent_Internal provider={provider} documentId={documentId} userName={userName} userColor={userColor} />;
};
