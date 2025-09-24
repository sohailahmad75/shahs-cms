import { useState, useMemo } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '../../../../assets/styledIcons/CloseIcon';
import { useTheme } from '../../../../context/themeContext';
import type { Product } from '../product.types';

interface ProductFormDrawerProps {
    selectedType: string;
    onBack: () => void;
    onClose: () => void;
    onSubmit: (values: Partial<Product>) => void;
    editingProduct?: Partial<Product>;
    isSubmitting?: boolean;
}

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    sku: Yup.string().required('SKU is required'),
});

const getDefaultValues = (type: string) => ({
    sku: '',
    name: '',
    itemCode: '',
    categoryId: '',
    description: '',
    unit: 'pcs',
    salesPrice: 0,
    salesVatInclusive: false,
    salesVatRate: 20,
    incomeAccount: 'Sales of Product Income',
    purchaseCost: 0,
    purchaseTaxInclusive: false,
    purchaseTaxRate: 0,
    expenseAccount: 'Cost of Sales',
    stockAssetAccount: 'Stock Asset',
    reorderPoint: 0,
    isInventoryItem: type === 'stock',
    isActive: true,
    s3Key: '',
    availableFrom: '',
});

export default function ProductFormDrawer({
    selectedType,
    onBack,
    onClose,
    onSubmit,
    editingProduct,
    isSubmitting = false,
}: ProductFormDrawerProps) {
    const { isDarkMode: themeDarkMode } = useTheme();
    const finalDarkMode = themeDarkMode;

    const initialValues = useMemo(() => {
        const defaults = getDefaultValues(selectedType);
        return { ...defaults, ...(editingProduct || {}) };
    }, [selectedType, editingProduct]);

    const showStockFields = selectedType === 'stock';
    const showNonStockFields = selectedType === 'non-stock';

    return (
        <div className={`p-6 h-full overflow-y-auto ${finalDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white'}`}>
          
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div className="flex items-center">
                    <div className="bg-blue-600 rounded-full p-3 mr-4 flex items-center justify-center">
                        {selectedType === "stock" && (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        )}
                        {selectedType === "non-stock" && (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9M5 11V9m2 2a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6z" />
                            </svg>
                        )}
                        {selectedType === "service" && (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12v2H7v-2z" />
                            </svg>
                        )}
                        {selectedType === "bundle" && (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M12 13a4 4 0 004 4h6m-6-4h-6m-6 4a4 4 0 004-4v-4a4 4 0 00-8 0v4a4 4 0 004 4z" />
                            </svg>
                        )}
                    </div>

                    <div>
                        <h2 className={`text-lg font-semibold ${finalDarkMode ? "text-slate-100" : "text-gray-800"}`}>
                            {selectedType === "stock" && "Stock"}
                            {selectedType === "non-stock" && "Non-stock"}
                            {selectedType === "service" && "Service"}
                            {selectedType === "bundle" && "Bundle"}
                        </h2>
                        <button
                            onClick={onBack}
                            className={`text-sm hover:underline ${finalDarkMode ? "text-blue-400" : "text-blue-600"}`}
                        >
                            Change type
                        </button>
                    </div>
                </div>

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

    
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onSubmit}
            >
                {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
                    <Form onSubmit={handleSubmit} className="space-y-6">
                     
                        <div>
                            <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Name*
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={values.name}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {touched.name && errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                     
                        <div>
                            <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                SKU*
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={values.sku}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                    }`}
                                required
                            />
                            {touched.sku && errors.sku && (
                                <p className="mt-1 text-sm text-red-500">{errors.sku}</p>
                            )}
                        </div>

                  
                        <div>
                            <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Item Code
                            </label>
                            <input
                                type="text"
                                name="itemCode"
                                value={values.itemCode}
                                onChange={handleChange}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                    }`}
                            />
                        </div>

                     
                        <div className="flex items-start space-x-4">
                            <div className="flex-1">
                                <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Category
                                </label>
                                <input
                                    type="text"
                                    name="categoryId"
                                    value={values.categoryId}
                                    onChange={handleChange}
                                    placeholder="Enter category"
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                        }`}
                                />
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
                                        <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                            Reorder Point
                                        </label>
                                        <input
                                            type="number"
                                            name="reorderPoint"
                                            value={values.reorderPoint}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                            Available From
                                        </label>
                                        <input
                                            type="date"
                                            name="availableFrom"
                                            // value={values.availableFrom}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                        Stock Asset Account
                                    </label>
                                    <input
                                        type="text"
                                        name="stockAssetAccount"
                                        value={values.stockAssetAccount}
                                        onChange={handleChange}
                                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                            }`}
                                    />
                                </div>
                            </>
                        )}

                        {/* Description Field - Same as original */}
                        <div>
                            <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={values.description}
                                onChange={handleChange}
                                placeholder="Description on sales forms"
                                rows={3}
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                    }`}
                            />
                        </div>

                 
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Sales Price (£)
                                </label>
                                <input
                                    type="number"
                                    name="salesPrice"
                                    value={values.salesPrice}
                                    onChange={handleChange}
                                    step="0.01"
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Income Account
                                </label>
                                <input
                                    type="text"
                                    name="incomeAccount"
                                    value={values.incomeAccount}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="salesVatInclusive"
                                    checked={values.salesVatInclusive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label className={`ml-2 block text-sm ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Inclusive of VAT
                                </label>
                            </div>
                            <div className="mt-2">
                                <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    VAT Rate (%)
                                </label>
                                <input
                                    type="number"
                                    name="salesVatRate"
                                    value={values.salesVatRate}
                                    onChange={handleChange}
                                    step="0.01"
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                        </div>

                       
                        <div>
                            <h4 className={`text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
                                Purchasing information
                            </h4>

                         
                            {(showStockFields || showNonStockFields) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                            Cost (£)
                                        </label>
                                        <input
                                            type="number"
                                            name="purchaseCost"
                                            value={values.purchaseCost}
                                            onChange={handleChange}
                                            step="0.01"
                                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                            Expense Account
                                        </label>
                                        <input
                                            type="text"
                                            name="expenseAccount"
                                            value={values.expenseAccount}
                                            onChange={handleChange}
                                            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                                }`}
                                        />
                                    </div>
                                </div>
                            )}

             
                            <div className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    name="purchaseTaxInclusive"
                                    checked={values.purchaseTaxInclusive}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                                />
                                <label className={`ml-2 block text-sm ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Inclusive of purchase tax
                                </label>
                            </div>
                            <div>
                                <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                    Purchase Tax Rate (%)
                                </label>
                                <input
                                    type="number"
                                    name="purchaseTaxRate"
                                    value={values.purchaseTaxRate}
                                    onChange={handleChange}
                                    step="0.01"
                                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                        }`}
                                />
                            </div>
                        </div>

           
                        <div>
                            <label className={`block text-sm font-medium ${finalDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                                Unit
                            </label>
                            <input
                                type="text"
                                name="unit"
                                value={values.unit}
                                onChange={handleChange}
                                placeholder="e.g., pcs, kg, box"
                                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${finalDarkMode ? 'bg-slate-800 border-slate-600 text-slate-100' : 'border-gray-300'
                                    }`}
                            />
                        </div>

                    
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Saving...' : 'Save and close'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}