// src/components/ui/Modal.tsx
import type { ReactNode } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: string; // optional custom width (e.g., "max-w-md", "max-w-xl")
};

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  width = "max-w-md",
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-white rounded p-6 w-full ${width} shadow-lg relative min-h-[400px]`}
      >
        {/* Close button */}
        <button
          className="absolute top-2 right-3 text-gray-600 text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Optional title */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
