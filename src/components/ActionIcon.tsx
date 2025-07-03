// src/components/ActionIcon.tsx
import React from "react";

type ActionIconProps = {
  onClick?: () => void;
  icon: React.ReactNode;
  title?: string;
  className?: string;
};

const ActionIcon: React.FC<ActionIconProps> = ({
  onClick,
  icon,
  title,
  className = "",
}) => {
  return (
    <span
      className={`cursor-pointer text-orange-500 hover:scale-110 transition duration-200 ease-in-out ${className}`}
      onClick={onClick}
      title={title}
      role="button"
    >
      {icon}
    </span>
  );
};

export default ActionIcon;
