import React from "react";

export const CSIS_COVER_BANNER_SVG_MARKUP = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 650" width="1000" height="500">
  <defs>
    <!-- Background Gradient: dark suit on left, silver/light grey background on right -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#05070a"/>
      <stop offset="35%" stop-color="#1b2333"/>
      <stop offset="55%" stop-color="#64748b"/>
      <stop offset="80%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>

    <!-- Globe Sphere Radial Gradient -->
    <radialGradient id="globeGrad" cx="35%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="30%" stop-color="#0284c7"/>
      <stop offset="70%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#082f49"/>
    </radialGradient>

    <!-- Red Ribbon Gradient -->
    <linearGradient id="redRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff3333"/>
      <stop offset="40%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#881337"/>
    </linearGradient>

    <!-- Glow Filter -->
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Main Background -->
  <rect width="1200" height="650" fill="url(#bgGrad)" />

  <!-- World Map Grid / Silhouette Background in Silver Area -->
  <g opacity="0.18" stroke="#ffffff" stroke-width="1.5" fill="none">
    <ellipse cx="850" cy="320" rx="280" ry="180" stroke-dasharray="6 6"/>
    <ellipse cx="850" cy="320" rx="180" ry="180" stroke-dasharray="6 6"/>
    <line x1="550" y1="320" x2="1150" y2="320" />
    <line x1="850" y1="140" x2="850" y2="500" />
  </g>

  <!-- Suited Businessman Body Contour on Left -->
  <g id="suitPerson">
    <!-- Dark Jacket -->
    <path d="M 0 0 L 320 0 C 310 180 280 380 250 650 L 0 650 Z" fill="#0c1017" />
    <path d="M 120 0 L 290 0 C 270 200 220 420 180 650 L 0 650 Z" fill="#111827" />
    <!-- White shirt V-neck & Tie -->
    <path d="M 160 0 L 200 0 L 180 180 L 150 180 Z" fill="#ffffff" opacity="0.9" />
    <path d="M 172 0 L 188 0 L 182 240 L 175 240 Z" fill="#1e293b" />
    <path d="M 0 120 C 140 180 180 320 220 650 L 0 650 Z" fill="#080c14" />
  </g>

  <!-- Extended Human Hand (Palm Up) holding globe -->
  <g id="humanHand">
    <!-- Arm sleeve cuff -->
    <path d="M 60 380 C 100 350 160 360 210 400 L 170 520 C 120 480 80 440 60 380 Z" fill="#0f172a" />
    <path d="M 195 390 L 210 400 L 195 430 L 180 420 Z" fill="#f8fafc" /> <!-- White cuff -->

    <!-- Skin tones (hand & fingers extended right) -->
    <!-- Palm -->
    <path d="M 190 405 C 250 360 330 380 400 480 C 440 540 380 610 300 620 C 220 620 160 550 180 460 Z" fill="#fbcfe8" opacity="0.15" />
    <path d="M 90 310 C 130 240 160 280 180 380 C 160 480 110 460 90 310 Z" fill="#fed7aa" opacity="0.9" /> <!-- Thumb -->
    <!-- Palm Base -->
    <path d="M 180 410 C 240 380 320 410 410 520 C 430 560 380 610 320 610 C 250 610 190 530 180 410 Z" fill="#fdba74" />
    <path d="M 210 420 C 280 410 360 450 425 540 C 400 580 340 590 290 570 C 230 530 200 470 210 420 Z" fill="#f97316" opacity="0.6" />
    <!-- Extended Fingers under globe -->
    <path d="M 330 460 C 400 470 480 520 490 550 C 480 570 420 570 360 530 Z" fill="#fdba74" /> <!-- Index finger -->
    <path d="M 310 490 C 380 510 460 560 470 590 C 450 610 390 600 330 550 Z" fill="#fb923c" /> <!-- Middle finger -->
    <path d="M 280 520 C 340 540 410 590 420 620 C 400 635 340 625 290 570 Z" fill="#f97316" /> <!-- Ring/Pinky finger -->
  </g>

  <!-- Multicolored Glowing Bokeh Particles -->
  <g id="bokehLights">
    <circle cx="410" cy="210" r="14" fill="#38bdf8" opacity="0.8" filter="url(#glow)"/>
    <circle cx="430" cy="310" r="28" fill="#0284c7" opacity="0.6" filter="url(#glow)"/>
    <circle cx="580" cy="270" r="22" fill="#38bdf8" opacity="0.7" filter="url(#glow)"/>
    <circle cx="590" cy="410" r="32" fill="#fb923c" opacity="0.6" filter="url(#glow)"/>
    <circle cx="670" cy="210" r="18" fill="#38bdf8" opacity="0.8" filter="url(#glow)"/>
    <circle cx="710" cy="390" r="26" fill="#f43f5e" opacity="0.5" filter="url(#glow)"/>
    <circle cx="780" cy="250" r="30" fill="#38bdf8" opacity="0.6" filter="url(#glow)"/>
    <circle cx="820" cy="420" r="16" fill="#fb923c" opacity="0.7" filter="url(#glow)"/>
    <circle cx="890" cy="270" r="24" fill="#c084fc" opacity="0.5" filter="url(#glow)"/>
    <circle cx="980" cy="210" r="20" fill="#38bdf8" opacity="0.7" filter="url(#glow)"/>
  </g>

  <!-- 3D Holographic CSIS Earth Globe -->
  <g transform="translate(310, 310)">
    <!-- Cyan Atmosphere Back Aura -->
    <circle cx="0" cy="0" r="145" fill="#38bdf8" opacity="0.35" filter="url(#glow)" />
    <circle cx="0" cy="0" r="125" fill="#0284c7" opacity="0.5" filter="url(#glow)" />

    <!-- Sphere Base -->
    <circle cx="0" cy="0" r="115" fill="url(#globeGrad)" stroke="#38bdf8" stroke-width="2.5" />

    <!-- Globe Grid Lines -->
    <g opacity="0.7" stroke="#bae6fd" stroke-width="1.5" fill="none">
      <ellipse cx="0" cy="0" rx="115" ry="45"/>
      <ellipse cx="0" cy="0" rx="115" ry="85"/>
      <ellipse cx="0" cy="0" rx="45" ry="115"/>
      <ellipse cx="0" cy="0" rx="85" ry="115"/>
      <line x1="-115" y1="0" x2="115" y2="0" stroke-width="2"/>
    </g>

    <!-- World Continents (Realistic vector silhouette) -->
    <path d="M -60 -45 C -30 -75 20 -60 40 -30 C 55 0 25 30 -20 45 C -70 50 -80 0 -60 -45 Z" fill="#ffffff" opacity="0.85" />
    <path d="M -10 20 C 30 5 70 30 65 75 C 40 90 -10 75 -10 20 Z" fill="#ffffff" opacity="0.8" />
    <path d="M 30 -70 C 60 -85 90 -50 80 -30 C 60 -20 30 -40 30 -70 Z" fill="#ffffff" opacity="0.8" />

    <!-- CSIS Red Ribbon Loop Outer Orbit -->
    <g transform="rotate(-15)">
      <!-- Rear Loop Part -->
      <path d="M -155 -5 C -155 -42 155 -42 155 -5" stroke="#881337" stroke-width="26" fill="none" opacity="0.75" />
      
      <!-- Front Loop Part -->
      <path d="M -155 -5 C -155 46 155 46 155 -5" stroke="url(#redRingGrad)" stroke-width="28" fill="none" filter="url(#softGlow)" />
      <path d="M -155 -5 C -155 46 155 46 155 -5" stroke="#ffffff" stroke-width="2" fill="none" opacity="0.4" />

      <!-- White CSIS Bold Text centered on ribbon -->
      <text x="0" y="13" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="36" fill="#ffffff" text-anchor="middle" letter-spacing="4" filter="url(#softGlow)">CSIS</text>
    </g>
  </g>

  <!-- Floating White Flat Icons in Row to Right of Globe -->
  <!-- 1. Group of People Icon -->
  <g transform="translate(500, 240) scale(2.0)" fill="#ffffff">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" opacity="0.95"/>
    <path d="M18 10c1.66 0 3-1.34 3-3s-1.34-3-3-3c-.25 0-.48.04-.71.09 1.04.77 1.71 1.98 1.71 3.36s-.67 2.59-1.71 3.36c.23.05.46.09.71.09zm0 2c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V18h5v-2c0-2.22-3.83-3.41-6-3.95z" opacity="0.8"/>
  </g>

  <!-- 2. Mobile Phone with Gear Icon -->
  <g transform="translate(640, 240) scale(2.0)" fill="#ffffff" opacity="0.95">
    <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
    <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
  </g>

  <!-- 3. Bar Chart Icon -->
  <g transform="translate(770, 235) scale(2.1)" fill="#ffffff" opacity="0.95">
    <rect x="2" y="10" width="4" height="10" rx="1"/>
    <rect x="8" y="4" width="4" height="16" rx="1"/>
    <rect x="14" y="12" width="4" height="8" rx="1"/>
  </g>

  <!-- 4. Wifi Wireless Signal Icon -->
  <g transform="translate(900, 240) scale(2.1)" fill="#ffffff" opacity="0.95">
    <path d="M12 3C7.03 3 2.56 4.96.08 8.16l1.77 1.77C3.92 7.15 7.72 5.5 12 5.5s8.08 1.65 10.15 4.43l1.77-1.77C21.44 4.96 16.97 3 12 3zm0 5c-3.31 0-6.29 1.31-8.49 3.43l1.77 1.77C7.01 11.53 9.37 10.5 12 10.5s4.99 1.03 6.72 2.7l1.77-1.77C18.29 9.31 15.31 8 12 8zm0 5c-1.93 0-3.68.78-4.95 2.05l1.77 1.77c.82-.82 1.95-1.32 3.18-1.32s2.36.5 3.18 1.32l1.77-1.77C15.68 13.78 13.93 13 12 13zm0 4c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
  </g>

  <!-- 5. Stock Trend Line Chart with Arrow -->
  <g transform="translate(1030, 230) scale(2.1)" stroke="#ffffff" stroke-width="2.2" fill="none" opacity="0.95" stroke-linecap="round" stroke-linejoin="round">
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

