import { FastField } from "formik";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTheme } from "../../../context/themeContext";
import InputField from "../../../components/InputField";
import SelectField from "../../../components/SelectField";
import DatePickerField from "../../../components/DatePickerField";

export const DraggableRow = ({ item, index, onRemove, productOptions }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: index });

    const { isDarkMode } = useTheme();
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`grid grid-cols-8 gap-2 items-center border border-gray-200 rounded-md px-3 py-2 ${isDarkMode ? "bg-slate-950" : "bg-white"
                } shadow-sm mb-2`}
            {...attributes}
            {...listeners}
        >
            <span className="cursor-grab text-gray-400 select-none">☰</span>

            <FastField
                name={`items[${index}].serviceDate`}
                component={DatePickerField}
            />

            <FastField
                name={`items[${index}].product`}
                component={SelectField}
                options={productOptions}
            />

            <FastField
                name={`items[${index}].description`}
                component={InputField}
                placeholder="Description"
            />

            <FastField
                name={`items[${index}].qty`}
                component={InputField}
                type="number"
            />

            <FastField
                name={`items[${index}].rate`}
                component={InputField}
                type="number"
            />

            <div className="font-semibold text-right text-gray-700">
                £{(Number(item.qty) * Number(item.rate)).toFixed(2)}
            </div>

            <button
                type="button"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 text-lg"
            >
                ✕
            </button>
        </div>
    );
};
