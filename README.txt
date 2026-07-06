MarkItDown Desktop
==================

A beautifully designed, local-first desktop application powered by Microsoft MarkItDown and Google Gemini. Convert Office documents, PDFs, images, archives, audio, and more into clean, structured Markdown with optional AI-powered OCR.

FEATURES
--------
1. Universal File Support
Convert a wide range of file formats into Markdown, including:
- Microsoft Word (.docx)
- PowerPoint (.pptx)
- Excel (.xlsx)
- PDF (.pdf)
- Images (.png, .jpg, .jpeg, .webp)
- ZIP archives (.zip)
- Audio files
- And many more supported by Microsoft MarkItDown
Simply drag and drop your files to begin.

2. AI-Powered OCR (Gemini)
For scanned documents, screenshots, diagrams, charts, or image-based PDFs, the application can use Google Gemini to:
- Extract text accurately
- Describe images and diagrams
- Preserve document context
- Produce clean Markdown output
(Note: A Gemini API key is required only for OCR features.)

3. Modern Desktop Experience
- Clean and elegant dark interface
- Minimal design inspired by Claude
- Fast and responsive user experience
- Drag-and-drop workflow

4. Custom AI Instructions
Provide custom prompts such as:
- Extract only tables
- Convert output to CSV
- Ignore images
- Summarize the document
- Describe diagrams in detail
Your instructions are passed directly to the AI extraction engine.

5. Safe & Reliable
- Handles parser exceptions gracefully
- Prevents crashes caused by very large files
- Protects the UI from freezing during processing
- Local-first architecture

TECH STACK
----------
- Frontend: React 19
- Language: TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS v4
- Desktop: Electron
- Backend: Python
- Conversion Engine: Microsoft MarkItDown
- OCR: Google Gemini

PROJECT STRUCTURE
-----------------
MarkItDown-Desktop/
|-- electron/
|-- python/
|-- src/
|-- public/
|-- package.json
|-- vite.config.ts
|-- README.txt

GETTING STARTED
---------------
Prerequisites:
Install the following software:
- Node.js 18+
- Python 3.10+
- npm
- Gemini API Key (Optional, only required for OCR)

INSTALLATION
------------
1. Clone the Repository
git clone https://github.com/zihad501501/Markitdown-desktop-local.git
cd Markitdown-desktop-local

Install Node.js dependencies:
npm install

2. Set Up Python
Navigate to the Python folder:
cd python

Create a virtual environment:
python -m venv venv

Activate the Environment:
(Windows): venv\Scripts\activate
(macOS / Linux): source venv/bin/activate

Install Python dependencies:
pip install markitdown google-genai openai

Return to the project root:
cd ..

RUNNING THE APPLICATION
-----------------------
Start the development server:
npm run dev

BUILD FOR PRODUCTION
--------------------
Generate a production desktop build:
npm run build
The packaged application will be available in the output directory after the build completes.

ENVIRONMENT VARIABLES
---------------------
If you want to use Gemini OCR, configure your API key inside the application settings.

PRIVACY & SECURITY
------------------
Your privacy is a priority.
- All file conversion happens locally.
- Files are processed using a local Python subprocess.
- Documents are never uploaded unless Gemini OCR is enabled.
- Only files requiring OCR are temporarily sent to Google's API.
- API keys are stored locally on your machine.
- No analytics or tracking are included.

SUPPORTED WORKFLOWS
-------------------
- Office -> Markdown
- PDF -> Markdown
- Image -> Markdown
- ZIP -> Markdown
- Audio -> Markdown
- OCR -> Markdown
- AI Description -> Markdown

CONTRIBUTING
------------
Contributions are welcome!
1. Fork the repository
2. Create a feature branch: git checkout -b feature/my-feature
3. Commit your changes: git commit -m "Add new feature"
4. Push the branch: git push origin feature/my-feature
5. Open a Pull Request

SUPPORT
-------
If you find this project useful, please consider giving it a Star on GitHub. It helps others discover the project and supports future development.

LICENSE
-------
This project is licensed under the MIT License. See the LICENSE file for more information.

ACKNOWLEDGEMENTS
----------------
This project is built with the following amazing open-source technologies:
- Microsoft MarkItDown
- Google Gemini
- React
- Electron
- Vite
- Tailwind CSS
- TypeScript

Made with love by Zihad
Convert Anything -> Markdown
