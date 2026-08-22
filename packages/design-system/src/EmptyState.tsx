import Button from "./Button";
interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  message,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="mt-4">
      <p className="text-body text-text-secondary">{message}</p>
      {actionLabel && onAction && (
        <div className="mt-3">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
