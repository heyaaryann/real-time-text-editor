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
import { useEditorStore } from '@/store/use-editor-store'

export const Editor = () => {

  const{setEditor } =useEditorStore();
  
  const editor = useEditor({
    onCreate({editor}) {
        setEditor(editor);
    },
    onDestroy(){
      setEditor(null);
    },
    onUpdate({editor}){
      setEditor(editor);
    },
    onSelectionUpdate({editor}){
      setEditor(editor);
    },
    onTransaction({editor}){
      setEditor(editor);
    },
    onFocus({editor}){
      setEditor(editor);
    },
    onBlur({editor}){
      setEditor(editor);
    },
    onContentError({editor}){
      setEditor(editor);
    },
    editorProps: {
      attributes: {
        
        style: "padding-left:56px; padding-right:56px;",
        class: "tiptap focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text",
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
  
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      HorizontalRule,
      
    ],
    content: 
      `
      hello everyone
      `,
      
  });

  if (!editor) return null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Editor Area */}
      <main className="size-full overflow-x-auto bg-[#F9FBFD] px-4 print:p-0 print:bg-white print:overflow-visible]">
        <div className='min-w-max justify-center w-[816px] py-4 print:py-0 mx-auto print:w-full print:min-w-0'>
          <EditorContent editor={editor} />
        </div>
      </main>
    </div>
  );
};

