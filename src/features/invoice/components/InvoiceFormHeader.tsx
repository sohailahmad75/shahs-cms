import SelectField from "../../../components/SelectField";
import InputField from "../../../components/InputField";

const customerOptions = [
  { label: "John Doe", value: "john" },
  { label: "Jane Smith", value: "jane" },
];

const InvoiceFormHeader = ({ form, errors, handleChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <SelectField
        name="customer"
        value={form.customer}
        onChange={handleChange}
        options={customerOptions}
        placeholder="Select a customer"
        error={errors.customer}
      />
      <InputField
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Customer Email"
        error={errors.email}
      />
      <InputField
        name="invoiceDate"
        type="date"
        value={form.invoiceDate}
        onChange={handleChange}
        placeholder="Invoice Date"
        error={errors.invoiceDate}
      />
      <InputField
        name="dueDate"
        type="date"
        value={form.dueDate}
        onChange={handleChange}
        placeholder="Due Date"
        error={errors.dueDate}
      />
    </div>
  );
};

export default InvoiceFormHeader;
