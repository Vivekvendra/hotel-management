import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-stone-200 animate-pulse space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-stone-200 rounded"></div>
                <div className="h-7 w-24 bg-stone-300 rounded"></div>
              </div>
              <div className="w-10 h-10 bg-stone-200 rounded-2xl"></div>
            </div>
            <div className="h-3 w-32 bg-stone-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white rounded-2xl p-6 border border-stone-200 animate-pulse space-y-4">
        <div className="h-6 w-48 bg-stone-200 rounded"></div>
        <div className="space-y-3 pt-2">
          {items.map((_, i) => (
            <div key={i} className="h-12 bg-stone-100 rounded-xl w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-32 bg-stone-100 rounded-2xl animate-pulse"></div>
  );
}
