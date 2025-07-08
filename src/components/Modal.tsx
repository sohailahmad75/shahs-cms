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
  width = "max-w-2xl", // increased width for better spacing
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-white rounded w-full ${width} max-h-[90vh] shadow-xl relative animate-fadeIn overflow-hidden`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-6 pb-4 border-b border-gray-200">
          <span
            className="absolute top-4 right-5 text-gray-600 hover:text-orange-500 transition duration-200 ease-in-out hover:scale-110 cursor-pointer"
            onClick={onClose}
            role="button"
            aria-label="Close modal"
          >
            <CloseIcon size={22} />
          </span>

          {title && (
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          )}
        </div>

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-72px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
