// ProductForm.tsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Schema = Yup.object({
  sku: Yup.string().required("SKU required"),
  name: Yup.string().required("Name required"),
  salesPrice: Yup.number().min(0).required(),
  purchaseCost: Yup.number().min(0).required(),
  salesVatRate: Yup.number().min(0).max(100).required(),
  purchaseTaxRate: Yup.number().min(0).max(100).required(),
  initialQtyOnHand: Yup.number().min(0),
});

export default function ProductForm({
  onSubmit,
}: {
  onSubmit: (v: any) => void;
}) {
  return (
    <Formik
      initialValues={{
        sku: "",
        name: "",
        itemCode: "",
        description: "",
        unit: "pcs",
        categoryId: "",
        salesPrice: 0,
        salesVatInclusive: false,
        salesVatRate: 20,
        incomeAccount: "Sales of Product Income",
        purchaseCost: 0,
        purchaseTaxInclusive: false,
        purchaseTaxRate: 0,
        expenseAccount: "Cost of Sales",
        stockAssetAccount: "Stock Asset",
        reorderPoint: 0,
        isInventoryItem: true,
        initialQtyOnHand: 0,
        asOfDate: "",
        warehouseId: "",
        preferredSupplierId: "",
        preferredSupplierSku: "",
      }}
      validationSchema={Schema}
      onSubmit={onSubmit}
    >
      <Form className="grid gap-4 md:grid-cols-2 p-4">
        <div className="md:col-span-2 text-xl font-semibold">Basic</div>
        <label className="flex flex-col">
          <span>SKU*</span>
          <Field name="sku" className="input" />
          <ErrorMessage
            name="sku"
            component="div"
            className="text-red-600 text-sm"
          />
        </label>
        <label className="flex flex-col">
          <span>Name*</span>
          <Field name="name" className="input" />
          <ErrorMessage
            name="name"
            component="div"
            className="text-red-600 text-sm"
          />
        </label>
        <label className="flex flex-col">
          <span>Item/Service code</span>
          <Field name="itemCode" className="input" />
        </label>
        <label className="flex flex-col">
          <span>Category</span>
          <Field name="categoryId" as="select" className="input">
            <option value="">Choose…</option>
            {/* map your categories */}
          </Field>
        </label>
        <label className="md:col-span-2 flex flex-col">
          <span>Description</span>
          <Field name="description" as="textarea" className="input" />
        </label>

        <div className="md:col-span-2 text-xl font-semibold mt-4">Sales</div>
        <label className="flex flex-col">
          <span>Sales price*</span>
          <Field
            name="salesPrice"
            type="number"
            step="0.01"
            className="input"
          />
          <ErrorMessage
            name="salesPrice"
            component="div"
            className="text-red-600 text-sm"
          />
        </label>
        <label className="flex flex-col">
          <span>Income account</span>
          <Field name="incomeAccount" className="input" />
        </label>
        <label className="flex items-center gap-2">
          <Field type="checkbox" name="salesVatInclusive" />{" "}
          <span>Price includes VAT</span>
        </label>
        <label className="flex flex-col">
          <span>VAT %*</span>
          <Field
            name="salesVatRate"
            type="number"
            step="0.01"
            className="input"
          />
          <ErrorMessage
            name="salesVatRate"
            component="div"
            className="text-red-600 text-sm"
          />
        </label>

        <div className="md:col-span-2 text-xl font-semibold mt-4">
          Purchasing
        </div>
        <label className="flex flex-col">
          <span>Cost*</span>
          <Field
            name="purchaseCost"
            type="number"
            step="0.01"
            className="input"
          />
          <ErrorMessage
            name="purchaseCost"
            component="div"
            className="text-red-600 text-sm"
          />
        </label>
        <label className="flex flex-col">
          <span>Expense account</span>
          <Field name="expenseAccount" className="input" />
        </label>
        <label className="flex items-center gap-2">
          <Field type="checkbox" name="purchaseTaxInclusive" />{" "}
          <span>Cost includes purchase tax</span>
        </label>
        <label className="flex flex-col">
          <span>Purchase tax %*</span>
          <Field
            name="purchaseTaxRate"
            type="number"
            step="0.01"
            className="input"
          />
          <ErrorMessage
            name="purchaseTaxRate"
            component="div"
            className="text-red-600 text-sm"
          />
        </label>

        <div className="md:col-span-2 text-xl font-semibold mt-4">
          Inventory
        </div>
        <label className="flex flex-col">
          <span>Stock asset account</span>
          <Field name="stockAssetAccount" className="input" />
        </label>
        <label className="flex flex-col">
          <span>Reorder point</span>
          <Field name="reorderPoint" type="number" className="input" />
        </label>
        <label className="flex items-center gap-2">
          <Field type="checkbox" name="isInventoryItem" />{" "}
          <span>Inventory item</span>
        </label>
        <label className="flex flex-col">
          <span>Unit</span>
          <Field name="unit" className="input" />
        </label>

        <div className="md:col-span-2 text-xl font-semibold mt-4">
          Opening stock (optional)
        </div>
        <label className="flex flex-col">
          <span>Initial qty on hand</span>
          <Field name="initialQtyOnHand" type="number" className="input" />
        </label>
        <label className="flex flex-col">
          <span>As of date</span>
          <Field name="asOfDate" type="date" className="input" />
        </label>
        <label className="flex flex-col">
          <span>Warehouse</span>
          <Field name="warehouseId" className="input" />
        </label>

        <div className="md:col-span-2 text-xl font-semibold mt-4">
          Preferred supplier (optional)
        </div>
        <label className="flex flex-col">
          <span>Supplier</span>
          <Field name="preferredSupplierId" className="input" />
        </label>
        <label className="flex flex-col">
          <span>Supplier SKU</span>
          <Field name="preferredSupplierSku" className="input" />
        </label>

        <div className="md:col-span-2 flex gap-2 mt-6">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-primary text-white"
          >
            Save
          </button>
          <button type="reset" className="px-4 py-2 rounded bg-gray-200">
            Clear
          </button>
        </div>
      </Form>
    </Formik>
  );
}
