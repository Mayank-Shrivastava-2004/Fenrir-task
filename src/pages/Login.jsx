import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Shield, Eye, EyeOff, CheckCircle2, Zap, BarChart3, Lock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const features = [
    {
        icon: <Zap size={18} />,
        title: "Real-Time Scanning",
        desc: "Live terminal output and instant vulnerability detection across all endpoints.",
    },
    {
        icon: <BarChart3 size={18} />,
        title: "Severity Intelligence",
        desc: "Automatic CVSS scoring with Critical, High, Medium, and Low classification.",
    },
    {
        icon: <Lock size={18} />,
        title: "Enterprise Security",
        desc: "SOC 2 compliant infrastructure with end-to-end encryption and audit trails.",
    },
    {
        icon: <CheckCircle2 size={18} />,
        title: "Greybox & Blackbox",
        desc: "Flexible scan modes for authenticated and unauthenticated surface coverage.",
    },
];

export default function Login() {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }
        if (email !== "admin@fenrir.com" || password !== "admin123") {
            setError("Invalid credentials. Please use admin@fenrir.com / admin123");
            return;
        }
        setLoading(true);
        // Simulate auth — navigate after short delay
        setTimeout(() => {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", email);
            setLoading(false);
            navigate("/dashboard");
        }, 900);
    };

    return (
        <div className={`min-h-screen flex ${isDark ? "bg-[#0F0F0F]" : "bg-[#F5F5F5]"}`}>

            {/* â”€â”€ Left Panel: Brand + Features â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#0A0A0A] via-[#0D1A17] to-[#0A160F] flex-col justify-between p-12">
                {/* Background grid */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(12,200,168,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(12,200,168,0.4) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* Glow blob */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-teal-glow">
                        <Shield size={18} className="text-white" />
                    </div>
                    <span className="text-white font-semibold text-lg tracking-tight">Fenrir Security</span>
                </div>

                {/* Hero text */}
                <div className="relative z-10">
                    <p className="text-primary text-sm font-medium tracking-widest uppercase mb-3">
                        B2B Security Platform
                    </p>
                    <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                        Scan. Detect.<br />
                        <span className="text-primary">Remediate.</span>
                    </h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                        Enterprise-grade vulnerability scanning with real-time insights and actionable remediation guidance.
                    </p>

                    {/* Feature list */}
                    <div className="mt-10 space-y-5">
                        {features.map((f) => (
                            <div key={f.title} className="flex items-start gap-4 animate-fade-in">
                                <div className="flex-shrink-0 w-8 h-8 rounded-md bg-primary-muted border border-primary/20 flex items-center justify-center text-primary">
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="text-white text-sm font-medium">{f.title}</p>
                                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-gray-600 text-xs">
                    Â© 2026 Fenrir Security Private Limited Â· All rights reserved
                </div>
            </div>

            {/* â”€â”€ Right Panel: Sign-In Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className={`flex-1 flex flex-col items-center justify-center px-6 py-12 relative
        ${isDark ? "bg-[#0F0F0F]" : "bg-[#F5F5F5]"}`}>

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                    className={`absolute top-5 right-5 p-2 rounded-lg transition-colors
            ${isDark
                            ? "bg-dark-card border border-border-dark text-gray-400 hover:text-primary"
                            : "bg-light-card border border-border-light text-gray-500 hover:text-primary"
                        }`}
                >
                    {isDark ? (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path
                                fillRule="evenodd"
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                </button>

                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Shield size={16} className="text-white" />
                    </div>
                    <span className={`font-semibold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
                        Fenrir Security
                    </span>
                </div>

                {/* Card */}
                <div className={`w-full max-w-md rounded-2xl p-8 border animate-fade-in
          ${isDark
                        ? "bg-dark-card border-border-dark shadow-card-dark"
                        : "bg-light-card border-border-light shadow-card-light"
                    }`}>

                    <h2 className={`text-2xl font-bold mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                        Welcome back
                    </h2>
                    <p className={`text-sm mb-7 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                        Sign in to your Fenrir dashboard
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                Work Email
                            </label>
                            <input
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border transition-colors
                  ${isDark
                                        ? "bg-dark-input border-border-dark text-white placeholder-gray-600 focus:border-primary"
                                        : "bg-light-input border-border-light text-gray-900 placeholder-gray-400 focus:border-primary"
                                    }`}
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className={`block text-xs font-medium mb-1.5 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                                    className={`w-full px-4 py-2.5 pr-10 rounded-lg text-sm outline-none border transition-colors
                    ${isDark
                                            ? "bg-dark-input border-border-dark text-white placeholder-gray-600 focus:border-primary"
                                            : "bg-light-input border-border-light text-gray-900 placeholder-gray-400 focus:border-primary"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors"
                                >
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-critical text-xs">{error}</p>
                        )}

                        {/* Forgot */}
                        <div className="flex justify-end">
                            <button type="button" className="text-xs text-primary hover:underline">
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-teal-glow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Signing inâ€¦
                                </span>
                            ) : "Sign in"}
                        </button>
                    </form>

                    <div className={`mt-6 pt-5 border-t text-xs text-center
            ${isDark ? "border-border-dark text-gray-600" : "border-border-light text-gray-400"}`}>
                        Don't have an account?{" "}
                        <Link to="/" className="text-primary hover:underline font-medium">Request access</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

