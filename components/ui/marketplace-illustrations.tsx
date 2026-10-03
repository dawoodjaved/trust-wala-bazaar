"use client";

// Inline SVG illustrations for marketplace theme

export const ShoppingAppSVG = () => (
  <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="800" height="600" fill="transparent"/>
    {/* Shopping cart */}
    <path d="M200 400 L600 400" stroke="#c8d96f" strokeWidth="3" opacity="0.3"/>
    <circle cx="250" cy="450" r="30" fill="#c8d96f" opacity="0.2"/>
    <circle cx="550" cy="450" r="30" fill="#c8d96f" opacity="0.2"/>
    {/* Phone/App illustration */}
    <rect x="300" y="150" width="200" height="350" rx="20" fill="none" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
    <rect x="320" y="200" width="160" height="200" rx="10" fill="#c8d96f" opacity="0.1"/>
    <circle cx="400" cy="420" r="15" fill="#c8d96f" opacity="0.3"/>
    {/* Products */}
    <rect x="100" y="200" width="80" height="80" rx="8" fill="#c8d96f" opacity="0.15"/>
    <rect x="620" y="200" width="80" height="80" rx="8" fill="#c8d96f" opacity="0.15"/>
  </svg>
);

export const OnlineShoppingSVG = () => (
  <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="800" height="600" fill="transparent"/>
    {/* Shopping bags */}
    <path d="M200 300 L250 450 L350 450 L400 300 Z" fill="#c8d96f" opacity="0.2" stroke="#c8d96f" strokeWidth="2"/>
    <path d="M400 300 L450 450 L550 450 L600 300 Z" fill="#c8d96f" opacity="0.2" stroke="#c8d96f" strokeWidth="2"/>
    {/* Shopping cart icon */}
    <circle cx="400" cy="200" r="60" fill="none" stroke="#c8d96f" strokeWidth="3" opacity="0.4"/>
    <path d="M370 200 L430 200" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
    <path d="M400 170 L400 230" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
  </svg>
);

export const AIIllustrationSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Neural network nodes */}
    <circle cx="50" cy="50" r="12" fill="#c8d96f" opacity="0.6"/>
    <circle cx="150" cy="50" r="12" fill="#c8d96f" opacity="0.6"/>
    <circle cx="100" cy="100" r="15" fill="#c8d96f" opacity="0.8"/>
    <circle cx="50" cy="150" r="12" fill="#c8d96f" opacity="0.6"/>
    <circle cx="150" cy="150" r="12" fill="#c8d96f" opacity="0.6"/>
    {/* Connections */}
    <line x1="50" y1="50" x2="100" y2="100" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
    <line x1="150" y1="50" x2="100" y2="100" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
    <line x1="50" y1="150" x2="100" y2="100" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
    <line x1="150" y1="150" x2="100" y2="100" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
  </svg>
);

export const SecuritySVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Shield */}
    <path d="M100 40 L140 60 L140 120 Q140 160 100 180 Q60 160 60 120 L60 60 Z" fill="none" stroke="#c8d96f" strokeWidth="3" opacity="0.6"/>
    <path d="M100 40 L140 60 L140 120 Q140 160 100 180 Q60 160 60 120 L60 60 Z" fill="#c8d96f" opacity="0.1"/>
    {/* Lock */}
    <rect x="85" y="100" width="30" height="40" rx="4" fill="none" stroke="#c8d96f" strokeWidth="2" opacity="0.6"/>
    <path d="M85 100 Q100 90 100 100" stroke="#c8d96f" strokeWidth="2" opacity="0.6" fill="none"/>
  </svg>
);

export const VoiceSearchSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Microphone */}
    <rect x="80" y="60" width="40" height="60" rx="20" fill="none" stroke="#c8d96f" strokeWidth="3" opacity="0.6"/>
    <line x1="100" y1="120" x2="100" y2="140" stroke="#c8d96f" strokeWidth="2" opacity="0.6"/>
    <line x1="70" y1="140" x2="130" y2="140" stroke="#c8d96f" strokeWidth="2" opacity="0.6"/>
    {/* Sound waves */}
    <path d="M140 80 Q160 80 160 100 Q160 120 140 120" stroke="#c8d96f" strokeWidth="2" fill="none" opacity="0.4"/>
    <path d="M60 80 Q40 80 40 100 Q40 120 60 120" stroke="#c8d96f" strokeWidth="2" fill="none" opacity="0.4"/>
  </svg>
);

export const AnalyticsSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Chart bars */}
    <rect x="40" y="140" width="25" height="40" fill="#c8d96f" opacity="0.6"/>
    <rect x="75" y="100" width="25" height="80" fill="#c8d96f" opacity="0.6"/>
    <rect x="110" y="80" width="25" height="100" fill="#c8d96f" opacity="0.6"/>
    <rect x="145" y="120" width="25" height="60" fill="#c8d96f" opacity="0.6"/>
    {/* Trend line */}
    <path d="M40 160 L75 120 L110 100 L145 140" stroke="#c8d96f" strokeWidth="3" fill="none" opacity="0.8"/>
  </svg>
);

export const BusinessDealSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Handshake */}
    <path d="M60 100 Q80 80 100 100" stroke="#c8d96f" strokeWidth="3" fill="none" opacity="0.6"/>
    <path d="M140 100 Q120 80 100 100" stroke="#c8d96f" strokeWidth="3" fill="none" opacity="0.6"/>
    {/* Document */}
    <rect x="80" y="120" width="40" height="50" rx="4" fill="none" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
    <line x1="85" y1="135" x2="115" y2="135" stroke="#c8d96f" strokeWidth="1" opacity="0.3"/>
    <line x1="85" y1="145" x2="115" y2="145" stroke="#c8d96f" strokeWidth="1" opacity="0.3"/>
  </svg>
);

export const MobileAppsSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Phone */}
    <rect x="70" y="40" width="60" height="120" rx="8" fill="none" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
    <rect x="80" y="60" width="40" height="60" rx="4" fill="#c8d96f" opacity="0.1"/>
    <circle cx="100" cy="130" r="5" fill="#c8d96f" opacity="0.3"/>
    {/* App icons */}
    <rect x="85" y="140" width="12" height="12" rx="2" fill="#c8d96f" opacity="0.2"/>
    <rect x="103" y="140" width="12" height="12" rx="2" fill="#c8d96f" opacity="0.2"/>
  </svg>
);

export const TranslatorSVG = () => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Globe */}
    <circle cx="100" cy="100" r="50" fill="none" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
    <path d="M50 100 Q100 80 150 100" stroke="#c8d96f" strokeWidth="2" opacity="0.3" fill="none"/>
    <path d="M50 100 Q100 120 150 100" stroke="#c8d96f" strokeWidth="2" opacity="0.3" fill="none"/>
    {/* Language indicators */}
    <text x="100" y="60" textAnchor="middle" fill="#c8d96f" fontSize="20" opacity="0.6">EN</text>
    <text x="100" y="150" textAnchor="middle" fill="#c8d96f" fontSize="20" opacity="0.6">UR</text>
  </svg>
);

// Empty State Illustrations
export const EmptyCartSVG = () => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Shopping cart outline */}
    <path d="M100 200 L350 200" stroke="#c8d96f" strokeWidth="3" opacity="0.3"/>
    <path d="M120 200 L140 120 L300 120 L320 200" stroke="#c8d96f" strokeWidth="2" fill="none" opacity="0.4"/>
    <circle cx="150" cy="250" r="20" fill="none" stroke="#c8d96f" strokeWidth="2" opacity="0.3"/>
    <circle cx="300" cy="250" r="20" fill="none" stroke="#c8d96f" strokeWidth="2" opacity="0.3"/>
    {/* Empty indicator */}
    <circle cx="200" cy="100" r="30" fill="none" stroke="#c8d96f" strokeWidth="2" opacity="0.2"/>
    <path d="M185 100 L215 100" stroke="#c8d96f" strokeWidth="2" opacity="0.3"/>
  </svg>
);

export const EmptySearchSVG = () => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Magnifying glass */}
    <circle cx="150" cy="120" r="40" fill="none" stroke="#c8d96f" strokeWidth="3" opacity="0.4"/>
    <line x1="180" y1="150" x2="220" y2="190" stroke="#c8d96f" strokeWidth="3" opacity="0.4"/>
    {/* Question mark */}
    <text x="200" y="200" textAnchor="middle" fill="#c8d96f" fontSize="60" opacity="0.3">?</text>
  </svg>
);

export const CreateListingSVG = () => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Document/Form */}
    <rect x="120" y="80" width="160" height="200" rx="8" fill="none" stroke="#c8d96f" strokeWidth="2" opacity="0.4"/>
    <line x1="140" y1="120" x2="260" y2="120" stroke="#c8d96f" strokeWidth="2" opacity="0.3"/>
    <line x1="140" y1="150" x2="260" y2="150" stroke="#c8d96f" strokeWidth="2" opacity="0.3"/>
    <line x1="140" y1="180" x2="240" y2="180" stroke="#c8d96f" strokeWidth="2" opacity="0.3"/>
    {/* Plus button */}
    <circle cx="300" cy="100" r="25" fill="#c8d96f" opacity="0.2" stroke="#c8d96f" strokeWidth="2"/>
    <line x1="300" y1="90" x2="300" y2="110" stroke="#c8d96f" strokeWidth="3"/>
    <line x1="290" x2="310" y2="100" stroke="#c8d96f" strokeWidth="3"/>
    <line x1="290" y1="100" x2="310" y2="100" stroke="#c8d96f" strokeWidth="3"/>
  </svg>
);

export const HelpSupportSVG = () => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Support chat bubble */}
    <path d="M100 100 L200 100 L220 140 L200 180 L100 180 Z" fill="none" stroke="#c8d96f" strokeWidth="2" opacity="0.4" rx="10"/>
    <circle cx="150" cy="140" r="8" fill="#c8d96f" opacity="0.3"/>
    <circle cx="170" cy="140" r="8" fill="#c8d96f" opacity="0.3"/>
    <circle cx="190" cy="140" r="8" fill="#c8d96f" opacity="0.3"/>
    {/* Question mark */}
    <circle cx="300" cy="140" r="40" fill="none" stroke="#c8d96f" strokeWidth="3" opacity="0.4"/>
    <text x="300" y="155" textAnchor="middle" fill="#c8d96f" fontSize="40" opacity="0.6">?</text>
  </svg>
);
