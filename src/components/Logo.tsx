import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const BRAND = "AURAX";

export default function Logo({ size = "md" }: LogoProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // small delay so the animation feels intentional
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const text = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  } as const;

  return (
    <Link
      to="/"
      className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-aurax-500 rounded-lg logo-hover"
      aria-label="Aurax"
    >
      <span
        className={`${text[size]} font-normal tracking-wide inline-flex`}
        aria-hidden="true"
      >
        {BRAND.split("").map((char, i) => (
          <span
            key={i}
            className="logo-letter"
            style={{
              animationDelay: `${i * 100}ms`,
              animationPlayState: visible ? "running" : "paused",
            }}
          >
            {char}
          </span>
        ))}
      </span>
      {/* accessible fallback */}
      <span className="sr-only">AURAX</span>
    </Link>
  );
}
