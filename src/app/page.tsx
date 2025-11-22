"use client";

import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();

  const createNewDocument = () => {
    const id = Math.random().toString(36).substring(2, 15);
    router.push(`/documents/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-neutral-100 p-4">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-neutral-900">
            Collaborative Editor
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto">
            Real-time text editing with rich features. Create a new document or join an existing one to start collaborating instantly.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-md mx-auto w-full">
          <Button
            size="lg"
            className="w-full md:w-auto text-base font-medium"
            onClick={createNewDocument}
          >
            <Plus className="mr-2 h-5 w-5" />
            New Document
          </Button>

          <div className="flex w-full md:w-auto items-center gap-2">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              accept=".docx, .pdf"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const id = Math.random().toString(36).substring(2, 15);

                try {
                  let content = "";

                  if (file.name.endsWith(".docx")) {
                    // Parse .docx file
                    const mammoth = (await import("mammoth")).default;
                    const arrayBuffer = await file.arrayBuffer();
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    content = result.value;
                  } else if (file.name.endsWith(".pdf")) {
                    // For PDF files, we'll use a simpler approach
                    // Note: This is a basic implementation that extracts text
                    try {
                      const pdfjsLib = await import("pdfjs-dist");

                      // Use a more reliable worker source
                      if (typeof window !== 'undefined') {
                        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
                          'pdfjs-dist/build/pdf.worker.min.mjs',
                          import.meta.url
                        ).toString();
                      }

                      const arrayBuffer = await file.arrayBuffer();
                      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
                      const pdf = await loadingTask.promise;

                      let text = "";
                      for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map((item: any) => item.str).join(" ");
                        text += pageText + "\n\n";
                      }

                      // Convert text to HTML paragraphs
                      const paragraphs = text.split("\n").filter(line => line.trim()).map(line => `<p>${line}</p>`).join("");
                      content = paragraphs || "<p>No text content found in PDF</p>";
                    } catch (pdfError) {
                      console.error("PDF parsing error:", pdfError);
                      // Fallback: just create a placeholder
                      content = `<p>PDF file selected: ${file.name}</p><p>Note: PDF content extraction failed. Please try a .docx file for better results.</p>`;
                    }
                  }

                  // Store content in localStorage
                  if (content) {
                    localStorage.setItem(`document_content_${id}`, content);
                  }

                  // Navigate to the new document
                  router.push(`/documents/${id}`);
                } catch (error) {
                  console.error("Error parsing file:", error);
                  alert(`Failed to open file: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
              }}
            />
            <Button
              size="lg"
              variant="outline"
              className="w-full md:w-auto text-base font-medium"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <FileText className="mr-2 h-5 w-5" />
              Open
            </Button>
          </div>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
            <h3 className="font-semibold text-lg mb-2">Rich Text Editing</h3>
            <p className="text-neutral-600">Full-featured toolbar with formatting, lists, images, and more.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
            <h3 className="font-semibold text-lg mb-2">Real-time Sync</h3>
            <p className="text-neutral-600">Changes are saved automatically and synced across devices.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-neutral-200">
            <h3 className="font-semibold text-lg mb-2">Collaboration</h3>
            <p className="text-neutral-600">Share your document ID to collaborate with others in real-time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;