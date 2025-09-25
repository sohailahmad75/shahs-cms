

import CloseIcon from "../../../../assets/styledIcons/CloseIcon";
import { useTheme } from "../../../../context/themeContext";

const TypeSelectorDrawer = ({ onSelect, onClose }) => {
    const { isDarkMode: themeDarkMode } = useTheme();
    const finalDarkMode = themeDarkMode;

    const types = [
        {
            id: 'stock',
            title: 'Stock',
            description: 'Products you buy and/or sell and that you track quantities of.',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            ),
        },
        {
            id: 'non-stock',
            title: 'Non-stock',
            description: 'Products you buy and/or sell but don need to track quantities of, for example, nuts and bolts used in an installation.',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9M5 11V9m2 2a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" />
                </svg>
            ),
        },
        {
            id: 'service',
            title: 'Service',
            description: 'Services that you provide to customers, for example, landscaping or VAT preparation services.',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12v2H7v-2z" />
                </svg>
            ),
        },
        {
            id: 'bundle',
            title: 'Bundle',
            description: 'A collection of products and/or services that you sell together, for example, a gift basket of fruit, cheese, and wine.',
            icon: (
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M12 13a4 4 0 004 4h6m-6-4h-6m-6 4a4 4 0 004-4v-4a4 4 0 00-8 0v4a4 4 0 004 4z" />
                </svg>
            ),
        },
    ];

    return (
        <div className={`p-4 ${finalDarkMode ? "bg-slate-800 border-slate-700" : "bg-gray-50"} border-b h-full overflow-y-auto`}>
            <div className="flex justify-between items-center mb-4 relative pt-4">
                <h3 className={`text-lg font-semibold ${finalDarkMode ? "text-slate-100" : "text-gray-800"}`}>
                    Product/Service information
                </h3>

                <span
                    className={`transition duration-200 ease-in-out hover:scale-110 cursor-pointer ${finalDarkMode
                        ? "text-slate-100 hover:text-slate-200"
                        : "text-gray-600 hover:text-orange-500"
                        }`}
                    onClick={onClose}
                    role="button"
                    aria-label="Close modal"
                >
                    <CloseIcon size={22} />
                </span>
            </div>

            {types.map((type) => (
                <div
                    key={type.id}
                    className={`flex items-start p-4 mb-4 rounded-lg shadow-sm cursor-pointer transition ${finalDarkMode
                        ? "bg-slate-700 hover:bg-slate-600"
                        : "bg-white hover:bg-blue-50"
                        }`}
                    onClick={() => onSelect(type.id)}
                >
                    <div className="bg-blue-600 rounded-full p-3 mr-4 flex items-center justify-center">
                        {type.icon}
                    </div>
                    <div>
                        <h4 className={`font-medium ${finalDarkMode ? "text-slate-100" : "text-gray-800"}`}>
                            {type.title}
                        </h4>
                        <p className={`text-sm mt-1 ${finalDarkMode ? "text-slate-300" : "text-gray-600"}`}>
                            {type.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TypeSelectorDrawer;