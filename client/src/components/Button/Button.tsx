import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles =
        'font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    };

    const sizeStyles = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const finalClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return <button className={finalClassName} {...props} />;
}
