import React from "react";

interface DateInputProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    name?: string;
    min?: string;
    max?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

export default function DateInput({
    label,
    value,
    onChange,
    name,
    min,
    max,
    required = false,
    disabled = false,
    className = "",
}: DateInputProps) {
    return (
        <div className={`flex flex-col gap-1 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="text-sm font-medium text-gray-700 mb-1"
                >
                    {label}
                </label>
            )}
            <input
                type="date"
                id={name}
                name={name}
                value={value}
                onChange={e => onChange(e.target.value)}
                min={min}
                max={max}
                required={required}
                disabled={disabled}
                className={`
          rounded-lg border border-gray-300 px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-150
          text-gray-800 bg-white
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
            />
        </div>
    );
}
