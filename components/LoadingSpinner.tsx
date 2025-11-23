import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="relative w-24 h-24">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-4 border-islamic-gold/30 rounded-full animate-[spin_3s_linear_infinite]"></div>
        {/* Inner rotating ring reverse */}
        <div className="absolute inset-2 border-4 border-islamic-light/50 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl text-islamic-base">۞</span>
        </div>
      </div>
      <p className="text-islamic-cream text-lg animate-pulse font-light">در حال تفأل به قرآن کریم...</p>
    </div>
  );
};

export default LoadingSpinner;