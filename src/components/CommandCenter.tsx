import React, { useState } from 'react';
import { StatusChip } from './StatusChip';
import { CENSUS_FORECAST_POINTS } from '../data/mockData';

interface CommandCenterProps {
  onReviewActions: () => void;
  onOpenAllUnits: () => void;
  onNavigateToUnit: (unitId: string) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  onReviewActions,
  onOpenAllUnits,
  onNavigateToUnit
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // SVG Chart Dimensions
  const width = 640;
  const height = 240;
  const padding = { top: 35, right: 30, bottom: 40, left: 45 };

  // Y-axis range: 340 to 460
  const minY = 340;
  const maxY = 460;
  const getY = (val: number) => {
    return height - padding.bottom - ((val - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);
  };
  const getX = (index: number) => {
    const step = (width - padding.left - padding.right) / (CENSUS_FORECAST_POINTS.length - 1);
    return padding.left + index * step;
  };

  // Licensed Capacity = 438 beds
  const capacityY = getY(438);

  // Actual points (index 0 to 3)
  const actualPath = CENSUS_FORECAST_POINTS.slice(0, 4).reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getY(pt.actual!);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Forecast points (index 3 to 7)
  const forecastPath = CENSUS_FORECAST_POINTS.slice(3).reduce((acc, pt, i) => {
    const x = getX(i + 3);
    const y = getY(pt.forecast!);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Confidence Interval polygon area (index 3 to 7)
  const ciUpper = CENSUS_FORECAST_POINTS.slice(3).map((pt, i) => `${getX(i + 3)},${getY(pt.upper!)}`);
  const ciLower = CENSUS_FORECAST_POINTS.slice(3).map((pt, i) => `${getX(i + 3)},${getY(pt.lower!)}`).reverse();
  const ciPolygon = `${ciUpper.join(' ')} ${ciLower.join(' ')}`;

  return (
    <div className="flex flex-col gap-5 max-w-[1440px] mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#12262B]">
            Command Center
          </h1>
          <p className="text-[14px] text-[#4A6469] mt-0.5">
            Hospital-wide view · Updated 14:32 · Live
          </p>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[#DCEAF8] text-[#154C8A] border border-[#2F78C4]/30">
            <span className="material-symbols-outlined text-[15px]">analytics</span>
            Simulated hospital data
          </span>
        </div>
      </div>

      {/* 2. Critical Surge Alert Banner */}
      <div className="bg-[#FDE8DC] border border-[#F2B79A] rounded-xl p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start md:items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#FBDDD0] border border-[#B3441A]/30 flex items-center justify-center shrink-0 text-[#8F2D07]">
            <span className="material-symbols-outlined text-[24px]">error</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-[16px] font-bold text-[#8F2D07] leading-tight">
              ICU is likely to run out of beds in about 3 h 40 min
            </h2>
            <p className="text-[13px] text-[#8F2D07]/90 mt-0.5">
              Current inflow exceeds discharge trajectory by 2.4x. Surge protocol recommendation available.
            </p>
          </div>
        </div>

        <button
          onClick={onReviewActions}
          className="self-start md:self-auto inline-flex items-center gap-2 bg-[#0F6E73] hover:bg-[#0A4F53] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <span>Review actions</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>

      {/* 3. Four Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Bed Occupancy */}
        <div className="bg-white rounded-[14px] border border-[#DCE5E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-medium text-[#4A6469]">Bed Occupancy</span>
              <StatusChip tier="critical" />
            </div>
            <div className="text-[34px] font-bold text-[#12262B] tabular-nums tracking-tight">
              94.2%
            </div>
            <p className="text-[12px] text-[#4A6469] mt-1 leading-snug">
              412 of 438 operational beds occupied across wings
            </p>
          </div>
          <div className="mt-4">
            <div className="w-full h-2 bg-[#E6EDEE] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#B3441A] rounded-full transition-all duration-500" 
                style={{ width: '94.2%' }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Patients Waiting */}
        <div className="bg-white rounded-[14px] border border-[#DCE5E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-medium text-[#4A6469]">Patients Waiting</span>
              <StatusChip tier="warning" />
            </div>
            <div className="text-[34px] font-bold text-[#12262B] tabular-nums tracking-tight">
              38
            </div>
            <p className="text-[12px] text-[#4A6469] mt-1 leading-snug">
              Avg triage-to-bed delay 42 min above baseline
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-[#8F2D07]">
            <span className="material-symbols-outlined text-[16px]">trending_up</span>
            <span>+6 arrivals last 30 min</span>
          </div>
        </div>

        {/* Card 3: Staff on Duty */}
        <div className="bg-white rounded-[14px] border border-[#DCE5E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-medium text-[#4A6469]">Staff on Duty</span>
              <StatusChip tier="ok" />
            </div>
            <div className="text-[34px] font-bold text-[#12262B] tabular-nums tracking-tight">
              142
            </div>
            <p className="text-[12px] text-[#4A6469] mt-1 leading-snug">
              Full shift coverage in acute wards; 4 float nurses standby
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-[#0B5A56]">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span>Tier-1 ratio sustained</span>
          </div>
        </div>

        {/* Card 4: Equipment Available */}
        <div className="bg-white rounded-[14px] border border-[#DCE5E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[13px] font-medium text-[#4A6469]">Equipment Available</span>
              <StatusChip tier="watch" />
            </div>
            <div className="text-[34px] font-bold text-[#12262B] tabular-nums tracking-tight">
              18 / 20
            </div>
            <p className="text-[12px] text-[#4A6469] mt-1 leading-snug">
              Ventilators deployed; 2 reserved for emergency inbound
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-[12px] font-semibold text-[#154C8A]">
            <span className="material-symbols-outlined text-[16px]">medical_services</span>
            <span>90% fleet allocation</span>
          </div>
        </div>
      </div>

      {/* 4. Large Analytical Grid: Forecast & Department Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: 48-Hour Inpatient Census Forecast */}
        <div className="lg:col-span-7 bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h2 className="text-[17px] font-bold text-[#12262B]">
                  48-Hour Inpatient Census Forecast
                </h2>
                <p className="text-[13px] text-[#4A6469]">
                  Predictive neural forecast with historical smoothing
                </p>
              </div>
            </div>

            {/* SVG Visual Area */}
            <div className="relative mt-3 w-full overflow-hidden bg-[#F8FAFA] rounded-xl border border-[#E6EDEE] p-3">
              <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-auto overflow-visible"
              >
                <defs>
                  <linearGradient id="ciGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F6E73" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#0F6E73" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[350, 400, 450].map((val) => {
                  const y = getY(val);
                  return (
                    <g key={val}>
                      <line 
                        x1={padding.left} 
                        y1={y} 
                        x2={width - padding.right} 
                        y2={y} 
                        stroke="#E6EDEE" 
                        strokeWidth="1" 
                      />
                      <text 
                        x={padding.left - 8} 
                        y={y + 3} 
                        fill="#8EA5AA" 
                        fontSize="10" 
                        textAnchor="end"
                        className="font-mono"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Licensed Capacity Threshold Line (438 beds) */}
                <line 
                  x1={padding.left} 
                  y1={capacityY} 
                  x2={width - padding.right} 
                  y2={capacityY} 
                  stroke="#B3441A" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={padding.left - 8} 
                  y={capacityY + 3} 
                  fill="#B3441A" 
                  fontSize="10" 
                  fontWeight="bold" 
                  textAnchor="end"
                  className="font-mono"
                >
                  438
                </text>
                <text 
                  x={width - padding.right - 8} 
                  y={capacityY - 6} 
                  fill="#8F2D07" 
                  fontSize="9.5" 
                  fontWeight="600" 
                  textAnchor="end"
                  className="tracking-tight"
                >
                  Licensed Capacity (438 Beds)
                </text>

                {/* Shaded Likely Range (80% CI) */}
                <polygon points={ciPolygon} fill="url(#ciGradient)" />

                {/* "Now (14:32)" Vertical Indicator */}
                <line 
                  x1={getX(3)} 
                  y1={padding.top} 
                  x2={getX(3)} 
                  y2={height - padding.bottom} 
                  stroke="#4A6469" 
                  strokeWidth="1.2" 
                  strokeDasharray="2 3" 
                />
                {/* Now Badge */}
                <rect 
                  x={getX(3) - 34} 
                  y={padding.top - 20} 
                  width="68" 
                  height="18" 
                  rx="4" 
                  fill="#12262B" 
                />
                <text 
                  x={getX(3)} 
                  y={padding.top - 7} 
                  fill="#FFFFFF" 
                  fontSize="9" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  Now (14:32)
                </text>

                {/* Actual Demand Line */}
                <path 
                  d={actualPath} 
                  fill="none" 
                  stroke="#0E3B40" 
                  strokeWidth="2.8" 
                  strokeLinecap="round" 
                />

                {/* Model Forecast Line (Dashed) */}
                <path 
                  d={forecastPath} 
                  fill="none" 
                  stroke="#0F6E73" 
                  strokeWidth="2.5" 
                  strokeDasharray="5 4" 
                  strokeLinecap="round" 
                />

                {/* Actual Demand Points */}
                {CENSUS_FORECAST_POINTS.slice(0, 4).map((pt, i) => {
                  const x = getX(i);
                  const y = getY(pt.actual!);
                  return (
                    <circle 
                      key={pt.time} 
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill="#0E3B40" 
                      stroke="#FFFFFF" 
                      strokeWidth="2" 
                    />
                  );
                })}

                {/* Surge Breach Highlight Marker */}
                <circle 
                  cx={getX(5)} 
                  cy={getY(CENSUS_FORECAST_POINTS[5].forecast!)} 
                  r="5" 
                  fill="#B3441A" 
                  stroke="#FFFFFF" 
                  strokeWidth="2" 
                />
                <text 
                  x={getX(5) - 8} 
                  y={getY(CENSUS_FORECAST_POINTS[5].forecast!) - 10} 
                  fill="#8F2D07" 
                  fontSize="9.5" 
                  fontWeight="bold"
                >
                  Surge Breach ~18:15
                </text>

                {/* X-axis labels */}
                {CENSUS_FORECAST_POINTS.map((pt, i) => {
                  const x = getX(i);
                  const isCurrent = i === 3;
                  return (
                    <g 
                      key={pt.time}
                      onMouseEnter={() => setHoveredPoint(i)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer"
                    >
                      <text 
                        x={x} 
                        y={height - padding.bottom + 16} 
                        fill={isCurrent ? '#12262B' : '#6F797A'} 
                        fontSize="10" 
                        fontWeight={isCurrent ? 'bold' : 'normal'}
                        textAnchor="middle"
                        className="font-mono"
                      >
                        {pt.time}
                      </text>
                      {/* Transparent hit area for hover */}
                      <rect 
                        x={x - 20} 
                        y={padding.top} 
                        width="40" 
                        height={height - padding.top - padding.bottom} 
                        fill="transparent" 
                      />
                    </g>
                  );
                })}

                {/* Active Hover Tooltip */}
                {hoveredPoint !== null && (
                  <g transform={`translate(${getX(hoveredPoint)}, ${getY(CENSUS_FORECAST_POINTS[hoveredPoint].actual || CENSUS_FORECAST_POINTS[hoveredPoint].forecast!) - 40})`}>
                    <rect 
                      x="-55" 
                      y="-12" 
                      width="110" 
                      height="34" 
                      rx="6" 
                      fill="#0E3B40" 
                      opacity="0.95" 
                    />
                    <text x="0" y="2" fill="#A1F0F5" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {CENSUS_FORECAST_POINTS[hoveredPoint].time}: {CENSUS_FORECAST_POINTS[hoveredPoint].actual || CENSUS_FORECAST_POINTS[hoveredPoint].forecast} Beds
                    </text>
                    <text x="0" y="15" fill="#CFE3E4" fontSize="8.5" textAnchor="middle">
                      {hoveredPoint < 4 ? 'Actual Inpatient Census' : '80% CI Projected Inflow'}
                    </text>
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 pt-3 border-t border-[#E6EDEE] text-[12px] text-[#4A6469]">
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#0E3B40]" />
              <span>Actual demand</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-[#0F6E73]" />
              <span>Model forecast</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-xs bg-[#0F6E73]/20 border border-[#0F6E73]/40" />
              <span>Shaded likely range (80% CI)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-[#B3441A]" />
              <span>Capacity limit line</span>
            </div>
          </div>
        </div>

        {/* Right: Department Capacity Status */}
        <div className="lg:col-span-5 bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[17px] font-bold text-[#12262B]">
                Department Capacity Status
              </h2>
            </div>
            <p className="text-[13px] text-[#4A6469] mb-4">
              Sorted by breach probability
            </p>

            {/* Department List */}
            <div className="flex flex-col gap-3.5">
              {/* Unit 1: ICU */}
              <div 
                onClick={() => onNavigateToUnit('icu')}
                className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E6EDEE] hover:border-[#B3441A]/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] font-bold text-[#12262B] group-hover:text-[#0F6E73] transition-colors">
                    Intensive Care Unit (ICU)
                  </span>
                  <StatusChip tier="critical" />
                </div>
                <div className="flex items-center justify-between text-[12px] text-[#8F2D07] font-medium mb-1.5">
                  <span>Capacity breach in ~3 h 40 min (31/32 beds)</span>
                  <span className="font-bold">96%</span>
                </div>
                <div className="w-full bg-[#E6EDEE] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#B3441A] rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              {/* Unit 2: ED */}
              <div 
                onClick={() => onNavigateToUnit('ed')}
                className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E6EDEE] hover:border-[#B07A00]/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] font-bold text-[#12262B] group-hover:text-[#0F6E73] transition-colors">
                    Emergency Department (ED)
                  </span>
                  <StatusChip tier="warning" />
                </div>
                <div className="flex items-center justify-between text-[12px] text-[#6B4600] font-medium mb-1.5">
                  <span>Risk building · Projected bottleneck at 18:00</span>
                  <span className="font-bold">84%</span>
                </div>
                <div className="w-full bg-[#E6EDEE] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#B07A00] rounded-full" style={{ width: '84%' }} />
                </div>
              </div>

              {/* Unit 3: Acute Surgical Wing */}
              <div 
                onClick={() => onNavigateToUnit('surgical')}
                className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E6EDEE] hover:border-[#2F78C4]/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] font-bold text-[#12262B] group-hover:text-[#0F6E73] transition-colors">
                    Acute Surgical Wing
                  </span>
                  <StatusChip tier="watch" />
                </div>
                <div className="flex items-center justify-between text-[12px] text-[#154C8A] font-medium mb-1.5">
                  <span>Stable · Inflow matching scheduled discharges</span>
                  <span className="font-bold">68%</span>
                </div>
                <div className="w-full bg-[#E6EDEE] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2F78C4] rounded-full" style={{ width: '68%' }} />
                </div>
              </div>

              {/* Unit 4: General Medical Ward */}
              <div 
                onClick={() => onNavigateToUnit('general')}
                className="p-3 rounded-xl bg-[#F8FAFA] border border-[#E6EDEE] hover:border-[#0F6E73]/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[14px] font-bold text-[#12262B] group-hover:text-[#0F6E73] transition-colors">
                    General Medical Ward
                  </span>
                  <StatusChip tier="ok" />
                </div>
                <div className="flex items-center justify-between text-[12px] text-[#0B5A56] font-medium mb-1.5">
                  <span>Optimal buffer · 22 available beds</span>
                  <span className="font-bold">52%</span>
                </div>
                <div className="w-full bg-[#E6EDEE] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F6E73] rounded-full" style={{ width: '52%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-4 pt-3 border-t border-[#E6EDEE]">
            <button
              onClick={onOpenAllUnits}
              className="text-[13px] font-semibold text-[#0F6E73] hover:text-[#0A4F53] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View all 12 operational units</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
