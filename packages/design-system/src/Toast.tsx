import { useEffect } from "react";

interface ToastProps {
  message: string;
  duration?: number;
  onDismiss: () => void;
}
export default function Toast({
  message,
  duration = 1500,
  onDismiss,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  return (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-md bg-text-primary px-4 py-2 text-white shadow-lg"
    >
      {message}
    </div>
  );
}
