import { Plus, Menu } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Header({ setSideOpen, totalScans, onExport, onNewScan }) {
    const { isDark } = useTheme();
    const nav = isDark ? "bg-dark-nav" : "bg-light-nav";
    const bdr = isDark ? "border-border-dark" : "border-border-light";
    const txt = isDark ? "text-white" : "text-gray-900";
    const muted = isDark ? "text-gray-400" : "text-gray-500";
    const card = isDark ? "bg-dark-card" : "bg-light-card";

    return (
        <header className={`flex items-center justify-between px-5 py-4 border-b ${bdr} ${nav} sticky top-0 z-30`}>
            <div className="flex items-center gap-3">
                {/* Mobile menu toggle */}
                <button
                    onClick={() => setSideOpen(true)}
                    className={`md:hidden p-2 rounded-lg border ${bdr} ${card} ${muted}`}
                >
                    <Menu size={15} />
                </button>
                <div>
                    <h1 className={`text-base font-bold ${txt}`}>Dashboard Overview</h1>
                    <p className={`text-xs ${muted} hidden sm:block`}>
                        {totalScans} services · Last updated just now
                    </p>
                </div>
            </div>

            <button
                onClick={onExport}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all ${card} ${bdr} ${muted} hover:text-primary hover:border-primary/40`}
            >
                Export Report
            </button>
            <button
                onClick={onNewScan}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all shadow-teal-glow-sm"
            >
                <Plus size={13} /> New Scan
            </button>
        </header>
    );
}
