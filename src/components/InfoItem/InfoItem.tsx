import React from 'react';

interface InfoItemProps {
    label: string;
    value: string | number;
}

export default function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div className="flex justify-between">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">{value}</span>
        </div>
    );
}
