'use client';

import { Editor } from "./editor";
import { Toolbar } from "./toolbar";
import { DocumentHeader } from "./document-header";
import { CollaborativeRoom } from "@/components/collaborative-room";

interface DocumentIdPageProps {
  params: { documentId: string };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  return (
    <CollaborativeRoom roomId={params.documentId}>
      <div className="min-h-screen bg-[#FAFBFD]">
        <DocumentHeader />
        <Toolbar />
        <Editor />
      </div>
    </CollaborativeRoom>
  );
};

export default DocumentIdPage;
