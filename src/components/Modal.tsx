// src/components/ui/Modal.tsx
import type { ReactNode } from "react";
import CloseIcon from "../assets/styledIcons/CloseIcon";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: string;
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
        className={`bg-white rounded p-6 w-full ${width} shadow-xl relative animate-fadeIn`}
      >
        <span
          className="absolute top-3 right-4 text-gray-600 hover:text-orange-500 transition duration-200 ease-in-out hover:scale-110 cursor-pointer"
          onClick={onClose}
          role="button"
          aria-label="Close modal"
        >
          <CloseIcon size={22} />
        </span>

        {title && (
          <h2 className="text-xl font-semibold mb-4 text-gray-800">{title}</h2>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;
