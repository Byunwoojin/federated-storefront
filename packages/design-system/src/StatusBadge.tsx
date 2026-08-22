interface StatusBadgeProps {
  label: string;
}

export default function StatusPadge({ label }: StatusBadgeProps) {
  return (
    <span className="inline-block rounded bg-gray-100 px-2 py-2 text-sm text-text-primary">
      {label}
    </span>
  );
}
