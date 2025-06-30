// src/components/invoice/InvoiceForm.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Formik, FieldArray, Form } from "formik";
import * as Yup from "yup";
import InvoiceFormHeader from "./InvoiceFormHeader";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import Button from "../../../components/Button";
import Loader from "../../../components/Loader";

const productOptions = [
  { label: "Burger", value: "burger" },
  { label: "Fries", value: "fries" },
];

const DraggableRow = ({ item, index, handleChange, handleRemove, errors }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-8 gap-2 items-center border-b py-2 bg-white"
      {...attributes}
      {...listeners}
    >
      <span className="cursor-move text-gray-400">☰</span>
      <InputField
        name={`items[${index}].serviceDate`}
        value={item.serviceDate}
        onChange={handleChange}
        type="date"
        placeholder="Service Date"
        error={errors?.serviceDate}
      />
      <SelectField
        name={`items[${index}].product`}
        value={item.product}
        onChange={handleChange}
        options={productOptions}
        placeholder="Product/Service"
        error={errors?.product}
      />
      <InputField
        name={`items[${index}].description`}
        value={item.description}
        onChange={handleChange}
        placeholder="Description"
        error={errors?.description}
      />
      <InputField
        name={`items[${index}].qty`}
        value={item.qty}
        onChange={handleChange}
        type="number"
        placeholder="Qty"
        error={errors?.qty}
      />
      <InputField
        name={`items[${index}].rate`}
        value={item.rate}
        onChange={handleChange}
        type="number"
        placeholder="Rate"
        error={errors?.rate}
      />
      <div className="font-semibold">
        £{(Number(item.qty) * Number(item.rate)).toFixed(2)}
      </div>
      <button
        type="button"
        onClick={handleRemove}
        className="text-red-500 hover:underline"
      >
        ✕
      </button>
    </div>
  );
};

const defaultForm = {
  customer: "",
  email: "",
  invoiceDate: "",
  dueDate: "",
  items: [
    {
      serviceDate: "",
      product: "",
      description: "",
      qty: 1,
      rate: 0,
    },
  ],
};

const InvoiceForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [initialValues, setInitialValues] = useState(defaultForm);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      fetch(`/api/invoices/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setInitialValues(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const validationSchema = Yup.object({
    customer: Yup.string().required("Customer is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    invoiceDate: Yup.string().required("Invoice date is required"),
    dueDate: Yup.string().required("Due date is required"),
    items: Yup.array().of(
      Yup.object({
        serviceDate: Yup.string(),
        product: Yup.string().required("Required"),
        description: Yup.string(),
        qty: Yup.number().min(1, "Min 1").required("Required"),
        rate: Yup.number().min(0, "Min 0").required("Required"),
      }),
    ),
  });

  const calculateTotal = (items: any[]) =>
    items.reduce((acc, item) => acc + Number(item.qty) * Number(item.rate), 0);

  const handleSubmit = async (values: typeof defaultForm) => {
    if (isEditMode) {
      await fetch(`/api/invoices/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    } else {
      await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        {isEditMode ? "Edit Invoice" : "Create Invoice"}
      </h1>

      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, handleChange }) => (
          <Form>
            <InvoiceFormHeader
              form={values}
              errors={errors}
              handleChange={handleChange}
            />

            <FieldArray name="items">
              {({ push, remove, move }) => (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={({ active, over }) => {
                    if (active.id !== over?.id) {
                      const oldIndex = active.id as number;
                      const newIndex = over?.id as number;
                      move(oldIndex, newIndex);
                    }
                  }}
                >
                  <div className="mb-2 font-medium grid grid-cols-8 gap-2">
                    <span>#</span>
                    <span>Service Date</span>
                    <span>Product</span>
                    <span>Description</span>
                    <span>Qty</span>
                    <span>Rate</span>
                    <span>Amount</span>
                    <span>VAT</span>
                  </div>

                  <SortableContext
                    items={values.items.map((_, i) => i)}
                    strategy={verticalListSortingStrategy}
                  >
                    {values.items.map((item, index) => (
                      <DraggableRow
                        key={index}
                        item={item}
                        index={index}
                        handleChange={handleChange}
                        handleRemove={() => remove(index)}
                        errors={errors.items?.[index] || {}}
                      />
                    ))}
                  </SortableContext>

                  <button
                    type="button"
                    onClick={() =>
                      push({
                        serviceDate: "",
                        product: "",
                        description: "",
                        qty: 1,
                        rate: 0,
                      })
                    }
                    className="text-sm text-blue-600 mt-2 hover:underline"
                  >
                    + Add Line
                  </button>
                </DndContext>
              )}
            </FieldArray>

            <div className="text-right text-lg font-bold mb-4">
              Total: £{calculateTotal(values.items).toFixed(2)}
            </div>

            <Button type="submit">
              {isEditMode ? "Update Invoice" : "Save Invoice"}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default InvoiceForm;
