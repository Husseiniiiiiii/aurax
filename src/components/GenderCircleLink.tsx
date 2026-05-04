import { Link } from "react-router-dom";

type Size = "home" | "hub";

const ringBox: Record<Size, string> = {
  home: "w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48",
  hub: "w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52",
};

const linkWidth: Record<Size, string> = {
  home: "max-w-[200px] sm:max-w-[240px]",
  hub: "max-w-[220px] sm:max-w-[260px]",
};

const labelClass: Record<Size, string> = {
  home: "text-sm sm:text-base md:text-lg",
  hub: "text-base sm:text-lg",
};

export default function GenderCircleLink({
  to,
  image,
  label,
  ariaLabel,
  size = "home",
}: {
  to: string;
  image: string;
  label: string;
  ariaLabel: string;
  size?: Size;
}) {
  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={`group flex flex-col items-center gap-4 w-full ${linkWidth[size]}`}
    >
      <div
        className={`relative ${ringBox[size]} rounded-full overflow-hidden ring-[3px] ring-aurax-300/80 dark:ring-aurax-600/70 shadow-glow ring-offset-4 ring-offset-aurax-50 dark:ring-offset-aurax-900 transition group-hover:ring-aurax-500 dark:group-hover:ring-aurax-400 group-hover:scale-[1.02]`}
      >
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-aurax-900/70 via-transparent to-transparent" />
      </div>
      <span
        className={`text-center font-extrabold tracking-wide ${labelClass[size]}`}
      >
        {label}
      </span>
    </Link>
  );
}
