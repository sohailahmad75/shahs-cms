import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    color?: string;
}

// 📦 Box Icon - Simple Product
const ProductBoxIcon: React.FC<IconProps> = ({
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
            d="M20 7L12 3L4 7V17L12 21L20 17V7Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M4 7L12 11L20 7"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12 21V11"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 🎯 Target Product Icon
const ProductTargetIcon: React.FC<IconProps> = ({
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
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
            fill={color}
        />
    </svg>
);

// ⚡ Modern Product Icon
const ProductRocketIcon: React.FC<IconProps> = ({
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
            d="M13 11L21 2"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M22 13C22 7.47715 17.5228 3 12 3C6.47715 3 2 7.47715 2 13C2 15.3595 2.78514 17.537 4.1487 19.2839C4.1487 19.2839 5.76923 20.6154 6.92308 21.4615C7.30769 21.7692 7.5 22 8 22H16C16.5 22 16.6923 21.7692 17.0769 21.4615C18.2308 20.6154 19.8513 19.2839 19.8513 19.2839C21.2149 17.537 22 15.3595 22 13Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M13 16L11 18"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M15 11L13 13"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

// 🏷️ Tag Product Icon
const ProductTagIcon: React.FC<IconProps> = ({
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
            d="M20.59 13.41L13.42 20.58C13.2343 20.766 13.0137 20.9135 12.7709 21.0141C12.5281 21.1148 12.2678 21.1666 12.005 21.1666C11.7422 21.1666 11.4819 21.1148 11.2391 21.0141C10.9963 20.9135 10.7757 20.766 10.59 20.58L2 12V2H12L20.59 10.59C20.9625 10.9647 21.1716 11.4716 21.1716 12C21.1716 12.5284 20.9625 13.0353 20.59 13.41Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M7 7H7.01"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export { ProductBoxIcon, ProductTargetIcon, ProductRocketIcon, ProductTagIcon };