import CloseIcon from "../../../../assets/styledIcons/CloseIcon";
import { useTheme } from "../../../../context/themeContext";
import StockIcon from "../../../../assets/styledIcons/StockIcon";
import NonStockIcon from "../../../../assets/styledIcons/NonStockIcon";
import ServiceIcon from "../../../../assets/styledIcons/ServiceIcon";

const TypeSelectorDrawer = ({ onSelect, onClose }) => {
  const { isDarkMode } = useTheme();

  const types = [
    {
      id: "stock",
      title: "Stock",
      description:
        "Products you buy and/or sell and that you track quantities of.",
      icon: <StockIcon size={28} />,
    },
    {
      id: "non-stock",
      title: "Non-stock",
      description:
        "Products you buy and/or sell but don’t need to track quantities of, e.g. bolts used in an installation.",
      icon: <NonStockIcon size={28} />,
    },
    {
      id: "service",
      title: "Service",
      description:
        "Services that you provide to customers, e.g. landscaping or VAT preparation services.",
      icon: <ServiceIcon size={30} />,
    },
  ];

  return (
    <div
      className={`p-5 h-full overflow-y-auto border-b ${
        isDarkMode
          ? "bg-slate-800 border-slate-700"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3
          className={`text-lg font-semibold ${
            isDarkMode ? "text-slate-100" : "text-secondary-100"
          }`}
        >
          Product/Service Information
        </h3>
        <button
          onClick={onClose}
          aria-label="Close modal"
          className={`transition duration-200 ease-in-out hover:scale-110 ${
            isDarkMode
              ? "text-slate-300 hover:text-slate-100"
              : "text-gray-500 hover:text-orange-500"
          }`}
        >
          <CloseIcon size={22} />
        </button>
      </div>

      {/* List */}
      {types.map((type) => (
        <div
          key={type.id}
          onClick={() => onSelect(type.id)}
          className={`flex items-start gap-4 p-4 mb-4 rounded-lg cursor-pointer transition border ${
            isDarkMode
              ? "bg-slate-700 border-slate-600 hover:bg-slate-600"
              : "bg-white border-gray-200 hover:bg-orange-50"
          }`}
        >
          <div className="rounded-full p-3 flex items-center justify-center text-orange-100 border border-orange-100">
            {type.icon}
          </div>
          <div>
            <h4
              className={`font-medium ${
                isDarkMode ? "text-slate-100" : "text-secondary-100"
              }`}
            >
              {type.title}
            </h4>
            <p
              className={`text-sm mt-1 ${
                isDarkMode ? "text-slate-300" : "text-gray-600"
              }`}
            >
              {type.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TypeSelectorDrawer;
