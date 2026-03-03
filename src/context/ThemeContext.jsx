import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const ThemeContext = createContext(null);
const STORAGE_KEY = "fenrir-theme";

function readStoredTheme() {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v === "dark" || v === "light") return v;
    } catch { }
    return "dark";
}

function syncDOM(mode) {
    document.documentElement.classList.toggle("dark", mode === "dark");
    try { localStorage.setItem(STORAGE_KEY, mode); } catch { }
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(readStoredTheme);

    useEffect(() => { syncDOM(theme); }, [theme]);

    const toggleTheme = useCallback(
        () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
        []
    );

    const value = useMemo(
        () => ({ theme, isDark: theme === "dark", toggleTheme }),
        [theme, toggleTheme]
    );

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be inside <ThemeProvider>");
    return ctx;
}
