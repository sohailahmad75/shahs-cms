import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    color?: string;
}

// 👥 Suppliers Icon
const SuppliersIcon: React.FC<IconProps> = ({
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
            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 🏢 Company/Business Supplier
const BusinessSupplierIcon: React.FC<IconProps> = ({
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
            d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M16 7H8V11H16V7Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M12 15V17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M8 15H16"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

// 📦 Inventory Supplier
const InventorySupplierIcon: React.FC<IconProps> = ({
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
            d="M12 21V11"
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
            d="M8 11V17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M16 11V17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 🚚 Delivery Supplier
const DeliverySupplierIcon: React.FC<IconProps> = ({
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
            d="M16 3H1V16H16V3Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M16 8H20L23 11V16H16V8Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M5.5 21C6.88071 21 8 19.8807 8 18.5C8 17.1193 6.88071 16 5.5 16C4.11929 16 3 17.1193 3 18.5C3 19.8807 4.11929 21 5.5 21Z"
            stroke={color}
            strokeWidth="2"
        />
        <path
            d="M18.5 21C19.8807 21 21 19.8807 21 18.5C21 17.1193 19.8807 16 18.5 16C17.1193 16 16 17.1193 16 18.5C16 19.8807 17.1193 21 18.5 21Z"
            stroke={color}
            strokeWidth="2"
        />
    </svg>
);

// 📊 Analytics Supplier
const AnalyticsSupplierIcon: React.FC<IconProps> = ({
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
            d="M3 3V21H21"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M7 16L10 11L13 14L17 8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M17 12H17.01"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

// 🤝 Partnership Supplier
const PartnershipIcon: React.FC<IconProps> = ({
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
            d="M8 17H6C4.89543 17 4 16.1046 4 15V9C4 7.89543 4.89543 7 6 7H8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M16 7H18C19.1046 7 20 7.89543 20 9V15C20 16.1046 19.1046 17 18 17H16"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M12 21V17"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M12 7V3"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M8 21H16"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

// ⭐ Premium Supplier
const PremiumSupplierIcon: React.FC<IconProps> = ({
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
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

// 📞 Contact Supplier
const ContactSupplierIcon: React.FC<IconProps> = ({
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
            d="M22 16.92V19.92C22.0002 20.1985 21.9154 20.4703 21.7572 20.6992C21.599 20.9282 21.3748 21.1034 21.114 21.203C20.8532 21.3026 20.5677 21.3222 20.295 21.259C20.0223 21.1958 19.7752 21.0526 19.585 20.848C18.9333 20.1478 18.1486 19.5819 17.2774 19.1837C16.4062 18.7855 15.466 18.5628 14.51 18.528C12.346 18.441 10.26 19.267 8.708 20.819C7.899 21.632 6.992 21.994 6.075 22C5.762 22 5.452 21.964 5.15 21.889L2 21L2.889 18.85C3.086 18.296 3.125 17.7 3 17.13C2.968 16.98 2.968 16.82 3 16.67C3.21 15.694 3.791 14.848 4.611 14.311C6.019 13.354 7.676 12.896 9.338 13.002C11.0002 13.1077 12.5911 13.7711 13.848 14.885C14.593 15.567 15.171 16.398 15.56 17.33"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
            stroke={color}
            strokeWidth="2"
        />
    </svg>
);

// 💰 Payment Terms Icon
const PaymentTermsIcon: React.FC<IconProps> = ({
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
            d="M12 1V23"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export {
    SuppliersIcon,
    BusinessSupplierIcon,
    InventorySupplierIcon,
    DeliverySupplierIcon,
    AnalyticsSupplierIcon,
    PartnershipIcon,
    PremiumSupplierIcon,
    ContactSupplierIcon,
    PaymentTermsIcon
};