import React from "react";

export const SantanderLogo: React.FC<{ className?: string; color?: string }> = ({
  className = "h-8",
  color = "#EC0000",
}) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Authentic Red Flame SVG representing Santander without circle background */}
      <svg
        viewBox="20 15 60 60"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M48.5 22C48.5 22 55 28 58 36C61 44 59.5 54 53 59C46.5 64 36 62 31.5 54C27 46 29 34 35 28C35 28 32 32 32 38C32 44 36 49 41.5 50C47 51 51.5 47 52.5 41C53.5 35 48.5 22 48.5 22Z"
          fill={color}
        />
        <path
          d="M54.5 32C54.5 32 60 37 62 44C64 51 61.5 59 55.5 63C49.5 67 40 65 36.5 58C36.5 58 39 61 44 61C49 61 53 57 54.5 51C56 45 54.5 32 54.5 32Z"
          fill={color}
          opacity="0.85"
        />
        <path
          d="M62 45C62 45 66 49 67 54C68 59 66 65 61.5 68C57 71 50 69 47.5 64C47.5 64 50 66 54 65C58 64 61 60 61.5 55C62 50 62 45 62 45Z"
          fill={color}
          opacity="0.7"
        />
      </svg>
      
      {/* Authentic text for "Santander" */}
      <span 
        className="font-sans font-bold tracking-tight text-lg sm:text-xl md:text-2xl transition-colors select-none"
        style={{ color: color }}
      >
        Santander
      </span>
    </div>
  );
};

export const ComexaLogo: React.FC<{ className?: string; darkTheme?: boolean }> = ({
  className = "h-11",
  darkTheme = true,
}) => {
  const stripeColor = darkTheme ? "#FFFFFF" : "#000000";
  const rectBgColor = darkTheme ? "#000000" : "#FFFFFF";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Yellow/Black Striped COMEXA Moose Logo */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="15" y="10" width="70" height="60" fill={rectBgColor} />
        {/* Horizontal Stripes */}
        <g stroke={stripeColor} strokeWidth="2">
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
        {/* Yellow Elk/Moose profile silhouette facing right */}
        <path
          d="M 20 62 C 20 54, 25 45, 30 40 C 33 37, 36 36, 40 36 C 45 36, 49 38, 54 38 C 62 38, 71 35, 75 32 C 80 28, 83 23, 79 19 C 75 15, 68 17, 64 21 C 57 26, 55 29, 50 27 C 46 25, 49 19, 52 13 C 55 7, 50 3, 44 6 C 39 9, 38 16, 39 21 C 35 17, 31 13, 25 11 C 19 9, 15 13, 19 17 C 22 20, 27 22, 31 24 C 27 26, 21 29, 15 33 C 10 37, 12 43, 18 41 C 23 39, 29 35, 33 33 C 29 39, 25 47, 25 55 C 25 61, 28 66, 30 66 Z"
          fill="#FFE500"
        />
        {/* Cyan Italic COMEXA Text below */}
        <text
          x="50"
          y="92"
          textAnchor="middle"
          fill="#009EE0"
          fontSize="17"
          fontWeight="950"
          fontStyle="italic"
          fontFamily='"Inter", "Arial Black", sans-serif'
          letterSpacing="0.5"
        >
          COMEXA®
        </text>
      </svg>
      
      {/* Labels */}
      <div className="flex flex-col justify-center leading-tight">
        <span
          className={`text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-wider font-sans uppercase ${
            darkTheme ? "text-white" : "text-[#1A3D6C]"
          }`}
        >
          INTEGRADORES Y DESARROLLADORES
        </span>
        <span
          className={`text-[7px] sm:text-[8px] md:text-[9px] font-extrabold tracking-wide font-sans uppercase ${
            darkTheme ? "text-white" : "text-[#1A3D6C]"
          }`}
        >
          EN SISTEMAS ELECTRÓNICOS DE SEGURIDAD
        </span>
        <span
          className={`text-[6px] sm:text-[7px] md:text-[8px] font-sans tracking-normal font-medium ${
            darkTheme ? "text-[#009EE0]" : "text-[#4A90E2]"
          }`}
        >
          Alarmas, CCTV, Incendio, Control de Acceso
        </span>
      </div>
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

