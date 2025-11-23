import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const OrnamentalBorder: React.FC<Props> = ({ children, className = "" }) => {
  return (
    <div className={`relative p-1 ${className}`}>
      {/* Outer Golden Border */}
      <div className="absolute inset-0 border-2 border-islamic-gold/40 rounded-xl pointer-events-none"></div>
      
      {/* Inner Decorative Corner Patterns (CSS Shapes) */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-islamic-accent rounded-tl-xl pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-islamic-accent rounded-tr-xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-islamic-accent rounded-bl-xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-islamic-accent rounded-br-xl pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 bg-islamic-cream/95 backdrop-blur-sm rounded-lg p-6 shadow-2xl border border-islamic-gold/20">
        {children}
      </div>
    </div>
  );
};

export default OrnamentalBorder;