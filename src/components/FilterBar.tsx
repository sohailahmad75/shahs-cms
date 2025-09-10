'use client';

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import InputField from './InputField';
import SelectField from './SelectField';
import DatePickerField from './DatePickerField';

interface FilterOption {
    key: string;
    label: string;
    options?: readonly string[];
    type: 'select' | 'input' | 'date';
}

interface AppliedFilter {
    key: string;
    value: string;
}

interface FilterBarProps {
    filtersConfig: FilterOption[];
    onApplyFilters?: (filters: Record<string, string>) => void;
    onClearAll?: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filtersConfig, onClearAll }) => {
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const applyFilter = (key: string, value: string) => {
        if (!value.trim()) return;

        if (appliedFilters.some((f) => f.key === key && f.value === value)) return;

        setAppliedFilters((prev) => [...prev, { key, value }]);
    };

    const removeFilter = (index: number) => {
        setAppliedFilters((prev) => prev.filter((_, i) => i !== index));
    };

    const resetFilters = () => {
        setAppliedFilters([]);
        setFilters({});
        onClearAll?.();
    };

    const renderFilterControl = (filter: FilterOption) => {
        const { key, label, type, options } = filter;

        if (type === 'select') {
            return (
                <div key={key} className="w-full sm:w-auto">
                    <SelectField
                        value={filters[key] || ''}
                        onChange={(e) => {
                            const value = e.target.value as string;
                            handleFilterChange(key, value);
                            applyFilter(key, value);
                        }}
                        options={options?.map(opt => ({ label: opt, value: opt })) || []}
                        placeholder={label}
                        name={key}
                    />
                </div>
            );
        }

        if (type === 'date') {
            return (
                <div key={key} className="w-full sm:w-auto">
                    <DatePickerField
                        value={filters[key] || ''}
                        onChange={(value) => {
                            const dateValue = value as string;
                            handleFilterChange(key, dateValue);
                            applyFilter(key, dateValue);
                        }}
                        name={key}
                        placeholder={label}
                    />
                </div>
            );
        }

        return (
            <div key={key} className="w-full sm:w-auto">
                <InputField
                    type="text"
                    placeholder={label}
                    value={filters[key] || ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleFilterChange(key, value);
                        applyFilter(key, value);
                    }}
                    name={key}
                />
            </div>
        );
    };

    return (
        <div className="bg-white border border-gray-200 p-4 rounded-md shadow-sm">
            <div className="flex flex-wrap gap-3 mb-4">
                {filtersConfig.map(renderFilterControl)}
            </div>

            {/* Separator line */}
            <hr className="my-3 border-gray-300" />

            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
                    Applied Filters:
                </span>

                {appliedFilters.length === 0 ? (
                    <span className="text-sm text-gray-500 italic">No filters applied</span>
                ) : (
                    <>
                        {appliedFilters.map((filter, index) => (
                            <div
                                key={index}
                                className="inline-flex items-center bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm border border-gray-200 shadow-sm"
                            >
                                <span className="font-medium">
                                    {filtersConfig.find((f) => f.key === filter.key)?.label || filter.key}:{" "}
                                </span>
                                <span className="ml-1">{filter.value}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFilter(index)}
                                    className="ml-2 text-gray-500 hover:text-red-500 transition-colors font-bold text-lg"
                                    aria-label={`Remove ${filter.value} filter`}
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="ml-2 text-gray-600 hover:text-blue-600 transition-colors"
                            title="Clear All"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
