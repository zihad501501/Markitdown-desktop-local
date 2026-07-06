import React, { useState, useEffect } from 'react';
import { FileDrop } from './components/FileDrop';
import { ConvertButton } from './components/ConvertButton';
import { OutputBox } from './components/OutputBox';

function App() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('apiKey') || localStorage.getItem('openai_api_key') || '');
  const [selectedModel, setSelectedModel] = useState(() => localStorage.getItem('selectedModel') || 'flash');
  const [customPrompt, setCustomPrompt] = useState(() => localStorage.getItem('customPrompt') || '');

  // Save inputs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('apiKey', apiKey);
  }, [apiKey]);

  useEffect(() => {
    localStorage.setItem('selectedModel', selectedModel);
  }, [selectedModel]);
  
  useEffect(() => {
    localStorage.setItem('customPrompt', customPrompt);
  }, [customPrompt]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleCustomPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomPrompt(e.target.value);
  };

  const handleFileSelect = async () => {
    try {
      const filePath = await (window as any).electronAPI.openFile();
      if (filePath) {
        setSelectedFile(filePath);
        setMarkdown('');
        setError(null);
      }
    } catch (err: any) {
      setError('Failed to select file: ' + err.message);
    }
  };

  const handleConvert = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    setError(null);
    setMarkdown('');
    
    try {
      const result = await (window as any).electronAPI.convertFile(selectedFile, apiKey, selectedModel, customPrompt);
      setMarkdown(result);
    } catch (err: any) {
      setError('Conversion failed: ' + (typeof err === 'string' ? err : err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
  };

  const handleSave = async () => {
    if (!markdown) return;
    try {
      await window.electronAPI.saveFile(markdown);
    } catch (err: any) {
      setError('Failed to save file: ' + err.message);
    }
  };

  const handleFileDrop = (filePath: string) => {
    setSelectedFile(filePath);
    setMarkdown('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-claude-bg flex justify-center py-16 px-4 sm:px-6 lg:px-8 font-sans text-claude-text">
      <div className="max-w-4xl w-full space-y-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-semibold text-claude-text tracking-tight">MarkItDown</h1>
          <p className="text-lg text-claude-muted font-serif">
            Convert any document or image into clean Markdown.
          </p>
        </div>

        <div className="bg-claude-card px-8 py-10 shadow-sm rounded-2xl border border-claude-border">
          
          <div className="mb-8 space-y-5">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-claude-text mb-2">
                API Key (Optional, requires OpenAI or Gemini for image OCR)
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={handleApiKeyChange}
                placeholder="sk-... or AIza..."
                className="w-full px-4 py-2.5 bg-claude-bg border border-claude-border rounded-lg focus:ring-1 focus:ring-claude-accent focus:border-claude-accent outline-none transition-all placeholder:text-gray-400 text-claude-text"
              />
              <p className="mt-2 text-xs text-claude-muted">Stored securely on your local machine.</p>
            </div>
            
            {apiKey && !apiKey.startsWith('sk-') && (
              <div>
                <label htmlFor="modelSelect" className="block text-sm font-medium text-claude-text mb-2">
                  Intelligence Tier
                </label>
                <select
                  id="modelSelect"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-claude-bg border border-claude-border rounded-lg focus:ring-1 focus:ring-claude-accent focus:border-claude-accent outline-none transition-all text-claude-text"
                >
                  <option value="flash">Gemini 1.5 Flash (Lightning Fast)</option>
                  <option value="pro">Gemini 1.5 Pro (Deep Reasoning)</option>
                </select>
              </div>
            )}
            
            <div>
              <label htmlFor="customPrompt" className="block text-sm font-medium text-claude-text mb-2">
                Custom AI Instructions (Optional)
              </label>
              <textarea
                id="customPrompt"
                value={customPrompt}
                onChange={handleCustomPromptChange}
                placeholder="e.g. Extract only the tabular data and format as CSV."
                rows={2}
                className="w-full px-4 py-2.5 bg-claude-bg border border-claude-border rounded-lg focus:ring-1 focus:ring-claude-accent focus:border-claude-accent outline-none transition-all placeholder:text-gray-400 text-claude-text resize-y"
              />
            </div>
          </div>

          <FileDrop onFileSelect={handleFileSelect} onFileDrop={handleFileDrop} selectedFile={selectedFile} />
          
          {error && (
            <div className="mt-6 p-4 bg-[#3A2424] border border-[#5A3434] rounded-xl text-[#FF9494] text-sm shadow-sm flex items-start space-x-3">
              <span className="text-lg">⚠️</span>
              <span className="pt-0.5 leading-relaxed">{error}</span>
            </div>
          )}

          <ConvertButton 
            onClick={handleConvert} 
            isLoading={isLoading} 
            disabled={!selectedFile} 
          />

          <OutputBox 
            markdown={markdown} 
            onCopy={handleCopy} 
            onSave={handleSave} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
