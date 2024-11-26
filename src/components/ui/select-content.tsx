// src/components/ui/select-content.tsx
import * as React from 'react';

interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
}

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute mt-2 w-full bg-white shadow-lg rounded-md z-10 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SelectContent.displayName = 'SelectContent';

export { SelectContent };
