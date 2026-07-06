<h1 align="center">MarkItDown Desktop</h1>

<p align="center">
  A beautiful, Claude-styled Desktop application powered by Microsoft's MarkItDown and Google's Gemini 1.5. Convert any file (Office documents, PDFs, Images, Archives, Audio) into clean Markdown with advanced visual OCR capabilities.
</p>

## ✨ Features

* **Universal File Support**: Drag & drop `.docx`, `.pptx`, `.xlsx`, `.pdf`, `.zip`, `.png`, `.jpg`, and more.
* **Intelligent OCR via Gemini**: If your document contains images, diagrams, or charts, the app seamlessly connects to Gemini to aggressively transcribe the text and describe the visual elements.
* **Claude Aesthetics**: A gorgeous dark-mode interface styled with Anthropic's minimal design system.
* **Custom AI Instructions**: Pass custom instructions (e.g. "Only extract tables and output as CSV") directly to the extraction engine.
* **Memory & Crash Protection**: Safely truncates massive zip files from freezing your UI and securely catches all backend parsing exceptions gracefully.

---

## 🛠️ Tech Stack

* **Frontend**: React + TypeScript + Vite + Tailwind CSS v4
* **Backend**: Python (Microsoft `markitdown` + Google `genai` SDK)
* **Desktop Wrapper**: Electron (with secure context isolation via preload scripts)

---

## 🚀 Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

Make sure you have the following installed:
1. **Node.js** (v18 or higher)
2. **Python** (v3.10 or higher)
3. A free **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/) (Optional, but required for image/pdf OCR).

### Installation

**1. Clone the repository and install Node dependencies:**
```bash
git clone https://github.com/your-username/markitdown-desktop.git
cd markitdown-desktop
npm install
```

**2. Setup the Python Virtual Environment:**
```bash
cd python
python -m venv venv

# Activate the virtual environment:
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install the required Python packages:
pip install markitdown google-genai openai
cd ..
```

### Running the App

You can start the application using the built-in NPM script, which launches both the React frontend and the Electron window simultaneously:

```bash
npm run dev
```

### Building for Production

To compile the application into a standalone executable (e.g. `.exe` or `.dmg`):

```bash
npm run build
```
This command compiles the React assets, bundles the Electron application, and generates the final installer in the `dist` folder using `electron-builder`.

---

## 🔒 Privacy & Security

This app runs locally on your machine.
* File parsing using MarkItDown happens entirely **locally** via the Python subprocess.
* Your files are **only** uploaded to the cloud if they require OCR/Visual extraction via the Gemini API, after which they are instantly deleted from the Gemini temporary file server. 
* Your API keys are saved locally to your browser's `localStorage` and never sent anywhere else.

