import { memo, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FastField, FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import Button from "../../../components/Button";
import Loader from "../../../components/Loader";
import InvoiceFormHeader from "./InvoiceFormHeader";
import { useTheme } from "../../../context/themeContext";

const productOptions = [
  { label: "Burger", value: "burger" },
  { label: "Fries", value: "fries" },
  { label: "Wrap", value: "wrap" },
];

const DraggableRow = memo(({ item, index, handleRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
 const { isDarkMode } = useTheme();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-8 gap-2 items-center border border-gray-200 rounded-md px-3 py-2 ${isDarkMode ? "bg-slate-950" : "bg-white"} shadow-sm mb-2`}
      {...attributes}
      {...listeners}
    >
      <span className="cursor-grab text-gray-400">☰</span>
      <FastField
        name={`items[${index}].serviceDate`}
        type="date"
        placeholder="Service Date"
        component={InputField}
      />
      <FastField
        name={`items[${index}].product`}
        options={productOptions}
        placeholder="Product/Service"
        component={SelectField}
      />
      <FastField
        name={`items[${index}].description`}
        placeholder="Description"
        component={InputField}
      />
      <FastField
        name={`items[${index}].qty`}
        type="number"
        placeholder="Qty"
        component={InputField}
      />
      <FastField
        name={`items[${index}].rate`}
        type="number"
        placeholder="Rate"
        component={InputField}
      />
      <div className="font-semibold text-right text-gray-700">
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
});

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
    const { isDarkMode } = useTheme();


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
    const url = isEditMode ? `/api/invoices/${id}` : "/api/invoices";
    const method = isEditMode ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  };

  if (loading) return <Loader />;

  return (
    <div className={`${isDarkMode ? "bg-slate-900" : "bg-gray-50"} p-6 rounded-lg shadow-md`}>
      <h1 className="text-2xl font-semibold mb-6">
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
              form={values ?? {}}
              errors={errors ?? {}}
              handleChange={handleChange}
            />

            <FieldArray name="items">
              {({ push, remove, move }) => (
                <DndContext
                  collisionDetection={closestCenter}
                  onDragEnd={({ active, over }) => {
                    if (active.id !== over?.id) {
                      move(active.id as number, over?.id as number);
                    }
                  }}
                >
                  <div className="text-sm text-gray-600 font-medium grid grid-cols-8 gap-2 px-1 mb-1">
                    <span>#</span>
                    <span>Service Date</span>
                    <span>Product</span>
                    <span>Description</span>
                    <span>Qty</span>
                    <span>Rate</span>
                    <span>Amount</span>
                    <span></span>
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
                        handleRemove={() => remove(index)}
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
                    className="text-sm text-blue-600 mt-3 hover:underline"
                  >
                    + Add Line
                  </button>
                </DndContext>
              )}
            </FieldArray>

            <div className="text-right text-lg font-bold my-6">
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
