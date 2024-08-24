import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class names

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const LoadingButton: React.FC<ButtonProps> = ({
  isLoading = false,
  type = 'button',
  onClick,
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        `relative flex items-center justify-center h-10 px-4 py-2 font-medium text-white bg-blue-500 rounded-md transition duration-300
        disabled:bg-gray-400 disabled:cursor-not-allowed
        focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`,
        className
      )}
      disabled={isLoading || disabled}
      aria-disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="w-5 h-5 text-white animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 1 1 16 0 8 8 0 0 1-16 0zm2 0a6 6 0 1 0 12 0 6 6 0 0 0-12 0z"
          ></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
