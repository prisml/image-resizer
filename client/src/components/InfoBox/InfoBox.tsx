import React from 'react';

interface InfoBoxProps {
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export default function InfoBox({ type = 'info', title, children, className = '' }: InfoBoxProps) {
    const typeStyles = {
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        success: 'bg-green-50 border-green-200 text-green-800',
        warning: 'bg-amber-50 border-amber-200 text-amber-800',
        error: 'bg-red-50 border-red-200 text-red-800',
    };

    const icons = {
        info: 'ℹ️',
        success: '✓',
        warning: '⚠️',
        error: '✕',
    };

    return (
        <div className={`border rounded-lg p-3 ${typeStyles[type]} ${className}`}>
            {title && <p className="text-sm font-semibold mb-1">{title}</p>}
            <p className="text-sm flex items-start gap-2">
                <span>{icons[type]}</span>
                <span>{children}</span>
            </p>
        </div>
    );
}
