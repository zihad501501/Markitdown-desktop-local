MarkItDown Desktop

A beautifully designed, local-first Desktop application powered by Microsoft's MarkItDown and Google's Gemini 1.5. Convert any file (Office documents, PDFs, Images, Archives, Audio) into clean Markdown with advanced visual OCR capabilities.

FEATURES:
- Universal File Support: Drag & drop .docx, .pptx, .xlsx, .pdf, .zip, .png, .jpg, and more.
- Intelligent OCR via Gemini: If your document contains images, diagrams, or charts, the app seamlessly connects to Gemini to aggressively transcribe the text and describe the visual elements.
- Claude Aesthetics: A gorgeous dark-mode interface styled with Anthropic's minimal design system.
- Custom AI Instructions: Pass custom instructions (e.g. "Only extract tables and output as CSV") directly to the extraction engine.
- Memory & Crash Protection: Safely truncates massive zip files from freezing your UI and securely catches all backend parsing exceptions gracefully.

TECH STACK:
- Frontend: React, TypeScript, Vite, Tailwind CSS v4
- Backend: Python (Microsoft markitdown + Google genai SDK)
- Desktop Wrapper: Electron (with secure context isolation)

GETTING STARTED:

Prerequisites:
1. Node.js (v18 or higher)
2. Python (v3.10 or higher)
3. A free Gemini API Key from Google AI Studio (Optional, but required for image OCR).

Installation:
1. Clone the repository and install Node dependencies:
   git clone https://github.com/zihad501501/Markitdown-desktop-local.git
   cd Markitdown-desktop-local
   npm install

2. Setup the Python Virtual Environment:
   cd python
   python -m venv venv
   
   Activate the virtual environment:
   (Windows): venv\Scripts\activate
   (Mac/Linux): source venv/bin/activate
   
   Install the required Python packages:
   pip install markitdown google-genai openai
   cd ..

Running the App:
You can start the application using the built-in NPM script:
npm run dev

Building for Production:
To compile the application into a standalone executable (e.g. .exe):
npm run build

PRIVACY & SECURITY:
This app runs locally on your machine. File parsing happens entirely locally via the Python subprocess. Your files are only uploaded to the cloud if they require OCR via the Gemini API, after which they are instantly deleted. Your API keys are saved locally to your browser's localStorage.
