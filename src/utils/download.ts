import { Editor } from "@tiptap/react";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

/**
 * Download document as PDF
 */
export const downloadAsPDF = (editor: Editor, filename: string = "document") => {
    const doc = new jsPDF();
    const content = editor.getText();

    // Split content into lines and add to PDF
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 15, 15);

    doc.save(`${filename}.pdf`);
};

/**
 * Download document as DOCX
 */
export const downloadAsDOCX = async (editor: Editor, filename: string = "document") => {
    const text = editor.getText();

    // Split text into paragraphs
    const paragraphs = text.split('\n').map(line =>
        new Paragraph({
            children: [new TextRun(line || " ")],
        })
    );

    // Create document
    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });

    // Generate and save
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${filename}.docx`);
};

/**
 * Download document as plain text
 */
export const downloadAsTXT = (editor: Editor, filename: string = "document") => {
    const content = editor.getText();
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${filename}.txt`);
};

/**
 * Download document as Markdown
 */
export const downloadAsMarkdown = (editor: Editor, filename: string = "document") => {
    // Get HTML and convert to basic Markdown
    const html = editor.getHTML();

    // Basic HTML to Markdown conversion
    let markdown = html
        // Headings
        .replace(/<h1>(.*?)<\/h1>/g, "# $1\n\n")
        .replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n")
        .replace(/<h3>(.*?)<\/h3>/g, "### $1\n\n")
        .replace(/<h4>(.*?)<\/h4>/g, "#### $1\n\n")
        .replace(/<h5>(.*?)<\/h5>/g, "##### $1\n\n")
        .replace(/<h6>(.*?)<\/h6>/g, "###### $1\n\n")
        // Bold and Italic
        .replace(/<strong>(.*?)<\/strong>/g, "**$1**")
        .replace(/<b>(.*?)<\/b>/g, "**$1**")
        .replace(/<em>(.*?)<\/em>/g, "*$1*")
        .replace(/<i>(.*?)<\/i>/g, "*$1*")
        // Links
        .replace(/<a href="(.*?)">(.*?)<\/a>/g, "[$2]($1)")
        // Lists
        .replace(/<li>(.*?)<\/li>/g, "- $1\n")
        .replace(/<ul>(.*?)<\/ul>/g, "$1\n")
        .replace(/<ol>(.*?)<\/ol>/g, "$1\n")
        // Paragraphs
        .replace(/<p>(.*?)<\/p>/g, "$1\n\n")
        // Code
        .replace(/<code>(.*?)<\/code>/g, "`$1`")
        .replace(/<pre><code>(.*?)<\/code><\/pre>/g, "```\n$1\n```\n")
        // Blockquotes
        .replace(/<blockquote>(.*?)<\/blockquote>/g, "> $1\n")
        // Remove remaining HTML tags
        .replace(/<[^>]*>/g, "")
        // Decode HTML entities
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"');

    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, `${filename}.md`);
};

/**
 * Download document as HTML
 */
export const downloadAsHTML = (editor: Editor, filename: string = "document") => {
    const htmlContent = editor.getHTML();

    // Create a complete HTML document
    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${filename}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
    }
    p {
      margin-bottom: 16px;
    }
    ul, ol {
      margin-bottom: 16px;
      padding-left: 2em;
    }
    blockquote {
      border-left: 4px solid #ddd;
      padding-left: 16px;
      margin-left: 0;
      color: #666;
    }
    code {
      background-color: #f5f5f5;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    pre {
      background-color: #f5f5f5;
      padding: 16px;
      border-radius: 6px;
      overflow-x: auto;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 16px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f5f5f5;
      font-weight: 600;
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: "text/html;charset=utf-8" });
    saveAs(blob, `${filename}.html`);
};
