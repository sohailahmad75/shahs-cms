import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    color?: string;
    salesCount?: number; 
}

const SalesIcon: React.FC<IconProps> = ({
    size = 18,
    color = "currentColor",
    salesCount,
    ...props
}) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
     
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
     
            <rect x="3" y="12" width="3" height="8" rx="1" fill={color} opacity="0.7" />
            <rect x="8" y="8" width="3" height="12" rx="1" fill={color} opacity="0.8" />
            <rect x="13" y="5" width="3" height="15" rx="1" fill={color} opacity="0.9" />
            <rect x="18" y="2" width="2" height="18" rx="1" fill={color} />

            <path
                d="M2 18 L7 12 L11 15 L19 6"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            <path
                d="M17.5 7.5 L20.5 4.5 L19 4.5 Z"
                fill={color}
            />
        </svg>

        {salesCount !== undefined && (
            <div style={{
                fontSize: "14px",
                fontWeight: "bold",
                color: color,
                background: `${color}15`,
                padding: "2px 8px",
                borderRadius: "12px",
                border: `1px solid ${color}30`
            }}>
                {salesCount.toLocaleString()}
            </div>
        )}
    </div>
);

export default SalesIcon;