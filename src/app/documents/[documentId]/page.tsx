import { Editor } from "./editor";


interface DocumentIdPageProps {
  params: { documentId: string };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col items-center pt-10">
      
      <Editor/>
    </div>
  );
};

export default DocumentIdPage;
