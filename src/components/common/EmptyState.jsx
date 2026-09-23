import React from 'react';
import { SearchX } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'Try adjusting your search query or filter to find what you are looking for.',
  icon: Icon = SearchX,
  actionText,
  onAction
}) {
  return (
    <div className="py-12 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-3xl bg-[#8C6D3B]/10 text-[#8C6D3B] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 stroke-[1.75]" />
      </div>
      <h4 className="text-lg font-serif-luxury font-semibold text-stone-800 mb-1">
        {title}
      </h4>
      <p className="text-sm text-stone-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-full bg-[#8C6D3B] hover:bg-[#755B31] text-white text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
