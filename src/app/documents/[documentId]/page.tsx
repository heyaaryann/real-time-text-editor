'use client';

import { Editor } from "./editor";
import { Toolbar } from "./toolbar";
import { DocumentHeader } from "./document-header";

interface DocumentIdPageProps {
  params: { documentId: string };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <DocumentHeader />
      <Toolbar />
      <Editor />
    </div>
  );
};

export default DocumentIdPage;
