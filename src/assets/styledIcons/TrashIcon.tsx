import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const TrashIcon: React.FC<IconProps> = ({
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
      d="M10 12L14 16M14 12L10 16M4 6H20M16 6L15.73 5.19C15.47 4.4 15.34 4.01 15.09 3.72C14.88 3.46 14.6 3.26 14.29 3.14C13.94 3 13.52 3 12.69 3H11.31C10.48 3 10.06 3 9.71 3.14C9.4 3.26 9.12 3.46 8.91 3.72C8.66 4.01 8.53 4.4 8.27 5.19L8 6M18 6V16.2C18 17.88 18 18.72 17.67 19.36C17.39 19.93 16.93 20.39 16.36 20.67C15.72 21 14.88 21 13.2 21H10.8C9.12 21 8.28 21 7.64 20.67C7.07 20.39 6.61 19.93 6.33 19.36C6 18.72 6 17.88 6 16.2V6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default TrashIcon;
