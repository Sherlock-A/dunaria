interface IconProps {
  className?: string;
}

export function IconCamel({ className = "h-6 w-6" }: IconProps) {
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
      <path d="M4 18v-2a2 2 0 0 1 2-2h1l2-3h2l1-2h1a2 2 0 0 0 2-2V6a1 1 0 0 1 1-1h1" />
      <path d="M4 18h2M14 18v-4l2-1" />
      <path d="M16 13h2v5h-2" />
      <circle cx="18" cy="7" r="1" />
    </svg>
  );
}
