import React, { useCallback, useRef, useState } from "react";
import AsyncSelect from "react-select/async";

interface AsyncSelectProps {
    label?: string;
    placeholder?: string;
    value: any;
    onChange: (option: any) => void;
    useQueryHook: (args: { search: string; page: number }) => Promise<any>;
    getOptionLabel?: (item: any) => string;
    getOptionValue?: (item: any) => string;
}

const PAGE_SIZE = 20;


const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
    const timer = useRef(null);

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

    const loadOptions = useCallback(
        async (input: string) => {
            setInputValue(input);
            setPage(1);
            const { data } = await useQueryHook({ search: input, page: 1 });
            const results = data?.items || data?.data || [];
            setOptions(results);
            setHasMore(results.length === PAGE_SIZE);
            return results.map((item: any) => ({
                label: getOptionLabel(item),
                value: getOptionValue(item),
            }));
        },
        [useQueryHook, getOptionLabel, getOptionValue]
    );


    const debouncedLoadOptions = useDebounce(loadOptions, 400);

    
    const handleMenuScrollToBottom = async () => {
        if (!hasMore) return;
        const nextPage = page + 1;
        const { data } = await useQueryHook({ search: inputValue, page: nextPage });
        const newResults = data?.items || data?.data || [];
        if (newResults.length < PAGE_SIZE) setHasMore(false);
        setPage(nextPage);
        setOptions((prev) => [...prev, ...newResults]);
    };

    const formattedOptions = options.map((item) => ({
        label: getOptionLabel(item),
        value: getOptionValue(item),
    }));

    return (
        <div style={{ marginBottom: "1rem" }}>
            {label && <label className="block mb-1 text-sm font-medium">{label}</label>}
            <AsyncSelect
                cacheOptions
                defaultOptions={formattedOptions}
                loadOptions={debouncedLoadOptions}
                onMenuScrollToBottom={handleMenuScrollToBottom}
                value={formattedOptions.find((opt) => opt.value === value) || null}
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
