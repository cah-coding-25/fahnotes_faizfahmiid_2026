import React from 'react';

export const VectorDecorations: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden" aria-hidden="true">
      {/* Subtle Background Dot Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dot-pattern" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.2" fill="#000000" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-pattern)" />
      </svg>

      {/* Top Left Floating Vectors (Sparkle + Code Tag + Squiggle) */}
      <div className="absolute -top-6 -left-6 w-56 h-56 opacity-80 hidden lg:block">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Yellow Burst Star */}
          <path
            d="M50 20 L58 42 L80 50 L58 58 L50 80 L42 58 L20 50 L42 42 Z"
            fill="#FFD233"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Black Sparkle */}
          <path
            d="M95 25 L98 35 L108 38 L98 41 L95 51 L92 41 L82 38 L92 35 Z"
            fill="#000000"
          />
          {/* Pink Squiggle Wave */}
          <path
            d="M20 100 Q 35 85, 50 100 T 80 100 T 110 100"
            stroke="#FF6584"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Cyan Mini Circle */}
          <circle cx="85" cy="85" r="8" fill="#2DD4BF" stroke="#000000" strokeWidth="2" />
        </svg>
      </div>

      {/* Top Right Floating Vectors (Brackets + Sparkle ✦) */}
      <div className="absolute top-12 right-6 w-48 h-48 opacity-75 hidden xl:block">
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Purple Rotated Diamond */}
          <rect
            x="70"
            y="20"
            width="28"
            height="28"
            rx="6"
            transform="rotate(25 70 20)"
            fill="#818CF8"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* 4-pointed Sparkle */}
          <path
            d="M120 70 L126 90 L146 96 L126 102 L120 122 L114 102 L94 96 L114 90 Z"
            fill="#FFD233"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Dashed Circle */}
          <circle
            cx="40"
            cy="110"
            r="16"
            stroke="#000000"
            strokeWidth="2.5"
            strokeDasharray="4 4"
            fill="none"
          />
          {/* Cross / Plus */}
          <path d="M40 30 L40 50 M30 40 L50 40" stroke="#000000" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>

      {/* Bottom Left Vector Accents (Geometric Stack + Spiral Sparkle) */}
      <div className="absolute bottom-8 left-4 w-48 h-48 opacity-70 hidden xl:block">
        <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Teal Pill / Capsule */}
          <rect
            x="10"
            y="80"
            width="56"
            height="22"
            rx="11"
            transform="rotate(-15 10 80)"
            fill="#2DD4BF"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Pink Burst Star */}
          <path
            d="M90 60 L95 75 L110 80 L95 85 L90 100 L85 85 L70 80 L85 75 Z"
            fill="#FF6584"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Little Zigzag */}
          <path
            d="M80 130 L90 120 L100 130 L110 120 L120 130"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Bottom Right Vector Accents (Code Bracket Sticker + Burst) */}
      <div className="absolute bottom-10 right-8 w-52 h-52 opacity-75 hidden lg:block">
        <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Yellow Square with offset shadow look */}
          <rect
            x="70"
            y="60"
            width="36"
            height="36"
            rx="8"
            transform="rotate(12 70 60)"
            fill="#FFD233"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Blue Sparkle */}
          <path
            d="M30 40 L34 52 L46 56 L34 60 L30 72 L26 60 L14 56 L26 52 Z"
            fill="#38BDF8"
            stroke="#000000"
            strokeWidth="2"
          />
          {/* Double Arch / Wave */}
          <path
            d="M60 140 Q 80 120, 100 140 T 140 140"
            stroke="#000000"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Asterisk */}
          <g transform="translate(130, 70)">
            <path d="M0 -8 L0 8 M-8 0 L8 0 M-6 -6 L6 6 M-6 6 L6 -6" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    </div>
  );
};
