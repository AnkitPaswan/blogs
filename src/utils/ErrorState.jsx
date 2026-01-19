import React from "react";
import { Link } from "react-router-dom";
import { RefreshCw, Home, WifiOff } from "lucide-react";

const ErrorState = ({
  title = "Something went wrong",
  message = "Failed to load data. Please try again later.",
  onRetry,
  showRetry = true,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[400px] px-4 py-8 ${className}`}
    >
      {/* Error Icon */}
      <div className="mb-6 relative">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
          <WifiOff className="w-10 h-10 text-red-500" />
        </div>
        {/* Decorative ring */}
        <div className="absolute inset-0 rounded-full border-2 border-red-200 scale-110 opacity-50" />
      </div>

      {/* Error Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-3 text-center">
        {title}
      </h2>

      {/* Error Message */}
      <p className="text-gray-500 text-center max-w-md mb-8 leading-relaxed">
        {message}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
        )}

      </div>

      {/* Troubleshooting Tips */}
      <div className="mt-10 p-4 bg-gray-50 rounded-xl max-w-md">
        <p className="text-xs text-gray-500 text-center">
          <span className="font-medium">Tip:</span> Check your internet connection
          and try refreshing the page.
        </p>
      </div>
    </div>
  );
};

export default ErrorState;

