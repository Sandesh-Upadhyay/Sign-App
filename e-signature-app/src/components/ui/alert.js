// src/components/ui/alert.jsx
import React from 'react';

export const Alert = React.forwardRef(({ children, variant = 'default', className, ...props }, ref) => {
  const baseStyle = "relative w-full rounded-lg border p-4";
  const variantStyle = variant === 'destructive' 
    ? "border-red-600 text-red-600 bg-red-50" 
    : "border-blue-600 text-blue-600 bg-blue-50";

  return (
    <div
      ref={ref}
      role="alert"
      className={`${baseStyle} ${variantStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

export const AlertTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={`mb-1 font-medium leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h5>
));

export const AlertDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  >
    {children}
  </div>
));

Alert.displayName = "Alert";
AlertTitle.displayName = "AlertTitle";
AlertDescription.displayName = "AlertDescription";