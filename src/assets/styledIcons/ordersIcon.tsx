import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const OrdersIcon: React.FC<IconProps> = ({
  size = 22,
  color = "currentColor",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
    height={size}
    width={size}
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M16 2h-1.17A3.001 3.001 0 0 0 12 0a3.001 3.001 0 0 0-2.83 2H8c-1.1 0-2 .9-2 2v18c0 
             1.1.9 2 2 2h8c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-4-1c.83 0 1.5.67 1.5 1.5S12.83 4 
             12 4s-1.5-.67-1.5-1.5S11.17 1 12 1zM16 22H8V4h1.17c.41.58 1.07.99 1.83.99s1.42-.41 
             1.83-.99H16v18z" />
    <path d="M10 9h4v2h-4V9zm0 4h4v2h-4v-2zm0 4h4v2h-4v-2z" />
  </svg>
);

export default OrdersIcon;
