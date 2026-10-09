import React from 'react';
import { StatusTier } from '../types';

interface StatusChipProps {
  tier: StatusTier | 'approved' | 'dismissed' | 'pending';
  label?: string;
  className?: string;
  showDot?: boolean;
  pulsing?: boolean;
}

export const StatusChip: React.FC<StatusChipProps> = ({
  tier,
  label,
  className = '',
  showDot = true,
  pulsing = false
}) => {
  const normalizedTier = tier.toLowerCase();
  
  if (normalizedTier === 'critical') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#FBDDD0] text-[#8F2D07] border border-[#B3441A] ${className}`}>
        {showDot && (
          <span className={`w-1.5 h-1.5 rounded-full bg-[#B3441A] ${pulsing ? 'animate-pulse' : ''}`} />
        )}
        <span>{label || 'Critical'}</span>
      </span>
    );
  }

  if (normalizedTier === 'warning') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#FFEFC2] text-[#6B4600] border border-[#B07A00] ${className}`}>
        {showDot && <span className="w-1.5 h-1.5 rounded-full bg-[#B07A00]" />}
        <span>{label || 'Warning'}</span>
      </span>
    );
  }

  if (normalizedTier === 'watch') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#DCEAF8] text-[#154C8A] border border-[#2F78C4] ${className}`}>
        {showDot && <span className="w-1.5 h-1.5 rounded-full bg-[#2F78C4]" />}
        <span>{label || 'Watch'}</span>
      </span>
    );
  }

  if (normalizedTier === 'approved' || normalizedTier === 'ok') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#D9F0EE] text-[#0B5A56] border border-[#0F6E73] ${className}`}>
        {showDot && <span className="w-1.5 h-1.5 rounded-full bg-[#0F6E73]" />}
        <span>{label || (normalizedTier === 'approved' ? 'Approved' : 'OK')}</span>
      </span>
    );
  }

  if (normalizedTier === 'dismissed') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-[#F0F4F5] text-[#4A6469] border border-[#BAC6C8] ${className}`}>
        {showDot && <span className="w-1.5 h-1.5 rounded-full bg-[#7D8F92]" />}
        <span>{label || 'Dismissed'}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-slate-100 text-slate-700 border border-slate-300 ${className}`}>
      {label || tier}
    </span>
  );
};
