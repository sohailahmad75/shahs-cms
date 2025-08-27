import { useTheme } from "../context/themeContext";

const Loader = ({ className = "h-40" }) => {
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`flex items-center justify-center w-full ${className || ""}`}
    >
      <div
        className={`
          w-6 h-6 border-4 border-t-transparent rounded-full animate-spin
          ${isDarkMode ? "border-slate-700" : "border-orange-500"}
        `}
      />
    </div>
  );
};

export default Loader;

