import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/Button";
import type { Supplier } from "../Supplier.types";
import InputField from "../../../../components/InputField";
import SelectField from "../../../../components/SelectField";
import CheckboxField from "../../../../components/CheckboxField";
import { useTheme } from "../../../../context/themeContext";
// import { VAT_OPTIONS } from "../../../finance/constants/accountOptions";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: Omit<Supplier, "id" | "createdAt" | "updatedAt">) => void | Promise<void>;
  editingSupplier?: Partial<Supplier>;
  isSubmitting?: boolean;
};

const Schema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be longer than or equal to 2 characters")
    .required("Name should not be empty"),
  email: Yup.string()
    .trim()
    .email("Email must be a valid email")
    .min(5, "Email must be longer than or equal to 5 characters")
    .required("Email is required"),
  phone: Yup.string()
    .trim()
    .min(10, "Phone must be longer than or equal to 10 characters")
    .required("Phone is required"),
  address: Yup.string()
    .trim()
    .min(10, "Address must be longer than or equal to 10 characters")
    .required("Address is required"),
  website: Yup.string()
    .trim()
    .url("Website must be a valid URL")
    .min(10, "Website must be longer than or equal to 10 characters")
    .transform((value) => value === "" ? undefined : value)
    .optional(),
  notes: Yup.string()
    .trim()
    .max(500, "Notes must be less than 500 characters")
    .transform((value) => value === "" ? undefined : value)
    .optional(),
  currency: Yup.string()
    .trim()
    .length(3, "Currency must be 3 characters (e.g., GBP, USD, EUR)")
    .required("Currency is required"),
  balance: Yup.number()
    .min(0, "Balance cannot be negative")
    .default(0),
  isTaxable: Yup.boolean()
    .default(true),
  defaultVatRate: Yup.number()
    .min(0, "VAT rate cannot be negative")
    .max(1, "VAT rate cannot exceed 1 (100%)")
    .default(0.2),
  contactPerson: Yup.string()
    .trim()
    .min(2, "Contact person must be longer than or equal to 2 characters")
    .required("Contact person is required"),
  paymentTerms: Yup.number()
    .integer("Payment terms must be a whole number")
    .min(0, "Payment terms cannot be negative")
    .default(30),
  taxNumber: Yup.string()
    .trim()
    .min(5, "Tax number must be longer than or equal to 5 characters")
    .transform((value) => value === "" ? undefined : value)
    .optional(),
  bankDetails: Yup.string()
    .trim()
    .min(10, "Bank details must be longer than or equal to 10 characters")
    .transform((value) => value === "" ? undefined : value)
    .optional(),
  status: Yup.string()
    .oneOf(["active", "inactive"], "Status must be either active or inactive")
    .required("Status is required"),
}).test('additional-info-validation', '', function (value) {
  const { website, taxNumber, bankDetails } = value;

  const hasAnyValue = !!website || !!taxNumber || !!bankDetails;

  const hasAllValues = !!website && !!taxNumber && !!bankDetails;

  if (hasAnyValue && !hasAllValues) {
    if (!website) {
      return this.createError({
        path: 'website',
        message: 'Website is required when Tax Number or Bank Details are provided'
      });
    }
    if (!taxNumber) {
      return this.createError({
        path: 'taxNumber',
        message: 'Tax Number is required when Website or Bank Details are provided'
      });
    }
    if (!bankDetails) {
      return this.createError({
        path: 'bankDetails',
        message: 'Bank Details are required when Website or Tax Number are provided'
      });
    }
  }

  return true;
});

const emptyInitialValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  website: "",
  notes: "",
  currency: "GBP",
  balance: 0,
  isTaxable: true,
  defaultVatRate: 0.2,
  contactPerson: "",
  paymentTerms: 30,
  taxNumber: "",
  bankDetails: "",
  status: "active" as "active" | "inactive",
};

type FormValues = typeof emptyInitialValues;

export default function SupplierModal({
  isOpen,
  onClose,
  onSubmit,
  editingSupplier,
  isSubmitting,
}: Props) {
  const { isDarkMode } = useTheme();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSupplier?.id ? "Edit Supplier" : "Add Supplier"}
      width="max-w-4xl"
    >
      <Formik<FormValues>
        initialValues={{
          ...emptyInitialValues,
          ...(editingSupplier
            ? {
              name: editingSupplier.name ?? "",
              email: editingSupplier.email ?? "",
              phone: editingSupplier.phone ?? "",
              address: editingSupplier.address ?? "",
              website: editingSupplier.website ?? "",
              notes: editingSupplier.notes ?? "",
              currency: editingSupplier.currency ?? "GBP",
              balance: editingSupplier.balance ?? 0,
              isTaxable: editingSupplier.isTaxable ?? true,
              defaultVatRate: editingSupplier.defaultVatRate ?? 0.2,
              contactPerson: editingSupplier.contactPerson ?? "",
              paymentTerms: editingSupplier.paymentTerms ?? 30,
              taxNumber: editingSupplier.taxNumber ?? "",
              bankDetails: editingSupplier.bankDetails ?? "",
              status: editingSupplier.status ?? "active",
            }
            : {}),
        }}
        validationSchema={Schema}
        enableReinitialize
        onSubmit={async (vals) => {
          await onSubmit(vals);
        }}
      >
        {({ values, handleChange, setFieldValue, touched, errors }) => (
          <Form className="space-y-8">

            <div className="col-span-2 flex items-center gap-6 mb-6">
              <div className="flex-grow h-px bg-gray-200" />
              <span className={`${isDarkMode ? "text-slate-100" : "text-orange-500"} text-md font-medium whitespace-nowrap`}>
                Basic Information
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="name"
                  placeholder="e.g., Premium Meat Suppliers"
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name ? (errors.name as string) : ""}
                />
              </div>

              <div>
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="contactPerson"
                  placeholder="e.g., Ahmed Hassan"
                  value={values.contactPerson}
                  onChange={handleChange}
                  error={touched.contactPerson ? (errors.contactPerson as string) : ""}
                />
              </div>

              <div>
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Email <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="email"
                  type="email"
                  placeholder="e.g., orders@premiummeats.co.uk"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email ? (errors.email as string) : ""}
                />
              </div>

              <div>
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Phone <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="phone"
                  placeholder="e.g., +44 161 234 5678"
                  value={values.phone}
                  onChange={handleChange}
                  error={touched.phone ? (errors.phone as string) : ""}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Website
                </label>
                <InputField
                  name="website"
                  type="url"
                  placeholder="e.g., https://www.premiummeats.co.uk"
                  value={values.website}
                  onChange={handleChange}
                  error={touched.website ? (errors.website as string) : ""}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Address <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="address"
                  placeholder="e.g., Unit 5, Food Industrial Estate, Manchester, M1 2AB, United Kingdom"
                  value={values.address}
                  onChange={handleChange}
                  error={touched.address ? (errors.address as string) : ""}
                />
              </div>
            </div>


            <div className="col-span-2 flex items-center gap-6 mb-6">
              <div className="flex-grow h-px bg-gray-200" />
              <span className={`${isDarkMode ? "text-slate-100" : "text-orange-500"} text-md font-medium whitespace-nowrap`}>
                Financial Information
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Currency <span className="text-red-500">*</span>
                </label>
                <InputField
                  name="currency"
                  placeholder="e.g., GBP"
                  value={values.currency}
                  onChange={handleChange}
                  error={touched.currency ? (errors.currency as string) : ""}
                />
              </div>

              <div>
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Balance
                </label>
                <InputField
                  name="balance"
                  type="number"
                  placeholder="0.00"
                  value={values.balance}
                  onChange={handleChange}
                  error={touched.balance ? (errors.balance as string) : ""}
                />
              </div>

              <div>
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Default VAT Rate
                </label>
                <InputField
                  name="defaultVatRate"
                  type="number"
                  placeholder="0.20"
                  value={values.defaultVatRate}
                  onChange={handleChange}
                  error={touched.defaultVatRate ? (errors.defaultVatRate as string) : ""}
                />
              </div>
              {/* <div>
                <label
                  className={`${isDarkMode ? "text-slate-100" : "text-gray-700"
                    } text-sm font-medium mb-1 block`}
                >
                  Default VAT Rate
                </label>
                <SelectField
                  name="defaultVatRate"
                  value={values.defaultVatRate || "NO_VAT"}
                  onChange={handleChange}
                  options={VAT_OPTIONS}
                  placeholder="Select VAT Rate"
                  error={touched.defaultVatRate ? (errors.defaultVatRate as string) : ""}
                />
              </div> */}


              <div>
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Payment Terms (days)
                </label>
                <InputField
                  name="paymentTerms"
                  type="number"
                  placeholder="30"
                  value={values.paymentTerms}
                  onChange={handleChange}
                  error={touched.paymentTerms ? (errors.paymentTerms as string) : ""}
                />
              </div>

              <div className="pt-2">
                <CheckboxField
                  name="isTaxable"
                  label="Taxable Supplier"
                  checked={values.isTaxable}
                  onChange={(e) => setFieldValue("isTaxable", e.target.checked)}
                  className=""

                  labelClassName="select-none"
                />
                {touched.isTaxable && errors.isTaxable ? (
                  <p className="text-primary-100 text-sm mt-1">
                    {errors.isTaxable as string}
                  </p>
                ) : null}
              </div>
            </div>


            <div className="col-span-2 flex items-center gap-6 mb-6">
              <div className="flex-grow h-px bg-gray-200" />
              <span className={`${isDarkMode ? "text-slate-100" : "text-orange-500"} text-md font-medium whitespace-nowrap`}>
                Additional Information
              </span>
              <div className="flex-grow h-px bg-gray-200" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Tax Number
                </label>
                <InputField
                  name="taxNumber"
                  placeholder="e.g., GB123456789"
                  value={values.taxNumber}
                  onChange={handleChange}
                  error={touched.taxNumber ? (errors.taxNumber as string) : ""}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Bank Details
                </label>
                <InputField
                  type="textarea"
                  name="bankDetails"
                  placeholder="e.g., Bank: HSBC, Sort: 12-34-56, Account: 12345678"
                  value={values.bankDetails}
                  onChange={handleChange}
                  error={touched.bankDetails ? (errors.bankDetails as string) : ""}
                />
              </div>

              <div className="md:col-span-2">
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Notes
                </label>
                <InputField
                  type="textarea"
                  name="notes"
                  placeholder="e.g., Halal certified meat supplier with excellent quality"
                  value={values.notes}
                  onChange={handleChange}
                  error={touched.notes ? (errors.notes as string) : ""}
                />
              </div>

              <div>
                <label className={`${isDarkMode ? "text-slate-100" : "text-gray-700"} text-sm font-medium mb-1 block`}>
                  Status <span className="text-red-500">*</span>
                </label>
                <SelectField
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                  placeholder="Select status"
                  error={touched.status ? (errors.status as string) : ""}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button type="button" variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" loading={isSubmitting}>
                {editingSupplier?.id ? "Update Supplier" : "Create Supplier"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}