import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    LayoutDashboard, FolderOpen, ScanLine, CalendarClock,
    Bell, Settings, LifeBuoy, Search, Filter, Plus,
    ChevronRight, Sun, Moon, LogOut, TrendingUp, TrendingDown,
    CheckCircle2, Clock, XCircle, User, X, Menu,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import ScanTable from "../components/ScanTable";
import Skeleton from "../components/Skeleton";

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CFG = {
    Completed: {
        label: "Completed",
        icon: CheckCircle2,
        cls: "bg-primary-muted text-primary border-primary/20",
    },
    Scheduled: {
        label: "Scheduled",
        icon: Clock,
        cls: "bg-gray-500 text-white border-transparent shadow-sm", // R5 Requirement
    },
    Failed: {
        label: "Failed",
        icon: XCircle,
        cls: "bg-critical-bg text-critical border-critical/20",
    },
};

// ─── Severity dot badges ──────────────────────────────────────────────────────
const SEV = ["critical", "high", "medium", "low"];
const SEV_COLOR = {
    critical: "bg-critical",
    high: "bg-high",
    medium: "bg-medium",
    low: "bg-low",
};
const SEV_TEXT = {
    critical: "text-critical",
    high: "text-high",
    medium: "text-medium",
    low: "text-low",
};

// ─── Header Stats ─────────────────────────────────────────────────────────────
const STAT_CARDS = [
    { key: "critical", label: "Critical", change: "+2%", up: true, bg: "bg-critical-bg", border: "border-critical/20", text: "text-critical" },
    { key: "high", label: "High", change: "+5%", up: true, bg: "bg-high-bg", border: "border-high/20", text: "text-high" },
    { key: "medium", label: "Medium", change: "-1%", up: false, bg: "bg-medium-bg", border: "border-medium/20", text: "text-medium" },
    { key: "low", label: "Low", change: "-3%", up: false, bg: "bg-low-bg", border: "border-low/20", text: "text-low" },
];

function getTotals(scans) {
    return scans.reduce(
        (acc, s) => {
            acc.critical += s.vulnerabilities.critical;
            acc.high += s.vulnerabilities.high;
            acc.medium += s.vulnerabilities.medium;
            acc.low += s.vulnerabilities.low;
            return acc;
        },
        { critical: 0, high: 0, medium: 0, low: 0 }
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Dashboard({ scans, setScans }) {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [sideOpen, setSideOpen] = useState(false);
    const [scanModal, setScanModal] = useState(false);
    const [scanType, setScanType] = useState("Blackbox");
    const [scanTarget, setScanTarget] = useState("");
    const [scanName, setScanName] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const totals = getTotals(scans);

    const statuses = ["All", "Completed", "Scheduled", "Failed"];

    // Filter scans based on the selected status and search query to display in the data table
    const filtered = scans.filter((s) => {
        const matchStatus = filterType === "All" || s.status === filterType;
        const matchSearch =
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.type.toLowerCase().includes(searchQuery.toLowerCase());
        return matchStatus && matchSearch;
    });

    // Theme helpers
    const bg = isDark ? "bg-dark-bg" : "bg-light-bg";
    const nav = isDark ? "bg-dark-nav" : "bg-light-nav";
    const card = isDark ? "bg-dark-card" : "bg-light-card";
    const bdr = isDark ? "border-border-dark" : "border-border-light";
    const txt = isDark ? "text-white" : "text-gray-900";
    const muted = isDark ? "text-gray-400" : "text-gray-500";
    const inputCls = isDark
        ? "bg-dark-input border-border-dark text-white placeholder-gray-600 focus:border-primary"
        : "bg-light-input border-border-light text-gray-900 placeholder-gray-400 focus:border-primary";

    // ─── Toast / action handlers ──────────────────────────────────────────────
    const handleLaunchScan = () => {
        if (!scanTarget.trim()) {
            toast.error("Please enter a target URL.", {
                style: { background: "#1A1A1A", color: "#fff", border: "1px solid #E5393540" },
                iconTheme: { primary: "#E53935", secondary: "#fff" },
            });
            return;
        }
        if (!scanName.trim()) {
            toast.error("Please enter a scan name.", {
                style: { background: "#1A1A1A", color: "#fff", border: "1px solid #E5393540" },
                iconTheme: { primary: "#E53935", secondary: "#fff" },
            });
            return;
        }

        // Construct the new scan object and prepend it to the existing scans array
        const newScan = {
            id: `SCN-${String(scans.length + 1).padStart(3, "0")}`,
            name: scanName,
            type: scanType,
            status: "Running",
            progress: 12,
            lastScan: "Just now",
            target: scanTarget,
            initiatedBy: localStorage.getItem("userEmail") || "admin@fenrir.com",
            duration: null,
            vulnerabilities: { critical: 1, high: 1, medium: 0, low: 1 },
            findings: [
                { id: "f1", title: "SQL Injection", severity: "Critical", timestamp: new Date().toISOString(), endpoint: "/api/users?id=" },
                { id: "f2", title: "Missing rate limit", severity: "High", timestamp: new Date().toISOString(), endpoint: "/auth/login" },
                { id: "f3", title: "X-Frame-Options missing", severity: "Low", timestamp: new Date().toISOString(), endpoint: "/" }
            ],
        };

        setScans((prev) => [newScan, ...prev]);
        setScanModal(false);
        setScanTarget("");
        setScanName("");
        toast.success(`Initializing ${scanType} scan for ${scanTarget}…`, {
            icon: "🚀",
            style: { background: "#0CC8A820", color: "#0CC8A8", border: "1px solid #0CC8A840" },
            duration: 4000,
        });
    };

    const handleExportReport = () => {
        const triggerDownload = () => {
            const pdf = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R>>endobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF";
            const blob = new Blob([pdf], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "Security_Report.pdf";
            document.body.appendChild(a); a.click();
            document.body.removeChild(a); URL.revokeObjectURL(url);
        };
        toast.promise(
            new Promise((resolve) => setTimeout(() => { triggerDownload(); resolve(); }, 2000)),
            {
                loading: "Generating PDF report…",
                success: "Security_Report.pdf downloaded!",
                error: "Export failed. Please retry.",
            },
            {
                loading: { style: { background: "#1A1A1A", color: "#ccc", border: "1px solid #2A2A2A" } },
                success: { icon: "📥", style: { background: "#0CC8A820", color: "#0CC8A8", border: "1px solid #0CC8A840" } },
                error: { style: { background: "#E5393520", color: "#E53935", border: "1px solid #E5393540" } },
            }
        );
    };



    return (
        <div className={`min-h-screen flex ${bg}`}>

            {/* ── New Scan Modal ──────────────────────────────────────────── */}
            {scanModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setScanModal(false)} />

                    {/* Modal card */}
                    <div className={`relative z-10 w-full max-w-md rounded-2xl border p-6 shadow-2xl animate-fade-in ${card} ${bdr}`}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h2 className={`text-sm font-bold ${txt}`}>Launch New Scan</h2>
                                <p className={`text-xs mt-0.5 ${muted}`}>Configure and start a new vulnerability scan</p>
                            </div>
                            <button onClick={() => setScanModal(false)} className={`p-1.5 rounded-lg hover:bg-primary-muted transition-colors ${muted}`}>
                                <X size={15} />
                            </button>
                        </div>

                        {/* Target input */}
                        <div className="mb-4">
                            <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Target URL</label>
                            <input
                                type="text"
                                value={scanTarget}
                                onChange={(e) => setScanTarget(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLaunchScan()}
                                placeholder="https://api.example.com"
                                className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none border transition-colors ${inputCls}`}
                                autoFocus
                            />
                        </div>

                        {/* Scan Name input */}
                        <div className="mb-4">
                            <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Scan Name</label>
                            <input
                                type="text"
                                value={scanName}
                                onChange={(e) => setScanName(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleLaunchScan()}
                                placeholder="e.g. My Website Target"
                                className={`w-full px-3 py-2.5 rounded-lg text-sm outline-none border transition-colors ${inputCls}`}
                            />
                        </div>

                        {/* Scan type */}
                        <div className="mb-6">
                            <label className={`block text-xs font-medium mb-2 ${muted}`}>Scan Type</label>
                            <div className="flex gap-2">
                                {["Blackbox", "Greybox"].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setScanType(t)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all
                                            ${scanType === t
                                                ? "bg-primary text-white border-primary shadow-teal-glow-sm"
                                                : `${card} ${bdr} ${muted} hover:border-primary/40`
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setScanModal(false)}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-colors ${card} ${bdr} ${muted} hover:text-primary`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLaunchScan}
                                className="flex-1 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-all shadow-teal-glow-sm"
                            >
                                🚀 Launch Scan
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Desktop Sidebar ──────────────────────────────────────── */}
            <aside className={`hidden md:flex w-56 flex-shrink-0 flex-col border-r ${bdr} sticky top-0 h-screen`}>
                <Sidebar activeLabel="Dashboard" />
            </aside>

            {/* ── Mobile Sidebar Drawer ────────────────────────────────── */}
            {sideOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="w-56 flex flex-col h-full shadow-2xl">
                        <Sidebar activeLabel="Dashboard" />
                    </div>
                    <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSideOpen(false)} />
                </div>
            )}

            {/* ── Main Content ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Topbar/Header extracted for modularity */}
                <Header
                    setSideOpen={setSideOpen}
                    totalScans={scans.length}
                    onExport={handleExportReport}
                    onNewScan={() => setScanModal(true)}
                />

                <main className="flex-1 p-5 space-y-5 animate-fade-in">

                    {/* ── Stat Cards ─────────────────────────────────────────── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {STAT_CARDS.map((s) => (
                            <div key={s.key} className={`rounded-xl border p-4 ${card} ${bdr} transition-shadow hover:shadow-card-dark`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={`text-xs font-medium uppercase tracking-wider ${muted}`}>{s.label}</span>
                                    {!isLoading && (
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5
                    ${s.up ? "text-critical bg-critical-bg" : "text-low bg-low-bg"}`}>
                                            {s.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                                            {s.change}
                                        </span>
                                    )}
                                </div>
                                <div className={`flex items-end gap-2`}>
                                    {isLoading ? (
                                        <Skeleton className="h-9 w-16 mb-1 rounded-lg" />
                                    ) : (
                                        <span className={`text-3xl font-extrabold ${s.text}`}>{totals[s.key]}</span>
                                    )}
                                </div>
                                <div className={`mt-2 h-1.5 rounded-full ${isLoading ? (isDark ? 'bg-[#2A2A2A]' : 'bg-[#E0E0E0]') : s.bg} border ${s.border} overflow-hidden`}>
                                    {!isLoading && (
                                        <div className={`h-full rounded-full ${SEV_COLOR[s.key]}`}
                                            style={{ width: `${Math.min((totals[s.key] / 40) * 100, 100)}%` }} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Toolbar ────────────────────────────────────────────── */}
                    <div className={`flex flex-col sm:flex-row gap-3 items-stretch sm:items-center`}>
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${muted}`} />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search scans by name or target…"
                                className={`w-full pl-8 pr-4 py-2 rounded-lg text-sm border outline-none transition-colors ${inputCls}`}
                            />
                        </div>

                        {/* Status filter pills */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            <button className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border transition-colors ${card} ${bdr} ${muted} hover:text-primary hover:border-primary/40`}>
                                <Filter size={12} /> Filter
                            </button>
                            {statuses.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilterType(s)}
                                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all
                    ${filterType === s
                                            ? "bg-primary text-white border-primary shadow-teal-glow-sm"
                                            : `${card} ${bdr} ${muted} hover:text-primary hover:border-primary/40`
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Scan Table ─────────────────────────────────────────── */}
                    <ScanTable scans={filtered} totalCount={scans.length} isLoading={isLoading} />
                </main>
            </div>
        </div>
    );
}
