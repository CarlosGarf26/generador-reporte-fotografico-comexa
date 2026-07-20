import React from "react";

export const SantanderLogo: React.FC<{ className?: string; color?: string }> = ({
  className = "h-8",
  color = "#EC0000",
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Red Flame SVG representing Santander */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M50 95C74.8528 95 95 74.8528 95 50C95 25.1472 74.8528 5 50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95Z"
          fill={color}
        />
        {/* Stylized White Flame */}
        <path
          d="M48.5 22C48.5 22 55 28 58 36C61 44 59.5 54 53 59C46.5 64 36 62 31.5 54C27 46 29 34 35 28C35 28 32 32 32 38C32 44 36 49 41.5 50C47 51 51.5 47 52.5 41C53.5 35 48.5 22 48.5 22Z"
          fill="white"
        />
        <path
          d="M54.5 32C54.5 32 60 37 62 44C64 51 61.5 59 55.5 63C49.5 67 40 65 36.5 58C36.5 58 39 61 44 61C49 61 53 57 54.5 51C56 45 54.5 32 54.5 32Z"
          fill="white"
          opacity="0.85"
        />
        <path
          d="M62 45C62 45 66 49 67 54C68 59 66 65 61.5 68C57 71 50 69 47.5 64C47.5 64 50 66 54 65C58 64 61 60 61.5 55C62 50 62 45 62 45Z"
          fill="white"
          opacity="0.7"
        />
      </svg>
      
      {/* Stylized custom text with Montserrat/Arial vibe for "Santander" */}
      <span className="font-sans font-bold text-white tracking-tight text-lg sm:text-xl md:text-2xl">
        Santander
      </span>
    </div>
  );
};

export const ComexaLogo: React.FC<{ className?: string; darkTheme?: boolean }> = ({
  className = "h-11",
  darkTheme = true,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Yellow/Blue Comexa Shield Shield Logo */}
      <svg
        viewBox="0 0 120 120"
        className="h-full w-auto flex-shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shield background */}
        <path
          d="M60 10L100 25V65C100 90 80 110 60 115C40 110 20 95 20 65V25L60 10Z"
          fill="#0C2340"
          stroke="#F2A900"
          strokeWidth="3"
        />
        {/* Yellow shield accent half */}
        <path
          d="M60 10L20 25V65C20 95 40 110 60 115V10Z"
          fill="#F2A900"
          opacity="0.15"
        />
        {/* Yellow dynamic star pattern/bolts representing safety/tech */}
        <path
          d="M60 25L70 45H85L72 55L77 75L60 62L43 75L48 55L35 45H50L60 25Z"
          fill="#F2A900"
        />
        {/* Blue inner design */}
        <circle cx="60" cy="51" r="10" fill="#0C2340" stroke="#F2A900" strokeWidth="2" />
        {/* Stylized '20' Years or Shield Crown */}
        <path
          d="M45 82H75V88H45V82Z"
          fill="#F2A900"
        />
        <text
          x="60"
          y="103"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="14"
          fontWeight="bold"
          fontFamily="system-ui"
          letterSpacing="1"
        >
          COMEXA
        </text>
      </svg>
      
      {/* Labels */}
      <div className="flex flex-col justify-center leading-tight">
        <span
          className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-wider font-sans ${
            darkTheme ? "text-amber-400" : "text-amber-600"
          }`}
        >
          INTEGRADORES Y DESARROLLADORES
        </span>
        <span
          className={`text-[7px] sm:text-[8px] md:text-[9px] font-medium tracking-wide font-sans ${
            darkTheme ? "text-gray-200" : "text-gray-700"
          }`}
        >
          EN SISTEMAS ELECTRÓNICOS DE SEGURIDAD
        </span>
        <span
          className={`text-[6px] sm:text-[7px] md:text-[8px] font-mono tracking-normal font-medium ${
            darkTheme ? "text-gray-400" : "text-gray-500"
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
        viewBox="0 0 120 120"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M60 10L100 25V65C100 90 80 110 60 115C40 110 20 95 20 65V25L60 10Z"
          fill="none"
          stroke="#4B5563"
          strokeWidth="3"
        />
        <path
          d="M60 25L70 45H85L72 55L77 75L60 62L43 75L48 55L35 45H50L60 25Z"
          fill="#4B5563"
        />
        <text
          x="60"
          y="105"
          textAnchor="middle"
          fill="#4B5563"
          fontSize="15"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          COMEXA
        </text>
      </svg>
    </div>
  );
};
