import { useTheme } from "../context/ThemeContext";

export default function Skeleton({ className = "", variant = "rect" }) {
    const { isDark } = useTheme();
    // Use dark/light colors matching the exact instructions
    const bgClass = isDark ? "bg-[#1A1A1A]" : "bg-[#E5E7EB]";

    // Basic structure for rectangles and circles
    let shapeClass = "rounded-md";
    if (variant === "circle") {
        shapeClass = "rounded-full";
    }

    return (
        <div
            className={`animate-pulse ${bgClass} ${shapeClass} ${className}`}
        ></div>
    );
}
