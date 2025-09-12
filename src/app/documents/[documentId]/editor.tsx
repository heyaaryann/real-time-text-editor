'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Tasklist from '@tiptap/extension-task-list';
import Taskitem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TextStyle from '@tiptap/extension-text-style';

export const Editor = () => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        style: "padding-left:56px; padding-right:56px;",
        class: "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
      },
    },
    extensions: [
      StarterKit,
      Taskitem.configure({ nested: true }),
      Tasklist,
      Table,
      TableCell,
      TableHeader,
      TableRow,
      Image,
      ImageResize,
      Underline,
      Strike,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link,
      HorizontalRule,
      TextStyle
    ],
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* Fixed Navbar */}
      <nav className="w-full h-16 bg-gray-800 text-white flex items-center px-6 fixed top-0 left-0 z-50">
        <h1 className="text-xl font-bold">Real Time Text Editor</h1>
      </nav>

      {/* Toolbar Section */}
      <div className="toolbar mt-5">
        <button disabled={!editor} onClick={() => editor?.chain().focus().toggleBold().run()}>Bold</button>
        <button disabled={!editor} onClick={() => editor?.chain().focus().toggleItalic().run()}>Italic</button>
        <button disabled={!editor} onClick={() => editor?.chain().focus().toggleUnderline().run()}>Underline</button>
        <button disabled={!editor} onClick={() => editor?.chain().focus().toggleStrike().run()}>Strikethrough</button>

        <select
          disabled={!editor}
          defaultValue="paragraph"
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'paragraph') {
              editor?.chain().focus().setParagraph().run();
            } else {
              const level = parseInt(value) as 1 | 2 | 3 | 4 | 5 | 6;
              editor?.chain().focus().toggleHeading({ level }).run();
            }
          }}
        >
          <option value="paragraph">Paragraph</option>
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
        </select>

        <button disabled={!editor} onClick={() => editor?.chain().focus().toggleBulletList().run()}>Bullet List</button>
        <button disabled={!editor} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>Numbered List</button>
        <button disabled={!editor} onClick={() => editor?.chain().focus().toggleTaskList().run()}>Task List</button>
        <button disabled={!editor} onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>

        <button disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>Align Left</button>
        <button disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>Align Center</button>
        <button disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign('right').run()}>Align Right</button>
        <button disabled={!editor} onClick={() => editor?.chain().focus().setTextAlign('justify').run()}>Justify</button>

        <button disabled={!editor} onClick={() => editor?.chain().focus().setHorizontalRule().run()}>Horizontal Rule</button>
        

        <button disabled={!editor} onClick={() => {
          const url = window.prompt('Enter URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}>Insert Link</button>
      </div>

      {/* Editor Area */}
      <main className="flex-1 overflow-auto bg-yellow-50 flex justify-center py-4 print:py-0 print:w-full print:min-w-0">
        <EditorContent editor={editor} />
      </main>
    </div>
  );
};
