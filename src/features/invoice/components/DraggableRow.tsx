import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "../../../context/themeContext";
import { useFormikContext } from "formik";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import DatePickerField from "../../../components/DatePickerField";
import { memo, useCallback } from "react";
import type { DraggableRowProps } from "../helpers/invoiceHelpers";

export const DraggableRow = memo<DraggableRowProps>(({ 
  id, 
  item, 
  index, 
  onRemove, 
  productOptions 
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id });

    const { isDarkMode } = useTheme();
    const { setFieldValue } = useFormikContext();
    const style = { 
        transform: CSS.Transform.toString(transform), 
        transition,
        opacity: isDragging ? 0.5 : 1 
    };


    const handleProductChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setFieldValue(`items[${index}].product`, e.target.value);
    }, [setFieldValue, index]);

    
    const handleServiceDateChange = useCallback((val: string) => {
        setFieldValue(`items[${index}].serviceDate`, val);
    }, [setFieldValue, index]);

    
    const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(`items[${index}].description`, e.target.value);
    }, [setFieldValue, index]);

    const handleQtyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(`items[${index}].qty`, Number(e.target.value));
    }, [setFieldValue, index]);

    const handleRateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue(`items[${index}].rate`, Number(e.target.value));
    }, [setFieldValue, index]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`grid grid-cols-8 gap-2 items-center border border-gray-200 rounded-md px-3 py-2 ${
                isDarkMode ? "bg-slate-950" : "bg-white"
            } shadow-sm mb-2 ${isDragging ? 'z-10' : ''}`}
        >
            <span 
                className="cursor-grab text-gray-400 select-none hover:text-gray-600"
                {...attributes}
                {...listeners}
            >
                ☰
            </span>

            <DatePickerField
                name={`items[${index}].serviceDate`}
                value={item.serviceDate}
                onChange={handleServiceDateChange}
            />

          
            <SelectField
                name={`items[${index}].product`}
                value={item.product}
                options={productOptions}
                onChange={handleProductChange} 
                placeholder="Select product"
            />

            <InputField
                name={`items[${index}].description`}
                value={item.description}
                placeholder="Description"
                onChange={handleDescriptionChange}
            />

            <InputField
                name={`items[${index}].qty`}
                type="number"
                value={item.qty}
                onChange={handleQtyChange}
                
            />

            <InputField
                name={`items[${index}].rate`}
                type="number"
                value={item.rate}
                onChange={handleRateChange}
            />

            <div className="font-semibold text-right text-gray-700">
                £{(Number(item.qty) * Number(item.rate)).toFixed(2)}
            </div>

            <button
                type="button"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 text-lg transition-colors"
            >
                ✕
            </button>
        </div>
    );
});

DraggableRow.displayName = 'DraggableRow';