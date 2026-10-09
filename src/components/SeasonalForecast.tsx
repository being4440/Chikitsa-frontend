import React, { useState } from 'react';
import { StatusChip } from './StatusChip';
import { SEASONAL_WEEKS_DATA } from '../data/mockData';

interface SeasonalForecastProps {
  onExecuteChecklist: () => void;
}

export const SeasonalForecast: React.FC<SeasonalForecastProps> = ({ onExecuteChecklist }) => {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  // SVG Chart Dimensions
  const width = 860;
  const height = 280;
  const padding = { top: 40, right: 35, bottom: 45, left: 55 };

  // Y-axis range: 180 to 540
  const minY = 180;
  const maxY = 540;
  const getY = (val: number) => {
    return height - padding.bottom - ((val - minY) / (maxY - minY)) * (height - padding.top - padding.bottom);
  };
  const getX = (index: number) => {
    const step = (width - padding.left - padding.right) / (SEASONAL_WEEKS_DATA.length - 1);
    return padding.left + index * step;
  };

  // Capacity threshold = 480
  const capY = getY(480);

  // Monsoon season window: Week 7 (index 6) to Week 10 (index 9)
  const monsoonXStart = getX(6) - 25;
  const monsoonXEnd = getX(9) + 25;

  // Historical demand line (index 0 to 5)
  const historicalPath = SEASONAL_WEEKS_DATA.slice(0, 6).reduce((acc, pt, i) => {
    const x = getX(i);
    const y = getY(pt.demand!);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Model forecast line (index 5 to 11)
  const forecastPath = SEASONAL_WEEKS_DATA.slice(5).reduce((acc, pt, i) => {
    const x = getX(i + 5);
    const y = getY(pt.forecast!);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Confidence Interval polygon area (index 5 to 11)
  const ciUpper = SEASONAL_WEEKS_DATA.slice(5).map((pt, i) => `${getX(i + 5)},${getY(pt.upper!)}`);
  const ciLower = SEASONAL_WEEKS_DATA.slice(5).map((pt, i) => `${getX(i + 5)},${getY(pt.lower!)}`).reverse();
  const ciPolygon = `${ciUpper.join(' ')} ${ciLower.join(' ')}`;

  return (
    <div className="flex flex-col gap-5 max-w-[1440px] mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#12262B]">
            Seasonal Forecast &amp; Climate Intelligence
          </h1>
          <p className="text-[14px] text-[#4A6469] mt-0.5">
            Multi-week cyclical demand patterns, epidemiological curves, and weather event correlation
          </p>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[#DCEAF8] text-[#154C8A] border border-[#2F78C4]/30">
            <span className="material-symbols-outlined text-[15px]">analytics</span>
            Simulated hospital data
          </span>
        </div>
      </div>

      {/* 2. Top Card: 12-Week Rolling Demand & Seasonal Surge Projection */}
      <div className="bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-2">
            <div>
              <h2 className="text-[17px] font-bold text-[#12262B]">
                12-Week Rolling Demand &amp; Seasonal Surge Projection
              </h2>
              <p className="text-[13px] text-[#4A6469]">
                Historical intake correlation against monsoon precipitation patterns and respiratory infection peaks.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[#F3F6F7] border border-[#DCE5E7] text-[#4A6469]">
                Horizon: 12 Wks (W1 – W12)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-[#D9F0EE] text-[#0B5A56] border border-[#0F6E73]/30">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                Bi-weekly Refreshed
              </span>
            </div>
          </div>

          {/* SVG Visual Chart */}
          <div className="relative mt-4 w-full overflow-hidden bg-[#F8FAFA] rounded-xl border border-[#E6EDEE] p-3">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="seasonalCiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F6E73" stopOpacity="0.20" />
                  <stop offset="100%" stopColor="#0F6E73" stopOpacity="0.04" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[200, 300, 400, 500].map((val) => {
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

              {/* Monsoon Season Surge Window shaded box */}
              <rect
                x={monsoonXStart}
                y={padding.top}
                width={monsoonXEnd - monsoonXStart}
                height={height - padding.top - padding.bottom}
                fill="#DCEAF8"
                fillOpacity="0.38"
                stroke="#2F78C4"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                rx="6"
              />
              {/* Monsoon label header */}
              <rect 
                x={monsoonXStart + 10} 
                y={padding.top + 8} 
                width="168" 
                height="20" 
                rx="4" 
                fill="#FFFFFF" 
                stroke="#2F78C4" 
                strokeWidth="0.8" 
              />
              <text 
                x={monsoonXStart + 18} 
                y={padding.top + 22} 
                fill="#154C8A" 
                fontSize="9.5" 
                fontWeight="bold"
              >
                ☔ Monsoon Season Surge Window
              </text>

              {/* Capacity Threshold 480 Line */}
              <line 
                x1={padding.left} 
                y1={capY} 
                x2={width - padding.right} 
                y2={capY} 
                stroke="#B3441A" 
                strokeWidth="1.6" 
                strokeDasharray="4 4" 
              />
              <text 
                x={padding.left - 8} 
                y={capY + 3} 
                fill="#B3441A" 
                fontSize="10" 
                fontWeight="bold" 
                textAnchor="end"
                className="font-mono"
              >
                480 Cap
              </text>

              {/* 80% CI Polygon */}
              <polygon points={ciPolygon} fill="url(#seasonalCiGrad)" />

              {/* Today (WK 6) Vertical line */}
              <line 
                x1={getX(5)} 
                y1={padding.top} 
                x2={getX(5)} 
                y2={height - padding.bottom} 
                stroke="#4A6469" 
                strokeWidth="1.2" 
                strokeDasharray="2 3" 
              />
              <text 
                x={getX(5)} 
                y={padding.top - 8} 
                fill="#12262B" 
                fontSize="9" 
                fontWeight="bold" 
                textAnchor="middle"
              >
                TODAY (WK 6)
              </text>

              {/* Historical demand curve */}
              <path 
                d={historicalPath} 
                fill="none" 
                stroke="#0E3B40" 
                strokeWidth="2.8" 
                strokeLinecap="round" 
              />

              {/* Model Forecast curve (dashed) */}
              <path 
                d={forecastPath} 
                fill="none" 
                stroke="#0F6E73" 
                strokeWidth="2.5" 
                strokeDasharray="5 4" 
                strokeLinecap="round" 
              />

              {/* Historical Points */}
              {SEASONAL_WEEKS_DATA.slice(0, 6).map((pt, i) => {
                const x = getX(i);
                const y = getY(pt.demand!);
                return (
                  <circle 
                    key={pt.week} 
                    cx={x} 
                    cy={y} 
                    r="4" 
                    fill="#0E3B40" 
                    stroke="#FFFFFF" 
                    strokeWidth="2" 
                  />
                );
              })}

              {/* Forecast Points */}
              {SEASONAL_WEEKS_DATA.slice(6).map((pt, i) => {
                const x = getX(i + 6);
                const y = getY(pt.forecast!);
                const isPeak = pt.isPeak;
                return (
                  <circle 
                    key={pt.week} 
                    cx={x} 
                    cy={y} 
                    r={isPeak ? 5.5 : 4} 
                    fill={isPeak ? '#B3441A' : '#0F6E73'} 
                    stroke="#FFFFFF" 
                    strokeWidth="2" 
                  />
                );
              })}

              {/* X-axis labels */}
              {SEASONAL_WEEKS_DATA.map((pt, i) => {
                const x = getX(i);
                const isToday = pt.isToday;
                const isPeak = pt.isPeak;
                return (
                  <g 
                    key={pt.week}
                    onMouseEnter={() => setHoveredWeek(i)}
                    onMouseLeave={() => setHoveredWeek(null)}
                    className="cursor-pointer"
                  >
                    <text 
                      x={x} 
                      y={height - padding.bottom + 18} 
                      fill={isPeak ? '#B3441A' : isToday ? '#12262B' : '#6F797A'} 
                      fontSize="10" 
                      fontWeight={isPeak || isToday ? 'bold' : 'normal'}
                      textAnchor="middle"
                    >
                      {pt.week}
                    </text>
                    {/* Transparent hit area */}
                    <rect 
                      x={x - 25} 
                      y={padding.top} 
                      width="50" 
                      height={height - padding.top - padding.bottom} 
                      fill="transparent" 
                    />
                  </g>
                );
              })}

              {/* Active Hover Tooltip */}
              {hoveredWeek !== null && (
                <g transform={`translate(${getX(hoveredWeek)}, ${getY(SEASONAL_WEEKS_DATA[hoveredWeek].demand || SEASONAL_WEEKS_DATA[hoveredWeek].forecast!) - 42})`}>
                  <rect 
                    x="-60" 
                    y="-12" 
                    width="120" 
                    height="38" 
                    rx="6" 
                    fill="#0E3B40" 
                    opacity="0.95" 
                  />
                  <text x="0" y="2" fill="#A1F0F5" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                    {SEASONAL_WEEKS_DATA[hoveredWeek].week}: {SEASONAL_WEEKS_DATA[hoveredWeek].demand || SEASONAL_WEEKS_DATA[hoveredWeek].forecast} adm/wk
                  </text>
                  <text x="0" y="16" fill="#CFE3E4" fontSize="8.5" textAnchor="middle">
                    {SEASONAL_WEEKS_DATA[hoveredWeek].inMonsoon ? 'Monsoon Wave +42% Inflow' : 'Baseline Climate Model'}
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Legend and model info */}
          <div className="flex flex-wrap items-center justify-between gap-y-3 mt-4 pt-3 border-t border-[#E6EDEE] text-[12px] text-[#4A6469]">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#0E3B40]" />
                <span>Historical demand</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-[#0F6E73]" />
                <span>Model seasonal forecast</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#0F6E73]/20 border border-[#0F6E73]/40" />
                <span>80% Confidence interval</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#DCEAF8] border border-[#2F78C4]" />
                <span>Monsoon season period</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-[#B3441A]" />
                <span>Capacity threshold (480 adm/wk)</span>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F0F8F8] text-[#0F6E73] font-mono text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">model_training</span>
              ARIMA + Climatic GNN Ensemble Model (v4.2.1)
            </span>
          </div>
        </div>
      </div>

      {/* 3. Bottom 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Forecast Quality */}
        <div className="lg:col-span-5 bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F6E73] text-[20px]">
                  insights
                </span>
                <h2 className="text-[17px] font-bold text-[#12262B]">
                  Forecast Quality
                </h2>
              </div>
              <span className="text-[12px] text-[#4A6469]">
                Validation Window: 52 Wks
              </span>
            </div>

            {/* Metric Box */}
            <div className="bg-[#F8FAFA] rounded-xl p-4 border border-[#E6EDEE] mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[12px] text-[#4A6469] font-medium">
                  Mean Absolute Percentage Error (MAPE)
                </span>
                <StatusChip tier="ok" />
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-[34px] font-bold text-[#12262B] tabular-nums tracking-tight">
                  4.1%
                </span>
                <span className="text-[13px] font-semibold text-[#0B5A56]">
                  Reliability Tier 1
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-[12px] font-semibold text-[#0B5A56]">
                <span className="material-symbols-outlined text-[16px]">trending_down</span>
                <span>-62% error reduction compared to traditional 3-year rolling average</span>
              </div>
            </div>
          </div>

          {/* Model Accuracy Info Callout */}
          <div className="mt-4 p-3.5 rounded-xl bg-[#F0F8F8] border border-[#0F6E73]/30 flex items-start gap-2.5 text-[12px] text-[#12262B]">
            <span className="material-symbols-outlined text-[#0F6E73] text-[18px] shrink-0 mt-0.5">
              info
            </span>
            <span className="leading-relaxed">
              The seasonal model achieves <strong>95.9% prediction accuracy</strong> by adjusting for regional rainfall forecasts, school calendar shifts, and local epidemiological surveillance data.
            </span>
          </div>
        </div>

        {/* Right Column: Pre-Surge Operational Recommendations */}
        <div className="lg:col-span-7 bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F6E73] text-[20px]">
                  checklist
                </span>
                <h2 className="text-[17px] font-bold text-[#12262B]">
                  Pre-Surge Operational Recommendations
                </h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FBDDD0] text-[#8F2D07] border border-[#B3441A]">
                SURGE PREP
              </span>
            </div>

            {/* Recommendations List */}
            <div className="flex flex-col gap-3">
              {/* Recommendation 1 */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E6EDEE] flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D9F0EE] text-[#0B5A56] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#12262B]">
                    Schedule elective surgical maintenance 2 weeks prior to Week 7 onset to maximize surgical bed availability.
                  </span>
                  <span className="text-[11px] text-[#4A6469] mt-0.5">
                    Target: Surgical Suite A &amp; Stepdown Ward
                  </span>
                </div>
              </div>

              {/* Recommendation 2 */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E6EDEE] flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D9F0EE] text-[#0B5A56] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#12262B]">
                    Increase respiratory isolation consumables stockpile by 25% ahead of Monsoon peak.
                  </span>
                  <span className="text-[11px] text-[#4A6469] mt-0.5">
                    Target: Central Medical Supply Depot
                  </span>
                </div>
              </div>

              {/* Recommendation 3 */}
              <div className="p-3.5 rounded-xl bg-[#F8FAFA] border border-[#E6EDEE] flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#D9F0EE] text-[#0B5A56] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold text-[#12262B]">
                    Authorize pre-arranged float pool nurse contracts starting Week 6.
                  </span>
                  <span className="text-[11px] text-[#4A6469] mt-0.5">
                    Target: ER &amp; Acute Pulmonary Staffing
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-5 pt-4 border-t border-[#E6EDEE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[12px] text-[#4A6469]">
              Action readiness review pending approval
            </span>
            <button
              onClick={onExecuteChecklist}
              className="inline-flex items-center justify-center gap-2 bg-[#0F6E73] hover:bg-[#0A4F53] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Execute Pre-Surge Checklist</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
