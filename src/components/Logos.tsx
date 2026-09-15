import React from "react";
import { COMEXA_LOGO_SRC } from "../assets/comexaLogoBase64";

export const SantanderLogo: React.FC<{ className?: string; color?: string; showText?: boolean }> = ({
  className = "h-8",
  color = "#EC0000",
  showText = true,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className} select-none`}>
      {/* Official Santander Flame Emblem */}
      <svg
        viewBox="0 0 500 450"
        className="h-full w-auto flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill={color}>
          <path d="M 250 35 C 240 65, 232 105, 232 140 C 232 175, 245 205, 245 205 C 220 185, 198 150, 192 125 C 188 100, 192 75, 192 75 C 178 98, 168 128, 168 162 C 168 205, 188 238, 188 238 C 128 238, 60 272, 60 332 C 60 392, 145 432, 250 432 C 355 432, 440 392, 440 332 C 440 272, 372 238, 312 238 C 312 238, 328 212, 328 178 C 328 132, 292 80, 250 35 Z"/>
        </g>
        <g fill="#FFFFFF">
          <path d="M 125 315 C 125 282, 172 260, 218 260 C 248 260, 262 278, 250 302 C 235 330, 185 365, 155 380 C 138 365, 125 342, 125 315 Z"/>
          <path d="M 205 292 C 218 262, 242 238, 262 208 C 278 185, 282 162, 276 142 C 288 168, 288 200, 272 228 C 255 258, 228 285, 218 312 C 210 338, 222 362, 242 378 C 222 368, 202 342, 205 292 Z"/>
        </g>
      </svg>
      
      {showText && (
        <span 
          className="font-sans font-bold tracking-tight text-white text-base sm:text-lg md:text-xl transition-colors select-none"
        >
          Santander
        </span>
      )}
    </div>
  );
};

export const ComexaLogo: React.FC<{ className?: string; darkTheme?: boolean }> = ({
  className = "h-10",
}) => {
  return (
    <div className={`flex items-center shrink-0 ${className} select-none`}>
      {/* Exact image from user GitHub */}
      <img
        src={COMEXA_LOGO_SRC}
        alt="COMEXA"
        className="h-full w-auto object-contain rounded-xs"
        loading="eager"
      />
    </div>
  );
};

export const ComexaWatermark: React.FC<{ className?: string }> = ({
  className = "w-96 h-96 opacity-[0.03]",
}) => {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="15" y="10" width="70" height="60" fill="none" stroke="#4B5563" strokeWidth="1" />
        <g stroke="#4B5563" strokeWidth="1">
          <line x1="15" y1="14" x2="85" y2="14" />
          <line x1="15" y1="18" x2="85" y2="18" />
          <line x1="15" y1="22" x2="85" y2="22" />
          <line x1="15" y1="26" x2="85" y2="26" />
          <line x1="15" y1="30" x2="85" y2="30" />
          <line x1="15" y1="34" x2="85" y2="34" />
          <line x1="15" y1="38" x2="85" y2="38" />
          <line x1="15" y1="42" x2="85" y2="42" />
          <line x1="15" y1="46" x2="85" y2="46" />
          <line x1="15" y1="50" x2="85" y2="50" />
          <line x1="15" y1="54" x2="85" y2="54" />
          <line x1="15" y1="58" x2="85" y2="58" />
          <line x1="15" y1="62" x2="85" y2="62" />
          <line x1="15" y1="66" x2="85" y2="66" />
        </g>
        <path
          d="M 20 62 C 20 54, 25 45, 30 40 C 33 37, 36 36, 40 36 C 45 36, 49 38, 54 38 C 62 38, 71 35, 75 32 C 80 28, 83 23, 79 19 C 75 15, 68 17, 64 21 C 57 26, 55 29, 50 27 C 46 25, 49 19, 52 13 C 55 7, 50 3, 44 6 C 39 9, 38 16, 39 21 C 35 17, 31 13, 25 11 C 19 9, 15 13, 19 17 C 22 20, 27 22, 31 24 C 27 26, 21 29, 15 33 C 10 37, 12 43, 18 41 C 23 39, 29 35, 33 33 C 29 39, 25 47, 25 55 C 25 61, 28 66, 30 66 Z"
          fill="#4B5563"
        />
        <text
          x="50"
          y="92"
          textAnchor="middle"
          fill="#4B5563"
          fontSize="15"
          fontWeight="bold"
          fontStyle="italic"
          fontFamily="system-ui"
        >
          COMEXA®
        </text>
      </svg>
    </div>
  );
};

export const CitiLogo: React.FC<{ className?: string; color?: string }> = ({
  className = "h-8",
  color = "#002D62",
}) => {
  return (
    <div className={`flex items-center gap-1 ${className} select-none`}>
      <svg
        viewBox="0 0 100 60"
        className="h-full w-auto flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Red arch representing the Citi umbrella/arch */}
        <path
          d="M 12 28 C 30 11, 70 11, 88 28 C 81 23, 66 18, 50 18 C 34 18, 19 23, 12 28 Z"
          fill="#ED1C24"
        />
        {/* Lowercase 'citi' logo text */}
        <text
          x="50"
          y="49"
          textAnchor="middle"
          fill={color}
          fontSize="29"
          fontWeight="900"
          fontFamily='"Inter", "Arial Black", sans-serif'
          letterSpacing="-1.5"
        >
          citi
        </text>
      </svg>
    </div>
  );
};

