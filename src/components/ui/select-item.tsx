// src/components/ui/select-item.tsx
import * as React from 'react';

interface SelectItemProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, onClick, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`p-2 cursor-pointer hover:bg-gray-100 focus:bg-blue-100 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SelectItem.displayName = 'SelectItem';

export { SelectItem };
