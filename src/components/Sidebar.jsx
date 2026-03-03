import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, FolderOpen, ScanLine, CalendarClock,
    Bell, Settings, LifeBuoy, Sun, Moon, LogOut, User,
    ShieldAlert, CheckCircle2, AlertTriangle, X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";

// ─── Nav links ────────────────────────────────────────────────────────────────
//  path: string  → real NavLink
//  path: null    → button that fires a toast
const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FolderOpen, label: "Projects", path: "/projects" },
    { icon: ScanLine, label: "Scans", path: "/scans" },
    { icon: CalendarClock, label: "Schedule", path: "/schedule" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LifeBuoy, label: "Support", path: "/support" },
];

// ─── Mock notifications ───────────────────────────────────────────────────────
const MOCK_NOTIFS = [
    {
        id: 1, icon: CheckCircle2, iconCls: "text-primary", unread: true,
        title: "Scan #SCN-001 Completed",
        desc: "Fenrir API Gateway — 19 findings detected.",
        time: "2m ago",
    },
    {
        id: 2, icon: ShieldAlert, iconCls: "text-critical", unread: true,
        title: "Critical Vulnerability Found",
        desc: "SQL Injection in /v1/users?id= — immediate action required.",
        time: "14m ago",
    },
    {
        id: 3, icon: AlertTriangle, iconCls: "text-high", unread: false,
        title: "Scan #SCN-005 In Progress",
        desc: "Mobile API v2 — 62% complete, 3 findings so far.",
        time: "32m ago",
    },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Sidebar({ activeLabel }) {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const [notifOpen, setNotifOpen] = useState(false);
    const [dismissed, setDismissed] = useState([]);
    const notifRef = useRef(null);
    const userEmail = localStorage.getItem("userEmail") || "admin@fenrir.com";

    const unread = MOCK_NOTIFS.filter((n) => n.unread && !dismissed.includes(n.id)).length;

    // Close notification dropdown on outside click
    useEffect(() => {
        const fn = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target))
                setNotifOpen(false);
        };
        document.addEventListener("mousedown", fn);
        return () => document.removeEventListener("mousedown", fn);
    }, []);

    // ── Theme tokens ──────────────────────────────────────────────
    const navBg = isDark ? "bg-[#141414]" : "bg-[#FAFAFA]";
    const bdr = isDark ? "border-[#2A2A2A]" : "border-[#E0E0E0]";
    const txt = isDark ? "text-white" : "text-gray-900";
    const muted = isDark ? "text-gray-400" : "text-gray-500";
    const cardBg = isDark ? "bg-[#1A1A1A] border-[#2A2A2A]" : "bg-white border-[#E0E0E0]";

    // ── Shared active / inactive class builders
    const activeItemCls = "bg-[#0CC8A8]/10 text-[#0CC8A8] font-semibold";
    const inactiveItemCls = `${muted} hover:bg-[#0CC8A8]/5 hover:text-[#0CC8A8]`;
    const baseItemCls = "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-150 cursor-pointer";

    // ── Toast for stub pages
    const stubToast = (label) =>
        toast(`${label} — coming soon!`, {
            icon: "🔧",
            style: { background: isDark ? "#1A1A1A" : "#fff", color: isDark ? "#fff" : "#111", border: "1px solid #2A2A2A" },
        });

    return (
        <div className={`flex flex-col h-full border-r ${navBg} ${bdr}`}>

            {/* ── Logo (clickable → /dashboard) ───────────────────── */}
            <button
                onClick={() => navigate("/dashboard")}
                className={`flex items-center gap-3 px-6 py-6 border-b ${bdr} hover:opacity-80 transition-opacity text-left`}
            >
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-teal-glow-sm flex-shrink-0">
                    <ScanLine size={15} className="text-white" />
                </div>
                <span className={`font-bold text-sm tracking-tight ${txt}`}>Fenrir Security</span>
            </button>

            {/* ── Nav links ────────────────────────────────────────── */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">

                {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
                    <NavLink
                        key={label}
                        to={path}
                        className={({ isActive }) => {
                            let isMatch = isActive;
                            // Dashboard & placeholder matches
                            if (activeLabel) {
                                isMatch = (label === activeLabel);
                            } else if (path === "/dashboard" && isActive) {
                                isMatch = true;
                            }
                            return `${baseItemCls} ${isMatch ? activeItemCls : inactiveItemCls} cursor-pointer`;
                        }}
                    >
                        <Icon size={16} className="flex-shrink-0" />
                        {label}
                    </NavLink>
                ))}

                {/* ── Notifications (special — dropdown) ─────────── */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setNotifOpen((o) => !o);
                        }}
                        className={`${baseItemCls} ${"Notifications" === activeLabel || notifOpen ? activeItemCls : inactiveItemCls}`}
                    >
                        <Bell size={16} className="flex-shrink-0" />
                        <span>Notifications</span>
                        {unread > 0 && (
                            <span className="ml-auto bg-critical text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                {unread}
                            </span>
                        )}
                    </button>

                    {notifOpen && (
                        <div className={`absolute left-full top-0 ml-2 w-[280px] rounded-xl border shadow-2xl z-50 overflow-hidden animate-fade-in ${cardBg}`}>
                            {/* Header */}
                            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${bdr}`}>
                                <span className={`text-xs font-bold tracking-wide ${txt}`}>Notifications</span>
                                <button onClick={() => setNotifOpen(false)} className={`p-1 rounded hover:text-critical ${muted}`}>
                                    <X size={12} />
                                </button>
                            </div>

                            {/* List */}
                            <div className="max-h-64 overflow-y-auto">
                                {MOCK_NOTIFS.filter((n) => !dismissed.includes(n.id)).map((n) => {
                                    const NIcon = n.icon;
                                    return (
                                        <div
                                            key={n.id}
                                            className={`flex gap-3 px-4 py-3 transition-colors
                                                ${n.unread ? (isDark ? "bg-primary/[0.04]" : "bg-primary/[0.03]") : ""}
                                                ${isDark ? "hover:bg-white/[0.03]" : "hover:bg-gray-50"}`}
                                        >
                                            <NIcon size={14} className={`${n.iconCls} flex-shrink-0 mt-0.5`} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-1">
                                                    <p className={`text-xs font-semibold leading-snug ${txt}`}>{n.title}</p>
                                                    <button
                                                        onClick={() => setDismissed((d) => [...d, n.id])}
                                                        className={`flex-shrink-0 ${muted} hover:text-critical`}
                                                    >
                                                        <X size={10} />
                                                    </button>
                                                </div>
                                                <p className={`text-[11px] mt-0.5 leading-relaxed ${muted}`}>{n.desc}</p>
                                                <p className="text-[10px] text-primary mt-0.5">{n.time}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                                {MOCK_NOTIFS.every((n) => dismissed.includes(n.id)) && (
                                    <div className={`py-8 text-center text-xs ${muted}`}>All caught up! 🎉</div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className={`px-4 py-2 border-t ${bdr} text-center`}>
                                <button
                                    onClick={() => setDismissed(MOCK_NOTIFS.map((n) => n.id))}
                                    className="text-[11px] text-primary hover:underline"
                                >
                                    Mark all as read
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* ── Theme toggle ─────────────────────────────────────── */}
            <div className={`px-2 py-4 border-t ${bdr}`}>
                <button
                    onClick={toggleTheme}
                    className={`${baseItemCls} ${inactiveItemCls}`}
                >
                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    {isDark ? "Light Mode" : "Dark Mode"}
                </button>
            </div>

            {/* ── User profile ─────────────────────────────────────── */}
            <div className={`px-6 py-5 border-t ${bdr}`}>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className={`text-xs font-semibold truncate ${txt}`}>Admin User</p>
                        <p className={`text-[11px] truncate ${muted}`}>{userEmail}</p>
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem("isLoggedIn");
                            localStorage.removeItem("userEmail");
                            navigate("/login");
                        }}
                        title="Log out"
                        className={`${muted} hover:text-critical transition-colors`}
                    >
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
