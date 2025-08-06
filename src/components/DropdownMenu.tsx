import { useEffect, useRef, useState } from "react";
import Loader from "./Loader"; // ✅ make sure path is correct

type DropdownMenuItem = {
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
};

type DropdownMenuProps = {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: "left" | "right";
  disabled?: boolean;
  loading?: boolean;
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  items,
  align = "right",
  disabled = false,
  loading = false,
}) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled && !loading) {
      setOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={handleToggle}
        className={`cursor-pointer ${disabled || loading ? "opacity-50 pointer-events-none" : ""}`}
      >
        {loading ? <Loader className="h-auto py-1" /> : trigger}
      </div>

      {open && !disabled && !loading && (
        <div
          className={`absolute mt-2 py-2 z-50 bg-white border border-gray-200 rounded shadow-md min-w-[160px] text-sm ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, idx) => {
            const isDisabled = item.disabled;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (!isDisabled) {
                    item.onClick();
                    setOpen(false);
                  }
                }}
                className={`px-4 py-2 transition-colors duration-150 ${
                  isDisabled
                    ? "text-gray-400 cursor-not-allowed"
                    : item.danger
                      ? "text-red-600 hover:bg-red-50 cursor-pointer"
                      : "text-gray-700 hover:bg-orange-50 cursor-pointer"
                }`}
              >
                {item.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
