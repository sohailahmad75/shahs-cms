import React from "react";

interface IconsProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const SearchIcon: React.FC<IconsProps> = ({ size = 24, ...props }) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-4.35-4.35M5 11a6 6 0 1112 0 6 6 0 01-12 0z"
    />
  </svg>
);

export default SearchIcon;
