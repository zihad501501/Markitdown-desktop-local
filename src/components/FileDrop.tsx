import { FC, useState, DragEvent } from 'react';

interface FileDropProps {
  onFileSelect: () => void;
  onFileDrop: (filePath: string) => void;
  selectedFile: string | null;
}

export const FileDrop: FC<FileDropProps> = ({ onFileSelect, onFileDrop, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0] as File & { path: string };
      if (file.path) {
        onFileDrop(file.path);
      }
    }
  };

  return (
    <div 
      className={`w-full flex flex-col items-center justify-center p-10 border border-dashed rounded-xl transition-all duration-200 ease-in-out ${
        isDragging ? 'border-claude-accent bg-claude-accent/10' : 'border-[#3A3A3A] bg-claude-bg/50 hover:border-claude-accent/50'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className="text-lg font-medium mb-1.5 text-claude-text">Drag & drop your file</h2>
      <p className="text-sm text-claude-muted mb-6 font-serif">or click to browse your computer</p>
      
      <button
        onClick={onFileSelect}
        className="px-6 py-2.5 bg-claude-bg border border-claude-border text-claude-text text-sm font-medium rounded-lg hover:bg-[#333333] transition-colors shadow-sm cursor-pointer"
      >
        Select File
      </button>

      {selectedFile && (
        <div className="mt-8 p-4 bg-[#2A2A2A] rounded-lg w-full max-w-md border border-claude-border text-center shadow-sm">
          <p className="text-[11px] font-semibold text-claude-muted uppercase tracking-wider mb-1">Selected File</p>
          <p className="text-sm font-medium text-claude-text truncate" title={selectedFile}>
            {selectedFile.split('\\').pop()?.split('/').pop()}
          </p>
        </div>
      )}
    </div>
  );
};
