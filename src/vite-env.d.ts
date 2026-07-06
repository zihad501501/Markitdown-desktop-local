/// <reference types="vite/client" />

interface Window {
  electronAPI: {
    openFile: () => Promise<string | null>;
    saveFile: (content: string) => Promise<string | null>;
    convertFile: (filePath: string) => Promise<string>;
  }
}
