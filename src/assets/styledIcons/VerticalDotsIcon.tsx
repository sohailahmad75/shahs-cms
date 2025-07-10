// src/components/icons/VerticalDotsIcon.tsx
import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const VerticalDotsIcon: React.FC<IconProps> = ({
  size = 20,
  color = "currentColor",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      fill={color}
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 3a2 2 0 10-4 0 2 2 0 004 0zm-2 5a2 2 0 110 4 2 2 0 010-4zm0 7a2 2 0 110 4 2 2 0 010-4z"
    />
  </svg>
);

export default VerticalDotsIcon;
