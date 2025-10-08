import type { ReactNode } from "react";
import CloseIcon from "../assets/styledIcons/CloseIcon";
import { useTheme } from "../context/themeContext";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  width?: string;
  isDarkMode?: boolean;
  hideHeader?: boolean;   
  hideClose?: boolean; 
};

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  width = "max-w-2xl",
  isDarkMode = false,
  hideHeader = false,    
  hideClose = false,     
}: ModalProps) => {
  const { isDarkMode: themeDarkMode } = useTheme();
  const finalDarkMode = isDarkMode || themeDarkMode;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`rounded w-full ${width} max-h-[90vh] shadow-xl relative animate-fadeIn overflow-hidden ${finalDarkMode ? "bg-slate-950 border border-slate-700" : "bg-white"
          }`}
      >
       
        {!hideHeader && (
          <div
            className={`sticky top-0 z-10 px-6 pt-6 pb-4 border-b ${finalDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
              }`}
          >
        
            {!hideClose && (
              <span
                className={`absolute top-4 right-5 transition duration-200 ease-in-out hover:scale-110 cursor-pointer ${finalDarkMode
                    ? "text-slate-100 hover:text-slate-200"
                    : "text-gray-600 hover:text-orange-500"
                  }`}
                onClick={onClose}
                role="button"
                aria-label="Close modal"
              >
                <CloseIcon size={22} />
              </span>
            )}

            
            {title && (
              <h2
                className={`text-xl font-semibold ${finalDarkMode ? "text-slate-100" : "text-gray-800"
                  }`}
              >
                {title}
              </h2>
            )}
          </div>
        )}

     
        <div
          className={`p-6 overflow-y-auto max-h-[calc(90vh-72px)] ${finalDarkMode ? "bg-slate-950" : "bg-white"
            }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
