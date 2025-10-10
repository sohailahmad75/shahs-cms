import { useEffect, useState, useCallback, memo } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import { useTheme } from "../../../context/themeContext";
import { DraggableRow } from "./DraggableRow";
import InvoiceHeader from "./InvoiceHeader";
import { InvoiceTotal } from "./InvoiceTotal";
import { toast } from "react-toastify";

interface InvoiceItem {
  serviceDate: string;
  product: string;
  description: string;
  qty: number;
  rate: number;
}

interface InvoiceFormValues {
  customer: string;
  email: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
}

interface DraggableRowProps {
  id: number;
  index: number;
  item: InvoiceItem;
  onRemove: () => void;
  productOptions: { label: string; value: string }[];
}


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
  items: [{ serviceDate: "", product: "", description: "", qty: 1, rate: 0 }],
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

const MemoizedDraggableRow = memo<DraggableRowProps>(DraggableRow);


const InvoicePage: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [initialValues, setInitialValues] = useState<InvoiceFormValues>(emptyInitialValues);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setInitialValues(emptyInitialValues);
      setLoading(false);
    }, 400);
  }, []);

  const calculateTotal = useCallback(
    (items: InvoiceItem[]) => items.reduce((acc, item) => acc + Number(item.qty) * Number(item.rate), 0),
    []
  );

  const handleSubmit = async (values: InvoiceFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Invoice Submitted ✅", values);
      toast.success("Invoice saved successfully!");
    } catch (error) {
      toast.error("Failed to save invoice!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-8 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create Invoice</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={InvoiceSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({ values, handleChange, setFieldValue }) => (
              <Form className="space-y-8">

                <div
                  className={`rounded-2xl p-6 border shadow-sm ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white"
                    }`}
                >
                  <InvoiceHeader
                    values={values}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    customerOptions={customerOptions}
                  />
                </div>


                <div
                  className={`rounded-2xl p-6 border shadow-sm ${isDarkMode ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white"
                    }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-orange-600">Line Items</h3>
                    <Button
                      type="button"
                      onClick={() =>
                        setFieldValue("items", [
                          ...values.items,
                          { serviceDate: "", product: "", description: "", qty: 1, rate: 0 },
                        ])
                      }
                    >
                      + Add Item
                    </Button>
                  </div>

                  <FieldArray name="items">
                    {({ move, remove }) => (
                      <DndContext
                        collisionDetection={closestCenter}
                        onDragEnd={({ active, over }) => {
                          if (!over) return;
                          if (active.id !== over.id) {
                            move(Number(active.id), Number(over.id));
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
                      </DndContext>
                    )}
                  </FieldArray>
                </div>


                <InvoiceTotal total={calculateTotal(values.items)} />


                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <Button type="submit" loading={isSubmitting}>
                    Save Invoice
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default InvoicePage;
