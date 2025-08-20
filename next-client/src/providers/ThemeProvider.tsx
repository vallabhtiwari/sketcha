"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Theme, ThemeContextProps } from "@/types";

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("dark");
  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
      setTheme(theme as Theme);
    } else {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
