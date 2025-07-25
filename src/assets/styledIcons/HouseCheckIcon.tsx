import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const HouseCheckIcon: React.FC<IconProps> = ({
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
    <path d="M44.88,53H13.67a2.93,2.93,0,0,1-3-2.84V24.59" />
    <line x1="50.68" y1="24.76" x2="50.68" y2="35.77" />
    <polyline points="24.93 52.95 24.93 35.88 36.51 35.88 36.51 52.95" />
    <path d="M7.12,16.6s-1.1,7.76,6.45,9a7.15,7.15,0,0,0,6.1-2,7.43,7.43,0,0,0,11-.1,7.37,7.37,0,0,0,5,2.49,11.77,11.77,0,0,0,5.89-2.15,6.67,6.67,0,0,0,4.68,2.15,8,8,0,0,0,7.92-9.3L49.46,6.48a1,1,0,0,0-.94-.66H12.7a1,1,0,0,0-.94.66Z" />
    <line x1="7.12" y1="16.6" x2="54.21" y2="16.6" />
    <line x1="19.72" y1="16.6" x2="19.72" y2="5.82" />
    <line x1="30.72" y1="16.6" x2="30.72" y2="5.82" />
    <line x1="41.69" y1="16.6" x2="41.69" y2="5.82" />
    <circle cx="50.68" cy="45.37" r="9.6" />
    <polyline points="46.22 46.93 49.45 49.37 55.13 41.38" />
  </svg>
);

export default HouseCheckIcon;
