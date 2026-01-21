import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'hover' | 'bordered';
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

interface CardHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface CardBodyProps {
    children: React.ReactNode;
    className?: string;
}

interface CardFooterProps {
    children: React.ReactNode;
    className?: string;
}

function CardHeader({ children, className = '' }: CardHeaderProps) {
    return <div className={`px-4 py-3 border-b border-gray-200 ${className}`}>{children}</div>;
}

function CardBody({ children, className = '' }: CardBodyProps) {
    return <div className={`p-4 ${className}`}>{children}</div>;
}

function CardFooter({ children, className = '' }: CardFooterProps) {
    return <div className={`px-4 py-3 border-t border-gray-200 ${className}`}>{children}</div>;
}

function Card({ children, className = '', variant = 'default', onClick }: CardProps) {
    const variantClasses = {
        default: 'bg-white rounded-lg shadow-md',
        hover: 'bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow',
        bordered: 'bg-white rounded-lg border border-gray-200',
    };

    return (
        <div className={`${variantClasses[variant]} ${className}`} onClick={onClick}>
            {children}
        </div>
    );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
