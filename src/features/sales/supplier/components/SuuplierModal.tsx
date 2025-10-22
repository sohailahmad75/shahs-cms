import { Formik, Form } from "formik";
import * as Yup from "yup";
import Modal from "../../../../components/Modal";
import Button from "../../../../components/Button";
import type { Supplier } from "../Supplier.types";
import InputField from "../../../../components/InputField";
import SelectField from "../../../../components/SelectField";

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

export default function SupplierModal({
  isOpen,
  onClose,
  onSubmit,
  editingSupplier,
  isSubmitting,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingSupplier?.id ? "Edit Supplier" : "Add Supplier"}
    >
      <Formik
        initialValues={{
          name: editingSupplier?.name ?? "",
          email: editingSupplier?.email ?? "",
          phone: editingSupplier?.phone ?? "",
          address: editingSupplier?.address ?? "",
          website: editingSupplier?.website ?? undefined,
          notes: editingSupplier?.notes ?? "",
          currency: editingSupplier?.currency ?? "GBP",
          balance: editingSupplier?.balance ?? 0,
          isTaxable: editingSupplier?.isTaxable ?? true,
          defaultVatRate: editingSupplier?.defaultVatRate ?? 0.2,
          contactPerson: editingSupplier?.contactPerson ?? "",
          paymentTerms: editingSupplier?.paymentTerms ?? 30,
          taxNumber: editingSupplier?.taxNumber ?? undefined,
          bankDetails: editingSupplier?.bankDetails ?? undefined,
          status: editingSupplier?.status ?? "active",
        }}
        validationSchema={Schema}
        onSubmit={async (vals) => {
          await onSubmit(vals);
        }}
        enableReinitialize
      >
        {({ values, handleChange, handleSubmit, errors, touched, setFieldValue }) => (
          <Form className="space-y-4 max-h-96 overflow-y-auto pr-2" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <h3 className="text-lg font-medium text-gray-500 mb-3">Basic Information</h3>
              </div>

              <InputField
                label="Supplier Name *"
                name="name"
                value={values.name}
                onChange={handleChange}
                error={touched.name ? (errors.name as string) : undefined}
                placeholder="e.g., Premium Meat Suppliers"
              />

              <InputField
                label="Contact Person *"
                name="contactPerson"
                value={values.contactPerson}
                onChange={handleChange}
                error={touched.contactPerson ? (errors.contactPerson as string) : undefined}
                placeholder="e.g., Ahmed Hassan"
              />

              <InputField
                label="Email *"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email ? (errors.email as string) : undefined}
                placeholder="e.g., orders@premiummeats.co.uk"
              />

              <InputField
                label="Phone *"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                error={touched.phone ? (errors.phone as string) : undefined}
                placeholder="e.g., +44 161 234 5678"
              />

              <InputField
                label="Website"
                name="website"
                type="url"
                value={values.website}
                onChange={handleChange}
                error={touched.website ? (errors.website as string) : undefined}
                placeholder="e.g., https://www.premiummeats.co.uk"
                className="md:col-span-2"
              />

              <InputField
                label="Address *"
                name="address"
                value={values.address}
                onChange={handleChange}
                error={touched.address ? (errors.address as string) : undefined}
                placeholder="e.g., Unit 5, Food Industrial Estate, Manchester, M1 2AB, United Kingdom"
                className="md:col-span-2"
              />


              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Financial Information</h3>
              </div>

              <InputField
                label="Currency *"
                name="currency"
                value={values.currency}
                onChange={handleChange}
                error={touched.currency ? (errors.currency as string) : undefined}
                placeholder="e.g., GBP"
              />

              <InputField
                label="Balance"
                name="balance"
                type="number"
                value={values.balance}
                onChange={handleChange}
                error={touched.balance ? (errors.balance as string) : undefined}
                placeholder="0.00"
              />

              <InputField
                label="Default VAT Rate"
                name="defaultVatRate"
                type="number"
                value={values.defaultVatRate}
                onChange={handleChange}
                error={touched.defaultVatRate ? (errors.defaultVatRate as string) : undefined}
                placeholder="0.20"
              />

              <InputField
                label="Payment Terms (days)"
                name="paymentTerms"
                type="number"
                value={values.paymentTerms}
                onChange={handleChange}
                error={touched.paymentTerms ? (errors.paymentTerms as string) : undefined}
                placeholder="30"
              />

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isTaxable"
                  name="isTaxable"
                  checked={values.isTaxable}
                  onChange={(e) => setFieldValue("isTaxable", e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isTaxable" className="text-sm font-medium text-gray-700">
                  Taxable Supplier
                </label>
              </div>


              <div className="md:col-span-2 mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Additional Information</h3>
              </div>

              <InputField
                label="Tax Number"
                name="taxNumber"
                value={values.taxNumber}
                onChange={handleChange}
                error={touched.taxNumber ? (errors.taxNumber as string) : undefined}
                placeholder="e.g., GB123456789"
                className="md:col-span-2"
              />

              <InputField
                label="Bank Details"
                name="bankDetails"
                value={values.bankDetails}
                onChange={handleChange}
                error={touched.bankDetails ? (errors.bankDetails as string) : undefined}
                placeholder="e.g., Bank: HSBC, Sort: 12-34-56, Account: 12345678"
                type="textarea"
                rows={3}
                className="md:col-span-2"
              />

              <InputField
                label="Notes"
                name="notes"
                value={values.notes}
                onChange={handleChange}
                error={touched.notes ? (errors.notes as string) : undefined}
                placeholder="e.g., Halal certified meat supplier with excellent quality"
                type="textarea"
                rows={3}
                className="md:col-span-2"
              />

              <div className="md:col-span-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="status" className="text-sm font-medium text-gray-700">
                    Status *
                  </label>
                  <SelectField
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" }
                    ]}
                    error={touched.status ? errors.status : undefined}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Supplier"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}