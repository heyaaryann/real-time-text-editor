'use client';

import { Editor } from "./editor";
import { Toolbar } from "./toolbar";

interface DocumentIdPageProps {
  params: { documentId: string };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <div className="print:hidden">
        <Toolbar />
      </div>
      <Editor />
    </div>
  );
};

export default DocumentIdPage;
