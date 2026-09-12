"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "samruddhisetu-theme";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    const shouldBeDark = saved === "dark";
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="fixed bottom-6 left-6 z-50 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full p-3 shadow-lg hover:scale-105 transition-all"
    >
      {isDark ? (
        <Sun size={20} className="text-orange-400" />
      ) : (
        <Moon size={20} className="text-[#1e3a8a]" />
      )}
    </button>
  );
}
