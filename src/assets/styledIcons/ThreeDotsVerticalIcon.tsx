import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  rotation?: number; // degrees
  transformOrigin?: string; // e.g., 'center', 'top left', etc.
}

const ThreeDotsVerticalIcon: React.FC<IconProps> = ({
  size = 16,
  color = "currentColor",
  rotation = 0,
  transformOrigin = "center",
  style,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill={color}
    style={{
      transform: `rotate(${rotation}deg)`,
      transformOrigin,
      ...style,
    }}
    {...props}
  >
    <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
  </svg>
);

export default ThreeDotsVerticalIcon;
