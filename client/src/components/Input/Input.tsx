import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({ label, error, className = '', ...props }: InputProps) {
    return (
        <div className="w-full">
            {label && <label className="text-sm font-medium text-gray-700 block mb-1">{label}</label>}
            <input
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    error ? 'border-red-500' : 'border-gray-300'
                } ${className}`}
                {...props}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}
