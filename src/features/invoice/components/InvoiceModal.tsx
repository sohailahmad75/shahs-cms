import { useEffect, useState, useCallback, memo } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Modal from "../../../components/Modal";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import { useTheme } from "../../../context/themeContext";
import { DraggableRow } from "./DraggableRow";
import InvoiceHeader from "./InvoiceHeader";
import { InvoiceLineHeader } from "./InvoiceLineHeader";
import { InvoiceTotal } from "./InvoiceTotal";
import type {
  InvoiceFormValues,
  InvoiceItem,
  InvoiceModalProps,
  DraggableRowProps
} from "../helpers/invoiceHelpers";

const productOptions = [
  { label: "Burger", value: "burger" },
  { label: "Fries", value: "fries" },
  { label: "Wrap", value: "wrap" },
];

const customerOptions = [
  { label: "John Doe", value: "john" },
  { label: "Jane Smith", value: "jane" },
  { label: "Mike Johnson", value: "mike" },
];

const emptyInitialValues: InvoiceFormValues = {
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

const InvoiceSchema = Yup.object().shape({
  customer: Yup.string().required("Customer is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  invoiceDate: Yup.string().required("Invoice date is required"),
  dueDate: Yup.string().required("Due date is required"),
  items: Yup.array().of(
    Yup.object({
      serviceDate: Yup.string(),
      product: Yup.string().required("Product is required"),
      description: Yup.string(),
      qty: Yup.number().min(1, "Minimum 1").required("Quantity is required"),
      rate: Yup.number().min(0, "Minimum 0").required("Rate is required"),
    })
  ),
});

// Memoized component with proper types
const MemoizedDraggableRow = memo<DraggableRowProps>(DraggableRow);

const InvoiceModal: React.FC<InvoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingInvoice,
  isSubmitting,
}) => {
  const { isDarkMode } = useTheme();
  const [initialValues, setInitialValues] = useState<InvoiceFormValues>(emptyInitialValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingInvoice && isOpen) {
      setLoading(true);
      setTimeout(() => {
        setInitialValues(editingInvoice);
        setLoading(false);
      }, 400);
    } else if (isOpen) {
      setInitialValues(emptyInitialValues);
    }
  }, [editingInvoice, isOpen]);

  const calculateTotal = useCallback((items: InvoiceItem[]) =>
    items.reduce((acc, item) => acc + Number(item.qty) * Number(item.rate), 0), []);

  // Memoized form component with proper types
  const InvoiceForm = useCallback(({
    values,
    handleChange,
    setFieldValue
  }: {
    values: InvoiceFormValues;
    handleChange: any;
    setFieldValue: (field: string, value: any) => void;
  }) => (
    <Form className="space-y-6">
      <InvoiceHeader
        values={values}
        handleChange={handleChange}
        setFieldValue={setFieldValue}
        customerOptions={customerOptions}
      />

      <div className="mt-8">
        <InvoiceLineHeader isDarkMode={isDarkMode} />
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
              <SortableContext
                items={values.items.map((_, i) => i)}
                strategy={verticalListSortingStrategy}
              >
                {values.items.map((item, index) => (
                  <MemoizedDraggableRow
                    key={`item-${index}`}
                    id={index}
                    index={index}
                    item={item}
                    onRemove={() => remove(index)}
                    productOptions={productOptions}
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
      </div>

      <InvoiceTotal total={calculateTotal(values.items)} />

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {editingInvoice ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </Form>
  ), [isDarkMode, calculateTotal, isSubmitting, onClose, editingInvoice]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingInvoice ? "Edit Invoice" : "Create Invoice"}
      width="max-w-6xl"
      isDarkMode={isDarkMode}
    >
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader />
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={InvoiceSchema}
          enableReinitialize
          onSubmit={onSubmit}
        >
          {({ values, handleChange, setFieldValue }) => (
            <InvoiceForm
              values={values}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
            />
          )}
        </Formik>
      )}
    </Modal>
  );
};

export default InvoiceModal;