import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const EditIcon: React.FC<IconProps> = ({
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
      d="M21.28 6.4L11.74 15.94C10.79 16.89 7.97 17.33 7.34 16.7C6.71 16.07 7.14 13.25 8.09 12.3L17.64 2.75C18.38 2 19.49 1.91 20.51 2.1C21.53 2.29 22.11 3.35 21.89 4.44C21.77 4.99 21.53 5.53 21.28 6.4Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 4H6C4.94 4 3.92 4.42 3.17 5.17C2.42 5.92 2 6.94 2 8V18C2 19.06 2.42 20.08 3.17 20.83C3.92 21.58 4.94 22 6 22H17C19.21 22 20 20.2 20 18V13"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EditIcon;
