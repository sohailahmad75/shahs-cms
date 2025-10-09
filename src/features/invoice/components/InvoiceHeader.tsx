import React from "react";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import DatePickerField from "../../../components/DatePickerField";

interface InvoiceHeaderProps {
    values: any;
    setFieldValue: (field: string, value: any) => void;
    customerOptions: { label: string; value: string }[];
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
    values,
    setFieldValue,
    customerOptions,
}) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
            name="customer"
            value={values.customer}
            options={customerOptions}
            onChange={(val) => setFieldValue("customer", val)}

            placeholder="Select Customer"
        />

        <InputField
            name="email"
            type="email"
            value={values.email}
            onChange={(e) => setFieldValue("email", e.target.value)}
            label="Email"
            placeholder="Customer Email"
        />

        <DatePickerField
            name="invoiceDate"
            value={values.invoiceDate}
            onChange={(val) => setFieldValue("invoiceDate", val)}

        />

        <DatePickerField
            name="dueDate"
            value={values.dueDate}
            onChange={(val) => setFieldValue("dueDate", val)}

        />
    </div>
);
