import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CloseIcon from "../../../../assets/styledIcons/CloseIcon";
import { useTheme } from "../../../../context/themeContext";
import type { Product } from "../product.types";

import NonStockIcon from "../../../../assets/styledIcons/NonStockIcon";
import StockIcon from "../../../../assets/styledIcons/StockIcon";
import ServiceIcon from "../../../../assets/styledIcons/ServiceIcon";

// Themed controls (have internal error rendering)
import InputField from "../../../../components/InputField";
import SelectField from "../../../../components/SelectField";
import CheckboxField from "../../../../components/CheckboxField";
import DatePickerField from "../../../../components/DatePickerField";

interface ProductFormDrawerProps {
  selectedType: "stock" | "non-stock" | "service";
  onBack: () => void;
  onClose: () => void;
  onSubmit: (values: Partial<Product>) => void;
  editingProduct?: Partial<Product>;
  isSubmitting?: boolean;

  // Option sources (plug your API lists in)
  categoryOptions?: { value: string; label: string }[];
  vatOptions?: { value: string; label: string }[]; // e.g. [{value:"NO_VAT",label:"No VAT"}, {value:"S_20",label:"20% S"}]
  incomeAccountOptions?: { value: string; label: string }[];
  expenseAccountOptions?: { value: string; label: string }[];
  stockAssetAccountOptions?: { value: string; label: string }[];
  purchaseTaxOptions?: { value: string; label: string }[];
  supplierOptions?: { value: string; label: string }[];
}

const defaultOptions = {
  categories: [{ value: "", label: "Choose a category" }],
  vat: [
    { value: "NO_VAT", label: "No VAT" },
    { value: "S_20", label: "20.0% S" },
  ],
  income: [
    { value: "Sales of Product Income", label: "Sales of Product Income" },
  ],
  expense: [{ value: "cost_of_sales", label: "Cost of sales" }],
  stockAsset: [{ value: "Stock Asset", label: "Stock Asset" }],
  purchaseTax: [{ value: "NO_VAT", label: "No VAT" }],
  suppliers: [{ value: "", label: "Select a preferred supplier" }],
};

const qbValidation = Yup.object({
  name: Yup.string().required("Name is required"),
  sku: Yup.string().required("Item/Service code is required"),
  // Stock-only requirements
  initialQuantity: Yup.number()
    .transform((v, o) => (o === "" || o === null ? undefined : v))
    .when("isInventoryItem", {
      is: true,
      then: (s) => s.required("Initial quantity on hand is required"),
      otherwise: (s) => s.optional(),
    }),
  initialAsOf: Yup.mixed().when("isInventoryItem", {
    is: true,
    then: (s) => s.required("As of date is required"),
    otherwise: (s) => s.optional(),
  }),
});

const getDefaultValues = (type: string) => ({
  // header
  name: "",
  sku: "", // Item/Service code
  categoryId: "",
  // stock section
  initialQuantity: undefined as number | undefined,
  initialAsOf: "",
  reorderPoint: undefined as number | undefined,
  stockAssetAccount: "Stock Asset",
  // descriptions
  salesDescription: "",
  purchaseDescription: "",
  // sales section
  salesPrice: undefined as number | undefined,
  incomeAccount: "Sales of Product Income",
  salesVatInclusive: false,
  salesVatCode: "S_20",
  // purchase section
  purchaseCost: undefined as number | undefined,
  expenseAccount: "cost_of_sales",
  purchaseTaxInclusive: false,
  purchaseTaxCode: "NO_VAT",
  // supplier
  preferredSupplierId: "",
  // flags
  isInventoryItem: type === "stock",
  isActive: true,
});

export default function ProductFormDrawer({
  selectedType,
  onBack,
  onClose,
  onSubmit,
  editingProduct,
  isSubmitting = false,

  categoryOptions = defaultOptions.categories,
  vatOptions = defaultOptions.vat,
  incomeAccountOptions = defaultOptions.income,
  expenseAccountOptions = defaultOptions.expense,
  stockAssetAccountOptions = defaultOptions.stockAsset,
  purchaseTaxOptions = defaultOptions.purchaseTax,
  supplierOptions = defaultOptions.suppliers,
}: ProductFormDrawerProps) {
  const { isDarkMode } = useTheme();

  const initialValues = useMemo(() => {
    const defaults = getDefaultValues(selectedType);
    return { ...defaults, ...(editingProduct || {}) };
  }, [selectedType, editingProduct]);
  const finalDarkMode = isDarkMode;
  const isStock = selectedType === "stock";

  return (
    <div
      className={`p-6 h-full overflow-y-auto ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-white"}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center">
          <div className="mr-4 rounded-full p-3 flex items-center justify-center text-orange-100 border border-orange-100 bg-orange-500/10">
            {selectedType === "stock" && <StockIcon />}
            {selectedType === "non-stock" && <NonStockIcon />}
            {selectedType === "service" && <ServiceIcon />}
          </div>

          <div>
            <h2
              className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}
            >
              Product/Service information
            </h2>
            <button
              type="button"
              onClick={onBack}
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Change type
            </button>
          </div>
        </div>

        <button
          className={`transition duration-200 ease-in-out hover:scale-110 cursor-pointer ${isDarkMode ? "text-slate-100 hover:text-slate-200" : "text-gray-600 hover:text-orange-500"}`}
          onClick={onClose}
          aria-label="Close drawer"
        >
          <CloseIcon size={22} />
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={qbValidation}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* Row: Name + Image placeholder (right) */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4">
              <div className="flex flex-col gap-4">
                <InputField
                  label="Name"
                  required
                  name="name"
                  placeholder=""
                  type="textarea"
                  value={values.name || ""}
                  onChange={handleChange}
                  error={
                    touched.name && errors.name ? (errors.name as string) : ""
                  }
                  rows={2}
                />
                <InputField
                  label="Item/Service code"
                  required
                  name="sku"
                  placeholder=""
                  value={values.sku || ""}
                  onChange={handleChange}
                  error={
                    touched.sku && errors.sku ? (errors.sku as string) : ""
                  }
                />
              </div>
              {/* Simple thumbnail placeholder (optional to wire up later) */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-full aspect-square min-h-[120px] border-2 border-dashed border-gray-300 dark:border-slate-600 rounded flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 6h.01"
                    />
                  </svg>
                </div>
                <div className="flex gap-3 text-xs text-gray-500 dark:text-slate-400">
                  <button
                    type="button"
                    className="hover:text-gray-700 dark:hover:text-slate-200"
                  >
                    Upload
                  </button>
                  <button
                    type="button"
                    className="hover:text-red-500 dark:hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Item/Service code */}

            {/* Category (dropdown) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <SelectField
                name="categoryId"
                value={String(values.categoryId || "")}
                onChange={(e: any) =>
                  setFieldValue("categoryId", e.target.value)
                }
                options={categoryOptions}
              />
            </div>
            <hr className="my-3 border-gray-300 my-7" />
            {/* --- STOCK: Initial qty / As-of date / Reorder point --- */}
            {/* --- STOCK: Initial qty / As-of date / Reorder point --- */}
            {/* --- STOCK: Initial qty / As-of date / Reorder point (QB-style two-column row) --- */}
            {/* --- STOCK: Initial qty / As-of date / Reorder point (responsive rows) --- */}
            {isStock && (
              <>
                {/* Row 1: Initial qty */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_18rem] gap-2 md:gap-2 items-center md:items-center pe-0 md:pe-10">
                  <p
                    className={`text-sm font-semibold text-center ${finalDarkMode ? "text-slate-200" : "text-gray-800"}`}
                  >
                    Initial quantity on hand
                    <span className="ms-1 text-red-500">*</span>
                  </p>
                  <InputField
                    required
                    name="initialQuantity"
                    type="number"
                    value={values.initialQuantity ?? ""}
                    onChange={handleChange}
                    error={
                      touched.initialQuantity && errors.initialQuantity
                        ? (errors.initialQuantity as string)
                        : ""
                    }
                  />
                </div>

                {/* Row 2: As of date */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_18rem] gap-2 md:gap-4 items-center md:items-center pe-0 md:pe-10">
                  <p
                    className={`text-sm font-semibold text-center ${finalDarkMode ? "text-slate-200" : "text-gray-800"}`}
                  >
                    As of date <span className="ms-1 text-red-500">*</span>
                  </p>
                  <DatePickerField
                    name="initialAsOf"
                    value={(values.initialAsOf as any) || ""}
                    onChange={(v: any) => setFieldValue("initialAsOf", v)}
                    error={
                      touched.initialAsOf && errors.initialAsOf
                        ? (errors.initialAsOf as string)
                        : ""
                    }
                  />
                </div>

                {/* Row 3: Reorder point */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_18rem] gap-2 md:gap-4 items-center md:items-center pe-0 md:pe-10">
                  <p
                    className={`text-sm font-semibold text-center ${finalDarkMode ? "text-slate-200" : "text-gray-800"}`}
                  >
                    Reorder point
                  </p>
                  <InputField
                    name="reorderPoint"
                    type="number"
                    value={values.reorderPoint ?? ""}
                    onChange={handleChange}
                    error={
                      touched.reorderPoint && (errors as any).reorderPoint
                        ? ((errors as any).reorderPoint as string)
                        : ""
                    }
                  />
                </div>
                <hr className="my-3 border-gray-300 my-7" />
                {/* Stock asset account (full width below) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Stock asset account
                  </label>
                  <SelectField
                    name="stockAssetAccount"
                    value={String(values.stockAssetAccount || "")}
                    onChange={(e: any) =>
                      setFieldValue("stockAssetAccount", e.target.value)
                    }
                    options={stockAssetAccountOptions}
                  />
                </div>
              </>
            )}
            <hr className="my-3 border-gray-300 my-7" />
            {/* Sales description */}
            <InputField
              type="textarea"
              label="Description"
              name="salesDescription"
              placeholder="Description on sales forms"
              rows={3}
              value={values.salesDescription || ""}
              onChange={handleChange}
            />

            {/* Sales price + Income account */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Sales price/rate"
                name="salesPrice"
                type="number"
                value={values.salesPrice ?? ""}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Income account
                </label>
                <SelectField
                  name="incomeAccount"
                  value={String(values.incomeAccount || "")}
                  onChange={(e: any) =>
                    setFieldValue("incomeAccount", e.target.value)
                  }
                  options={incomeAccountOptions}
                />
              </div>
            </div>

            {/* Inclusive of VAT + VAT code */}
            <div className="mb-4">
              <CheckboxField
                name="salesVatInclusive"
                label="Inclusive of VAT"
                checked={!!values.salesVatInclusive}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                VAT
              </label>
              <SelectField
                name="salesVatCode"
                value={String(values.salesVatCode || "")}
                onChange={(e: any) =>
                  setFieldValue("salesVatCode", e.target.value)
                }
                options={vatOptions}
              />
            </div>
            <hr className="my-3 border-gray-300 my-7" />
            {/* Purchasing information title */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                Purchasing information
              </h4>
              <InputField
                type="textarea"
                name="purchaseDescription"
                placeholder="Description on purchase forms"
                rows={3}
                value={values.purchaseDescription || ""}
                onChange={handleChange}
              />
            </div>

            {/* Cost + Expense account */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Cost"
                name="purchaseCost"
                type="number"
                value={values.purchaseCost ?? ""}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Expense account
                </label>
                <SelectField
                  name="expenseAccount"
                  value={String(values.expenseAccount || "")}
                  onChange={(e: any) =>
                    setFieldValue("expenseAccount", e.target.value)
                  }
                  options={expenseAccountOptions}
                />
              </div>
            </div>

            {/* Inclusive of purchase tax + Purchase tax select */}
            <div className="mb-4">
              <CheckboxField
                name="purchaseTaxInclusive"
                label="Inclusive of purchase tax"
                checked={!!values.purchaseTaxInclusive}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Purchase tax
              </label>
              <SelectField
                name="purchaseTaxCode"
                value={String(values.purchaseTaxCode || "")}
                onChange={(e: any) =>
                  setFieldValue("purchaseTaxCode", e.target.value)
                }
                options={purchaseTaxOptions}
              />
            </div>
            {/* Preferred Supplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Preferred Supplier
              </label>
              <SelectField
                name="preferredSupplierId"
                value={String(values.preferredSupplierId || "")}
                onChange={(e: any) =>
                  setFieldValue("preferredSupplierId", e.target.value)
                }
                options={supplierOptions}
              />
            </div>

            {/* Save button (QB-style green) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto block rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save and close"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
