'use client';
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Tasklist from '@tiptap/extension-task-list'
import Taskitem from '@tiptap/extension-task-item'
import  Table from '@tiptap/extension-table'
import  TableCell from '@tiptap/extension-table-Cell'
import  TableHeader from '@tiptap/extension-table-header'
import  TableRow from '@tiptap/extension-table-row'
import Image from '@tiptap/extension-image'
import ImageResize from 'tiptap-extension-resize-image'

export const Editor = () => {

  const editor = useEditor({
    editorProps: {
      attributes: {
        style: "padding-left:56px; padding-right:56px;",
        class: "focus:outline-none print:border-0 bg-white border border-[#C7C7C7] flex flex-col min-h-[1054px] w-[816px] pt-10 pr-14 pb-10 cursor-text"
      },
    },
    extensions: 
    [StarterKit ,
     Taskitem.configure({
        nested:true,
     }) , 
     Tasklist,
    Table,
    TableCell,
    TableHeader,
    TableRow,
    Image,
ImageResize],
    content: 
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <th colSpan="3">Description</th>
            </tr>
            <tr>
              <td>Aryan goyal</td>
              <td>photography</td>
              <td>9996616559</td>
              <td>likeyourpixel</td>
            </tr>
          </tbody>
        </table>
      ,
  });

  return (
    <div className="w-full flex justify-center py-4 print:py-0 print:w-full print:min-w-0 min-h-[calc(100vh-80px)] bg-yellow-50">
      <EditorContent editor={editor} />
    </div>
  );
};