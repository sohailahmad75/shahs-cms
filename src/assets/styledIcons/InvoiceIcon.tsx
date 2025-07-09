import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const InvoiceIcon: React.FC<IconProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    fill="none"
    {...props}
  >
    <path
      d="M109.72 109.71v365.71h146.29v438.86H434.8l8.59-24.45c10.32-29.36 37.89-49.07 68.62-49.07 30.71 0 58.29 19.71 68.61 49.07l8.59 24.45h178.8V475.43H914.3V109.71H109.72z m585.15 731.43h-56.45c-25.73-44.84-73.73-73.52-126.41-73.52s-100.7 28.68-126.43 73.52h-56.43v-512h365.71v512z m146.28-438.85h-73.14v-73.14h36.57V256H219.44v73.14h36.57v73.14h-73.14V182.86h658.29v219.43z"
      fill={color}
    />
    <path
      d="M402.29 402.29h73.14v292.57h-73.14zM548.58 402.29h73.14v219.43h-73.14z"
      fill={color}
    />
  </svg>
);

export default InvoiceIcon;
