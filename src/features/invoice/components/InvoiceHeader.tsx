import React from "react";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import DatePickerField from "../../../components/DatePickerField";
import { useTheme } from "../../../context/themeContext";

interface InvoiceHeaderProps {
    values: any;
    setFieldValue: (field: string, value: any) => void;
    customerOptions: { label: string; value: string }[];
    handleChange: (e: React.ChangeEvent<any>) => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
    values,
    setFieldValue,
    customerOptions,
    handleChange,
}) => {
    const { isDarkMode } = useTheme();

    const labelClass = `${isDarkMode ? "text-slate-100" : "text-gray-700"
        } text-sm font-medium mb-1 block`;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
                <label className={labelClass}>
                    Customer <span className="text-red-500">*</span>
                </label>
                <SelectField
                    name="customer"
                    value={values.customer}
                    options={customerOptions}
                    onChange={(val) => setFieldValue("customer", val)}
                    placeholder="Select customer"
                />
            </div>


            <div>
                <label className={labelClass}>
                    Email <span className="text-red-500">*</span>
                </label>
                <InputField
                    name="email"
                    type="email"
                    value={values.email}
                    placeholder="Customer email"
                    onChange={handleChange}
                />
            </div>


            <div>
                <label className={labelClass}>
                    Invoice Date <span className="text-red-500">*</span>
                </label>
                <DatePickerField
                    name="invoiceDate"
                    value={values.invoiceDate}
                    onChange={(val) => setFieldValue("invoiceDate", val)}
                />
            </div>


            <div>
                <label className={labelClass}>
                    Due Date <span className="text-red-500">*</span>
                </label>
                <DatePickerField
                    name="dueDate"
                    value={values.dueDate}
                    onChange={(val) => setFieldValue("dueDate", val)}
                />
            </div>
        </div>
    );
};

export default InvoiceHeader;
