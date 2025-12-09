
import { Editor } from "./editor";
import { Toolbar } from "./toolbar";
import { DocumentHeader } from "./document-header";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const session = await auth();

  // Redirect to home if not authenticated
  if (!session?.user) {
    redirect("/");
  }

  const { documentId } = await params;

  // Generate a consistent color for the user based on their ID
  const userColor = session.user.id
    ? `#${parseInt(session.user.id.substring(0, 6), 36).toString(16).padStart(6, '0')}`
    : `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  return (
    <div className="min-h-screen bg-[#FAFBFD]">
      <DocumentHeader documentId={documentId} />
      <Toolbar />
      <Editor userName={session.user.name || session.user.email || "Anonymous"} userColor={userColor} />
    </div>
  );
};

export default DocumentIdPage;
