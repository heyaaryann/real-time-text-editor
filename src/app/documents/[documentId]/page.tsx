import { Editor } from "./editor";
import { Toolbar } from "./toolbar";
import { DocumentHeader } from "./document-header";
import { auth } from "@/lib/auth";

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const session = await auth();
  const { documentId } = await params;

  // Generate a consistent color for the user based on their ID or random
  const userColor = session?.user?.id
    ? `#${parseInt(session.user.id.substring(0, 6), 36).toString(16).padStart(6, '0')}`
    : `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  const userName = session?.user?.name || session?.user?.email || "Anonymous User";

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <DocumentHeader documentId={documentId} />
      <Toolbar />
      <Editor userName={userName} userColor={userColor} />
    </div>
  );
};

export default DocumentIdPage;
