import React, { useCallback, useRef, useState } from "react";
import AsyncSelect from "react-select/async";
import { useTheme } from "../context/themeContext";

interface AsyncSelectProps {
    label?: string;
    placeholder?: string;
    value: any;
    onChange: (option: any) => void;
    useQueryHook: (args: { query: string; page: number }) => any;
    getOptionLabel?: (item: any) => string;
    getOptionValue?: (item: any) => string;
    darkMode?: boolean;
    className?: string;
}

const PAGE_SIZE = 20;

const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    const timer = useRef<NodeJS.Timeout | null>(null);

    const debouncedFn = useCallback(
        (...args: any[]) => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                callback(...args);
            }, delay);
        },
        [callback, delay]
    );

    return debouncedFn;
};

const ReusableAsyncSelect: React.FC<AsyncSelectProps> = ({
    label,
    placeholder = "Select...",
    value,
    onChange,
    useQueryHook,
    getOptionLabel = (item) => item?.name ?? "",
    getOptionValue = (item) => item?.id ?? "",
    darkMode = false,
    className = "",
}) => {
    const { isDarkMode: themeDarkMode } = useTheme();
    const finalDarkMode = darkMode || themeDarkMode;

    const [page, setPage] = useState(1);
    const [inputValue, setInputValue] = useState("");
    const [options, setOptions] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const { refetch } = useQueryHook({
        query: inputValue,
        page: 1
    });

    const loadOptions = useCallback(
        async (input: string, callback: (options: any[]) => void) => {
            setInputValue(input);
            setPage(1);

            console.log("Searching for:", input);

            try {
                const result = await refetch();
                const data = result.data;

                console.log("API Result:", data);

                const results = data?.items || data?.data || [];
                console.log("Processed results:", results);

                setOptions(results);
                setHasMore(results.length === PAGE_SIZE);

                const formattedOptions = results.map((item: any) => ({
                    label: getOptionLabel(item),
                    value: getOptionValue(item),
                    data: item,
                }));

                callback(formattedOptions);
            } catch (error) {
                console.error("Error loading options:", error);
                callback([]);
            }
        },
        [refetch, getOptionLabel, getOptionValue]
    );

    const debouncedLoadOptions = useDebounce(loadOptions, 400);

    const handleMenuScrollToBottom = async () => {
        if (!hasMore) return;

        const nextPage = page + 1;
        try {
            const result = await refetch();
            const newResults = result.data?.items || result.data?.data || [];

            if (newResults.length < PAGE_SIZE) setHasMore(false);
            setPage(nextPage);
            setOptions((prev) => [...prev, ...newResults]);
        } catch (error) {
            console.error("Error loading more options:", error);
        }
    };

    const currentValue = options.find((item) => getOptionValue(item) === value);
    const formattedValue = currentValue ? {
        label: getOptionLabel(currentValue),
        value: getOptionValue(currentValue),
    } : null;

    const customStyles = {
        control: (base: any, state: any) => ({
            ...base,
            borderRadius: 6, // Same as DatePicker (6px = rounded-sm)
            borderColor: finalDarkMode
                ? state.isFocused ? "#94a3b8" : "#475569"
                : state.isFocused ? "#f97316" : "#d1d5db",
            backgroundColor: finalDarkMode ? "#1e293b" : "#ffffff",
            minHeight: "38px", // Same as DatePicker !h-[38px]
            height: "38px",
            boxShadow: state.isFocused
                ? finalDarkMode
                    ? "0 0 0 1px #94a3b8"
                    : "0 0 0 1px #f97316"
                : "none",
            "&:hover": {
                borderColor: finalDarkMode ? "#94a3b8" : "#f97316",
            },
        }),
        valueContainer: (base: any) => ({
            ...base,
            height: "38px",
            padding: "0 12px",
        }),
        input: (base: any) => ({
            ...base,
            color: finalDarkMode ? "#e2e8f0" : "#1f2937",
            margin: "0px",
            paddingTop: "0px",
            paddingBottom: "0px",
        }),
        indicatorsContainer: (base: any) => ({
            ...base,
            height: "38px",
        }),
        dropdownIndicator: (base: any) => ({
            ...base,
            color: finalDarkMode ? "#94a3b8" : "#6b7280",
            padding: "8px",
            "&:hover": {
                color: finalDarkMode ? "#e2e8f0" : "#374151",
            },
        }),
        clearIndicator: (base: any) => ({
            ...base,
            color: finalDarkMode ? "#94a3b8" : "#6b7280",
            padding: "8px",
            "&:hover": {
                color: finalDarkMode ? "#e2e8f0" : "#374151",
            },
        }),
        singleValue: (base: any) => ({
            ...base,
            color: finalDarkMode ? "#e2e8f0" : "#1f2937",
            margin: "0px",
        }),
        placeholder: (base: any) => ({
            ...base,
            color: finalDarkMode ? "#94a3b8" : "#9ca3af",
            margin: "0px",
        }),
        menu: (base: any) => ({
            ...base,
            borderRadius: 6,
            backgroundColor: finalDarkMode ? "#1e293b" : "#ffffff",
            border: finalDarkMode ? "1px solid #475569" : "1px solid #d1d5db",
            boxShadow: finalDarkMode
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.5)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isSelected
                ? finalDarkMode ? "#0f172a" : "#f97316"
                : state.isFocused
                    ? finalDarkMode ? "#334155" : "#ffedd5"
                    : finalDarkMode ? "#1e293b" : "#ffffff",
            color: state.isSelected
                ? finalDarkMode ? "#ffffff" : "#ffffff"
                : finalDarkMode ? "#e2e8f0" : "#1f2937",
            "&:active": {
                backgroundColor: finalDarkMode ? "#475569" : "#fed7aa",
            },
            fontSize: '0.875rem',
            borderRadius: 4,
            padding: "8px 12px",
        }),
        loadingIndicator: (base: any) => ({
            ...base,
            color: finalDarkMode ? "#94a3b8" : "#6b7280",
        }),
        noOptionsMessage: (base: any) => ({
            ...base,
            color: finalDarkMode ? "#94a3b8" : "#6b7280",
        }),
        loadingMessage: (base: any) => ({
            ...base,
            color: finalDarkMode ? "#94a3b8" : "#6b7280",
        }),
    };

    return (
        <div className={className}> {/* Remove mb-4 from here */}
            {label && (
                <label
                    className={`block mb-2 text-sm font-medium ${finalDarkMode ? "text-slate-200" : "text-gray-700"
                        }`}
                >
                    {label}
                </label>
            )}
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={debouncedLoadOptions}
                onMenuScrollToBottom={handleMenuScrollToBottom}
                value={formattedValue}
                onChange={onChange}
                placeholder={placeholder}
                isClearable
                styles={customStyles}
                theme={(theme) => ({
                    ...theme,
                    colors: {
                        ...theme.colors,
                        primary: finalDarkMode ? "#334155" : "#f97316",
                        primary25: finalDarkMode ? "#334155" : "#ffedd5",
                        primary50: finalDarkMode ? "#475569" : "#fed7aa",
                        primary75: finalDarkMode ? "#64748b" : "#fdba74",
                        neutral0: finalDarkMode ? "#1e293b" : "#ffffff",
                        neutral5: finalDarkMode ? "#334155" : "#f9fafb",
                        neutral10: finalDarkMode ? "#475569" : "#f3f4f6",
                        neutral20: finalDarkMode ? "#475569" : "#d1d5db",
                        neutral30: finalDarkMode ? "#64748b" : "#9ca3af",
                        neutral40: finalDarkMode ? "#94a3b8" : "#6b7280",
                        neutral50: finalDarkMode ? "#94a3b8" : "#6b7280",
                        neutral60: finalDarkMode ? "#cbd5e1" : "#4b5563",
                        neutral70: finalDarkMode ? "#e2e8f0" : "#374151",
                        neutral80: finalDarkMode ? "#f1f5f9" : "#1f2937",
                        neutral90: finalDarkMode ? "#f8fafc" : "#111827",
                    },
                })}
            />
        </div>
    );
};

export default ReusableAsyncSelect;