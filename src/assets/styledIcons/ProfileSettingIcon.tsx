import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const ProfileSettingIcon: React.FC<IconProps> = ({
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
    <circle
      cx="12"
      cy="8"
      r="3"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.5 17.5C19.5 16.9 19.4 16.3 19.2 15.8L20.2 14.9C20.4 14.7 20.4 14.3 20.2 14.1L18.9 12.8C18.7 12.6 18.3 12.6 18.1 12.8L17.2 13.8C16.7 13.6 16.1 13.5 15.5 13.5C14.9 13.5 14.3 13.6 13.8 13.8L12.9 12.8C12.7 12.6 12.3 12.6 12.1 12.8L10.8 14.1C10.6 14.3 10.6 14.7 10.8 14.9L11.8 15.8C11.6 16.3 11.5 16.9 11.5 17.5C11.5 18.1 11.6 18.7 11.8 19.2L10.8 20.1C10.6 20.3 10.6 20.7 10.8 20.9L12.1 22.2C12.3 22.4 12.7 22.4 12.9 22.2L13.8 21.2C14.3 21.4 14.9 21.5 15.5 21.5C16.1 21.5 16.7 21.4 17.2 21.2L18.1 22.2C18.3 22.4 18.7 22.4 18.9 22.2L20.2 20.9C20.4 20.7 20.4 20.3 20.2 20.1L19.2 19.2C19.4 18.7 19.5 18.1 19.5 17.5Z"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 20C4.7 17 8 15.5 12 15.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default ProfileSettingIcon;
