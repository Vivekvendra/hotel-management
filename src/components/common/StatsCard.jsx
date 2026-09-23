import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function StatsCard({
  title,
  value,
  subtitle,
  trend,
  trendType = 'up', // 'up' | 'down' | 'neutral'
  icon: Icon,
  iconColor = 'text-[#8C6D3B]',
  iconBg = 'bg-[#8C6D3B]/10',
  className = ''
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs hover:shadow-md hover:border-[#8C6D3B]/30 transition-all duration-300 flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-stone-500 tracking-wider uppercase">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1 tracking-tight">
            {value}
          </h3>
        </div>
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
          {trend && (
            <div
              className={`flex items-center gap-1 font-semibold ${
                trendType === 'up'
                  ? 'text-emerald-600'
                  : trendType === 'down'
                  ? 'text-rose-600'
                  : 'text-stone-500'
              }`}
            >
              {trendType === 'up' && <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />}
              {trendType === 'down' && <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />}
              <span>{trend}</span>
            </div>
          )}
          {subtitle && (
            <span className="text-stone-400 font-normal truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
