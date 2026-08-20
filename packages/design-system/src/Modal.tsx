interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label={title}
      className="fixed inset-0 bg-black/50"
      onClick={onClose}
    >
      <div
        className="mx-auto mt-[10$] w-[300px] bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-heading text-text-primary">{title}</h2>
        {children}
        <button onClick={onClose} className="mt-2">
          닫기
        </button>
      </div>
    </div>
  );
}
