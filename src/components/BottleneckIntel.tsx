import React, { useState } from 'react';
import { StatusChip } from './StatusChip';
import { DEPARTMENT_BOTTLENECKS } from '../data/mockData';

interface BottleneckIntelProps {
  onSimulateInLab: () => void;
  initialDepartmentId?: string;
}

export const BottleneckIntel: React.FC<BottleneckIntelProps> = ({
  onSimulateInLab,
  initialDepartmentId = 'icu'
}) => {
  const [selectedDeptId, setSelectedDeptId] = useState<string>(initialDepartmentId);

  const selectedDept = DEPARTMENT_BOTTLENECKS.find(d => d.id === selectedDeptId) || DEPARTMENT_BOTTLENECKS[0];

  return (
    <div className="flex flex-col gap-5 max-w-[1440px] mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#12262B]">
            Bottleneck Intelligence
          </h1>
          <p className="text-[14px] text-[#4A6469] mt-0.5">
            Machine learning feature attribution and risk decomposition by hospital operational unit
          </p>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[#DCEAF8] text-[#154C8A] border border-[#2F78C4]/30">
            <span className="material-symbols-outlined text-[15px]">analytics</span>
            Simulated hospital data
          </span>
        </div>
      </div>

      {/* 2. Department Selector Tabs */}
      <div className="bg-white rounded-xl p-1.5 flex flex-wrap items-center gap-2 border border-[#DCE5E7] shadow-2xs overflow-x-auto">
        {DEPARTMENT_BOTTLENECKS.map((dept) => {
          const isActive = dept.id === selectedDept.id;
          return (
            <button
              key={dept.id}
              onClick={() => setSelectedDeptId(dept.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#F0F8F8] border-2 border-[#0F6E73] text-[#0E3B40] font-semibold shadow-xs'
                  : 'text-[#4A6469] hover:bg-[#F3F6F7]'
              }`}
            >
              <span>{dept.name}</span>
              <StatusChip tier={dept.tier} />
            </button>
          );
        })}
      </div>

      {/* 3. Main Analytical Card */}
      <div className="bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 35% width (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col border-b lg:border-b-0 lg:border-r border-[#DCE5E7] pb-6 lg:pb-0 lg:pr-6 justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold text-[#4A6469]">
                  Predicted Breach Risk Probability
                </span>
                <span 
                  className="material-symbols-outlined text-[#8EA5AA] text-[18px] cursor-help" 
                  title="Calculated from real-time dynamic census telemetry"
                >
                  info
                </span>
              </div>

              {/* Score display */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className={`text-[54px] leading-none font-bold tracking-tight ${
                  selectedDept.tier === 'critical' ? 'text-[#8F2D07]' :
                  selectedDept.tier === 'warning' ? 'text-[#6B4600]' :
                  selectedDept.tier === 'watch' ? 'text-[#154C8A]' : 'text-[#0B5A56]'
                }`}>
                  {selectedDept.riskProbability}%
                </span>
                <StatusChip tier={selectedDept.tier} pulsing={selectedDept.tier === 'critical'} />
              </div>

              <div className="mt-3">
                <div className={`text-[14px] font-bold flex items-center gap-1.5 ${
                  selectedDept.tier === 'critical' ? 'text-[#8F2D07]' :
                  selectedDept.tier === 'warning' ? 'text-[#6B4600]' :
                  selectedDept.tier === 'watch' ? 'text-[#154C8A]' : 'text-[#0B5A56]'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  <span>{selectedDept.description}</span>
                </div>
                <div className="text-[12px] font-medium text-[#12262B] mt-1 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#4A6469]">alarm</span>
                  <span>Breach expected: {selectedDept.breachWindow}</span>
                </div>
              </div>

              {/* Dynamic Capacity Boundary gauge */}
              <div className="mt-4 bg-[#F3F6F7] rounded-lg p-3">
                <div className="flex justify-between items-center text-[11px] font-semibold text-[#4A6469] mb-1.5">
                  <span>Dynamic Capacity Boundary</span>
                  <span className="font-bold text-[#8F2D07]">
                    {selectedDept.occupied} / {selectedDept.capacity} Occupied
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#E6EDEE] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#0F6E73]" style={{ width: '70%' }} />
                  <div className="h-full bg-[#B07A00]" style={{ width: '15%' }} />
                  <div className="h-full bg-[#B3441A]" style={{ width: '15%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#4A6469] mt-1 font-mono">
                  <span>Nominal (0-75%)</span>
                  <span>Buffer (76-90%)</span>
                  <span className="text-[#8F2D07] font-semibold">Surge (&gt;90%)</span>
                </div>
              </div>

              <p className="text-[12px] text-[#4A6469] mt-3.5 leading-relaxed">
                {selectedDept.queueText}
              </p>
            </div>

            {/* Action link to Scenario Lab */}
            <div className="mt-6 pt-4 border-t border-[#E6EDEE]/70">
              <button
                onClick={onSimulateInLab}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0F6E73] hover:bg-[#0A4F53] text-white text-[13px] font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">science</span>
                <span>Simulate Interventions in Scenario Lab</span>
              </button>
            </div>
          </div>

          {/* Right Column: 65% width (lg:col-span-8) */}
          <div className="lg:col-span-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-[17px] font-bold text-[#12262B]">
                  Feature Contribution to Risk (SHAP Decomposition)
                </h2>
                <div className="flex items-center gap-4 text-[12px] font-medium text-[#4A6469]">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#0F6E73]" />
                    Risk Escalators
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-[#8EA5AA]" />
                    Absorptive Buffers
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-[#4A6469] mt-1 mb-4">
                Relative weight of factors pushing risk upward vs buffer mechanisms dampening risk.
              </p>

              {/* Horizontal Contribution Bars List */}
              <div className="flex flex-col gap-3">
                {selectedDept.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F8FAFA] p-3 rounded-lg border border-[#E6EDEE] hover:bg-[#F0F8F8] transition-colors"
                  >
                    <div className="flex items-center justify-between text-[13px] font-semibold text-[#12262B] mb-1.5">
                      <div className="flex items-center gap-2 truncate">
                        <span className={`material-symbols-outlined text-[16px] ${
                          factor.isBuffer ? 'text-[#4A6469]' : 'text-[#0F6E73]'
                        }`}>
                          {factor.icon}
                        </span>
                        <span className="truncate">{factor.label}</span>
                      </div>
                      <span className={`font-bold shrink-0 ml-2 ${
                        factor.isBuffer ? 'text-[#4A6469]' : 'text-[#0F6E73]'
                      }`}>
                        {factor.isBuffer ? `-${factor.weight}% risk dampening` : `+${factor.weight}% risk weight`}
                      </span>
                    </div>

                    <div className="w-full bg-[#E6EDEE] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          factor.isBuffer ? 'bg-[#8EA5AA]' : 'bg-[#0F6E73]'
                        }`}
                        style={{ width: `${Math.min(100, factor.weight * 2.2)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Muted Attribution Note */}
            <div className="mt-5 pt-3 border-t border-[#E6EDEE] flex items-center justify-between">
              <span className="text-[12px] text-[#4A6469] italic">
                Shows what the model weighs, not proof of cause.
              </span>
              <span className="text-[11px] font-mono text-[#8EA5AA]">
                Kernel: SHAP TreeExplainer v4.1
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Card: Hospital-Wide Bottleneck Ranking */}
      <div className="bg-white rounded-[14px] border border-[#DCE5E7] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0F6E73] text-[20px]">sort</span>
            <h2 className="text-[17px] font-bold text-[#12262B]">
              Hospital-Wide Bottleneck Ranking
            </h2>
          </div>
          <span className="text-[12px] text-[#4A6469]">
            Updated 2 mins ago · Rolling 12-Hour Forecast
          </span>
        </div>

        {/* 4 summary metrics in a clean grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Unit 1: ICU */}
          <div 
            onClick={() => setSelectedDeptId('icu')}
            className="bg-[#F8FAFA] rounded-xl p-4 border border-[#DCE5E7] border-l-4 border-l-[#B3441A] flex flex-col justify-between cursor-pointer hover:bg-[#F0F8F8] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold text-[#12262B]">Intensive Care</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FBDDD0] text-[#8F2D07]">
                  #1 Critical
                </span>
              </div>
              <div className="flex flex-col gap-1 my-2">
                <span className="text-[11px] text-[#4A6469] uppercase tracking-wide font-semibold">
                  Constraining Resource
                </span>
                <span className="text-[13px] font-semibold text-[#12262B] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#0F6E73]">single_bed</span>
                  Level 3 Critical Care Beds
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E6EDEE] flex items-center justify-between text-[12px]">
              <span className="text-[#4A6469]">Model Confidence</span>
              <span className="font-bold text-[#0E3B40]">94.2%</span>
            </div>
          </div>

          {/* Unit 2: ED */}
          <div 
            onClick={() => setSelectedDeptId('ed')}
            className="bg-[#F8FAFA] rounded-xl p-4 border border-[#DCE5E7] border-l-4 border-l-[#B07A00] flex flex-col justify-between cursor-pointer hover:bg-[#F0F8F8] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold text-[#12262B]">Emergency Dept</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFEFC2] text-[#6B4600]">
                  #2 Warning
                </span>
              </div>
              <div className="flex flex-col gap-1 my-2">
                <span className="text-[11px] text-[#4A6469] uppercase tracking-wide font-semibold">
                  Constraining Resource
                </span>
                <span className="text-[13px] font-semibold text-[#12262B] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#0F6E73]">badge</span>
                  Specialized Triage Nursing
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E6EDEE] flex items-center justify-between text-[12px]">
              <span className="text-[#4A6469]">Model Confidence</span>
              <span className="font-bold text-[#0E3B40]">91.8%</span>
            </div>
          </div>

          {/* Unit 3: Radiology */}
          <div 
            onClick={() => setSelectedDeptId('radiology')}
            className="bg-[#F8FAFA] rounded-xl p-4 border border-[#DCE5E7] border-l-4 border-l-[#B07A00] flex flex-col justify-between cursor-pointer hover:bg-[#F0F8F8] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold text-[#12262B]">Radiology / Imaging</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FFEFC2] text-[#6B4600]">
                  #3 Warning
                </span>
              </div>
              <div className="flex flex-col gap-1 my-2">
                <span className="text-[11px] text-[#4A6469] uppercase tracking-wide font-semibold">
                  Constraining Resource
                </span>
                <span className="text-[13px] font-semibold text-[#12262B] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#0F6E73]">radiology</span>
                  CT Diagnostic Turnaround
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E6EDEE] flex items-center justify-between text-[12px]">
              <span className="text-[#4A6469]">Model Confidence</span>
              <span className="font-bold text-[#0E3B40]">88.5%</span>
            </div>
          </div>

          {/* Unit 4: Surgical Wing */}
          <div 
            onClick={() => setSelectedDeptId('surgical')}
            className="bg-[#F8FAFA] rounded-xl p-4 border border-[#DCE5E7] border-l-4 border-l-[#2F78C4] flex flex-col justify-between cursor-pointer hover:bg-[#F0F8F8] transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[14px] font-bold text-[#12262B]">Acute Surgical Wing</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCEAF8] text-[#154C8A]">
                  #4 Watch
                </span>
              </div>
              <div className="flex flex-col gap-1 my-2">
                <span className="text-[11px] text-[#4A6469] uppercase tracking-wide font-semibold">
                  Constraining Resource
                </span>
                <span className="text-[13px] font-semibold text-[#12262B] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#0F6E73]">healing</span>
                  PACU Phase 1 Recovery Bays
                </span>
              </div>
            </div>
            <div className="pt-3 border-t border-[#E6EDEE] flex items-center justify-between text-[12px]">
              <span className="text-[#4A6469]">Model Confidence</span>
              <span className="font-bold text-[#0E3B40]">86.0%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
