import { FC } from 'react';

interface ConvertButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ConvertButton: FC<ConvertButtonProps> = ({ onClick, isLoading, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`w-full py-3.5 px-4 rounded-xl font-medium text-[15px] flex justify-center items-center transition-all ${
        disabled || isLoading
          ? 'bg-[#333333] text-gray-500 cursor-not-allowed'
          : 'bg-claude-text text-[#1A1A1A] hover:bg-white shadow-md hover:shadow-lg cursor-pointer'
      }`}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing Document...
        </>
      ) : (
        'Extract to Markdown'
      )}
    </button>
  );
};
