import { useEffect, useRef } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  actions,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      dialogRef.current?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label={title}
      className="fixed inset-0 bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-auto mt-10 w-[300px] bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-heading text-text-primary">{title}</h2>
        {children}
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="text-sm text-text-secondary underline"
          >
            닫기
          </button>
          {actions}
        </div>
      </div>
    </div>
  );
}
