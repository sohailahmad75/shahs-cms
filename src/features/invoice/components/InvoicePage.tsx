import { useEffect, useState, useCallback, memo } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { toast } from "react-toastify";
import { useTheme } from "../../../context/themeContext";
import { DraggableRow } from "./DraggableRow";
import InvoiceHeader from "./InvoiceHeader";
import { InvoiceTotal } from "./InvoiceTotal";
import Loader from "../../../components/Loader";
import Button from "../../../components/Button";
import { PlusIcon, ClipboardDocumentListIcon } from "@heroicons/react/24/outline";


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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Invoice saved successfully!");
    } catch {
      toast.error("Failed to save invoice!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-slate-950 text-gray-600" : "bg-gray-50 text-gray-900"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <ClipboardDocumentListIcon className={`w-9 h-9 ${isDarkMode ? "text-slate-100" : "text-gray-600"
              }`} />
            <div>
              <h1 className={`${isDarkMode ? "text-slate-100" : "text-gray-500"
                } text-3xl font-bold tracking-tight`}>Create Invoice</h1>
              <p className="text-sm text-gray-500">Simple and elegant invoice editor</p>
            </div>
          </div>
        </div>

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
              <Form className="space-y-12">
                <section className="space-y-4">
                  <h2 className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-600"
                    }  uppercase tracking-wide`}>
                    Customer Details
                  </h2>
                  <InvoiceHeader
                    values={values}
                    handleChange={handleChange}
                    setFieldValue={setFieldValue}
                    customerOptions={customerOptions}
                  />
                </section>


                <section className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className={`text-lg font-semibold ${isDarkMode ? "text-slate-100" : "text-gray-600"
                      }  uppercase tracking-wide`}>
                      Invoice Items
                    </h2>
                    <Button
                      type="button"
                      onClick={() =>
                        setFieldValue("items", [
                          ...values.items,
                          { serviceDate: "", product: "", description: "", qty: 1, rate: 0 },
                        ])
                      }
                    >
                      <PlusIcon className="w-4 h-4" />
                      Add Item
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
                          <div className="divide-y divide-gray-200 dark:divide-gray-700 space-y-4">
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
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </FieldArray>
                </section>


                <section className="pt-10 border-t border-gray-300 dark:border-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <InvoiceTotal total={calculateTotal(values.items)} isDarkMode={isDarkMode} />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}

                    >
                      {isSubmitting ? "Saving..." : "Save Invoice"}
                    </Button>
                  </div>
                </section>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default InvoicePage;
