import React, { useState, useEffect } from "react";
import InputField from "./InputField";

type DebouncedSearchProps = {
    value: string;
    onChange: (value: string) => void;
    delay?: number;
    placeholder?: string;
    className?: string;
    name?: string;
};

const DebouncedSearch: React.FC<DebouncedSearchProps> = ({
    value,
    onChange,
    delay = 500,
    placeholder = "Search…",
    name = "search",
}) => {
    const [innerValue, setInnerValue] = useState(value);

    useEffect(() => {
        setInnerValue(value);
    }, [value]);


    useEffect(() => {
        const handler = setTimeout(() => {
            if (innerValue !== value) {
                onChange(innerValue);
            }
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [innerValue, delay, onChange, value]);

    return (
        <InputField
            type="text"
            name={name}
            value={innerValue}
            onChange={(e) => setInnerValue(e.target.value)}
            placeholder={placeholder}
            
        />
    );
};

export default DebouncedSearch;
