import React from 'react';

export default function Logo({ className = "", size = "normal" }) {
  const isLarge = size === "large";
  
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Grand Azure Luxury Emblem - 8 Petal Star / Flower */}
      <svg
        className={isLarge ? "w-11 h-11" : "w-8 h-8"}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g fill="#8C6D3B">
          {/* North */}
          <path d="M50 8 C44 26 44 38 50 48 C56 38 56 26 50 8 Z" opacity="0.95" />
          {/* South */}
          <path d="M50 92 C44 74 44 62 50 52 C56 62 56 74 50 92 Z" opacity="0.95" />
          {/* East */}
          <path d="M92 50 C74 44 62 44 52 50 C62 56 74 56 92 50 Z" opacity="0.95" />
          {/* West */}
          <path d="M8 50 C26 44 38 44 48 50 C38 56 26 56 8 50 Z" opacity="0.95" />
          {/* North East */}
          <path d="M80 20 C64 28 56 36 51 49 C64 44 72 36 80 20 Z" opacity="0.88" />
          {/* South East */}
          <path d="M80 80 C72 64 64 56 51 51 C56 64 64 72 80 80 Z" opacity="0.88" />
          {/* South West */}
          <path d="M20 80 C36 72 44 64 49 51 C36 56 28 64 20 80 Z" opacity="0.88" />
          {/* North West */}
          <path d="M20 20 C28 36 36 44 49 49 C44 36 36 28 20 20 Z" opacity="0.88" />
          {/* Center core */}
          <circle cx="50" cy="50" r="5" fill="#FAF9F6" />
        </g>
      </svg>

      {/* Brand Typography */}
      <div className="flex flex-col text-left leading-none tracking-normal">
        <span className="text-[10px] tracking-[0.28em] uppercase font-medium text-[#8C6D3B]">
          Grand
        </span>
        <span className="text-xl font-serif-luxury font-semibold tracking-wider text-[#3E3224]">
          Azure
        </span>
      </div>
    </div>
  );
}
