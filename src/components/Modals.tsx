import React, { useState } from 'react';
import { StatusChip } from './StatusChip';
import { ALL_12_UNITS } from '../data/mockData';
import { StatusTier } from '../types';

// Modal Backdrop Container
const ModalBackdrop: React.FC<{ children: React.ReactNode; onClose: () => void }> = ({ children, onClose }) => (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200"
    onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}
  >
    {children}
  </div>
);

// 1. All 12 Operational Units Modal
export const AllUnitsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectUnit: (unitId: string) => void;
}> = ({ isOpen, onClose, onSelectUnit }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-[16px] border border-[#DCE5E7] p-6 max-w-3xl w-full shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6EDEE]">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#0F6E73] text-[22px]">domain</span>
            <div>
              <h2 className="text-[18px] font-bold text-[#12262B]">All 12 Hospital Operational Units</h2>
              <p className="text-[12px] text-[#4A6469]">Facility-wide census status, capacity thresholds, and breach probabilities</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[#F3F6F7] text-[#4A6469] flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="overflow-y-auto py-4 flex flex-col gap-2.5 pr-1">
          {ALL_12_UNITS.map((unit) => {
            const occupancyPct = Math.round((unit.occupied / unit.capacity) * 100);
            return (
              <div 
                key={unit.id}
                onClick={() => {
                  onSelectUnit(unit.id);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-[#F8FAFA] hover:bg-[#F0F8F8] border border-[#E6EDEE] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#12262B]">{unit.name}</span>
                    <span className="text-[12px] text-[#4A6469]">
                      {unit.occupied} of {unit.capacity} beds ({occupancyPct}%) · ETA: {unit.breachETA}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="w-24 bg-[#E6EDEE] h-2 rounded-full overflow-hidden hidden sm:block">
                    <div 
                      className={`h-full rounded-full ${
                        unit.tier === 'critical' ? 'bg-[#B3441A]' :
                        unit.tier === 'warning' ? 'bg-[#B07A00]' :
                        unit.tier === 'watch' ? 'bg-[#2F78C4]' : 'bg-[#0F6E73]'
                      }`}
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                  <StatusChip tier={unit.tier as StatusTier} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#E6EDEE] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0F6E73] text-white text-[13px] font-semibold hover:bg-[#0A4F53] transition-colors cursor-pointer"
          >
            Close Overview
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

// 2. Active Surge Sentinel Modal
export const ActiveSentinelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-[16px] border border-[#DCE5E7] p-6 max-w-xl w-full shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6EDEE]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F6E73] animate-pulse" />
            <h2 className="text-[18px] font-bold text-[#12262B]">Active Surge Sentinel Telemetry</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F3F6F7] text-[#4A6469] flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="py-4 flex flex-col gap-4 text-[13px] text-[#4A6469]">
          <div className="p-3.5 rounded-xl bg-[#F0F8F8] border border-[#0F6E73]/30">
            <div className="font-bold text-[#0B5A56] text-[14px] flex items-center gap-1.5 mb-1">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Autonomous Sentinel Loop · Active</span>
            </div>
            <p className="text-[#12262B]">
              Surge Sentinel continuously scans regional EMS feeds, admission dispatch queues, and ward telemetry every 10 seconds to forecast bed breaches up to 48 hours in advance.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[12px]">
            <div className="p-3 rounded-lg bg-[#F8FAFA] border border-[#E6EDEE]">
              <div className="text-[#4A6469]">Inference Engine</div>
              <div className="font-bold text-[#12262B] text-[13px] mt-0.5">Neural Census Transformer</div>
            </div>
            <div className="p-3 rounded-lg bg-[#F8FAFA] border border-[#E6EDEE]">
              <div className="text-[#4A6469]">Monte Carlo Runs</div>
              <div className="font-bold text-[#12262B] text-[13px] mt-0.5">5,000 simulations / 1.4s</div>
            </div>
            <div className="p-3 rounded-lg bg-[#F8FAFA] border border-[#E6EDEE]">
              <div className="text-[#4A6469]">Breach Trigger Limit</div>
              <div className="font-bold text-[#8F2D07] text-[13px] mt-0.5">&gt;90% Dynamic Capacity</div>
            </div>
            <div className="p-3 rounded-lg bg-[#F8FAFA] border border-[#E6EDEE]">
              <div className="text-[#4A6469]">Current Telemetry Sync</div>
              <div className="font-bold text-[#0B5A56] text-[13px] mt-0.5">99.8% Reliability</div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-[#E6EDEE] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0F6E73] text-white text-[13px] font-semibold hover:bg-[#0A4F53] transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

// 3. Custom Alert Rule Modal
export const CustomRuleModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSaveRule: (name: string, threshold: number, unit: string) => void;
}> = ({ isOpen, onClose, onSaveRule }) => {
  const [ruleName, setRuleName] = useState('PACU Evening Dwell Guard');
  const [unit, setUnit] = useState('Acute Surgical Pavilion');
  const [threshold, setThreshold] = useState(85);

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-[16px] border border-[#DCE5E7] p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6EDEE]">
          <h2 className="text-[18px] font-bold text-[#12262B]">Create Custom Alert Rule</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F3F6F7] text-[#4A6469] flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="py-4 flex flex-col gap-4 text-[13px]">
          <div>
            <label className="font-semibold text-[#12262B] block mb-1">Rule Name</label>
            <input 
              type="text" 
              value={ruleName} 
              onChange={(e) => setRuleName(e.target.value)}
              className="w-full px-3 py-2 border border-[#DCE5E7] rounded-lg focus:outline-none focus:border-[#0F6E73]"
            />
          </div>

          <div>
            <label className="font-semibold text-[#12262B] block mb-1">Target Department</label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 border border-[#DCE5E7] rounded-lg focus:outline-none focus:border-[#0F6E73] bg-white cursor-pointer"
            >
              <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
              <option value="Emergency Department (ED)">Emergency Department (ED)</option>
              <option value="Acute Surgical Pavilion">Acute Surgical Pavilion</option>
              <option value="Radiology / Imaging">Radiology / Imaging</option>
              <option value="General Medical Inpatient">General Medical Inpatient</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-[#12262B]">Capacity Breach Threshold</label>
              <span className="font-bold text-[#0F6E73]">{threshold}%</span>
            </div>
            <input 
              type="range" 
              min="60" 
              max="98" 
              value={threshold} 
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-[#0F6E73] cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-[#E6EDEE] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-[#DCE5E7] text-[#12262B] text-[13px] font-semibold hover:bg-[#F3F6F7] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSaveRule(ruleName, threshold, unit);
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-[#0F6E73] text-white text-[13px] font-semibold hover:bg-[#0A4F53] cursor-pointer"
          >
            Save Rule
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

// 4. Pre-Surge Checklist Modal
export const PreSurgeChecklistModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [tasks, setTasks] = useState([
    { id: 't1', text: 'Lock Elective Surgical Schedule for Week 7 (Target: Suites A & Stepdown)', checked: true },
    { id: 't2', text: 'Order +25% Respiratory Isolation Consumables Batch (N95, Filters, ECMO cannulas)', checked: true },
    { id: 't3', text: 'Activate Float Pool Nurse On-Call Reserve Contract (12 Standby RNs)', checked: true },
    { id: 't4', text: 'Test Oxygen Bulk Tank Low-Pressure Redundancy Sensors', checked: false },
    { id: 't5', text: 'Brief Regional EMS Dispatch Liaison on Divert Escalation Limits', checked: false }
  ]);
  const [executed, setExecuted] = useState(false);

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-[16px] border border-[#DCE5E7] p-6 max-w-xl w-full shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6EDEE]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0F6E73] text-[22px]">playlist_add_check</span>
            <h2 className="text-[18px] font-bold text-[#12262B]">Pre-Surge Readiness Checklist</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F3F6F7] text-[#4A6469] flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="py-4 flex flex-col gap-3">
          {tasks.map((task) => (
            <label 
              key={task.id} 
              className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFA] hover:bg-[#F0F8F8] border border-[#E6EDEE] transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={task.checked}
                onChange={() => {
                  setTasks(tasks.map(t => t.id === task.id ? { ...t, checked: !t.checked } : t));
                }}
                className="mt-0.5 accent-[#0F6E73] w-4 h-4 cursor-pointer"
              />
              <span className={`text-[13px] ${task.checked ? 'text-[#12262B] font-medium' : 'text-[#4A6469]'}`}>
                {task.text}
              </span>
            </label>
          ))}

          {executed && (
            <div className="p-3 rounded-lg bg-[#D9F0EE] text-[#0B5A56] text-[12px] font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Readiness Protocol verified and broadcasted to hospital wing charge nurses.</span>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-[#E6EDEE] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-[#DCE5E7] text-[#12262B] text-[13px] font-semibold hover:bg-[#F3F6F7] cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => setExecuted(true)}
            className="px-4 py-2 rounded-lg bg-[#0F6E73] text-white text-[13px] font-semibold hover:bg-[#0A4F53] flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">task_alt</span>
            <span>Confirm &amp; Broadcast Plan</span>
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};

// 5. Settings Modal
export const SettingsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [refreshInterval, setRefreshInterval] = useState('10s');
  const [emsBridge, setEmsBridge] = useState(true);
  const [alertAudio, setAlertAudio] = useState(true);

  if (!isOpen) return null;

  return (
    <ModalBackdrop onClose={onClose}>
      <div className="bg-white rounded-[16px] border border-[#DCE5E7] p-6 max-w-md w-full shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6EDEE]">
          <h2 className="text-[18px] font-bold text-[#12262B]">Operations Center Settings</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F3F6F7] text-[#4A6469] flex items-center justify-center cursor-pointer">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="py-4 flex flex-col gap-4 text-[13px]">
          <div>
            <label className="font-semibold text-[#12262B] block mb-1">Telemetry Sync Cadence</label>
            <select
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(e.target.value)}
              className="w-full px-3 py-2 border border-[#DCE5E7] rounded-lg bg-white cursor-pointer"
            >
              <option value="5s">Real-time Stream (5 seconds)</option>
              <option value="10s">Nominal Sync (10 seconds)</option>
              <option value="30s">Network Saver (30 seconds)</option>
            </select>
          </div>

          <label className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFA] border border-[#E6EDEE] cursor-pointer">
            <div>
              <div className="font-semibold text-[#12262B]">Regional EMS Divert Bridge</div>
              <div className="text-[11px] text-[#4A6469]">Auto-sync diversion status with county ambulance dispatch</div>
            </div>
            <input 
              type="checkbox" 
              checked={emsBridge} 
              onChange={() => setEmsBridge(!emsBridge)} 
              className="accent-[#0F6E73] w-4 h-4 cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFA] border border-[#E6EDEE] cursor-pointer">
            <div>
              <div className="font-semibold text-[#12262B]">Audio Chime on Critical Breach</div>
              <div className="text-[11px] text-[#4A6469]">Low-arousal chime on Tier 1 ICU risk projections</div>
            </div>
            <input 
              type="checkbox" 
              checked={alertAudio} 
              onChange={() => setAlertAudio(!alertAudio)} 
              className="accent-[#0F6E73] w-4 h-4 cursor-pointer"
            />
          </label>
        </div>

        <div className="pt-3 border-t border-[#E6EDEE] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#0F6E73] text-white text-[13px] font-semibold hover:bg-[#0A4F53] cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
};
