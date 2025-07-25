import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const ExpandIcon: React.FC<IconProps> = ({
  size = 14,
  color = "currentColor",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 1920 1920"
    fill="none"
    {...props}
  >
    <path
      d="M960.182.012 451 509.193l82.7 82.817 368.112-368.113v1472.217L533.7 1328.12l-82.7 82.7L960.182 1920l509.181-509.182-82.582-82.7-368.113 367.996V223.897l368.113 368.113 82.582-82.817z"
      fill={color}
      fillRule="evenodd"
    />
  </svg>
);

export default ExpandIcon;
