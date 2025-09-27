'use client';

import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import InputField from './InputField';
import SelectField from './SelectField';
import DatePickerField from './DatePickerField';
import { useTheme } from '../../src/context/themeContext';

interface FilterOption {
    key: string;
    label: string;
    options?: { label: string; value: string }[];
    type: 'select' | 'input' | 'date';
    isRange?: boolean;
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

const FilterBar: React.FC<FilterBarProps> = ({
    filtersConfig,
    onApplyFilters,
    onClearAll,
}) => {
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [appliedFilters, setAppliedFilters] = useState<AppliedFilter[]>([]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => {
            const newFilters = { ...prev, [key]: value };
            onApplyFilters?.(newFilters);
            return newFilters;
        });
    };

    const applyFilter = (key: string, value: string) => {
        if (!value.trim()) return;

        setAppliedFilters((prev) => {
            const exists = prev.some((f) => f.key === key && f.value === value);
            if (exists) return prev;
            return [...prev, { key, value }];
        });
    };

    const removeFilter = (index: number) => {
        setAppliedFilters((prev) => {
            const newApplied = prev.filter((_, i) => i !== index);
            const newFilters = newApplied.reduce<Record<string, string>>((acc, f) => {
                acc[f.key] = f.value;
                return acc;
            }, {});
            setFilters(newFilters);
            onApplyFilters?.(newFilters);
            return newApplied;
        });
    };

    const resetFilters = () => {
        setAppliedFilters([]);
        setFilters({});
        onClearAll?.();
        onApplyFilters?.({});
    };

    const { isDarkMode } = useTheme();

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
                        options={options || []}
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
                        isRange={true}
                        value={filters[key] || ['', '']}
                        onChange={(value) => {
                            if (Array.isArray(value)) {
                                const [from, to] = value;
                                handleFilterChange('startDate', new Date(from).toISOString());
                                handleFilterChange('endDate', new Date(to).toISOString());
                                applyFilter(key, `${from} → ${to}`);
                            } else {
                                const dateValue = new Date(value as string).toISOString();
                                handleFilterChange(key, dateValue);
                                applyFilter(key, value as string);
                            }
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
        <div
            className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'
                } p-4 rounded-md shadow-sm border`}
        >
            <div className="flex flex-wrap gap-3 mb-4">
                {filtersConfig.map(renderFilterControl)}
            </div>

            {/* Separator line */}
            <hr className={`my-3 ${isDarkMode ? 'border-slate-700' : 'border-gray-300'}`} />

            {/* Applied filters */}
            <div className="flex flex-wrap items-center gap-2">
                <span
                    className={`text-sm font-medium ${isDarkMode ? 'text-slate-200' : 'text-gray-600'
                        } whitespace-nowrap`}
                >
                    Applied Filters:
                </span>

                {appliedFilters.length === 0 ? (
                    <span
                        className={`text-sm italic ${isDarkMode ? 'text-slate-400' : 'text-gray-500'
                            }`}
                    >
                        No filters applied
                    </span>
                ) : (
                    <>
                        {appliedFilters.map((filter, index) => {
                            const optionLabel =
                                filtersConfig
                                    .find((f) => f.key === filter.key)
                                    ?.options?.find((opt) => opt.value === filter.value)?.label ||
                                filter.value;

                            return (
                                <div
                                    key={index}
                                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border shadow-sm ${isDarkMode
                                            ? 'bg-slate-800 text-slate-200 border-slate-700'
                                            : 'bg-gray-100 text-gray-800 border-gray-200'
                                        }`}
                                >
                                    <span className="font-medium">
                                        {filtersConfig.find((f) => f.key === filter.key)?.label ||
                                            filter.key}
                                        :
                                    </span>
                                    <span className="ml-1">{optionLabel}</span>
                                    <button
                                        type="button"
                                        onClick={() => removeFilter(index)}
                                        className={`ml-2 font-bold text-lg transition-colors cursor-pointer ${isDarkMode
                                                ? 'text-slate-400 hover:text-red-400'
                                                : 'text-gray-500 hover:text-red-500'
                                            }`}
                                        aria-label={`Remove ${filter.value} filter`}
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}

                        <button
                            type="button"
                            onClick={resetFilters}
                            className={`ml-2 transition-colors cursor-pointer ${isDarkMode
                                    ? 'text-slate-300 hover:text-slate-100'
                                    : 'text-gray-600 '
                                }`}
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