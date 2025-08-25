interface DocumentIdPageProps {
  params: { documentId: string };
}

const DocumentIdPage = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = params;

  return (
    <div>
      Document ID: {documentId}
    </div>
  );
};

export default DocumentIdPage;
