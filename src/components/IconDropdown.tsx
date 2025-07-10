// components/IconDropdown.tsx
import { useEffect, useRef, useState } from "react";

interface Item {
  label: string;
  onClick: () => void;
}

interface IconDropdownProps {
  items: Item[];
  icon: React.ReactNode; // normally your 3-dot svg
  buttonClassName?: string; // (optional) override btn style
}

const IconDropdown: React.FC<IconDropdownProps> = ({
  items,
  icon,
  buttonClassName = "p-2 text-white hover:text-gray-300",
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // close when clicking outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        className={`cursor-pointer p-2 text-white hover:text-gray-300 ${buttonClassName}`}
        onClick={() => setOpen((p) => !p)}
      >
        {icon}
      </button>

      {open && (
        <ul className="absolute right-0 bottom-full mb-1 w-56 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black/5 z-50 animate-fadeIn">
          {items.map((item) => (
            <li
              key={item.label}
              className="px-4 py-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer select-none rounded-md"
              onClick={() => {
                item.onClick();
                setOpen(false);
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IconDropdown;
