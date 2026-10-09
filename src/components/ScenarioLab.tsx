import React, { useState } from 'react';

interface ScenarioLabProps {
  onApplyIntervention?: () => void;
}

export const ScenarioLab: React.FC<ScenarioLabProps> = ({ onApplyIntervention }) => {
  // Interactive simulation parameters
  const [edInflow, setEdInflow] = useState<number>(19); // 14 to 28
  const [nurseStaffing, setNurseStaffing] = useState<number>(120); // 100 to 150
  const [dischargeRate, setDischargeRate] = useState<number>(4.2); // 2.0 to 6.5
  const [equipmentOffline, setEquipmentOffline] = useState<number>(2); // 0 to 5
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedProtocol, setSelectedProtocol] = useState<'Protocol B' | 'Protocol A' | 'Protocol C'>('Protocol B');

  // Dynamic calculations based on sliders
  const baselineInflow = 14;
  const inflowSurgePct = Math.round(((edInflow - baselineInflow) / baselineInflow) * 100);
  
  const baselineNurses = 142;
  const nurseDeficitPct = Math.round(((nurseStaffing - baselineNurses) / baselineNurses) * 100);

  // Computed impacts
  const deficitBeds = Math.max(0, Math.round((edInflow - 14) * 0.7 + (142 - nurseStaffing) * 0.05 + equipmentOffline * 0.4 - (dischargeRate - 4.2) * 1.2));
  const edBoardingHours = Number((2.0 + (edInflow - 14) * 0.35 + (142 - nurseStaffing) * 0.06 + equipmentOffline * 0.3 - (dischargeRate - 4.2) * 0.4).toFixed(1));
  const divertedAmbulances = Math.max(0, Math.round((edInflow - 14) * 0.8 + (142 - nurseStaffing) * 0.08 + equipmentOffline * 0.5 - (dischargeRate - 4.2) * 0.8));
  const propagationRate = (1.0 + (inflowSurgePct > 0 ? inflowSurgePct * 0.02 : 0) + (nurseDeficitPct < 0 ? Math.abs(nurseDeficitPct) * 0.015 : 0)).toFixed(1);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="flex flex-col gap-5 max-w-[1440px] mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#12262B]">
            Scenario Lab
          </h1>
          <p className="text-[14px] text-[#4A6469] mt-0.5">
            Simulate flow adjustments, evaluate downstream cascade delay, and compare operational interventions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg text-[12px] font-medium bg-[#E6EDEE] text-[#4A6469]">
            Baseline State: Live Census (14:32)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-[#DCEAF8] text-[#154C8A] border border-[#2F78C4]/30">
            Active Simulation Sandbox
          </span>
        </div>
      </div>

      {/* 2. Main Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: 1. Change the situation */}
        <div className="lg:col-span-6 bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[17px] font-bold text-[#12262B]">
                1. Change the situation
              </h2>
              <span className="material-symbols-outlined text-[#4A6469] text-[20px]">
                tune
              </span>
            </div>
            <p className="text-[13px] text-[#4A6469] mb-5">
              Adjust variables to simulate admission surges or staffing gaps.
            </p>

            {/* Variable Sliders List */}
            <div className="flex flex-col gap-5">
              {/* Variable 1: Hourly Arrivals */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#12262B]">
                    Hourly Arrivals (ED Admissions)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FBDDD0] text-[#8F2D07] border border-[#B3441A]/50">
                    {inflowSurgePct >= 0 ? `+${inflowSurgePct}% surge` : `${inflowSurgePct}% below`}
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="26"
                  step="1"
                  value={edInflow}
                  onChange={(e) => setEdInflow(Number(e.target.value))}
                  className="w-full accent-[#0F6E73] h-2 bg-[#E6EDEE] rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#4A6469]">
                    Current: 14/hr &rarr; <strong className="text-[#12262B]">Simulated: {edInflow}/hr</strong>
                  </span>
                  <span className="font-semibold text-[#8F2D07]">
                    {edInflow > 16 ? 'Surge Risk' : 'Manageable'}
                  </span>
                </div>
              </div>

              {/* Variable 2: Nurse Staffing Level */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#12262B]">
                    Nurse Staffing Level
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    nurseDeficitPct < 0 
                      ? 'bg-[#FBDDD0] text-[#8F2D07] border border-[#B3441A]/50'
                      : 'bg-[#D9F0EE] text-[#0B5A56] border border-[#0F6E73]/50'
                  }`}>
                    {nurseDeficitPct >= 0 ? `+${nurseDeficitPct}% surplus` : `${nurseDeficitPct}% shortage`}
                  </span>
                </div>
                <input
                  type="range"
                  min="105"
                  max="155"
                  step="1"
                  value={nurseStaffing}
                  onChange={(e) => setNurseStaffing(Number(e.target.value))}
                  className="w-full accent-[#0F6E73] h-2 bg-[#E6EDEE] rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#4A6469]">
                    Current: 142 nurses &rarr; <strong className="text-[#12262B]">Simulated: {nurseStaffing} nurses</strong>
                  </span>
                  <span className={`font-semibold ${nurseStaffing < 130 ? 'text-[#8F2D07]' : 'text-[#0B5A56]'}`}>
                    {nurseStaffing < 130 ? 'Triage Deficit' : 'Standard Ratio'}
                  </span>
                </div>
              </div>

              {/* Variable 3: Available Discharge Rate */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#12262B]">
                    Available Discharge Rate
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#D9F0EE] text-[#0B5A56] border border-[#0F6E73]/50">
                    Baseline ({dischargeRate >= 4.2 ? `+${Math.round(((dischargeRate - 4.2)/4.2)*100)}%` : `${Math.round(((dischargeRate - 4.2)/4.2)*100)}%`})
                  </span>
                </div>
                <input
                  type="range"
                  min="2.0"
                  max="6.5"
                  step="0.1"
                  value={dischargeRate}
                  onChange={(e) => setDischargeRate(Number(e.target.value))}
                  className="w-full accent-[#0F6E73] h-2 bg-[#E6EDEE] rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#4A6469]">
                    Standard 4.2 discharges/hr &rarr; <strong className="text-[#12262B]">{dischargeRate} discharges/hr</strong>
                  </span>
                  <span className="font-semibold text-[#0B5A56]">
                    {dischargeRate >= 4.2 ? 'Accelerated turnover' : 'Slowed release'}
                  </span>
                </div>
              </div>

              {/* Variable 4: Equipment Offline */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#12262B]">
                    Equipment Offline (CT/Ventilators)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCEAF8] text-[#154C8A] border border-[#2F78C4]/50">
                    {equipmentOffline} units offline
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={equipmentOffline}
                  onChange={(e) => setEquipmentOffline(Number(e.target.value))}
                  className="w-full accent-[#0F6E73] h-2 bg-[#E6EDEE] rounded-lg cursor-pointer"
                />
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-[#4A6469]">
                    Simulating scheduled CT Scanner maintenance
                  </span>
                  <span className="font-semibold text-[#12262B]">
                    Floor 2 North
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Run Simulation Button */}
          <div className="mt-6 pt-4 border-t border-[#E6EDEE]">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="w-full py-2.5 rounded-lg bg-[#0F6E73] hover:bg-[#0A4F53] text-white text-[14px] font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-75"
            >
              <span className={`material-symbols-outlined text-[18px] ${isSimulating ? 'animate-spin' : ''}`}>
                {isSimulating ? 'sync' : 'play_arrow'}
              </span>
              <span>{isSimulating ? 'Recalculating Cascade Matrix...' : 'Run simulation'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: 2. See how delays spread */}
        <div className="lg:col-span-6 bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-[17px] font-bold text-[#12262B]">
                2. See how delays spread
              </h2>
              <span className="flex items-center gap-1 text-[12px] text-[#4A6469] font-medium">
                <span className="material-symbols-outlined text-[16px]">account_tree</span>
                Cascade Pathway Mode
              </span>
            </div>
            <p className="text-[13px] text-[#4A6469] mb-5">
              Upstream bottlenecks ripple through acute care pathways.
            </p>

            {/* Visual Pathway Cascade Diagram */}
            <div className="bg-[#F8FAFA] rounded-xl border border-[#E6EDEE] p-4 flex flex-col gap-3">
              {/* Cascade Stage 1: ED Inflow */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFEFC2] border border-[#B07A00] flex items-center justify-center text-[#6B4600] shrink-0 font-bold text-[12px]">
                  1
                </div>
                <div className="flex-1 bg-white p-2.5 rounded-lg border border-[#DCE5E7] shadow-2xs">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-semibold text-[#12262B]">ED Inflow Acceleration</span>
                    <span className="text-[#8F2D07] font-bold">+{edInflow} pt/hr</span>
                  </div>
                  <div className="w-full bg-[#E6EDEE] h-1.5 rounded-full mt-1.5">
                    <div className="bg-[#B07A00] h-full rounded-full" style={{ width: `${Math.min(100, edInflow * 4.5)}%` }} />
                  </div>
                </div>
              </div>

              {/* Connector line with animated arrow */}
              <div className="pl-4 flex items-center text-[#8EA5AA]">
                <div className="w-0.5 h-3 bg-[#BAC6C8]" />
              </div>

              {/* Cascade Stage 2: Triage & Boarding */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FBDDD0] border border-[#B3441A] flex items-center justify-center text-[#8F2D07] shrink-0 font-bold text-[12px]">
                  2
                </div>
                <div className="flex-1 bg-white p-2.5 rounded-lg border border-[#DCE5E7] shadow-2xs">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-semibold text-[#12262B]">Triage & Boarding Congestion</span>
                    <span className="text-[#8F2D07] font-bold">+{edBoardingHours}h dwell</span>
                  </div>
                  <div className="w-full bg-[#E6EDEE] h-1.5 rounded-full mt-1.5">
                    <div className="bg-[#B3441A] h-full rounded-full" style={{ width: `${Math.min(100, edBoardingHours * 18)}%` }} />
                  </div>
                </div>
              </div>

              {/* Connector line */}
              <div className="pl-4 flex items-center text-[#8EA5AA]">
                <div className="w-0.5 h-3 bg-[#BAC6C8]" />
              </div>

              {/* Cascade Stage 3: Downstream ICU & Divert */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FBDDD0] border border-[#B3441A] flex items-center justify-center text-[#8F2D07] shrink-0 font-bold text-[12px]">
                  3
                </div>
                <div className="flex-1 bg-white p-2.5 rounded-lg border border-[#DCE5E7] shadow-2xs">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="font-semibold text-[#12262B]">ICU Saturation & EMS Diversion</span>
                    <span className="text-[#8F2D07] font-bold">-{deficitBeds} Beds</span>
                  </div>
                  <div className="w-full bg-[#E6EDEE] h-1.5 rounded-full mt-1.5">
                    <div className="bg-[#B3441A] h-full rounded-full" style={{ width: `${Math.min(100, 75 + deficitBeds * 8)}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Surge Propagation Metrics */}
          <div className="mt-4 pt-3 border-t border-[#E6EDEE] flex flex-wrap items-center justify-between text-[12px] gap-2">
            <div className="flex items-center gap-1.5 text-[#12262B] font-semibold">
              <span className="material-symbols-outlined text-[#0F6E73] text-[16px]">cyclone</span>
              <span>Surge Propagation Rate: <strong className="text-[#0F6E73]">{propagationRate}x Nominal</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#8F2D07] font-semibold">
              <span className="material-symbols-outlined text-[16px]">alarm</span>
              <span>Est. Cascade Crest: 19:45 Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Section: Compare outcomes */}
      <div className="bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-[17px] font-bold text-[#12262B]">
              3. Compare outcomes
            </h2>
            <p className="text-[13px] text-[#4A6469]">
              Compare baseline outcome with simulated proactive intervention.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#4A6469] tracking-wider uppercase">
              Confidence Level
            </span>
            <span className="px-2.5 py-1 rounded-lg text-[12px] font-bold bg-[#DCEAF8] text-[#154C8A] border border-[#2F78C4]/40">
              96.4% Monte Carlo
            </span>
          </div>
        </div>

        {/* Two Comparative Columns Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Column A: Do nothing */}
          <div className="p-5 rounded-xl bg-[#FFF9F6] border border-[#F2B79A]/80 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[15px] font-bold text-[#8F2D07]">
                  <span className="material-symbols-outlined text-[18px]">warning</span>
                  <span>Do nothing</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FBDDD0] text-[#8F2D07] border border-[#B3441A]">
                  Unmitigated Cascade
                </span>
              </div>

              {/* Metric 1 */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[12px] text-[#4A6469]">Peak ICU Bed Deficit</span>
                  <span className="text-[13px] font-bold text-[#8F2D07]">
                    -{Math.max(1, deficitBeds)} Beds Deficit (106% capacity)
                  </span>
                </div>
                <div className="w-full bg-[#E6EDEE] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#B3441A] rounded-full" style={{ width: '100%' }} />
                </div>
                <p className="text-[11px] text-[#8F2D07] mt-1">
                  Full divert status expected by 18:30
                </p>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[12px] text-[#4A6469]">ED Boarding Delay</span>
                  <span className="text-[13px] font-bold text-[#8F2D07]">
                    {edBoardingHours} hours avg boarding time
                  </span>
                </div>
                <div className="w-full bg-[#E6EDEE] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#B3441A] rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-[11px] text-[#8F2D07] mt-1">
                  Exceeds Joint Commission sentinel threshold
                </p>
              </div>

              {/* Metric 3 */}
              <div className="pt-2 border-t border-[#F2B79A]/40 flex justify-between items-center text-[13px]">
                <span className="text-[#4A6469]">Diverted Ambulances</span>
                <span className="font-bold text-[#8F2D07]">{Math.max(2, divertedAmbulances)} ambulances rerouted</span>
              </div>
              <p className="text-[11px] text-[#8F2D07]/90 -mt-2">
                Region EMS advisory yellow status active
              </p>
            </div>
          </div>

          {/* Column B: Recommended Intervention */}
          <div className="p-5 rounded-xl bg-[#F0F8F8] border border-[#0F6E73]/50 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[15px] font-bold text-[#0B5A56]">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span>Recommended Intervention</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['Protocol B', 'Protocol A', 'Protocol C'] as const).map((proto) => (
                    <button
                      key={proto}
                      onClick={() => setSelectedProtocol(proto)}
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors cursor-pointer ${
                        selectedProtocol === proto
                          ? 'bg-[#0F6E73] text-white'
                          : 'bg-[#D9F0EE] text-[#0B5A56] hover:bg-[#C8DEE4]'
                      }`}
                    >
                      {proto === 'Protocol B' ? 'Proactive Protocol B' : proto}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metric 1 */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[12px] text-[#4A6469]">Peak ICU Bed Deficit</span>
                  <span className="text-[13px] font-bold text-[#0B5A56]">
                    0 Bed Deficit (94% capacity preserved)
                  </span>
                </div>
                <div className="w-full bg-[#E6EDEE] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F6E73] rounded-full" style={{ width: '75%' }} />
                </div>
                <p className="text-[11px] text-[#0B5A56] mt-1">
                  Achieved via 2 step-down transfers & telemetry flex
                </p>
              </div>

              {/* Metric 2 */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-[12px] text-[#4A6469]">ED Boarding Delay</span>
                  <span className="text-[13px] font-bold text-[#0B5A56]">
                    1.2 hours avg boarding time (-75%)
                  </span>
                </div>
                <div className="w-full bg-[#E6EDEE] h-2.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0F6E73] rounded-full" style={{ width: '25%' }} />
                </div>
                <p className="text-[11px] text-[#0B5A56] mt-1">
                  Rapid triage bypass routing enabled
                </p>
              </div>

              {/* Metric 3 */}
              <div className="pt-2 border-t border-[#0F6E73]/20 flex justify-between items-center text-[13px]">
                <span className="text-[#4A6469]">Diverted Ambulances</span>
                <span className="font-bold text-[#0B5A56]">0 ambulances diverted</span>
              </div>
              <p className="text-[11px] text-[#0B5A56] -mt-2">
                Full intake operational readiness maintained
              </p>
            </div>
          </div>
        </div>

        {/* Assumptions Footer */}
        <div className="flex items-center gap-2 text-[12px] text-[#4A6469] pt-2 border-t border-[#E6EDEE]">
          <span className="material-symbols-outlined text-[16px] text-[#8EA5AA]">info</span>
          <span>
            Assumptions: Constant triage severity index · Same starting state (14:32 Live Census) · Time horizon: 24 Hours · Monte Carlo run time: 1.4s (5,000 runs)
          </span>
        </div>
      </div>
    </div>
  );
};
