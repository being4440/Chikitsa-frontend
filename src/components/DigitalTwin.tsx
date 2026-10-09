import React, { useState } from 'react';
import { StatusChip } from './StatusChip';
import { FACILITY_NODES } from '../data/mockData';
import { FacilityNode } from '../types';

interface DigitalTwinProps {
  onOpenInScenarioLab: (node: FacilityNode) => void;
  initialNodeId?: string;
}

export const DigitalTwin: React.FC<DigitalTwinProps> = ({
  onOpenInScenarioLab,
  initialNodeId = 'icu'
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(initialNodeId);

  const selectedNode = FACILITY_NODES.find(n => n.id === selectedNodeId) || FACILITY_NODES[0];

  return (
    <div className="flex flex-col gap-5 max-w-[1440px] mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#12262B]">
            Digital Twin
          </h1>
          <p className="text-[14px] text-[#4A6469] mt-0.5">
            Real-time topological hospital facility map with department utilization and queue tracking
          </p>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold bg-[#DCEAF8] text-[#154C8A] border border-[#2F78C4]/30">
            <span className="material-symbols-outlined text-[15px]">analytics</span>
            Simulated hospital data
          </span>
        </div>
      </div>

      {/* 2. Main Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Level 1 & Level 2 Care Flow Topology (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0F6E73] text-[20px]">hub</span>
                <h2 className="text-[17px] font-bold text-[#12262B]">
                  Level 1 &amp; Level 2 Care Flow Topology
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#4A6469]">
                <span className="w-2 h-2 rounded-full bg-[#0F6E73] animate-pulse" />
                <span>Live Census Flow</span>
              </div>
            </div>

            {/* Topology Map Canvas */}
            <div className="relative bg-[#F8FAFA] rounded-2xl border border-[#E6EDEE] p-5">
              {/* Subtle background connecting lines between pods */}
              <div className="absolute inset-0 pointer-events-none opacity-40">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <line x1="25%" y1="20%" x2="75%" y2="20%" stroke="#8EA5AA" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="25%" y1="20%" x2="25%" y2="50%" stroke="#8EA5AA" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="75%" y1="20%" x2="75%" y2="50%" stroke="#8EA5AA" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="25%" y1="50%" x2="75%" y2="50%" stroke="#8EA5AA" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="75%" y1="50%" x2="25%" y2="80%" stroke="#8EA5AA" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="25%" y1="80%" x2="75%" y2="80%" stroke="#8EA5AA" strokeWidth="2" strokeDasharray="4 4" />
                </svg>
              </div>

              {/* 2x3 Grid of Functional Ward Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                {FACILITY_NODES.map((node) => {
                  const isSelected = node.id === selectedNode.id;
                  
                  // Card color coding based on tier
                  let borderClass = 'border-[#E6EDEE]';
                  let bgClass = 'bg-white';
                  let headerClass = 'text-[#4A6469]';

                  if (node.tier === 'critical') {
                    borderClass = isSelected ? 'border-2 border-[#B3441A] shadow-md ring-2 ring-[#B3441A]/20' : 'border-[#F2B79A]';
                    bgClass = isSelected ? 'bg-[#FFF9F6]' : 'bg-[#FFF9F6]/80';
                    headerClass = 'text-[#8F2D07]';
                  } else if (node.tier === 'warning') {
                    borderClass = isSelected ? 'border-2 border-[#B07A00] shadow-md ring-2 ring-[#B07A00]/20' : 'border-[#FFEFC2]';
                    bgClass = isSelected ? 'bg-[#FFFAF0]' : 'bg-[#FFFAF0]/80';
                    headerClass = 'text-[#6B4600]';
                  } else if (node.tier === 'watch') {
                    borderClass = isSelected ? 'border-2 border-[#2F78C4] shadow-md ring-2 ring-[#2F78C4]/20' : 'border-[#DCEAF8]';
                    bgClass = isSelected ? 'bg-[#F4F9FD]' : 'bg-[#F4F9FD]/80';
                    headerClass = 'text-[#154C8A]';
                  } else {
                    borderClass = isSelected ? 'border-2 border-[#0F6E73] shadow-md ring-2 ring-[#0F6E73]/20' : 'border-[#D9F0EE]';
                    bgClass = isSelected ? 'bg-[#F0F8F8]' : 'bg-[#F0F8F8]/80';
                    headerClass = 'text-[#0B5A56]';
                  }

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${bgClass} ${borderClass}`}
                    >
                      <div>
                        {/* Floor tag + Status chip */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[10px] font-bold tracking-wider uppercase ${headerClass}`}>
                            {node.floor}
                          </span>
                          <div className="flex items-center gap-1.5">
                            {isSelected && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md text-[10px] font-bold bg-[#8F2D07] text-white">
                                <span className="material-symbols-outlined text-[12px]">check</span>
                                ACTIVE SELECTION
                              </span>
                            )}
                            <StatusChip tier={node.tier} />
                          </div>
                        </div>

                        {/* Node Name */}
                        <h3 className="text-[15px] font-bold text-[#12262B] mb-2">
                          {node.name}
                        </h3>

                        {/* Utilization Metric */}
                        <div className="flex items-center justify-between text-[13px] font-semibold text-[#12262B] mb-1">
                          <span>{node.capacityText}</span>
                          <span className="material-symbols-outlined text-[#0F6E73] text-[18px]">
                            {node.icon}
                          </span>
                        </div>
                      </div>

                      {/* Queue subtext */}
                      <div className="text-[12px] text-[#4A6469] mt-2 pt-2 border-t border-[#E6EDEE]/60">
                        {node.queueText}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Topology Footer Key */}
          <div className="flex flex-wrap items-center justify-between gap-y-2 mt-4 pt-3 border-t border-[#E6EDEE] text-[12px] text-[#4A6469]">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-semibold text-[#12262B]">Topology Key:</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B3441A]" />
                <span>Critical (&gt;90%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B07A00]" />
                <span>Warning (75-90%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2F78C4]" />
                <span>Watch (60-75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0F6E73]" />
                <span>OK (&lt;60%)</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#4A6469]">
              <span className="material-symbols-outlined text-[15px]">sync</span>
              <span>Refresh rate: 10s synced</span>
            </div>
          </div>
        </div>

        {/* Right Column: TELEMETRY INSPECTOR (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            {/* Inspector Header */}
            <div>
              <span className="text-[11px] font-bold text-[#4A6469] tracking-wider uppercase">
                TELEMETRY INSPECTOR
              </span>
              <div className="flex items-center justify-between mt-1">
                <h2 className="text-[18px] font-bold text-[#12262B]">
                  {selectedNode.name}
                </h2>
                <StatusChip tier={selectedNode.tier} />
              </div>
            </div>

            {/* Beds Capacity Section */}
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-[13px] font-semibold text-[#12262B]">Beds Capacity</span>
                <span className={`text-[14px] font-bold ${
                  selectedNode.tier === 'critical' ? 'text-[#8F2D07]' :
                  selectedNode.tier === 'warning' ? 'text-[#6B4600]' :
                  selectedNode.tier === 'watch' ? 'text-[#154C8A]' : 'text-[#0B5A56]'
                }`}>
                  {selectedNode.utilizationPct}%
                </span>
              </div>
              <div className="w-full bg-[#E6EDEE] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    selectedNode.tier === 'critical' ? 'bg-[#B3441A]' :
                    selectedNode.tier === 'warning' ? 'bg-[#B07A00]' :
                    selectedNode.tier === 'watch' ? 'bg-[#2F78C4]' : 'bg-[#0F6E73]'
                  }`}
                  style={{ width: `${selectedNode.utilizationPct}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[12px] mt-1.5">
                <span className="text-[#4A6469]">
                  {selectedNode.bedsOccupied} of {selectedNode.bedsTotal} beds occupied
                </span>
                <span className="font-semibold text-[#8F2D07]">
                  {selectedNode.bedsFree} bed free
                </span>
              </div>

              {/* Sub-breakdown box */}
              <div className="mt-2.5 p-3 rounded-lg bg-[#F8FAFA] border border-[#E6EDEE] flex flex-col gap-1.5 text-[12px]">
                {selectedNode.bedBreakdown.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-[#4A6469]">{item.label}:</span>
                    <span className={`font-semibold ${item.highlight ? 'text-[#8F2D07]' : 'text-[#12262B]'}`}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Staff on Duty Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[13px] font-semibold text-[#12262B]">Staff on Duty</span>
                <span className="text-[11px] font-semibold bg-[#E6EDEE] text-[#4A6469] px-2 py-0.5 rounded">
                  {selectedNode.staff.shift}
                </span>
              </div>

              {/* 3 Metric counters */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-[#E2F7FE] border border-[#BFEAF0]">
                  <div className="text-[20px] font-bold text-[#12262B] tabular-nums">
                    {selectedNode.staff.rns}
                  </div>
                  <div className="text-[11px] text-[#4A6469] font-medium mt-0.5">
                    {selectedNode.id === 'icu' ? 'ICU RNs' : 'Staff RNs'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#E2F7FE] border border-[#BFEAF0]">
                  <div className="text-[20px] font-bold text-[#12262B] tabular-nums">
                    {selectedNode.staff.physicians}
                  </div>
                  <div className="text-[11px] text-[#4A6469] font-medium mt-0.5">
                    {selectedNode.id === 'icu' ? 'Intensivists' : 'Physicians'}
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#E2F7FE] border border-[#BFEAF0]">
                  <div className="text-[20px] font-bold text-[#12262B] tabular-nums">
                    {selectedNode.staff.techs}
                  </div>
                  <div className="text-[11px] text-[#4A6469] font-medium mt-0.5">
                    Resp. Techs
                  </div>
                </div>
              </div>

              {/* Patient to Nurse ratio badge */}
              <div className="mt-2.5 p-2 rounded-lg bg-[#F0F8F8] border border-[#0F6E73]/20 flex justify-between items-center text-[12px]">
                <span className="text-[#4A6469]">Patient-to-nurse ratio:</span>
                <span className="font-bold text-[#0B5A56]">
                  {selectedNode.staff.ratio} <span className="font-normal text-[#4A6469]">({selectedNode.staff.targetRatio})</span>
                </span>
              </div>
            </div>

            {/* Equipment Availability Section */}
            <div>
              <span className="text-[13px] font-semibold text-[#12262B] block mb-2">
                Equipment Availability
              </span>

              <div className="flex flex-col gap-2 text-[12px]">
                <div className="p-2.5 rounded-lg bg-[#F8FAFA] border border-[#E6EDEE] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#4A6469]">
                    <span className="material-symbols-outlined text-[17px] text-[#0F6E73]">air</span>
                    <span>Ventilators Online</span>
                  </div>
                  <span className="font-bold text-[#12262B]">
                    {selectedNode.equipment.ventilatorsOnline} / {selectedNode.equipment.ventilatorsTotal}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F8FAFA] border border-[#E6EDEE] flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#4A6469]">
                    <span className="material-symbols-outlined text-[17px] text-[#2F78C4]">devices</span>
                    <span>Ventilator Standby</span>
                  </div>
                  <span className="font-bold text-[#154C8A]">
                    {selectedNode.equipment.ventilatorsStandby} available
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#F0F8F8] border border-[#0F6E73]/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0B5A56]">
                    <span className="material-symbols-outlined text-[17px]">heart_check</span>
                    <span>ECMO Circuit</span>
                  </div>
                  <span className="font-semibold text-[#0B5A56] bg-[#D9F0EE] px-2 py-0.5 rounded text-[11px]">
                    {selectedNode.equipment.ecmoOnline} Operational
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-5 pt-4 border-t border-[#E6EDEE]">
            <button
              onClick={() => onOpenInScenarioLab(selectedNode)}
              className="w-full py-2.5 rounded-lg bg-[#0F6E73] hover:bg-[#0A4F53] text-white text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span>Open in Scenario Lab to test changes</span>
            </button>
            <p className="text-[11px] text-[#4A6469] text-center mt-1.5">
              Pre-populates {selectedNode.shortName} baseline variables into simulation model
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
