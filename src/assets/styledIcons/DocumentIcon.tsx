import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const DocumentIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      d="M6 2C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2H6Z"
      fill={color}
    />
   
    <path
      d="M14 2V8H20"
      fill={color}
    />
  </svg>
);

export default DocumentIcon;
