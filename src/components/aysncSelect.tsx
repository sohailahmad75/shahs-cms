import React, { useCallback, useRef, useState } from "react";
import AsyncSelect from "react-select/async";

interface AsyncSelectProps {
    label?: string;
    placeholder?: string;
    value: any;
    onChange: (option: any) => void;
    useQueryHook: (args: { query: string; page: number }) => any;
    getOptionLabel?: (item: any) => string;
    getOptionValue?: (item: any) => string;
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
}) => {
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

    return (
        <div style={{ marginBottom: "1rem" }}>
            {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={debouncedLoadOptions}
                onMenuScrollToBottom={handleMenuScrollToBottom}
                value={formattedValue}
                onChange={onChange}
                placeholder={placeholder}
                isClearable
                styles={{
                    control: (base) => ({
                        ...base,
                        borderRadius: 8,
                        borderColor: "#ccc",
                        minHeight: 42,
                    }),
                }}
            />
        </div>
    );
};

export default ReusableAsyncSelect;