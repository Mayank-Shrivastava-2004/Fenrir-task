import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, Shield } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const features = [
    "Greybox & Blackbox scanning in minutes",
    "Real-time CVSS-scored vulnerability reports",
    "OWASP Top 10 automated test coverage",
    "SOC 2 compliant — enterprise-ready security",
    "Dedicated remediation guidance per finding",
];

// ── Social button SVG icons ──────────────────────────────────────────────────

const AppleIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
);

const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
);

const MetaIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#0082FB]">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
);

// ─── Field component (MUST be outside Signup to keep stable identity) ────────
function Field({ label, id, type = "text", placeholder, value, onChange, error, extra, inputCls, labelCls }) {
    return (
        <div>
            <label className={`block text-xs font-medium mb-1.5 ${labelCls}`}>
                {label}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete={id}
                    className={`w-full px-4 py-2.5 rounded-lg text-sm outline-none border transition-colors ${inputCls} ${error ? "border-critical" : ""}`}
                />
                {extra}
            </div>
            {error && <p className="text-critical text-xs mt-1">{error}</p>}
        </div>
    );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function Signup() {
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", password: "",
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const validate = () => {
        const errs = {};
        if (!form.firstName.trim()) errs.firstName = "Required";
        if (!form.lastName.trim()) errs.lastName = "Required";
        if (!form.email.trim()) errs.email = "Required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
        if (!form.password) errs.password = "Required";
        else if (form.password.length < 8) errs.password = "Minimum 8 characters";
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", form.email);
            setLoading(false);
            navigate("/dashboard");
        }, 900);
    };

    // Shared styles
    const bg = isDark ? "bg-dark-bg" : "bg-light-bg";
    const card = isDark ? "bg-dark-card" : "bg-light-card";
    const border = isDark ? "border-border-dark" : "border-border-light";
    const text = isDark ? "text-white" : "text-gray-900";
    const muted = isDark ? "text-gray-400" : "text-gray-500";
    const inputCls = isDark
        ? "bg-dark-input border-border-dark text-white placeholder-gray-600 focus:border-primary"
        : "bg-light-input border-border-light text-gray-900 placeholder-gray-400 focus:border-primary";
    const labelCls = isDark ? "text-gray-300" : "text-gray-700";

    return (
        <div className={`min-h-screen flex ${isDark ? "bg-[#0F0F0F]" : "bg-[#F5F5F5]"}`}>

            {/* ── Left: Visual Panel ─────────────────────────────────── */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12"
                style={{ background: "linear-gradient(135deg, #0F0F0F 0%, #0A1628 50%, #061A18 100%)" }}>

                {/* Grid texture */}
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(12,200,168,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(12,200,168,0.6) 1px, transparent 1px)",
                        backgroundSize: "36px 36px",
                    }}
                />
                {/* Glow blobs */}
                <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary opacity-[0.06] blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-0 w-64 h-64 rounded-full bg-blue-600 opacity-[0.06] blur-3xl pointer-events-none" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-teal-glow">
                        <Shield size={18} className="text-white" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">aps</span>
                </div>

                {/* Hero copy */}
                <div className="relative z-10">
                    <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">
                        Cybersecurity Platform
                    </p>
                    <h1 className="text-3xl font-extrabold text-white leading-snug mb-3">
                        Expert level Cybersecurity<br />
                        <span className="text-primary">in hours, not weeks.</span>
                    </h1>
                    <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-10">
                        Join thousands of security teams who ship faster and safer with continuous automated scanning.
                    </p>

                    {/* Feature checklist */}
                    <ul className="space-y-4">
                        {features.map((feat) => (
                            <li key={feat} className="flex items-start gap-3 animate-fade-in">
                                <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300 text-sm">{feat}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Footer */}
                <p className="relative z-10 text-gray-600 text-xs">
                    © 2026 Fenrir Security · SOC 2 Certified
                </p>
            </div>

            {/* ── Right: Form Card ───────────────────────────────────── */}
            <div className={`flex-1 flex flex-col items-center justify-center px-6 py-12 relative ${isDark ? "bg-[#0F0F0F]" : "bg-[#F5F5F5]"}`}>

                {/* Theme toggle */}
                <button onClick={toggleTheme} aria-label="Toggle theme"
                    className={`absolute top-5 right-5 p-2 rounded-lg border transition-colors ${card} ${border} ${muted} hover:text-primary`}>
                    {isDark ? (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    )}
                </button>

                {/* Mobile logo */}
                <div className="lg:hidden flex items-center gap-2 mb-8">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                        <Shield size={15} className="text-white" />
                    </div>
                    <span className={`font-bold text-lg ${text}`}>aps</span>
                </div>

                {/* Card */}
                <div className={`w-full max-w-md rounded-2xl border p-8 animate-fade-in
                    ${isDark
                        ? "bg-[#1A1A1A] border-[#2A2A2A] shadow-[0_1px_3px_rgba(0,0,0,0.6),_0_8px_32px_rgba(0,0,0,0.5)]"
                        : "bg-white border-[#E0E0E0] shadow-[0_2px_8px_rgba(0,0,0,0.08),_0_8px_32px_rgba(0,0,0,0.06)]"}`}>

                    <h2 className={`text-2xl font-bold mb-1 ${text}`}>Create your account</h2>
                    <p className={`text-sm mb-7 ${muted}`}>Start scanning in minutes — no credit card required.</p>

                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                        {/* Name row */}
                        <div className="grid grid-cols-2 gap-3">
                            <Field
                                label="First name" id="firstName" placeholder="FirstName"
                                value={form.firstName} onChange={set("firstName")} error={errors.firstName}
                                inputCls={inputCls} labelCls={labelCls}
                            />
                            <Field
                                label="Last name" id="lastName" placeholder="LastName"
                                value={form.lastName} onChange={set("lastName")} error={errors.lastName}
                                inputCls={inputCls} labelCls={labelCls}
                            />
                        </div>

                        {/* Email */}
                        <Field
                            label="Work email" id="email" type="email" placeholder="you@company.com"
                            value={form.email} onChange={set("email")} error={errors.email}
                            inputCls={inputCls} labelCls={labelCls}
                        />

                        {/* Password */}
                        <Field
                            label="Password (8+ characters)" id="password"
                            type={showPass ? "text" : "password"} placeholder="••••••••"
                            value={form.password} onChange={set("password")} error={errors.password}
                            inputCls={inputCls} labelCls={labelCls}
                            extra={
                                <button type="button" onClick={() => setShowPass((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            }
                        />

                        {/* CTA */}
                        <button type="submit" disabled={loading}
                            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-teal-glow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-1">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Creating account…
                                </span>
                            ) : "Create account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className={`flex-1 h-px ${isDark ? "bg-border-dark" : "bg-border-light"}`} />
                        <span className={`text-xs ${muted}`}>or continue with</span>
                        <div className={`flex-1 h-px ${isDark ? "bg-border-dark" : "bg-border-light"}`} />
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-3 gap-2.5">
                        {[
                            { label: "Apple", Icon: AppleIcon },
                            { label: "Google", Icon: GoogleIcon },
                            { label: "Meta", Icon: MetaIcon },
                        ].map(({ label, Icon }) => (
                            <button key={label}
                                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border text-xs font-medium transition-colors
                  ${card} ${border} ${muted}
                  ${isDark ? "hover:bg-white/5 hover:text-white" : "hover:bg-gray-50 hover:text-gray-900"}`}>
                                <Icon />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Sign in link */}
                    <p className={`mt-6 text-center text-xs ${muted}`}>
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
