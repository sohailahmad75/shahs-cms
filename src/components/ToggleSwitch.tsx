import React from "react";

type ToggleSwitchProps = {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  name?: string;
  className?: string;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  name,
  className = "",
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}
      <div className="relative inline-block w-12 h-6">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-full h-full bg-gray-300 rounded-full peer-checked:bg-orange-500 transition-colors duration-300" />
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 peer-checked:translate-x-6" />
      </div>
    </label>
  );
};

export default ToggleSwitch;
