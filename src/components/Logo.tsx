interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
}

// Stylised desert-sun mark: gold circle (sun) + two dune curves + horizon line.
// variant="light" → gold strokes on dark backgrounds (nav, footer).
// variant="dark"  → night-colour strokes on light backgrounds.
export function Logo({ className, variant = "light" }: LogoProps) {
  const c = variant === "dark" ? "#0B0F1A" : "#C8A45D";

  return (
    <svg
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Sun */}
      <circle cx="21" cy="7" r="3" fill={c} />
      {/* Upper dune */}
      <path
        d="M2 17 Q7 12 11.5 15 Q16 18 22 13"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Lower dune */}
      <path
        d="M2 21.5 Q8 17.5 13 20.5 Q18.5 23.5 28 18"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Horizon */}
      <path
        d="M2 25.5 H28"
        stroke={c}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
