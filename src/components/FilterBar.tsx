'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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
    const [showCalendar, setShowCalendar] = useState<string | null>(null);
    const [dateValue, setDateValue] = useState<Date | null>(null);

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
        setDateValue(null);
        onClearAll?.();
    };

    const handleDateChange = (key: string, date: Date) => {
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        setDateValue(date);
        handleFilterChange(key, formattedDate);
        applyFilter(key, formattedDate);
        setShowCalendar(null);
    };

    const renderFilterControl = (filter: FilterOption) => {
        const { key, label, type, options } = filter;

        if (type === 'select') {
            return (
                <div key={key} className="relative">
                    <select
                        onChange={(e) => {
                            const value = e.target.value;
                            handleFilterChange(key, value);
                            applyFilter(key, value);
                        }}
                        className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue=""
                    >
                        <option value="">{label}</option>
                        {options?.map((opt) => (
                            <option key={opt} value={opt}>
                                {opt}
                            </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            );
        }

        if (type === 'date') {
            return (
                <div key={key} className="relative">
                    <input
                        type="text"
                        placeholder={label}
                        value={filters[key] || ''}
                        onClick={() => setShowCalendar(key)}
                        readOnly
                        className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {showCalendar === key && (
                        <div className="absolute z-10 mt-1 bg-white p-2 border border-gray-200 rounded-md shadow-lg">
                            <Calendar
                                onChange={(date) => handleDateChange(key, date as Date)}
                                value={dateValue}
                            />
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div key={key} className="relative">
                <input
                    type="text"
                    placeholder={label}
                    value={filters[key] || ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        handleFilterChange(key, value);
                        applyFilter(key, value);
                    }}
                    className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        );
    };

    return (
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm rounded-md">
            <div className="flex flex-wrap gap-3 mb-4">
                {filtersConfig.map(renderFilterControl)}
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Applied Filters:</span>

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
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors underline-offset-2 hover:underline"
                        >
                            Clear All
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default FilterBar;