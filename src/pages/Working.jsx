import React from 'react';
import { Construction } from 'lucide-react';

export default function UnderConstruction() {
  return (
    // Full screen container, centered content
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      
      <div className="bg-white p-8 sm:p-12 rounded-xl shadow-2xl max-w-lg w-full text-center">
        
        {/* Icon */}
        <Construction 
          size={80} 
          className="mx-auto text-yellow-500 mb-6 animate-pulse" 
        />
        
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Work In Progress
        </h1>
        
        <p className="text-lg text-gray-600 mb-6">
          We're working hard to bring you this feature. Thank you for your patience!
        </p>
      </div>
    </div>
  );
}
