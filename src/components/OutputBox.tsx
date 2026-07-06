import { FC, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface OutputBoxProps {
  markdown: string;
  onCopy: () => void;
  onSave: () => void;
}

export const OutputBox: FC<OutputBoxProps> = ({ markdown, onCopy, onSave }) => {
  const [viewMode, setViewMode] = useState<'split' | 'raw' | 'preview'>('preview');

  if (!markdown) return null;

  // Bug 2 Fix: Truncate massively large markdown strings for the preview renderer
  // to prevent the React main thread from freezing.
  const MAX_PREVIEW_LENGTH = 50000;
  const isTruncated = markdown.length > MAX_PREVIEW_LENGTH;
  const previewMarkdown = isTruncated ? markdown.substring(0, MAX_PREVIEW_LENGTH) + '\n\n...\n\n*Preview truncated for performance. Copy or Save to see the full document.*' : markdown;

  return (
    <div className="w-full flex flex-col bg-claude-card border border-claude-border rounded-xl shadow-sm overflow-hidden mt-8 transition-all">
      <div className="bg-claude-bg/50 border-b border-claude-border px-5 py-3 flex flex-wrap gap-4 justify-between items-center">
        
        {/* View Toggles */}
        <div className="flex bg-claude-bg p-1 rounded-lg border border-claude-border">
          <button 
            onClick={() => setViewMode('raw')} 
            className={`px-4 py-1.5 text-sm rounded-md transition-all ${viewMode === 'raw' ? 'bg-[#333333] shadow-sm text-claude-text font-medium' : 'text-claude-muted hover:text-claude-text'}`}
          >
            Raw
          </button>
          <button 
            onClick={() => setViewMode('preview')} 
            className={`px-4 py-1.5 text-sm rounded-md transition-all ${viewMode === 'preview' ? 'bg-[#333333] shadow-sm text-claude-text font-medium' : 'text-claude-muted hover:text-claude-text'}`}
          >
            Preview
          </button>
          <button 
            onClick={() => setViewMode('split')} 
            className={`px-4 py-1.5 text-sm rounded-md transition-all hidden md:block ${viewMode === 'split' ? 'bg-[#333333] shadow-sm text-claude-text font-medium' : 'text-claude-muted hover:text-claude-text'}`}
          >
            Split
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onCopy}
            className="px-5 py-1.5 text-sm font-medium text-claude-text bg-claude-bg border border-claude-border rounded-lg hover:bg-[#333333] transition-colors shadow-sm cursor-pointer"
          >
            Copy
          </button>
          <button
            onClick={onSave}
            className="px-5 py-1.5 text-sm font-medium text-white bg-claude-accent rounded-lg hover:bg-claude-accent-hover transition-colors shadow-sm cursor-pointer"
          >
            Save .md
          </button>
        </div>
      </div>

      {isTruncated && (
        <div className="px-5 py-2 bg-[#3A2A1A] border-b border-[#5C4023] text-amber-500 text-xs text-center flex items-center justify-center space-x-2">
          <span>⚠️ Document is extremely large. Preview has been truncated to maintain performance. The exported file contains 100% of the data.</span>
        </div>
      )}
      
      {/* Viewer Area */}
      <div className="p-4 bg-claude-card h-[600px] flex flex-col md:flex-row gap-4">
        
        {/* Raw Markdown Pane */}
        {(viewMode === 'raw' || viewMode === 'split') && (
          <pre className="flex-1 w-full h-full overflow-y-auto whitespace-pre-wrap text-sm text-claude-muted font-mono bg-claude-bg/30 p-6 border border-claude-border/50 rounded-xl">
            {previewMarkdown}
          </pre>
        )}

        {/* Rich Preview Pane */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className="flex-1 w-full h-full overflow-y-auto bg-claude-card px-8 py-6 font-serif prose prose-invert max-w-none prose-headings:font-sans prose-headings:font-semibold prose-headings:text-claude-text prose-p:text-claude-text prose-p:leading-relaxed prose-a:text-claude-accent prose-img:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {previewMarkdown}
            </ReactMarkdown>
          </div>
        )}

      </div>
    </div>
  );
};
