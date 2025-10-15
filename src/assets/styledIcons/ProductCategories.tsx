import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    color?: string;
}

// 🛒 All Categories Icon
const CategoriesIcon: React.FC<IconProps> = ({
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
            d="M10 3H3V10H10V3Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M21 3H14V10H21V3Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M21 14H14V21H21V14Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M10 14H3V21H10V14Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 👕 Fashion & Clothing
const FashionIcon: React.FC<IconProps> = ({
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
            d="M12 7H12.01"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M16 21V7C16 5.34315 14.6569 4 13 4H11C9.34315 4 8 5.34315 8 7V21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6 21H18"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 📱 Electronics
const ElectronicsIcon: React.FC<IconProps> = ({
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
        <rect
            x="4"
            y="6"
            width="16"
            height="12"
            rx="2"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M8 18H16"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

// 🏠 Home & Furniture
const HomeIcon: React.FC<IconProps> = ({
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
            d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M9 21V12H15V21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 🎮 Sports & Games
const SportsIcon: React.FC<IconProps> = ({
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
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z"
            stroke={color}
            strokeWidth="2"
        />
    </svg>
);

// 💄 Beauty & Health
const BeautyIcon: React.FC<IconProps> = ({
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
            d="M12 21C16.1421 21 19.5 17.6421 19.5 13.5C19.5 9.35786 16.1421 6 12 6C7.85786 6 4.5 9.35786 4.5 13.5C4.5 17.6421 7.85786 21 12 21Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M12 6V3"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

// 📚 Books & Stationery
const BooksIcon: React.FC<IconProps> = ({
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
            d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2V2Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 🛒 Grocery Icon
const GroceryIcon: React.FC<IconProps> = ({
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
            d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.1 15.9 4.5 17 5.4 17H17M17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C18.0391 17.2107 17.5304 17 17 17ZM9 19C9 19.5304 8.78929 20.0391 8.41421 20.4142C8.03914 20.7893 7.53043 21 7 21C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19C5 18.4696 5.21071 17.9609 5.58579 17.5858C5.96086 17.2107 6.46957 17 7 17C7.53043 17 8.03914 17.2107 8.41421 17.5858C8.78929 17.9609 9 18.4696 9 19Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 🚗 Automotive
const AutomotiveIcon: React.FC<IconProps> = ({
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
            d="M5 13L3 9L8 7L10.5 10.5M5 13H18.5L21 9L16 7L13.5 10.5M5 13V17H18.5V13M13.5 10.5H10.5M10.5 10.5V13M13.5 10.5V13"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M7 17C7 17.5523 7.44772 18 8 18C8.55228 18 9 17.5523 9 17C9 16.4477 8.55228 16 8 16C7.44772 16 7 16.4477 7 17Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M17 17C17 17.5523 17.4477 18 18 18C18.5523 18 19 17.5523 19 17C19 16.4477 18.5523 16 18 16C17.4477 16 17 16.4477 17 17Z"
            stroke={color}
            strokeWidth="2"
        />
    </svg>
);

export {
    CategoriesIcon,
    FashionIcon,
    ElectronicsIcon,
    HomeIcon,
    SportsIcon,
    BeautyIcon,
    BooksIcon,
    GroceryIcon,
    AutomotiveIcon
};