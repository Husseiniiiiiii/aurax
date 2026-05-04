import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      className="relative h-10 w-10 grid place-items-center rounded-xl border border-aurax-200 dark:border-aurax-700 bg-white/70 dark:bg-aurax-800/60 hover:bg-aurax-100 dark:hover:bg-aurax-700 transition-all"
    >
      <Sun
        className={`absolute h-5 w-5 transition-all ${
          isDark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
        } text-aurax-700`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-all ${
          isDark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
        } text-aurax-200`}
      />
    </button>
  );
}
