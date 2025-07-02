import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const CollapseIcon: React.FC<IconProps> = ({
  size = 14,
  color = "currentColor",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    {...props}
  >
    <path
      d="M22.6 15.4a1.9 1.9 0 0 0 2.8 0l6-5.9a2.1 2.1 0 0 0 .2-2.7 1.9 1.9 0 0 0-3-.2L26 9.2V4a2 2 0 0 0-4 0v5.2l-2.6-2.6a1.9 1.9 0 0 0-3 .2 2.1 2.1 0 0 0 .2 2.7l6 5.9ZM25.4 32.6a1.9 1.9 0 0 0-2.8 0l-6 5.9a2.1 2.1 0 0 0-.2 2.7 1.9 1.9 0 0 0 3 .2L22 38.8V44a2 2 0 0 0 4 0v-5.2l2.6 2.6a1.9 1.9 0 0 0 3-.2 2.1 2.1 0 0 0-.2-2.7l-6-5.9ZM6 22h36a2 2 0 0 0 0-4H6a2 2 0 0 0 0 4ZM6 30h36a2 2 0 0 0 0-4H6a2 2 0 0 0 0 4Z"
      fill={color}
    />
  </svg>
);

export default CollapseIcon;
