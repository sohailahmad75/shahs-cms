import type { FC, SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const DeliverooIcon: FC<IconProps> = ({
  size = 18,
  color = "currentColor",
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 908 1000"
    width={size}
    height={size}
    fill="none"
    {...props}
  >
    <path
      d="M654.98,0l-46.36,440.75-79.02-371.59-249.2,52.44,78.24,371.56L0,569.14l63.85,296.36,631.41,134.5,144.36-322.93L908,26.61,654.98,0ZM455.15,639.82c-12.9,12.16-29.65,10.64-48.63,4.56-18.23-6.08-25.83-27.35-19.75-54.71,5.3-19.76,28.87-22.79,41.8-22.79,4.56,0,9.12.74,13.68,3.04,8.34,3.78,22.79,12.16,25.83,24.31,4.56,18.24,0,33.43-12.93,45.59M638.27,659.58c-9.89,16.72-34.2,19.01-59.26,6.82-16.71-8.34-16.71-28.1-14.45-41.03.77-6.82,3.81-13.68,8.37-18.98,6.08-7.6,15.94-17.49,26.58-17.49,19.01-.74,34.2,7.6,43.32,22.79,9.12,15.2,4.56,31.91-4.56,47.88"
      fill={color}
    />
  </svg>
);

export default DeliverooIcon;
