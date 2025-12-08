# Real-Time Text Editor

A collaborative real-time text editor built with Next.js, TipTap, and Hocuspocus.

## Features

- 📝 Rich text editing with formatting tools
- 🤝 Real-time collaboration
- 📥 File upload (.docx, .txt, .md)
- 💾 Download in multiple formats (PDF, DOCX, TXT, Markdown, HTML)
- ⚡ Fast and responsive

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Start the WebSocket server:
   ```bash
   cd server
   npm install
   npm start
   ```

4. Start the Next.js app:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment

See [deployment-guide.md](.gemini/antigravity/brain/174276cc-0adc-4d1e-a8b5-1b8cdbedd535/deployment-guide.md) for detailed deployment instructions.

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Editor**: TipTap
- **Collaboration**: Hocuspocus (Yjs)
- **Export**: jsPDF, docx, file-saver
- **UI Components**: Radix UI, Lucide Icons

## License

MIT
