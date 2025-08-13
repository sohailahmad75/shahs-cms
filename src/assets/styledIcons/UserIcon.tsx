import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const UserIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke={color}
    strokeWidth={3}
    {...props}
  >
    {/* Head/Circle */}
    <circle cx="32" cy="20" r="12" />
    {/* Body/Neck-to-Legs */}
    <path d="M32,32c0,0-8,6-8,14v8h16v-8c0-8-8-14-8-14" />
  </svg>
);

export default UserIcon;