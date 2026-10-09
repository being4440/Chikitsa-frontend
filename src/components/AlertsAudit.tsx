import React, { useState } from 'react';
import { StatusChip } from './StatusChip';
import { RiskAlert, AuditRecord } from '../types';

interface AlertsAuditProps {
  alerts: RiskAlert[];
  auditRecords: AuditRecord[];
  onApproveAlert: (alertId: string) => void;
  onDismissAlert: (alertId: string) => void;
  onOpenCustomRule: () => void;
}

export const AlertsAudit: React.FC<AlertsAuditProps> = ({
  alerts,
  auditRecords,
  onApproveAlert,
  onDismissAlert,
  onOpenCustomRule
}) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string>('alert-icu-deficit');
  const [filterTier, setFilterTier] = useState<string>('all');

  const activeAlerts = alerts.filter(a => a.status === 'pending');
  const selectedAlert = alerts.find(a => a.id === selectedAlertId) || activeAlerts[0] || alerts[0];

  const filteredAlerts = activeAlerts.filter(a => {
    if (filterTier === 'critical') return a.tier === 'critical';
    if (filterTier === 'warning') return a.tier === 'warning';
    return true;
  });

  return (
    <div className="flex flex-col gap-5 max-w-[1440px] mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-[#12262B]">
            Alerts &amp; Audit Trail
          </h1>
          <p className="text-[14px] text-[#4A6469] mt-0.5">
            Clinical capacity risk alerts, explainable root causes, and verified clinical decision log
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Dropdown */}
          <div className="relative">
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="appearance-none bg-white border border-[#DCE5E7] text-[#12262B] text-[13px] font-medium py-2 pl-3 pr-8 rounded-lg shadow-2xs focus:outline-none focus:border-[#0F6E73] cursor-pointer"
            >
              <option value="all">Filter: All Active Alerts ({activeAlerts.length})</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warning Only</option>
            </select>
            <span className="material-symbols-outlined text-[#4A6469] text-[18px] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>

          {/* Custom Alert Rule Button */}
          <button
            onClick={onOpenCustomRule}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-[#F3F6F7] border border-[#DCE5E7] text-[#12262B] text-[13px] font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-[#0F6E73] text-[18px]">add</span>
            <span>Custom Alert Rule</span>
          </button>
        </div>
      </div>

      {/* 2. Top Split: Active Alerts List & Detail Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Active Risk Alerts */}
        <div className="lg:col-span-5 bg-white rounded-[14px] border border-[#DCE5E7] p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[16px] font-bold text-[#12262B]">
                Active Risk Alerts
              </h2>
              <span className="text-[11px] font-bold text-[#4A6469] uppercase tracking-wider">
                {activeAlerts.length} PENDING TRIAGES
              </span>
            </div>

            {/* Alerts List */}
            <div className="flex flex-col gap-3">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8 text-[#4A6469] text-[13px]">
                  All alerts triaged. No active capacity breaches.
                </div>
              ) : (
                filteredAlerts.map((alert) => {
                  const isSelected = alert.id === selectedAlert?.id;
                  return (
                    <div
                      key={alert.id}
                      onClick={() => setSelectedAlertId(alert.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F0F8F8] border-[#0F6E73] shadow-xs'
                          : 'bg-[#F8FAFA] border-[#E6EDEE] hover:bg-[#F0F8F8]/60 hover:border-[#BAC6C8]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[14px] font-bold text-[#12262B] truncate">
                          {alert.title}
                        </span>
                        <StatusChip tier={alert.tier} />
                      </div>

                      <div className="flex items-center gap-1.5 text-[12px] text-[#8F2D07] font-medium mb-1">
                        <span className="material-symbols-outlined text-[15px]">alarm</span>
                        <span>Expected breach: {alert.expectedBreach} ({alert.timeTarget})</span>
                      </div>

                      <div className="text-[12px] text-[#4A6469]">
                        {alert.impactOrQueue}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Alert Detail */}
        {selectedAlert ? (
          <div className="lg:col-span-7 bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              {/* Alert Title Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-[17px] font-bold text-[#12262B]">
                  Alert Detail: {selectedAlert.title}
                </h2>
                <StatusChip tier={selectedAlert.tier} />
              </div>

              {/* Drivers Breakdown */}
              <div className="mt-1">
                <div className="flex items-center justify-between text-[12px] mb-2.5">
                  <span className="font-semibold text-[#12262B]">Top Three Contributing Drivers</span>
                  <span className="text-[#4A6469]">Explainable Root Attribution</span>
                </div>

                <div className="flex flex-col gap-3">
                  {selectedAlert.drivers.map((driver, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between items-center text-[12px] mb-1">
                        <span className="text-[#12262B] font-medium truncate pr-2">{driver.label}</span>
                        <span className="text-[#0F6E73] font-bold shrink-0">{driver.weight}%</span>
                      </div>
                      <div className="w-full bg-[#E6EDEE] h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#0F6E73] rounded-full transition-all duration-500" 
                          style={{ width: `${driver.weight * 1.5}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Suggested Action Card */}
              <div className="mt-2 p-4 rounded-xl bg-[#F0F8F8] border border-[#0F6E73]/30">
                <div className="flex items-center gap-2 text-[14px] font-bold text-[#0B5A56] mb-1.5">
                  <span className="material-symbols-outlined text-[18px]">psychology</span>
                  <span>Suggested Action (AI Decision Support)</span>
                </div>
                <p className="text-[13px] text-[#12262B] leading-relaxed">
                  {selectedAlert.suggestedAction}
                </p>
                <div className="flex items-center gap-1.5 mt-2.5 text-[12px] font-semibold text-[#0B5A56]">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>{selectedAlert.actionImpact}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-[#E6EDEE] flex items-center gap-3">
              <button
                onClick={() => onApproveAlert(selectedAlert.id)}
                className="flex-1 py-2.5 px-4 rounded-lg bg-[#0F6E73] hover:bg-[#0A4F53] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Approve action</span>
              </button>
              <button
                onClick={() => onDismissAlert(selectedAlert.id)}
                className="py-2.5 px-4 rounded-lg bg-white hover:bg-[#F3F6F7] border border-[#DCE5E7] text-[#12262B] text-[13px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#6F797A]">cancel</span>
                <span>Dismiss alert</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-[14px] border border-[#DCE5E7] p-8 shadow-xs flex items-center justify-center text-[#4A6469]">
            Select an alert on the left to inspect root causes and suggested clinical protocols.
          </div>
        )}
      </div>

      {/* 3. Bottom Table: Decision History & Compliance Audit Trail */}
      <div className="bg-white rounded-[14px] border border-[#DCE5E7] p-6 shadow-xs flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-[17px] font-bold text-[#12262B]">
              Decision History &amp; Compliance Audit Trail
            </h2>
            <p className="text-[13px] text-[#4A6469]">
              Immutable log of clinical actions, approvals, and model recommendations
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0E3B40]">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            <span>Cryptographically Signed Ledger</span>
          </div>
        </div>

        {/* Audit Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#E6EDEE] text-[#4A6469] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Alert</th>
                <th className="py-2.5 px-3">Decision</th>
                <th className="py-2.5 px-3">Decided By</th>
                <th className="py-2.5 px-3">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6EDEE]/70">
              {auditRecords.map((record) => (
                <tr key={record.id} className="hover:bg-[#F8FAFA] transition-colors">
                  <td className="py-3 px-3 font-mono text-[#4A6469] whitespace-nowrap">
                    {record.time}
                  </td>
                  <td className="py-3 px-3 font-bold text-[#12262B] whitespace-nowrap">
                    {record.alert}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <StatusChip 
                      tier={record.decision.toLowerCase() as any} 
                      label={record.decision} 
                    />
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="font-semibold text-[#12262B]">{record.decidedBy}</span>
                    <span className="text-[#4A6469] text-[12px]"> ({record.role})</span>
                  </td>
                  <td className="py-3 px-3 text-[#4A6469] max-w-md">
                    {record.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
