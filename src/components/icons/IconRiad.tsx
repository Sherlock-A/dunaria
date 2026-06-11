interface IconProps {
  className?: string;
}

export function IconRiad({ className = "h-6 w-6" }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="10" width="18" height="12" rx="1" />
      <path d="M3 10 L12 3 L21 10" />
      <path d="M9 22V16h6v6" />
      <path d="M12 6v2" />
      <circle cx="12" cy="14" r="2" />
    </svg>
  );
}
