import { useNavigate } from "react-router-dom";
import { ChevronRight, CheckCircle2, Clock, XCircle } from "lucide-react";
import Skeleton from "./Skeleton";
import { useTheme } from "../context/ThemeContext";

const STATUS_CFG = {
    Completed: { label: "Completed", icon: CheckCircle2, cls: "bg-primary-muted text-primary border-primary/20" },
    Scheduled: { label: "Scheduled", icon: Clock, cls: "bg-gray-500 text-white border-transparent shadow-sm" },
    Running: { label: "Running", icon: Clock, cls: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
    Failed: { label: "Failed", icon: XCircle, cls: "bg-critical-bg text-critical border-critical/20" },
};

const SEV = ["critical", "high", "medium", "low"];
const SEV_COLOR = { critical: "bg-critical", high: "bg-high", medium: "bg-medium", low: "bg-low" };
const SEV_TEXT = { critical: "text-critical", high: "text-high", medium: "text-medium", low: "text-low" };

export default function ScanTable({ scans, totalCount, isLoading }) {
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const card = isDark ? "bg-dark-card" : "bg-light-card";
    const bdr = isDark ? "border-border-dark" : "border-border-light";
    const txt = isDark ? "text-white" : "text-gray-900";
    const muted = isDark ? "text-gray-400" : "text-gray-500";

    // Format display for loading state, empty state, or map through valid scans
    return (
        <div className={`rounded-xl border overflow-x-auto ${card} ${bdr}`}>
            <div className="min-w-[800px]">
                {/* Table Header */}
                <div className={`hidden md:grid grid-cols-12 px-5 py-3 border-b ${bdr} text-xs font-semibold uppercase tracking-wider ${muted}`}>
                    <div className="col-span-3">Scan Name</div>
                    <div className="col-span-1">Type</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Progress</div>
                    <div className="col-span-3">Vulnerability</div>
                    <div className="col-span-1 text-right">Last Scan</div>
                </div>

                {/* Rows Logic: Display skeleton if loading, fallback message if empty, or map data */}
                {isLoading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                        <div key={`skeleton-${i}`} className={`grid grid-cols-2 md:grid-cols-12 items-center px-5 py-3.5 border-b ${bdr} ${i === 4 ? "border-b-0" : ""}`}>
                            <div className="col-span-2 md:col-span-3 min-w-0">
                                <Skeleton className="h-4 w-3/4 mb-1.5" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <div className="col-span-1 hidden md:block">
                                <Skeleton className="h-5 w-16" />
                            </div>
                            <div className="col-span-2 hidden md:block">
                                <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                            <div className="col-span-2 hidden md:block">
                                <Skeleton className="h-4 w-full max-w-[120px]" />
                            </div>
                            <div className="col-span-3 hidden md:flex gap-3">
                                <Skeleton className="h-4 w-8" />
                                <Skeleton className="h-4 w-8" />
                                <Skeleton className="h-4 w-8" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                            <div className="col-span-1 flex md:justify-end">
                                <Skeleton className="h-4 w-12" />
                            </div>
                        </div>
                    ))
                ) : scans.length === 0 ? (
                    <div className={`py-16 text-center text-sm ${muted}`}>No Scans Found</div>
                ) : (
                    scans.map((scan, i) => {
                        const defaultSc = { label: scan.status, icon: Clock, cls: "bg-gray-500 text-white" };
                        const sc = STATUS_CFG[scan.status] || defaultSc;
                        const StatusIcon = sc.icon;

                        return (
                            <div
                                key={scan.id}
                                onClick={() => navigate(`/scan/${scan.id}`)}
                                className={`
                                    grid grid-cols-2 md:grid-cols-12 items-center px-5 py-3.5 cursor-pointer
                                    border-b transition-colors animate-fade-in ${bdr}
                                    ${isDark ? "hover:bg-white/[0.025]" : "hover:bg-gray-50"}
                                    ${i === scans.length - 1 ? "border-b-0" : ""}
                                `}
                                style={{ animationDelay: `${i * 25}ms` }}
                            >
                                {/* Scan Name */}
                                <div className="col-span-2 md:col-span-3 min-w-0">
                                    <p className={`text-sm font-semibold truncate ${txt}`}>{scan.name}</p>
                                    <p className={`text-xs truncate mt-0.5 ${muted}`}>{scan.target}</p>
                                </div>

                                {/* Type */}
                                <div className="col-span-1 hidden md:block">
                                    <span className={`text-xs px-2 py-0.5 rounded border ${card} ${bdr} ${muted}`}>
                                        {scan.type}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="col-span-2 hidden md:flex">
                                    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${sc.cls}`}>
                                        <StatusIcon size={11} /> {sc.label}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="col-span-2 hidden md:block">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 rounded-full bg-border-dark overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${scan.status === "Failed" ? "bg-critical" :
                                                        scan.status === "Scheduled" ? "bg-gray-500" : "bg-primary"
                                                    }`}
                                                style={{ width: `${scan.progress}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs w-8 text-right ${muted}`}>{scan.progress}%</span>
                                    </div>
                                </div>

                                {/* Vulnerability badges */}
                                <div className="col-span-3 hidden md:flex items-center gap-3">
                                    {SEV.map((sev) => (
                                        <div key={sev} className="flex items-center gap-1">
                                            <span className={`w-2 h-2 rounded-full ${SEV_COLOR[sev]} flex-shrink-0`} />
                                            <span className={`text-xs font-semibold ${SEV_TEXT[sev]}`}>
                                                {scan.vulnerabilities?.[sev] || 0}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Last scan + arrow */}
                                <div className={`col-span-1 hidden md:flex items-center justify-end gap-1 text-xs ${muted}`}>
                                    {scan.lastScan}
                                    <ChevronRight size={12} className="text-gray-600" />
                                </div>

                                {/* Mobile: compact right side */}
                                <div className="col-span-1 flex flex-col items-end gap-1 md:hidden">
                                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border font-medium ${sc.cls}`}>
                                        <StatusIcon size={10} /> {sc.label}
                                    </span>
                                    <span className={`text-xs ${muted}`}>{scan.lastScan}</span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Footer */}
            <p className={`text-center text-xs pb-2 mt-2 ${muted}`}>
                {isLoading ? (
                    <Skeleton className="h-3 w-32 mx-auto inline-block align-middle" />
                ) : (
                    `Showing ${scans.length} of ${totalCount} scans`
                )}
            </p>
        </div>
    );
}
