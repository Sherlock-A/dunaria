interface IconProps {
  className?: string;
}

export function IconDune({ className = "h-6 w-6" }: IconProps) {
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
      <path d="M2 18 C5 14, 9 10, 12 10 C15 10, 19 14, 22 18" />
      <path d="M2 20 C6 16, 10 13, 14 13 C18 13, 21 16, 22 20" />
    </svg>
  );
}
