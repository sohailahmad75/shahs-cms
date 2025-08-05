const Loader = ({ className = "h-40" }) => {
  return (
    <div
      className={`flex items-center justify-center w-full ${className || ""} `}
    >
      <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
