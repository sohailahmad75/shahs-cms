import { useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CloseIcon from "../../../../assets/styledIcons/CloseIcon";
import { useTheme } from "../../../../context/themeContext";
import type { Product } from "../product.types";
import ReusableAsyncSelect from "../../../../components/aysncSelect";
import { useGetProductCategoriesQuery } from "../../productCategories/services/productCategoryApi";
import StockIcon from "../../../../assets/styledIcons/StockIcon";
import NonStockIcon from "../../../../assets/styledIcons/NonStockIcon";
import ServiceIcon from "../../../../assets/styledIcons/ServiceIcon";
import InputField from "../../../../components/InputField";
import SelectField from "../../../../components/SelectField";
import { useGetAllSupplierQuery } from "../../supplier/services/SupplierApi";

interface ProductFormDrawerProps {
  selectedType: "stock" | "non-stock" | "service";
  onBack: () => void;
  onClose: () => void;
  onSubmit: (values: Partial<Product>) => void;
  editingProduct?: Partial<Product>;
  isSubmitting?: boolean;
}


const transformNumber = (value: any, originalValue: any) =>
  originalValue === "" || originalValue === null ? undefined : value;

const transformString = (value: any, originalValue: any) =>
  originalValue === "" || originalValue === null ? undefined : value;

const validationSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  itemCode: Yup.string().trim().required("Item code is required"),
  uom: Yup.string()
    .oneOf(["kg", "g", "ltr", "ml", "pcs"], "Invalid unit")
    .required("Unit is required"),
  usage: Yup.string()
    .oneOf(["store", "warehouse"], "Invalid usage")
    .required("Usage is required"),
  categoryId: Yup.string().required("Category is required"),
  productType: Yup.string()
    .oneOf(["stock", "non-stock", "service"], "Invalid product type")
    .required("Product type is required"),


  initialQuantity: Yup.number()
    .transform(transformNumber)
    .when([], {
      is: () => selectedTypeRef.current === "stock",
      then: (s) => s.min(0).required("Initial quantity is required"),
      otherwise: (s) => s.min(0).optional(),
    }),

  salesPrice: Yup.number()
    .transform(transformNumber)
    .min(0)
    .optional(),

  purchaseCost: Yup.number()
    .transform(transformNumber)
    .min(0)
    .optional(),

  reorderPoint: Yup.number()
    .transform(transformNumber)
    .min(0)
    .optional(),


  supplierId: Yup.string()
    .transform(transformString)
    .optional(),

  salesDescription: Yup.string()
    .transform(transformString)
    .optional(),

  purchaseDescription: Yup.string()
    .transform(transformString)
    .optional(),
});

let selectedTypeRef = { current: "stock" };

const getDefaultValues = (type: string) => {
  selectedTypeRef.current = type;
  return {
    name: "",
    itemCode: "",
    uom: "kg",
    usage: "store",
    categoryId: "",
    productType: type,
    initialQuantity: undefined,
    salesPrice: undefined,
    purchaseCost: undefined,
    reorderPoint: undefined,
    salesDescription: undefined,
    purchaseDescription: undefined,
    supplierId: undefined,
  };
};


const cleanFormData = (values: Partial<Product>): Partial<Product> => {
  return {
    ...values,
    name: values.name?.trim(),
    itemCode: values.itemCode?.trim(),
    initialQuantity: values.initialQuantity || undefined,
    salesPrice: values.salesPrice || undefined,
    purchaseCost: values.purchaseCost || undefined,
    reorderPoint: values.reorderPoint || undefined,
    salesDescription: values.salesDescription?.trim() || undefined,
    purchaseDescription: values.purchaseDescription?.trim() || undefined,
    supplierId: values.supplierId || undefined,
  };
};


const cleanEditingProduct = (product: Partial<Product>): Partial<Product> => {
  return {
    ...product,
    initialQuantity: product.initialQuantity || undefined,
    salesPrice: product.salesPrice || undefined,
    purchaseCost: product.purchaseCost || undefined,
    reorderPoint: product.reorderPoint || undefined,
    salesDescription: product.salesDescription || undefined,
    purchaseDescription: product.purchaseDescription || undefined,
    supplierId: product.supplierId || undefined,
  };
};

export default function ProductFormDrawer({
  selectedType,
  onBack,
  onClose,
  onSubmit,
  editingProduct,
  isSubmitting = false,
}: ProductFormDrawerProps) {
  const { isDarkMode } = useTheme();

  const initialValues = useMemo(() => {
    const defaults = getDefaultValues(selectedType);

    if (editingProduct) {
      const cleanedEditingProduct = cleanEditingProduct(editingProduct);
      return { ...defaults, ...cleanedEditingProduct };
    }

    return defaults;
  }, [selectedType, editingProduct]);

  const isStock = selectedType === "stock";

  const handleFormSubmit = (values: Partial<Product>) => {
    const cleanedValues = cleanFormData(values);
    onSubmit(cleanedValues);
  };

  return (
    <div className={`p-6 h-full overflow-y-auto ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-white"}`}>
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
          className={`transition duration-200 ease-in-out hover:scale-110 cursor-pointer ${isDarkMode ? "text-slate-100 hover:text-slate-200" : "text-gray-600 hover:text-orange-500"}`}
          onClick={onClose}
          aria-label="Close drawer"
        >
          <CloseIcon size={22} />
        </button>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="space-y-6">

            <InputField
              label="Name"
              required
              name="name"
              value={values.name || ""}
              onChange={handleChange}
              error={touched.name && errors.name ? errors.name : ""}
            />

            <InputField
              label="Item Code"
              required
              name="itemCode"
              value={values.itemCode || ""}
              onChange={handleChange}
              error={touched.itemCode && errors.itemCode ? errors.itemCode : ""}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Unit of Measure <span className="text-red-500">*</span>
              </label>
              <SelectField
                name="uom"
                value={values.uom || "kg"}
                onChange={handleChange}
                options={[
                  { value: "kg", label: "kg" },
                  { value: "g", label: "g" },
                  { value: "ltr", label: "ltr" },
                  { value: "ml", label: "ml" },
                  { value: "pcs", label: "pcs" },
                ]}
                error={touched.uom && errors.uom ? errors.uom : ""}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
                Usage <span className="text-red-500">*</span>
              </label>
              <SelectField
                name="usage"
                value={values.usage || "store"}
                onChange={handleChange}
                options={[
                  { value: "store", label: "Store" },
                  { value: "warehouse", label: "Warehouse" },
                ]}
                error={touched.usage && errors.usage ? errors.usage : ""}
              />
            </div>

            <div>
              <ReusableAsyncSelect
                label="Category"
                placeholder="Select category..."
                value={values.categoryId}
                onChange={(selected: any) => {
                  setFieldValue("categoryId", selected?.value || "");
                }}
                useQueryHook={({ query, page }) =>
                  useGetProductCategoriesQuery({ query, page })
                }
                getOptionLabel={(item: any) => item.name}
                getOptionValue={(item: any) => item.id}
              />
              {touched.categoryId && errors.categoryId && (
                <div className="text-red-500 text-xs mt-1">{errors.categoryId}</div>
              )}
            </div>

            {isStock && (
              <>
                <InputField
                  label="Initial Quantity"
                  required
                  name="initialQuantity"
                  type="number"
                  value={values.initialQuantity ?? ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? undefined : Number(e.target.value);
                    setFieldValue("initialQuantity", value);
                  }}

                />

                <InputField
                  label="Reorder Point"
                  name="reorderPoint"
                  type="number"
                  value={values.reorderPoint ?? ""}
                  onChange={(e) => {
                    const value = e.target.value === "" ? undefined : Number(e.target.value);
                    setFieldValue("reorderPoint", value);
                  }}

                />
              </>
            )}

            <InputField
              label="Sales Description"
              name="salesDescription"
              value={values.salesDescription || ""}
              onChange={handleChange}
              type="textarea"
              rows={2}

            />

            <InputField
              label="Purchase Description"
              name="purchaseDescription"
              value={values.purchaseDescription || ""}
              onChange={handleChange}
              type="textarea"
              rows={2}

            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Sales Price"
                name="salesPrice"
                type="number"
                value={values.salesPrice ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? undefined : Number(e.target.value);
                  setFieldValue("salesPrice", value);
                }}

              />
              <InputField
                label="Purchase Cost"
                name="purchaseCost"
                type="number"
                value={values.purchaseCost ?? ""}
                onChange={(e) => {
                  const value = e.target.value === "" ? undefined : Number(e.target.value);
                  setFieldValue("purchaseCost", value);
                }}

              />
            </div>

            <div>
              <ReusableAsyncSelect
                label="Preferred Supplier"
                placeholder="Select supplier..."
                value={values.supplierId}
                onChange={(selected: any) => {
                  setFieldValue("supplierId", selected?.value || undefined);
                }}
                useQueryHook={({ query, page }) =>
                  useGetAllSupplierQuery({ query, page })
                }
                getOptionLabel={(item: any) => item.name}
                getOptionValue={(item: any) => item.id}
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