

import { Editor } from "./editor";
import { Toolbar } from "./toolbar";
import { DocumentHeader } from "./document-header";

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;
  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <DocumentHeader />
      <Toolbar />
      <Editor />
    </div>
  );
};

export default DocumentIdPage;
