'use client';

import Link from "next/link";
import { ArrowRight, FileText, Upload, CheckCircle, Zap } from "lucide-react";
import { useState } from "react";
import mammoth from "mammoth";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { LoginButton } from "@/components/auth/login-button";


export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name);
    setIsUploading(true);
    const documentId = uuidv4();
    console.log("Generated document ID:", documentId);

    try {
      let content = "";

      if (file.name.endsWith(".docx")) {
        console.log("Processing .docx file...");
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        content = result.value;
        console.log("Mammoth conversion result:", result);
      } else if (file.name.endsWith(".txt") || file.name.endsWith(".md")) {
        console.log("Processing text/md file...");
        content = await file.text();
        // Simple conversion for text/md to HTML paragraphs
        content = content.split('\n').map(line => `<p>${line}</p>`).join('');
      } else {
        alert("Unsupported file type. Please use .docx, .txt, or .md");
        setIsUploading(false);
        return;
      }

      console.log("Content prepared, saving to localStorage...");
      // Store initial content in localStorage to be picked up by the editor
      localStorage.setItem(`document-${documentId}-initial`, content);

      console.log("Redirecting to:", `/documents/${documentId}`);
      router.push(`/documents/${documentId}`);
    } catch (error) {
      console.error("Error parsing file:", error);
      alert("Failed to parse file");
    } finally {
      setIsUploading(false);
    }
  };

  const createNewDocument = () => {
    const documentId = uuidv4();
    router.push(`/documents/${documentId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <FileText className="text-white size-6" />
          </div>
          <span className="text-xl font-bold text-slate-800">Docs Editor</span>
        </div>
        <div className="flex gap-4">
          <LoginButton />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            <span className="text-blue-600">Real-Time</span> Text Editor
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Experience seamless collaboration with our advanced document editor.
            Create, edit, and share documents in real-time with your team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={createNewDocument}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Create New Document <ArrowRight className="size-5" />
            </button>

            <div className="relative w-full sm:w-auto">
              <input
                type="file"
                accept=".docx,.txt,.md"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={isUploading}
              />
              <button
                className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-200 hover:bg-blue-50 transition-all ${isUploading ? 'opacity-70' : ''}`}
              >
                {isUploading ? 'Uploading...' : 'Open from Computer'} <Upload className="size-5" />
              </button>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            Supports .docx, .txt, and .md files
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Zap className="text-blue-600 size-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
            <p className="text-slate-600">
              Built for speed and performance. No lag, just smooth typing and instant updates.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <CheckCircle className="text-green-600 size-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Auto-Saving</h3>
            <p className="text-slate-600">
              Never lose your work again. Changes are saved automatically as you type.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <FileText className="text-purple-600 size-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Rich Formatting</h3>
            <p className="text-slate-600">
              Full suite of formatting tools including tables, images, and more.
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-500">
          <p>© 2024 Docs Editor. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}