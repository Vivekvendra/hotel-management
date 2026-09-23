import React from 'react';

export default function Badge({ children, variant = 'default', size = 'normal', className = '' }) {
  const base = "inline-flex items-center font-medium rounded-full tracking-wide";
  
  const sizeStyles = {
    small: "px-2 py-0.5 text-[11px]",
    normal: "px-2.5 py-1 text-xs",
    large: "px-3 py-1.5 text-sm"
  };

  const variantStyles = {
    default: "bg-stone-100 text-stone-700 border border-stone-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border border-amber-200",
    danger: "bg-rose-50 text-rose-700 border border-rose-200",
    info: "bg-sky-50 text-sky-700 border border-sky-200",
    luxury: "bg-[#F6F1EA] text-[#755B31] border border-[#E0D1BF]"
  };

  return (
    <span className={`${base} ${sizeStyles[size] || sizeStyles.normal} ${variantStyles[variant] || variantStyles.default} ${className}`}>
      {children}
    </span>
  );
}
