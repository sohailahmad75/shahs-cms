import { useState } from 'react';
import CloseIcon from '../../../../assets/styledIcons/CloseIcon';
import { useTheme } from '../../../../context/themeContext';

const ProductFormDrawer = ({ selectedType, onBack, onClose }) => {
    const { isDarkMode: themeDarkMode } = useTheme();
    const finalDarkMode = themeDarkMode;


    const [formData, setFormData] = useState({
        name: '',
        itemCode: '',
        category: '',
        initialQty: '',
        asOfDate: '',
        reorderPoint: '',
        stockAssetAccount: 'Stock Asset',
        description: '',
        salesPrice: '',
        incomeAccount: 'Sales of Product Income',
        vatInclusive: false,
        vatRate: '20.0% S',
        purchaseDescription: '',
        cost: '',
        expenseAccount: 'Cost of sales',
        purchaseTaxInclusive: false,
        purchaseTax: '',
        preferredSupplier: '',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        alert(`Saved ${selectedType}! (Simulated)`);
    };


    const showStockFields = selectedType === 'stock';
    const showNonStockFields = selectedType === 'non-stock';

    return (
        <div className={`p-6 h-full overflow-y-auto ${finalDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white'}`}>

            <div className="flex justify-end mb-4">
                <span
                    className={`transition duration-200 ease-in-out hover:scale-110 cursor-pointer ${finalDarkMode
                        ? "text-slate-100 hover:text-slate-200"
                        : "text-gray-600 hover:text-orange-500"
                        }`}
                    onClick={onClose}
                    role="button"
                    aria-label="Close drawer"
                >
                    <CloseIcon size={22} />
                </span>
            </div>


            <div className="flex items-center mb-6 pb-4 border-b">
                <div className="bg-blue-600 rounded-full p-3 mr-4 flex items-center justify-center">
                    {selectedType === 'stock' && (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    )}
                    {selectedType === 'non-stock' && (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9M5 11V9m2 2a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" />
                        </svg>
                    )}
                    {selectedType === 'service' && (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12v2H7v-2z" />
                        </svg>
                    )}
                    {selectedType === 'bundle' && (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M12 13a4 4 0 004 4h6m-6-4h-6m-6 4a4 4 0 004-4v-4a4 4 0 00-8 0v4a4 4 0 004 4z" />
                        </svg>
                    )}
                </div>
                <div>
                    <h2 className={`text-lg font-semibold ${finalDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>
                        {selectedType === 'stock' && 'Stock'}
                        {selectedType === 'non-stock' && 'Non-stock'}
                        {selectedType === 'service' && 'Service'}
                        {selectedType === 'bundle' && 'Bundle'}
                    </h2>
                    <button
                        onClick={onBack}
                        className={`text-sm hover:underline ${finalDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                    >
                        Change type
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">


                <div>
                    <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Name*</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                ? 'bg-slate-800 border-slate-600 text-slate-100'
                                : 'border-gray-300'
                            }`}
                        required
                    />
                </div>


                <div>
                    <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Item/Service code</label>
                    <input
                        type="text"
                        name="itemCode"
                        value={formData.itemCode}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                ? 'bg-slate-800 border-slate-600 text-slate-100'
                                : 'border-gray-300'
                            }`}
                    />
                </div>


                <div className="flex items-start space-x-4">
                    <div className="flex-1">
                        <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                    ? 'bg-slate-800 border-slate-600 text-slate-100'
                                    : 'border-gray-300'
                                }`}
                        >
                            <option value="">Choose a category</option>
                            <option value="electronics">Electronics</option>
                            <option value="clothing">Clothing</option>
                            <option value="services">Services</option>
                        </select>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 6h.01" />
                            </svg>
                        </div>
                        <div className="flex space-x-2">
                            <button type="button" className="text-xs text-gray-500 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-5L20 14.586a2 2 0 002.828 0l2.828-2.828a2 2 0 000-2.828l-2.828-2.828A2 2 0 0020 6l-5.586 5.586z" />
                                </svg>
                            </button>
                            <button type="button" className="text-xs text-gray-500 hover:text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995 5.002 2 2 0 01-1.995-5.002L3 7m11 4a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>


                {showStockFields && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Initial quantity on hand*</label>
                                <input
                                    type="number"
                                    name="initialQty"
                                    value={formData.initialQty}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                            ? 'bg-slate-800 border-slate-600 text-slate-100'
                                            : 'border-gray-300'
                                        }`}
                                    required
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>As of date*</label>
                                <input
                                    type="text"
                                    name="asOfDate"
                                    placeholder="DD/MM/YYYY"
                                    value={formData.asOfDate}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                            ? 'bg-slate-800 border-slate-600 text-slate-100'
                                            : 'border-gray-300'
                                        }`}
                                    required
                                />
                                <a href="#" className={`text-xs mt-1 inline-block ${finalDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>What's the as of date?</a>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Reorder point</label>
                                <input
                                    type="number"
                                    name="reorderPoint"
                                    value={formData.reorderPoint}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                            ? 'bg-slate-800 border-slate-600 text-slate-100'
                                            : 'border-gray-300'
                                        }`}
                                />
                                <a href="#" className={`text-xs mt-1 inline-block ${finalDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>What's the reorder point?</a>
                            </div>
                        </div>

                        <div>
                            <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Stock asset account</label>
                            <select
                                name="stockAssetAccount"
                                value={formData.stockAssetAccount}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                        ? 'bg-slate-800 border-slate-600 text-slate-100'
                                        : 'border-gray-300'
                                    }`}
                            >
                                <option>Stock Asset</option>
                                <option>Inventory Asset</option>
                            </select>
                        </div>
                    </>
                )}


                <div>
                    <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description on sales forms"
                        rows={3}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                ? 'bg-slate-800 border-slate-600 text-slate-100'
                                : 'border-gray-300'
                            }`}
                    />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Sales price/rate</label>
                        <input
                            type="number"
                            name="salesPrice"
                            value={formData.salesPrice}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                    ? 'bg-slate-800 border-slate-600 text-slate-100'
                                    : 'border-gray-300'
                                }`}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Income account</label>
                        <select
                            name="incomeAccount"
                            value={formData.incomeAccount}
                            onChange={handleChange}
                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                    ? 'bg-slate-800 border-slate-600 text-slate-100'
                                    : 'border-gray-300'
                                }`}
                        >
                            <option>Sales of Product Income</option>
                            <option>Service Revenue</option>
                        </select>
                    </div>
                </div>


                <div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="vatInclusive"
                            checked={formData.vatInclusive}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className={`ml-2 block text-sm ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Inclusive of VAT</label>
                    </div>
                    <select
                        name="vatRate"
                        value={formData.vatRate}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                ? 'bg-slate-800 border-slate-600 text-slate-100'
                                : 'border-gray-300'
                            }`}
                    >
                        <option>20.0% S</option>
                        <option>10.0% R</option>
                        <option>0% Exempt</option>
                    </select>
                </div>


                <div>
                    <h4 className={`text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'} mb-2`}>Purchasing information</h4>
                    <textarea
                        name="purchaseDescription"
                        value={formData.purchaseDescription}
                        onChange={handleChange}
                        placeholder="Description on purchase forms"
                        rows={2}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                ? 'bg-slate-800 border-slate-600 text-slate-100'
                                : 'border-gray-300'
                            }`}
                    />
                </div>


                {(showStockFields || showNonStockFields) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Cost</label>
                            <input
                                type="number"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                        ? 'bg-slate-800 border-slate-600 text-slate-100'
                                        : 'border-gray-300'
                                    }`}
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Expense account</label>
                            <select
                                name="expenseAccount"
                                value={formData.expenseAccount}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                        ? 'bg-slate-800 border-slate-600 text-slate-100'
                                        : 'border-gray-300'
                                    }`}
                            >
                                <option>Cost of sales</option>
                                <option>Operating Expenses</option>
                            </select>
                        </div>
                    </div>
                )}


                <div>
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="purchaseTaxInclusive"
                            checked={formData.purchaseTaxInclusive}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                        <label className={`ml-2 block text-sm ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Inclusive of purchase tax</label>
                    </div>
                    <select
                        name="purchaseTax"
                        value={formData.purchaseTax}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                ? 'bg-slate-800 border-slate-600 text-slate-100'
                                : 'border-gray-300'
                            }`}
                    >
                        <option>Select tax</option>
                        <option>20.0% S</option>
                        <option>10.0% R</option>
                    </select>
                </div>


                <div>
                    <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Preferred Supplier</label>
                    <select
                        name="preferredSupplier"
                        value={formData.preferredSupplier}
                        onChange={handleChange}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode
                                ? 'bg-slate-800 border-slate-600 text-slate-100'
                                : 'border-gray-300'
                            }`}
                    >
                        <option>Select a preferred supplier</option>
                        <option>Supplier A</option>
                        <option>Supplier B</option>
                    </select>
                </div>


                <div className="pt-6">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Save and close
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ProductFormDrawer;