// import { useMemo, useState } from "react";
// import { Formik, Form } from "formik";
// import * as Yup from "yup";
// import Modal from "../../../../components/Modal";
// import InputField from "../../../../components/InputField";
// import Button from "../../../../components/Button";
// import DatePickerField from "../../../../components/DatePickerField";
// import type { Product } from "../product.types";
// import { useTheme } from "../../../../context/themeContext";

// type Props = {
//   isOpen: boolean;
//   onClose: () => void;
//   onSubmit: (values: Partial<Product>) => void;
//   editingProduct?: Partial<Product>;
//   isSubmitting?: boolean;
// };

// const schema = Yup.object({
//   sku: Yup.string().required("SKU is required"),
//   name: Yup.string().required("Name is required"),
//   salesPrice: Yup.number().min(0).required("Sales price is required"),
//   purchaseCost: Yup.number().min(0).required("Purchase cost is required"),
// });

// const defaultValues: Partial<Product> = {
//   sku: "",
//   name: "",
//   itemCode: "",
//   categoryId: "",
//   description: "",
//   unit: "pcs",
//   salesPrice: 0,
//   salesVatInclusive: false,
//   salesVatRate: 20,
//   incomeAccount: "Sales of Product Income",
//   purchaseCost: 0,
//   purchaseTaxInclusive: false,
//   purchaseTaxRate: 0,
//   expenseAccount: "Cost of Sales",
//   stockAssetAccount: "Stock Asset",
//   reorderPoint: 0,
//   isInventoryItem: true,
//   isActive: true,
//   s3Key: "",
// };

// export default function ProductModal({
//   isOpen,
//   onClose,
//   onSubmit,
//   editingProduct,
//   isSubmitting,
// }: Props) {
//   const [step, setStep] = useState(0);
//   const { isDarkMode } = useTheme();

//   const initialValues = useMemo(
//     () => ({ ...defaultValues, ...(editingProduct || {}) }),
//     [editingProduct],
//   );

//   const steps = [
//     { key: "basic", label: "Basic" },
//     { key: "pricing", label: "Pricing" },
//     { key: "inventory", label: "Inventory" },
//     { key: "additional", label: "Additional" },
//   ];

//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       title={editingProduct?.id ? "Edit Product" : "Add Product"}
//       width="max-w-4xl"
//     >
//       <Formik
//         initialValues={initialValues}
//         validationSchema={schema}
//         enableReinitialize
//         onSubmit={onSubmit}
//       >
//         {({ values, handleChange, setFieldValue }) => (
//           <Form className="space-y-6">
//             {/* stepper */}
//             <div className="flex items-center justify-between">
//               {steps.map((s, i) => {
//                 const active = i === step;
//                 const done = i < step;
//                 const base =
//                   "flex items-center gap-2 px-3 py-2 rounded-full border text-sm cursor-pointer select-none transition";
//                 const state = active
//                   ? `border-orange-400 ${isDarkMode ? "text-white" : "text-orange-600"}`
//                   : done
//                     ? "border-green-400 text-green-600"
//                     : "border-gray-300 text-gray-600";
//                 return (
//                   <div
//                     key={s.key}
//                     className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}
//                   >
//                     <div
//                       className={`${base} ${state}`}
//                       onClick={() => setStep(i)}
//                     >
//                       <span>{i + 1}</span>
//                       <span className="font-medium whitespace-nowrap">
//                         {s.label}
//                       </span>
//                     </div>
//                     {i < steps.length - 1 && (
//                       <div className="h-px flex-1 bg-gray-200 mx-2" />
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* content */}
//             {steps[step].key === "basic" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InputField
//                   name="sku"
//                   label="SKU *"
//                   value={values.sku as any}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="name"
//                   label="Name *"
//                   value={values.name as any}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="itemCode"
//                   label="Item Code"
//                   value={values.itemCode as any}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="categoryId"
//                   label="Category ID"
//                   value={values.categoryId as any}
//                   onChange={handleChange}
//                 />
//                 <div className="md:col-span-2">
//                   <InputField
//                     name="description"
//                     label="Description"
//                     value={values.description as any}
//                     onChange={handleChange}
//                     as="textarea"
//                   />
//                 </div>
//               </div>
//             )}

//             {steps[step].key === "pricing" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InputField
//                   name="salesPrice"
//                   label="Sales Price (£) *"
//                   type="number"
//                   step="0.01"
//                   value={String(values.salesPrice ?? "")}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="purchaseCost"
//                   label="Purchase Cost (£) *"
//                   type="number"
//                   step="0.01"
//                   value={String(values.purchaseCost ?? "")}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="salesVatRate"
//                   label="Sales VAT Rate (%)"
//                   type="number"
//                   step="0.01"
//                   value={String(values.salesVatRate ?? 20)}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="purchaseTaxRate"
//                   label="Purchase Tax Rate (%)"
//                   type="number"
//                   step="0.01"
//                   value={String(values.purchaseTaxRate ?? 0)}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="salesVatInclusive"
//                   label="Sales VAT Inclusive (true/false)"
//                   value={String(values.salesVatInclusive ?? false)}
//                   onChange={(e: any) =>
//                     setFieldValue(
//                       "salesVatInclusive",
//                       e.target.value === "true",
//                     )
//                   }
//                 />
//                 <InputField
//                   name="purchaseTaxInclusive"
//                   label="Purchase Tax Inclusive (true/false)"
//                   value={String(values.purchaseTaxInclusive ?? false)}
//                   onChange={(e: any) =>
//                     setFieldValue(
//                       "purchaseTaxInclusive",
//                       e.target.value === "true",
//                     )
//                   }
//                 />
//                 <InputField
//                   name="incomeAccount"
//                   label="Income Account"
//                   value={values.incomeAccount as any}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="expenseAccount"
//                   label="Expense Account"
//                   value={values.expenseAccount as any}
//                   onChange={handleChange}
//                 />
//               </div>
//             )}

//             {steps[step].key === "inventory" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InputField
//                   name="unit"
//                   label="Unit"
//                   value={values.unit as any}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="reorderPoint"
//                   label="Reorder Point"
//                   type="number"
//                   value={String(values.reorderPoint ?? 0)}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="isInventoryItem"
//                   label="Is Inventory Item (true/false)"
//                   value={String(values.isInventoryItem ?? true)}
//                   onChange={(e: any) =>
//                     setFieldValue("isInventoryItem", e.target.value === "true")
//                   }
//                 />
//                 <InputField
//                   name="stockAssetAccount"
//                   label="Stock Asset Account"
//                   value={values.stockAssetAccount as any}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="s3Key"
//                   label="Image S3 Key"
//                   value={values.s3Key as any}
//                   onChange={handleChange}
//                 />
//                 <InputField
//                   name="isActive"
//                   label="Active (true/false)"
//                   value={String(values.isActive ?? true)}
//                   onChange={(e: any) =>
//                     setFieldValue("isActive", e.target.value === "true")
//                   }
//                 />
//               </div>
//             )}

//             {steps[step].key === "additional" && (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <DatePickerField
//                   name="availableFrom"
//                   label="Available From"
//                   value={(values as any).availableFrom}
//                   onChange={(v: any) => setFieldValue("availableFrom", v)}
//                 />
//                 {/* Add any custom fields here */}
//               </div>
//             )}

//             <div className="flex justify-between pt-2">
//               <Button type="button" variant="outlined" onClick={onClose}>
//                 Cancel
//               </Button>
//               <div className="flex gap-2">
//                 <Button
//                   type="button"
//                   variant="outlined"
//                   onClick={() => setStep((s) => Math.max(0, s - 1))}
//                   disabled={step === 0 || isSubmitting}
//                 >
//                   Back
//                 </Button>
//                 <Button
//                   type={step < steps.length - 1 ? "button" : "submit"}
//                   onClick={() =>
//                     step < steps.length - 1 && setStep((s) => s + 1)
//                   }
//                   disabled={isSubmitting}
//                 >
//                   {step < steps.length - 1
//                     ? "Next"
//                     : isSubmitting
//                       ? "Saving..."
//                       : "Save"}
//                 </Button>
//               </div>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </Modal>
//   );
// }




import React, { useState } from 'react';
import TypeSelectorDrawer from './TypeSelectorDrawer';
import ProductFormDrawer from './ProductFormDrawer';

interface ProductDrawerManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductDrawerManager: React.FC<ProductDrawerManagerProps> = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelectType = (type: string) => {
    setSelectedType(type);
  };

  const handleBackToTypeSelector = () => {
    setSelectedType(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-xl overflow-y-auto lg:w-1/3"
        role="dialog"
        aria-modal="true"
      >
        {selectedType ? (
          <ProductFormDrawer
            selectedType={selectedType}
            onBack={handleBackToTypeSelector}
            onClose={onClose}
          />
        ) : (
          <TypeSelectorDrawer
            onSelect={handleSelectType}
            onClose={onClose}
          />
        )}
      </div>
    </>
  );
};

export default ProductDrawerManager;