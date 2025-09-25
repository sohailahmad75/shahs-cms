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

// ✅ Your dropzone + S3 uploader
import FileUploader from "../../../../components/FileUploader";

interface ProductFormDrawerProps {
  selectedType: "stock" | "non-stock" | "service";
  onBack: () => void;
  onClose: () => void;
  onSubmit: (values: Partial<Product>) => void;
  editingProduct?: Partial<Product>;
  isSubmitting?: boolean;

  // Option sources
  categoryOptions?: { value: string; label: string }[];
  vatOptions?: { value: string; label: string }[];
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

// ✅ Validation (unchanged, s3Key optional)
const qbValidation = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  sku: Yup.string().trim().required("Item/Service code is required"),

  isInventoryItem: Yup.boolean().default(false),

  initialQuantity: Yup.number()
    .transform((v, o) => (o === "" || o === null ? undefined : v))
    .when("isInventoryItem", {
      is: true,
      then: (s) =>
        s
          .required("Initial quantity on hand is required")
          .min(0, "Initial quantity cannot be negative"),
      otherwise: (s) => s.optional(),
    }),

  initialAsOf: Yup.mixed().when("isInventoryItem", {
    is: true,
    then: (s) => s.required("As of date is required"),
    otherwise: (s) => s.optional(),
  }),

  reorderPoint: Yup.number()
    .transform((v, o) => (o === "" || o === null ? undefined : v))
    .min(0, "Reorder point cannot be negative")
    .optional(),

  stockAssetAccount: Yup.string().when("isInventoryItem", {
    is: true,
    then: (s) => s.required("Stock asset account is required"),
    otherwise: (s) => s.optional(),
  }),

  salesPrice: Yup.number()
    .transform((v, o) => (o === "" || o === null ? undefined : v))
    .min(0, "Sales price cannot be negative")
    .optional(),
  incomeAccount: Yup.string().when("salesPrice", {
    is: (v: any) => v !== undefined && v !== null && v !== "",
    then: (s) => s.required("Income account is required when price is set"),
    otherwise: (s) => s.optional(),
  }),
  salesVatCode: Yup.string().optional(),

  purchaseCost: Yup.number()
    .transform((v, o) => (o === "" || o === null ? undefined : v))
    .min(0, "Cost cannot be negative")
    .optional(),
  expenseAccount: Yup.string().when("purchaseCost", {
    is: (v: any) => v !== undefined && v !== null && v !== "",
    then: (s) => s.required("Expense account is required when cost is set"),
    otherwise: (s) => s.optional(),
  }),

  categoryId: Yup.string().optional(),
  purchaseTaxCode: Yup.string().optional(),
  preferredSupplierId: Yup.string().optional(),

  // If you want to make image required, uncomment:
  // s3Key: Yup.string().required("Product image is required"),
});

const getDefaultValues = (type: string) => ({
  // header
  name: "",
  sku: "",
  categoryId: "",
  // image
  s3Key: "", // ✅ add image key to form values
  // stock section
  initialQuantity: undefined as number | undefined,
  initialAsOf: "",
  reorderPoint: undefined as number | undefined,
  stockAssetAccount: "Stock Asset",
  // descriptions
  salesDescription: "",
  purchaseDescription: "",
  // sales
  salesPrice: undefined as number | undefined,
  incomeAccount: "Sales of Product Income",
  salesVatInclusive: false,
  salesVatCode: "S_20",
  // purchasing
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
    // If you keep a signed URL for preview on edit, make sure `editingProduct` includes it (e.g., `editingProduct.signedUrl`)
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

          <div className="flex flex-col gap-1 leading-[1.1]">
            <p>
              {selectedType === "stock" && "Stock item"}
              {selectedType === "non-stock" && "Non-stock item"}
              {selectedType === "service" && "Service"}
            </p>
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
          className={`transition duration-200 ease-in-out hover:scale-110 cursor-pointer ${
            isDarkMode
              ? "text-slate-100 hover:text-slate-200"
              : "text-gray-600 hover:text-orange-500"
          }`}
          onClick={onClose}
          aria-label="Close drawer"
        >
          <CloseIcon size={22} />
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={qbValidation}
        validateOnBlur
        validateOnChange
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* Row: Name + Image */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_140px] gap-4">
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

              {/* ✅ Functional Image Upload */}
              <div className="flex flex-col items-center gap-2">
                <FileUploader
                  // store key in form state
                  value={values.s3Key || ""}
                  onChange={(key: string) => {
                    setFieldValue("s3Key", key);
                    setFieldTouched("s3Key", true, true);
                  }}
                  type="image"
                  // pick the path your backend expects for product images
                  // examples from your uploader: "menu-items", "menu-categories", etc.
                  path="menu-items"
                  // if you have a signed URL on the edit payload, pass it here
                  initialPreview={(editingProduct as any)?.signedUrl || ""}
                  // show any validation error if you decide to require s3Key
                  error={
                    touched.s3Key && (errors as any).s3Key
                      ? ((errors as any).s3Key as string)
                      : null
                  }
                  size={2}
                  fit="cover"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <SelectField
                name="categoryId"
                value={String(values.categoryId || "")}
                onChange={(e: any) => {
                  setFieldValue("categoryId", e.target.value);
                  setFieldTouched("categoryId", true, true);
                }}
                options={categoryOptions}
                error={
                  touched.categoryId && (errors as any).categoryId
                    ? ((errors as any).categoryId as string)
                    : ""
                }
              />
            </div>

            <hr className="my-7 border-gray-300" />

            {/* STOCK SECTION */}
            {isStock && (
              <>
                {/* Initial qty */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_18rem] gap-2 md:gap-2 items-center md:items-center pe-0 md:pe-10">
                  <p
                    className={`text-sm font-semibold text-center ${finalDarkMode ? "text-slate-200" : "text-gray-800"}`}
                  >
                    Initial quantity on hand{" "}
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

                {/* As of date */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_18rem] gap-2 md:gap-4 items-center md:items-center pe-0 md:pe-10">
                  <p
                    className={`text-sm font-semibold text-center ${finalDarkMode ? "text-slate-200" : "text-gray-800"}`}
                  >
                    As of date <span className="ms-1 text-red-500">*</span>
                  </p>
                  <DatePickerField
                    name="initialAsOf"
                    value={(values.initialAsOf as any) || ""}
                    onChange={(v: any) => {
                      setFieldValue("initialAsOf", v);
                      setFieldTouched("initialAsOf", true, true);
                    }}
                    error={
                      touched.initialAsOf && errors.initialAsOf
                        ? (errors.initialAsOf as string)
                        : ""
                    }
                  />
                </div>

                {/* Reorder point */}
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

                <hr className="my-7 border-gray-300" />

                {/* Stock asset account */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                    Stock asset account
                  </label>
                  <SelectField
                    name="stockAssetAccount"
                    value={String(values.stockAssetAccount || "")}
                    onChange={(e: any) => {
                      setFieldValue("stockAssetAccount", e.target.value);
                      setFieldTouched("stockAssetAccount", true, true);
                    }}
                    options={stockAssetAccountOptions}
                    error={
                      touched.stockAssetAccount &&
                      (errors as any).stockAssetAccount
                        ? ((errors as any).stockAssetAccount as string)
                        : ""
                    }
                  />
                </div>
              </>
            )}

            <hr className="my-7 border-gray-300" />

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
                error={
                  touched.salesPrice && (errors as any).salesPrice
                    ? ((errors as any).salesPrice as string)
                    : ""
                }
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Income account
                </label>
                <SelectField
                  name="incomeAccount"
                  value={String(values.incomeAccount || "")}
                  onChange={(e: any) => {
                    setFieldValue("incomeAccount", e.target.value);
                    setFieldTouched("incomeAccount", true, true);
                  }}
                  options={incomeAccountOptions}
                  error={
                    touched.incomeAccount && (errors as any).incomeAccount
                      ? ((errors as any).incomeAccount as string)
                      : ""
                  }
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
                onChange={(e: any) => {
                  setFieldValue("salesVatCode", e.target.value);
                  setFieldTouched("salesVatCode", true, true);
                }}
                options={vatOptions}
                error={
                  touched.salesVatCode && (errors as any).salesVatCode
                    ? ((errors as any).salesVatCode as string)
                    : ""
                }
              />
            </div>

            <hr className="my-7 border-gray-300" />

            {/* Purchasing information */}
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
                error={
                  touched.purchaseCost && (errors as any).purchaseCost
                    ? ((errors as any).purchaseCost as string)
                    : ""
                }
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                  Expense account
                </label>
                <SelectField
                  name="expenseAccount"
                  value={String(values.expenseAccount || "")}
                  onChange={(e: any) => {
                    setFieldValue("expenseAccount", e.target.value);
                    setFieldTouched("expenseAccount", true, true);
                  }}
                  options={expenseAccountOptions}
                  error={
                    touched.expenseAccount && (errors as any).expenseAccount
                      ? ((errors as any).expenseAccount as string)
                      : ""
                  }
                />
              </div>
            </div>

            {/* Inclusive of purchase tax + Purchase tax */}
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
                onChange={(e: any) => {
                  setFieldValue("purchaseTaxCode", e.target.value);
                  setFieldTouched("purchaseTaxCode", true, true);
                }}
                options={purchaseTaxOptions}
                error={
                  touched.purchaseTaxCode && (errors as any).purchaseTaxCode
                    ? ((errors as any).purchaseTaxCode as string)
                    : ""
                }
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
                onChange={(e: any) => {
                  setFieldValue("preferredSupplierId", e.target.value);
                  setFieldTouched("preferredSupplierId", true, true);
                }}
                options={supplierOptions}
                error={
                  touched.preferredSupplierId &&
                  (errors as any).preferredSupplierId
                    ? ((errors as any).preferredSupplierId as string)
                    : ""
                }
              />
            </div>

            {/* Save (theme’d) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`ml-auto block rounded-full px-5 py-2.5 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50
                ${isDarkMode ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500" : "bg-green-600 hover:bg-green-700 focus:ring-green-500"}`}
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
