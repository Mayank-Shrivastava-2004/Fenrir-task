import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertTriangle, LayoutDashboard, StopCircle, Menu } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import Sidebar from "../components/Sidebar";
import Skeleton from "../components/Skeleton";

// ─── Step Tracker config ─────────────────────────────────────────────────────
const STEPS = ["Spidering", "Mapping", "Testing", "Validating", "Reporting"];

function getActiveStep(progress) {
    if (progress === 0) return 0;
    if (progress <= 20) return 0;
    if (progress <= 40) return 1;
    if (progress <= 65) return 2;
    if (progress <= 85) return 3;
    return 4;
}

// ─── Circular Progress SVG ────────────────────────────────────────────────────
function CircularProgress({ value = 0, size = 100, stroke = 8 }) {
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (value / 100) * circ;

    return (
        <svg width={size} height={size} className="-rotate-90" aria-label={`${value}% progress`}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="rgba(12,200,168,0.12)" strokeWidth={stroke} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke="#0CC8A8" strokeWidth={stroke}
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 1s ease" }}
            />
        </svg>
    );
}

// ─── Severity badge ───────────────────────────────────────────────────────────
const SEV_CFG = {
    Critical: { cls: "bg-critical-bg text-critical border-critical/25", dot: "bg-critical" },
    High: { cls: "bg-high-bg     text-high     border-high/25", dot: "bg-high" },
    Medium: { cls: "bg-medium-bg   text-medium   border-medium/25", dot: "bg-medium" },
    Low: { cls: "bg-low-bg      text-low      border-low/25", dot: "bg-low" },
    Info: { cls: "bg-white/5     text-gray-400 border-white/10", dot: "bg-gray-400" },
};

// ─── Generate terminal log lines ──────────────────────────────────────────────
function buildLogs(scan) {
    if (!scan) return [];                                         // ← null guard
    const vuln = scan.vulnerabilities ?? {};
    const crit = vuln.critical ?? 0;
    const high = vuln.high ?? 0;
    const med = vuln.medium ?? 0;
    const low = vuln.low ?? 0;

    const base = [
        { t: "09:00:42", msg: `Initialising ${scan.type ?? "unknown"} scan engine…`, color: "text-gray-400" },
        { t: "09:00:44", msg: `Target confirmed online: ${scan.target ?? "N/A"}`, color: "text-primary" },
        { t: "09:00:46", msg: "Starting DNS resolution and port enumeration…", color: "text-gray-400" },
        { t: "09:00:50", msg: "HTTP/HTTPS services discovered on ports 80, 443.", color: "text-primary" },
        { t: "09:01:00", msg: `Good! Target is online → ${scan.target ?? "N/A"}`, color: "text-primary" },
        { t: "09:01:05", msg: "Spidering phase started — crawling all endpoints…", color: "text-gray-400" },
        { t: "09:01:22", msg: "Discovered 142 unique endpoints.", color: "text-gray-300" },
        { t: "09:02:10", msg: "Mapping phase — building attack surface graph…", color: "text-gray-400" },
        { t: "09:02:45", msg: "Attack surface: 38 forms, 21 API paths, 7 auth.", color: "text-gray-300" },
        { t: "09:03:00", msg: "Running OWASP Top 10 test suite…", color: "text-gray-400" },
    ];

    if (crit > 0) base.push({ t: "09:03:28", msg: "[CRITICAL] SQL Injection → /api/users?id= (status 500)", color: "text-critical" });
    if (high > 0) base.push({ t: "09:04:10", msg: "[HIGH] Missing rate limit on /auth/login (status 200)", color: "text-high" });
    if (med > 0) base.push({ t: "09:05:00", msg: "[MED]  TLS 1.0 cipher suites still accepted", color: "text-medium" });
    if (low > 0) base.push({ t: "09:05:40", msg: "[LOW]  X-Frame-Options header not set on / (status 200)", color: "text-low" });

    if (scan.status === "Failed") {
        base.push({ t: "09:06:00", msg: `[ERROR] Connection timeout at ${scan.progress ?? 0}% — aborting.`, color: "text-critical" });
    } else if (scan.status === "Completed") {
        base.push({ t: "09:06:15", msg: `Validation phase complete. Duration: ${scan.duration ?? "N/A"}.`, color: "text-gray-400" });
        base.push({ t: "09:06:16", msg: "Generating HTML + JSON report…", color: "text-gray-400" });
        base.push({ t: "09:06:20", msg: `✓ Scan COMPLETED. Total findings: ${crit + high + med + low}.`, color: "text-primary" });
    } else {
        base.push({ t: "09:06:05", msg: "Scan scheduled — waiting for dispatcher…", color: "text-status-scheduled" });
    }

    return base;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ScanDetail({ scans }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const termRef = useRef(null);

    const scan = scans.find((s) => s.id === id);
    const [visibleLogs, setVisibleLogs] = useState([]);
    const [logQueue, setLogQueue] = useState([]);
    const [typingLog, setTypingLog] = useState(null);
    const [typedText, setTypedText] = useState("");
    const [sideOpen, setSideOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleStopScan = () => {
        setIsScanning(false);
        toast.error("Scan Terminated", {
            style: { background: "#E5393520", color: "#E53935", border: "1px solid #E5393550" },
            duration: 4000,
        });
    };

    const handleRestartScan = () => {
        setIsScanning(true);
        setLogQueue(buildLogs(scan));
        setVisibleLogs([]);
        setTypingLog(null);
        setTypedText("");
        toast.success("Scan Restarted", {
            style: { background: "#0CC8A820", color: "#0CC8A8", border: "1px solid #0CC8A840" },
            duration: 3000,
        });
    };

    // Load initial logs into queue
    useEffect(() => {
        if (!scan) return;
        setLogQueue(buildLogs(scan));
        setVisibleLogs([]);
        setTypingLog(null);
        setTypedText("");
    }, [scan?.id]);

    // Pull next log from queue to type
    useEffect(() => {
        if (!typingLog && logQueue.length > 0 && isScanning) {
            setTypingLog(logQueue[0]);
            setLogQueue(q => q.slice(1));
            setTypedText("");
        }
    }, [typingLog, logQueue, isScanning]);

    // Typewriter effect for current log
    useEffect(() => {
        if (typingLog && isScanning) {
            const t = setInterval(() => {
                setTypedText(prev => {
                    const nextLen = prev.length + 1;
                    if (nextLen >= typingLog.msg.length) {
                        clearInterval(t);
                        setTimeout(() => {
                            setVisibleLogs(v => [...v, typingLog]);
                            setTypingLog(null);
                        }, 80); // Pause before next line
                        return typingLog.msg;
                    }
                    return typingLog.msg.slice(0, nextLen);
                });
            }, 15); // Typing speed
            return () => clearInterval(t);
        }
    }, [typingLog, isScanning]);

    // Auto-scroll terminal
    useEffect(() => {
        if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
    }, [visibleLogs, typedText]);

    // Highlight keywords in Teal
    const formatLogMsg = (text) => {
        const regex = /(\/[a-zA-Z0-9_?=-]+|HTTP\/HTTPS|[0-9]{2,}|SQL Injection|OWASP)/g;
        return text.split(regex).map((part, i) => {
            if (regex.test(part)) {
                return <span key={i} className="text-[#0CC8A8]">{part}</span>;
            }
            return <span key={i}>{part}</span>;
        });
    };

    // Theme tokens
    const bg = isDark ? "bg-dark-bg" : "bg-light-bg";
    const nav = isDark ? "bg-dark-nav" : "bg-light-nav";
    const card = isDark ? "bg-dark-card" : "bg-light-card";
    const bdr = isDark ? "border-border-dark" : "border-border-light";
    const txt = isDark ? "text-white" : "text-gray-900";
    const muted = isDark ? "text-gray-400" : "text-gray-500";

    // ── 404 state ───────────────────────────────────────────────────────────────
    if (!scan) {
        return (
            <div className={`min-h-screen flex items-center justify-center flex-col gap-4 ${bg}`}>
                <AlertTriangle size={36} className="text-high" />
                <p className={`text-sm ${muted}`}>Scan <strong>{id}</strong> not found.</p>
                <button onClick={() => navigate("/dashboard")}
                    className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ArrowLeft size={12} /> Back to Dashboard
                </button>
            </div>
        );
    }

    const activeStep = getActiveStep(scan?.progress ?? 0);
    const vulnerabilities = scan?.vulnerabilities ?? { critical: 0, high: 0, medium: 0, low: 0 };
    const findings = scan?.findings ?? [];
    const totalFindings = Object.values(vulnerabilities).reduce((a, b) => a + b, 0);

    const META = [
        { label: "Scan Type", val: scan?.type ?? "—" },
        { label: "Target", val: scan?.target ?? "—" },
        { label: "Started At", val: scan?.lastScan ?? "—" },
        { label: "Initiated By", val: scan?.initiatedBy ?? "—" },
        { label: "Duration", val: scan?.duration ?? "—" },
        { label: "Status", val: scan?.status ?? "—" },
    ];

    return (
        <div className={`min-h-screen flex ${bg}`}>

            {/* ── Desktop Sidebar ────────────────────────────────────── */}
            <aside className="hidden md:flex w-56 flex-shrink-0 flex-col sticky top-0 h-screen">
                <Sidebar activeLabel="Scans" />
            </aside>

            {/* ── Mobile Sidebar Drawer ──────────────────────────────── */}
            {sideOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div className="w-56 flex flex-col h-full">
                        <Sidebar activeLabel="Scans" />
                    </div>
                    <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setSideOpen(false)} />
                </div>
            )}

            {/* ── Main content ───────────────────────────────────────── */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Topbar */}
                <header className={`sticky top-0 z-30 flex items-center gap-3 px-5 py-4 border-b ${nav} ${bdr}`}>
                    <button onClick={() => setSideOpen(true)}
                        className={`md:hidden p-2 rounded-lg border ${bdr} ${card} ${muted}`}>
                        <Menu size={15} />
                    </button>
                    <button onClick={() => navigate("/dashboard")}
                        className={`p-1.5 rounded-lg border transition-colors ${card} ${bdr} ${muted} hover:text-primary`}>
                        <ArrowLeft size={15} />
                    </button>
                    <div className="min-w-0">
                        <h1 className={`text-sm font-bold ${txt} truncate`}>{scan.name}</h1>
                        <p className={`text-xs ${muted} truncate`}>{scan.target}</p>
                    </div>

                    <div className="ml-auto flex items-center gap-3 flex-shrink-0">
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium mr-3
                ${!isScanning
                                ? "bg-red-500/10 text-red-500 border-red-500/20"
                                : scan.status === "Completed" ? "bg-primary-muted text-primary border-primary/20"
                                    : scan.status === "Failed" ? "bg-critical-bg text-critical border-critical/20"
                                        : scan.status === "Scheduled" ? "bg-gray-500 text-white border-transparent shadow-sm"
                                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                            {!isScanning ? "Stopped" : scan.status}
                        </span>

                        {/* Stop ↔ Restart toggle — only for in-progress scans */}
                        {scan.status !== "Completed" && scan.status !== "Failed" && (
                            isScanning ? (
                                <button
                                    onClick={handleStopScan}
                                    title="Terminate this scan"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500 text-red-500 bg-red-500/10 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all flex-shrink-0"
                                >
                                    <StopCircle size={12} /> Stop Scan
                                </button>
                            ) : (
                                <button
                                    onClick={handleRestartScan}
                                    title="Restart this scan"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/50 bg-primary-muted text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all shadow-teal-glow-sm flex-shrink-0"
                                >
                                    🔄 Restart Scan
                                </button>
                            )
                        )}
                    </div>
                </header>

                <main className="flex-1 p-5 space-y-4 animate-fade-in overflow-auto">

                    {/* ── 1. Progress + Step Tracker ──────────────────────── */}
                    <div className={`rounded-xl border p-5 ${card} ${bdr}`}>
                        <div className="flex flex-col sm:flex-row items-center gap-6">

                            {/* Circular progress */}
                            <div className="relative flex-shrink-0">
                                {isLoading ? (
                                    <Skeleton variant="circle" className="w-[96px] h-[96px]" />
                                ) : (
                                    <>
                                        <CircularProgress value={scan.progress} size={96} stroke={8} />
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className={`text-lg font-extrabold ${txt}`}>{scan.progress}%</span>
                                            <span className={`text-[10px] ${muted}`}>
                                                {scan.status === "Completed" ? "Done" :
                                                    scan.status === "Failed" ? "Failed" : "Progress"}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Step tracker */}
                            <div className="flex-1 w-full">
                                <p className={`text-xs font-medium mb-3 ${muted}`}>Scan Pipeline</p>
                                <div className="flex items-center gap-0">
                                    {STEPS.map((step, i) => {
                                        const isPast = i < activeStep;
                                        const isCurrent = i === activeStep && scan.status !== "Completed";
                                        const isDone = scan.status === "Completed" || i < activeStep;

                                        return (
                                            <div key={step} className="flex items-center flex-1 min-w-0">
                                                {/* Step node */}
                                                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                                                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all
                            ${isDone || isCurrent
                                                            ? "border-primary bg-primary-muted text-primary shadow-teal-glow-sm"
                                                            : `border-border-dark ${muted} ${isDark ? "bg-dark-input" : "bg-light-input"}`
                                                        }
                            ${isCurrent && isScanning ? "animate-pulse-ring" : ""}`}
                                                    >
                                                        {isDone && !isCurrent ? "✓" : i + 1}
                                                    </div>
                                                    <span className={`text-[10px] font-medium whitespace-nowrap
                            ${isCurrent ? "text-primary" : isDone ? "text-primary/70" : muted}`}>
                                                        {step}
                                                    </span>
                                                </div>
                                                {/* Connector */}
                                                {i < STEPS.length - 1 && (
                                                    <div className={`flex-1 h-0.5 mx-1 rounded transition-colors
                            ${isPast || isDone ? "bg-primary/40" : isDark ? "bg-border-dark" : "bg-border-light"}`}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── 2. Metadata Row ─────────────────────────────────── */}
                    <div className={`rounded-xl border p-4 ${card} ${bdr}`}>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {META.map((m) => (
                                <div key={m.label} className="min-w-0">
                                    <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${muted}`}>{m.label}</p>
                                    {isLoading ? (
                                        <Skeleton className="h-4 w-3/4 rounded-md" />
                                    ) : (
                                        <p className={`text-xs font-medium truncate ${txt}`}>{m.val}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── 3. Main Split Panel ─────────────────────────────── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                        {/* Left: Live Scan Console */}
                        <div className={`rounded-xl border overflow-hidden flex flex-col ${card} ${bdr}`}>
                            {/* Console tab bar */}
                            <div className={`flex items-center gap-0 border-b ${bdr} ${isDark ? "bg-[#0F0F0F]" : "bg-gray-100"}`}>
                                <button className="flex items-center gap-1.5 px-4 py-2.5 border-b-2 border-primary text-primary text-xs font-medium">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    Activity Log
                                </button>
                                <div className="ml-auto flex items-center gap-1.5 px-3">
                                    <span className="w-2.5 h-2.5 rounded-full bg-critical opacity-80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-medium opacity-80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-low opacity-80" />
                                </div>
                            </div>

                            {/* Terminal output */}
                            <div
                                ref={termRef}
                                className={`flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 h-72 scroll-smooth ${isDark ? "bg-[#0A0A0A]" : "bg-gray-900"}`}
                            >
                                {visibleLogs.map((log, i) => (
                                    <div key={i} className="flex gap-2 leading-relaxed">
                                        <span className="text-gray-500 flex-shrink-0 select-none">[{log.t}]</span>
                                        <span className={log.color}>{formatLogMsg(log.msg)}</span>
                                    </div>
                                ))}
                                {typingLog && (
                                    <div className="flex gap-2 leading-relaxed">
                                        <span className="text-gray-500 flex-shrink-0 select-none">[{typingLog.t}]</span>
                                        <span className={typingLog.color}>{formatLogMsg(typedText)}</span>
                                    </div>
                                )}
                                {/* Blinking cursor */}
                                <div className="flex gap-2 items-center mt-1">
                                    <span className="text-gray-600 select-none">❯</span>
                                    <span className="inline-block w-2 text-[#0CC8A8] font-bold opacity-80 animate-pulse">_</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Finding Log */}
                        <div className={`rounded-xl border overflow-hidden flex flex-col ${card} ${bdr}`}>
                            {/* Header */}
                            <div className={`flex items-center justify-between px-4 py-3 border-b ${bdr}`}>
                                <span className={`text-xs font-semibold ${txt}`}>Finding Log</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-muted text-primary border border-primary/20 font-medium">
                                    {totalFindings} found
                                </span>
                            </div>

                            {/* Findings list */}
                            <div className="flex-1 overflow-y-auto h-72 divide-y divide-border-dark p-2">
                                {isLoading ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="px-2 py-3">
                                            <div className="flex justify-between mb-2">
                                                <Skeleton className="h-4 w-16" />
                                                <Skeleton className="h-3 w-10" />
                                            </div>
                                            <Skeleton className="h-3 w-3/4 mb-1.5" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    ))
                                ) : findings.length === 0 ? (
                                    <div className={`py-14 text-center text-xs ${muted}`}>
                                        No findings yet for this scan.
                                    </div>
                                ) : (
                                    findings.map((f) => {
                                        if (!f) return null; // skip corrupt entries
                                        const s = SEV_CFG[f.severity] ?? SEV_CFG.Info;
                                        return (
                                            <div key={f.id}
                                                className={`px-3 py-3 rounded-lg transition-colors ${isDark ? "hover:bg-white/[0.025]" : "hover:bg-gray-50"}`}>
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded border font-semibold ${s.cls}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                                        {f.severity}
                                                    </span>
                                                    <span className={`text-[10px] ${muted}`}>
                                                        {new Date(f.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                </div>
                                                <p className={`text-xs font-semibold leading-snug ${txt}`}>{f.title}</p>
                                                <p className="text-xs text-primary font-mono mt-0.5 truncate">{f.endpoint}</p>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── 4. Bottom Status Bar ────────────────────────────── */}
                    <div className={`rounded-xl border px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 ${card} ${bdr}`}>
                        {/* Agent stats */}
                        <div className="flex items-center gap-5">
                            {[
                                { label: "Sub-Agents", val: 0 },
                                { label: "Parallel Executions", val: scan?.status === "Completed" ? 2 : 0 },
                            ].map((m) => (
                                <div key={m.label} className="flex items-center gap-1.5">
                                    <span className={`text-xs ${muted}`}>{m.label}:</span>
                                    <span className={`text-xs font-bold ${txt}`}>{m.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className={`hidden sm:block w-px h-4 ${isDark ? "bg-border-dark" : "bg-border-light"}`} />

                        {/* Severity counts */}
                        <div className="flex items-center gap-4 flex-wrap">
                            {[
                                { label: "Critical", val: vulnerabilities.critical, cls: "text-critical" },
                                { label: "High", val: vulnerabilities.high, cls: "text-high" },
                                { label: "Medium", val: vulnerabilities.medium, cls: "text-medium" },
                                { label: "Low", val: vulnerabilities.low, cls: "text-low" },
                            ].map((s) => (
                                <div key={s.label} className="flex items-center gap-1.5">
                                    <span className={`text-xs ${muted}`}>{s.label}:</span>
                                    <span className={`text-xs font-extrabold ${s.cls}`}>{s.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Scan ID */}
                        <p className={`ml-auto text-[10px] font-mono ${muted} hidden sm:block`}>{scan.id}</p>
                    </div>

                </main>
            </div>
        </div>
    );
}
