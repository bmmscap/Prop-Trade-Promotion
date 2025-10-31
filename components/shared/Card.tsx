import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, icon }) => {
  return (
    <div className={`bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 ${className}`}>
      {title && (
        <div className="flex items-center mb-4">
          {icon && <div className="mr-3 text-indigo-400">{icon}</div>}
          <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
