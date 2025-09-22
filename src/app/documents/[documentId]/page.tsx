import { Editor } from "./editor";
//import { Toolbar } from "./toolbar";


interface DocumentIdPageProps {
  params: { documentId: string };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {

  return (
    <div className="min-h-screen bg-[#FAFBFD] ">
      
      
      <Editor/>
    </div>
  );
};

export default DocumentIdPage;
