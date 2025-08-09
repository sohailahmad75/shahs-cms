import React from "react";

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const SettingIcon: React.FC<IconProps> = ({
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
      d="M19.14 12.936c.04-.3.06-.61.06-.936s-.02-.636-.06-.936l2.03-1.578a.5.5 0 0 0 .12-.64l-1.922-3.323a.5.5 0 0 0-.602-.22l-2.39.96a7.034 7.034 0 0 0-1.616-.936l-.36-2.52A.5.5 0 0 0 14.5 2h-5a.5.5 0 0 0-.494.427l-.36 2.52a7.034 7.034 0 0 0-1.616.936l-2.39-.96a.5.5 0 0 0-.602.22L2.58 8.486a.5.5 0 0 0 .12.64L4.73 10.704c-.04.3-.06.61-.06.936s.02.636.06.936l-2.03 1.578a.5.5 0 0 0-.12.64l1.922 3.323a.5.5 0 0 0 .602.22l2.39-.96c.5.39 1.044.714 1.616.936l.36 2.52a.5.5 0 0 0 .494.427h5a.5.5 0 0 0 .494-.427l.36-2.52a7.034 7.034 0 0 0 1.616-.936l2.39.96a.5.5 0 0 0 .602-.22l1.922-3.323a.5.5 0 0 0-.12-.64l-2.03-1.578ZM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7Z"
      fill={color}
    />
  </svg>
);

export default SettingIcon;
