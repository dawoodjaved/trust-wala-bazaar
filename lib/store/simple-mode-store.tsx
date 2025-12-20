"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SimpleModeContextType {
  isSimpleMode: boolean;
  toggleSimpleMode: () => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const SimpleModeContext = createContext<SimpleModeContextType | undefined>(
  undefined
);

export function SimpleModeProvider({ children }: { children: ReactNode }) {
  const [isSimpleMode, setIsSimpleMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem("simpleMode");
    const savedFontSize = localStorage.getItem("fontSize");
    const savedContrast = localStorage.getItem("highContrast");

    if (saved) setIsSimpleMode(JSON.parse(saved));
    if (savedFontSize) setFontSize(Number(savedFontSize));
    if (savedContrast) setHighContrast(JSON.parse(savedContrast));
  }, []);

  useEffect(() => {
    // Apply simple mode class to body
    if (isSimpleMode) {
      document.body.classList.add("simple-mode");
    } else {
      document.body.classList.remove("simple-mode");
    }

    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}px`;

    // Apply high contrast
    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }

    // Save to localStorage
    localStorage.setItem("simpleMode", JSON.stringify(isSimpleMode));
    localStorage.setItem("fontSize", String(fontSize));
    localStorage.setItem("highContrast", JSON.stringify(highContrast));
  }, [isSimpleMode, fontSize, highContrast]);

  const toggleSimpleMode = () => {
    setIsSimpleMode((prev) => !prev);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return (
    <SimpleModeContext.Provider
      value={{
        isSimpleMode,
        toggleSimpleMode,
        fontSize,
        setFontSize,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </SimpleModeContext.Provider>
  );
}

export function useSimpleMode() {
  const context = useContext(SimpleModeContext);
  if (context === undefined) {
    throw new Error("useSimpleMode must be used within SimpleModeProvider");
  }
  return context;
}

