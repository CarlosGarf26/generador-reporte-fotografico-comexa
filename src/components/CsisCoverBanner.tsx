import React from "react";

export const CSIS_COVER_BANNER_SVG_MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 500" width="1000" height="500">
  <defs>
    <!-- Background Gradient: suit jacket dark left, silver/light gray right -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0b0f19"/>
      <stop offset="22%" stop-color="#151d2a"/>
      <stop offset="48%" stop-color="#4b5563"/>
      <stop offset="75%" stop-color="#9ca3af"/>
      <stop offset="100%" stop-color="#e5e7eb"/>
    </linearGradient>

    <!-- Globe Sphere Gradient -->
    <radialGradient id="globeGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="35%" stop-color="#0284c7"/>
      <stop offset="75%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </radialGradient>

    <!-- Red Ring Ribbon Gradient -->
    <linearGradient id="redBelt" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff4d4d"/>
      <stop offset="50%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#9f1239"/>
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="10" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Main Background -->
  <rect width="1000" height="500" fill="url(#bgGrad)" />

  <!-- Suit Jacket & Arm Silhouette on Left -->
  <path d="M 0 0 L 220 0 C 210 140 180 320 160 500 L 0 500 Z" fill="#090d16" />
  <!-- White shirt collar accent -->
  <path d="M 120 0 L 150 0 L 130 90 Z" fill="#ffffff" opacity="0.9" />

  <!-- Hand Holding Globe -->
  <g fill="#d97706" opacity="0.85">
    <!-- Palm and fingers under globe -->
    <path d="M 70 280 C 130 250 190 270 270 340 C 330 380 300 450 250 470 C 180 490 100 450 70 380 Z" />
    <path d="M 230 310 C 270 290 320 330 350 380 C 360 410 330 430 300 400 Z" opacity="0.9" />
  </g>

  <!-- World Map Grid Silhouette Background on Right -->
  <g opacity="0.25" stroke="#ffffff" stroke-width="1.2" fill="none">
    <ellipse cx="700" cy="250" rx="220" ry="140" stroke-dasharray="4 4"/>
    <ellipse cx="700" cy="250" rx="140" ry="140" stroke-dasharray="4 4"/>
    <line x1="480" y1="250" x2="920" y2="250" />
    <line x1="700" y1="110" x2="700" y2="390" />
  </g>

  <!-- Glowing Bokeh Particles -->
  <circle cx="430" cy="220" r="16" fill="#38bdf8" opacity="0.6" filter="url(#glow)"/>
  <circle cx="510" cy="350" r="22" fill="#fb923c" opacity="0.5" filter="url(#glow)"/>
  <circle cx="580" cy="140" r="14" fill="#38bdf8" opacity="0.7" filter="url(#glow)"/>
  <circle cx="670" cy="360" r="20" fill="#f43f5e" opacity="0.45" filter="url(#glow)"/>
  <circle cx="750" cy="180" r="26" fill="#38bdf8" opacity="0.5" filter="url(#glow)"/>
  <circle cx="830" cy="280" r="15" fill="#c084fc" opacity="0.4" filter="url(#glow)"/>
  <circle cx="910" cy="160" r="18" fill="#38bdf8" opacity="0.6" filter="url(#glow)"/>

  <!-- 3D Holographic Earth Globe -->
  <g transform="translate(260, 240)">
    <!-- Outer Atmosphere Glow -->
    <circle cx="0" cy="0" r="110" fill="#0284c7" opacity="0.35" filter="url(#glow)" />
    <!-- Globe Core -->
    <circle cx="0" cy="0" r="100" fill="url(#globeGrad)" stroke="#38bdf8" stroke-width="2" />
    
    <!-- Grid Lines (Latitude & Longitude) -->
    <ellipse cx="0" cy="0" rx="100" ry="38" stroke="#bae6fd" stroke-width="1.2" fill="none" opacity="0.65"/>
    <ellipse cx="0" cy="0" rx="100" ry="75" stroke="#bae6fd" stroke-width="1.2" fill="none" opacity="0.65"/>
    <ellipse cx="0" cy="0" rx="38" ry="100" stroke="#bae6fd" stroke-width="1.2" fill="none" opacity="0.65"/>
    <ellipse cx="0" cy="0" rx="75" ry="100" stroke="#bae6fd" stroke-width="1.2" fill="none" opacity="0.65"/>
    <line x1="-100" y1="0" x2="100" y2="0" stroke="#bae6fd" stroke-width="1.5" opacity="0.7"/>

    <!-- Continents overlay simulation -->
    <path d="M -50 -40 Q -25 -65 15 -50 Q 40 -25 25 15 Q -15 40 -65 0 Z" fill="#e0f2fe" opacity="0.45"/>
    <path d="M 0 15 Q 40 0 65 25 Q 50 65 15 75 Q -25 50 0 15 Z" fill="#e0f2fe" opacity="0.4"/>

    <!-- CSIS Red Ribbon Loop Wrapping Globe -->
    <g transform="rotate(-16)">
      <!-- Back segment of red ring -->
      <path d="M -130 0 C -130 -32 130 -32 130 0" stroke="#9f1239" stroke-width="22" fill="none" opacity="0.65"/>
      <!-- Front segment of red ring -->
      <path d="M -130 0 C -130 36 130 36 130 0" stroke="url(#redBelt)" stroke-width="24" fill="none" filter="url(#softGlow)"/>
      <!-- White CSIS Bold Text -->
      <text x="0" y="10" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" letter-spacing="3" filter="url(#softGlow)">CSIS</text>
    </g>
  </g>

  <!-- Floating White Flat Icons to Right of Globe -->
  <!-- 1. Group of People Icon -->
  <g transform="translate(410, 175) scale(1.5)" fill="#ffffff">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" opacity="0.95"/>
    <path d="M18 10c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.25 0-.48.04-.71.09 1.04.77 1.71 1.98 1.71 3.36s-.67 2.59-1.71 3.36c.23.05.46.09.71.09zm0 2c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V18h5v-2c0-2.22-3.83-3.41-6-3.95z" opacity="0.75"/>
  </g>

  <!-- 2. Mobile Phone with Gear Icon -->
  <g transform="translate(515, 175) scale(1.5)" fill="#ffffff" opacity="0.95">
    <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
    <!-- Gear inside phone -->
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="#ffffff"/>
  </g>

  <!-- 3. Bar Chart Icon -->
  <g transform="translate(620, 172) scale(1.6)" fill="#ffffff" opacity="0.95">
    <rect x="2" y="10" width="4" height="10" rx="1"/>
    <rect x="8" y="4" width="4" height="16" rx="1"/>
    <rect x="14" y="12" width="4" height="8" rx="1"/>
  </g>

  <!-- 4. Wifi Wireless Signal Icon -->
  <g transform="translate(725, 175) scale(1.6)" fill="#ffffff" opacity="0.95">
    <path d="M12 3C7.03 3 2.56 4.96.08 8.16l1.77 1.77C3.92 7.15 7.72 5.5 12 5.5s8.08 1.65 10.15 4.43l1.77-1.77C21.44 4.96 16.97 3 12 3zm0 5c-3.31 0-6.29 1.31-8.49 3.43l1.77 1.77C7.01 11.53 9.37 10.5 12 10.5s4.99 1.03 6.72 2.7l1.77-1.77C18.29 9.31 15.31 8 12 8zm0 5c-1.93 0-3.68.78-4.95 2.05l1.77 1.77c.82-.82 1.95-1.32 3.18-1.32s2.36.5 3.18 1.32l1.77-1.77C15.68 13.78 13.93 13 12 13zm0 4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
  </g>

  <!-- 5. Upward Trend Line Chart with Arrow -->
  <g transform="translate(830, 168) scale(1.6)" stroke="#ffffff" stroke-width="2.2" fill="none" opacity="0.95" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="2,18 8,12 14,15 22,5" />
    <polyline points="16,5 22,5 22,11" />
  </g>
</svg>`;

export const CsisCoverBanner: React.FC<{ customUrl?: string }> = ({ customUrl }) => {
  if (customUrl) {
    return (
      <img
        src={customUrl}
        alt="Portada Extracción de Video"
        className="w-full h-full object-cover rounded-xl"
      />
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-inner bg-slate-900 flex items-center justify-center">
      <div
        className="w-full h-full"
        dangerouslySetInnerHTML={{ __html: CSIS_COVER_BANNER_SVG_MARKUP }}
      />
    </div>
  );
};
