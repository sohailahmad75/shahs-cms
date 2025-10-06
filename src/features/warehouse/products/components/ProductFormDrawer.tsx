import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CloseIcon from "../../../../assets/styledIcons/CloseIcon";
import { useTheme } from "../../../../context/themeContext";
import type { Product } from "../product.types";

import NonStockIcon from "../../../../assets/styledIcons/NonStockIcon";
import StockIcon from "../../../../assets/styledIcons/StockIcon";
import ServiceIcon from "../../../../assets/styledIcons/ServiceIcon";

import InputField from "../../../../components/InputField";
import SelectField from "../../../../components/SelectField";
import CheckboxField from "../../../../components/CheckboxField";
import DatePickerField from "../../../../components/DatePickerField";

import FileUploader from "../../../../components/FileUploader";
import { useGetProductFinanceOptionsQuery } from "../../../finance/services/financeAccountApi";
import { useGetProductCategoriesQuery } from "../../productCategories/services/productCategoryApi";

interface ProductFormDrawerProps {
  selectedType: "stock" | "non-stock" | "service";
  onBack: () => void;
  onClose: () => void;
  onSubmit: (values: Partial<Product>) => void;
  editingProduct?: Partial<Product>;
  isSubmitting?: boolean;

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
  purchaseTax: [{ value: "NO_VAT", label: "No VAT" }],
  suppliers: [{ value: "", label: "Select a preferred supplier" }],
};

// ✅ Validation (with new field names)
const qbValidation = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  itemCode: Yup.string().trim().required("Item/Service code is required"),

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

  asOfDate: Yup.mixed().when("isInventoryItem", {
    is: true,
    then: (s) => s.required("As of date is required"),
    otherwise: (s) => s.optional(),
  }),

  reorderPoint: Yup.number()
    .transform((v, o) => (o === "" || o === null ? undefined : v))
    .min(0, "Reorder point cannot be negative")
    .optional(),

  stockAssetAccountId: Yup.string().when("isInventoryItem", {
    is: true,
    then: (s) => s.required("Stock asset account is required"),
    otherwise: (s) => s.optional(),
  }),

  salesPrice: Yup.number()
    .transform((v, o) => (o === "" || o === null ? undefined : v))
    .min(0, "Sales price cannot be negative")
    .optional(),
  incomeAccountId: Yup.string().when("salesPrice", {
    is: (v: any) => v !== undefined && v !== null && v !== "",
    then: (s) => s.required("Income account is required when price is set"),
    otherwise: (s) => s.optional(),
  }),
  salesVatCode: Yup.string().optional(),

  purchaseCost: Yup.number()
    .transform((v, o) => (o === "" || o === null ? undefined : v))
    .min(0, "Cost cannot be negative")
    .optional(),
  expenseAccountId: Yup.string().when("purchaseCost", {
    is: (v: any) => v !== undefined && v !== null && v !== "",
    then: (s) => s.required("Expense account is required when cost is set"),
    otherwise: (s) => s.optional(),
  }),

  categoryId: Yup.string().optional(),
  purchaseTaxCode: Yup.string().optional(),
  preferredSupplierId: Yup.string().optional(),
  // s3Key: Yup.string().required("Product image is required"),
});

const getDefaultValues = (type: string) => ({
  type,
  name: "",
  itemCode: "",
  categoryId: "",
  s3Key: "",
  initialQuantity: undefined as number | undefined,
  asOfDate: "",
  reorderPoint: undefined as number | undefined,
  stockAssetAccountId: "",
  salesDescription: "",
  purchaseDescription: "",
  salesPrice: undefined as number | undefined,
  incomeAccountId: "",
  salesVatInclusive: false,
  salesVatCode: "S_20",
  purchaseCost: undefined as number | undefined,
  expenseAccountId: "",
  purchaseTaxInclusive: false,
  purchaseTaxCode: "NO_VAT",
  preferredSupplierId: "",
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

  vatOptions = defaultOptions.vat,
  purchaseTaxOptions = defaultOptions.purchaseTax,
  supplierOptions = defaultOptions.suppliers,
}: ProductFormDrawerProps) {
  const { isDarkMode } = useTheme();

  const finalDarkMode = isDarkMode;
  const isStock = selectedType === "stock";

  const { data: catResp = { data: [] } } = useGetProductCategoriesQuery(
    {
      page: 1,
      perPage: 50,
      sort: "createdAt",
      sortDir: "DESC",
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const categoryOptions = useMemo(
    () =>
      (catResp?.data ?? []).map((c: any) => ({
        value: c.id,
        label: c.name,
      })),
    [catResp],
  );

  const { data: acc } = useGetProductFinanceOptionsQuery(
    {
      accountType: "current_assets,income,cost_of_sales",
      detailType: "stock,sales_of_product_income,supplies_and_materials_cos",
      group: "both",
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const stockAssetAccountOptions =
    acc?.current_assets?.stock?.map((a: any) => ({
      value: a.id,
      label: a.label,
    })) ?? [];

  const incomeAccountOptions =
    acc?.income?.sales_of_product_income?.map((a: any) => ({
      value: a.id,
      label: a.label,
    })) ?? [];

  const expenseAccountOptions =
    acc?.cost_of_sales?.supplies_and_materials_cos?.map((a: any) => ({
      value: a.id,
      label: a.label,
    })) ?? [];

  const initialValues = useMemo(() => {
    const base = {
      ...getDefaultValues(selectedType),
      ...(editingProduct || {}),
    } as any;

    base.itemCode = base.itemCode || "";

    // set defaults only if missing
    if (
      selectedType === "stock" &&
      !base.stockAssetAccountId &&
      stockAssetAccountOptions.length
    ) {
      base.stockAssetAccountId = stockAssetAccountOptions[0].value;
    }
    if (!base.incomeAccountId && incomeAccountOptions.length) {
      base.incomeAccountId = incomeAccountOptions[0].value;
    }
    if (!base.expenseAccountId && expenseAccountOptions.length) {
      base.expenseAccountId = expenseAccountOptions[0].value;
    }
    return base;
  }, [
    selectedType,
    editingProduct,
    stockAssetAccountOptions,
    incomeAccountOptions,
    expenseAccountOptions,
  ]);

  return (
    <div
      className={`p-6 h-full overflow-y-auto ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-white"}`}
    >
      <h2
        className={`text-md mb-3 font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-800"}`}
      >
        Product/Service information
      </h2>

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
            {/* Name + Image */}
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
                  name="itemCode"
                  placeholder=""
                  value={values.itemCode || ""}
                  onChange={handleChange}
                  error={
                    touched.itemCode && errors.itemCode
                      ? (errors.itemCode as string)
                      : ""
                  }
                />
              </div>

              <div className="flex flex-col items-center gap-2">
                <FileUploader
                  value={values.s3Key || ""}
                  onChange={(key: string) => {
                    setFieldValue("s3Key", key);
                    setFieldTouched("s3Key", true, true);
                  }}
                  type="image"
                  path="menu-items"
                  initialPreview={(editingProduct as any)?.signedUrl || ""}
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

                <div className="grid grid-cols-1 md:grid-cols-[1fr_18rem] gap-2 md:gap-4 items-center md:items-center pe-0 md:pe-10">
                  <p
                    className={`text-sm font-semibold text-center ${finalDarkMode ? "text-slate-200" : "text-gray-800"}`}
                  >
                    As of date <span className="ms-1 text-red-500">*</span>
                  </p>
                  <DatePickerField
                    name="asOfDate"
                    value={(values.asOfDate as any) || ""}
                    onChange={(v: any) => {
                      setFieldValue("asOfDate", v);
                      setFieldTouched("asOfDate", true, true);
                    }}
                    error={
                      touched.asOfDate && errors.asOfDate
                        ? (errors.asOfDate as string)
                        : ""
                    }
                  />
                </div>

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
                    name="stockAssetAccountId"
                    value={String(values.stockAssetAccountId || "")}
                    onChange={(e: any) => {
                      setFieldValue("stockAssetAccountId", e.target.value);
                      setFieldTouched("stockAssetAccountId", true, true);
                    }}
                    options={stockAssetAccountOptions}
                    error={
                      touched.stockAssetAccountId &&
                      (errors as any).stockAssetAccountId
                        ? ((errors as any).stockAssetAccountId as string)
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
                  name="incomeAccountId"
                  value={String(values.incomeAccountId || "")}
                  onChange={(e: any) => {
                    setFieldValue("incomeAccountId", e.target.value);
                    setFieldTouched("incomeAccountId", true, true);
                  }}
                  options={incomeAccountOptions}
                  error={
                    touched.incomeAccountId && (errors as any).incomeAccountId
                      ? ((errors as any).incomeAccountId as string)
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
                  name="expenseAccountId"
                  value={String(values.expenseAccountId || "")}
                  onChange={(e: any) => {
                    setFieldValue("expenseAccountId", e.target.value);
                    setFieldTouched("expenseAccountId", true, true);
                  }}
                  options={expenseAccountOptions}
                  error={
                    touched.expenseAccountId && (errors as any).expenseAccountId
                      ? ((errors as any).expenseAccountId as string)
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
