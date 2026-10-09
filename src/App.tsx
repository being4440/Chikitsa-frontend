/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavScreen, RiskAlert, AuditRecord, FacilityNode } from './types';
import { INITIAL_RISK_ALERTS, INITIAL_AUDIT_RECORDS } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { CommandCenter } from './components/CommandCenter';
import { ScenarioLab } from './components/ScenarioLab';
import { AlertsAudit } from './components/AlertsAudit';
import { BottleneckIntel } from './components/BottleneckIntel';
import { SeasonalForecast } from './components/SeasonalForecast';
import { DigitalTwin } from './components/DigitalTwin';
import { 
  AllUnitsModal, 
  ActiveSentinelModal, 
  CustomRuleModal, 
  PreSurgeChecklistModal, 
  SettingsModal 
} from './components/Modals';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('command-center');
  const [alerts, setAlerts] = useState<RiskAlert[]>(INITIAL_RISK_ALERTS);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>(INITIAL_AUDIT_RECORDS);
  const [liveSync, setLiveSync] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mobile menu drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Selected unit focus when drilling down from another screen
  const [focusedDeptId, setFocusedDeptId] = useState<string>('icu');

  // Modal Dialog States
  const [isAllUnitsOpen, setIsAllUnitsOpen] = useState(false);
  const [isSentinelOpen, setIsSentinelOpen] = useState(false);
  const [isCustomRuleOpen, setIsCustomRuleOpen] = useState(false);
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const pendingAlertsCount = alerts.filter(a => a.status === 'pending').length;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  // Approve an alert
  const handleApproveAlert = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'approved' } : a));

    const newRecord: AuditRecord = {
      id: `rec-${Date.now()}`,
      time: 'Just now',
      alert: alert.title,
      decision: 'Approved',
      decidedBy: 'Dr. Sarah Lin',
      role: 'Operations Director',
      note: `Surge Protocol authorized. ${alert.suggestedAction}`
    };

    setAuditRecords(prev => [newRecord, ...prev]);
    showToast(`Approved: ${alert.title}. Action logged to signed audit trail.`);
  };

  // Dismiss an alert
  const handleDismissAlert = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'dismissed' } : a));

    const newRecord: AuditRecord = {
      id: `rec-${Date.now()}`,
      time: 'Just now',
      alert: alert.title,
      decision: 'Dismissed',
      decidedBy: 'Dr. Sarah Lin',
      role: 'Operations Director',
      note: 'Alert triaged and marked resolved after clinical verification.'
    };

    setAuditRecords(prev => [newRecord, ...prev]);
    showToast(`Dismissed: ${alert.title}. Review logged in compliance audit.`);
  };

  // Save a custom alert rule
  const handleSaveCustomRule = (name: string, threshold: number, unit: string) => {
    showToast(`Created Rule: "${name}" for ${unit} (> ${threshold}% threshold)`);
  };

  // Drilldown handler from Command Center or All Units Modal
  const handleNavigateToUnit = (unitId: string) => {
    setFocusedDeptId(unitId);
    setCurrentScreen('digital-twin');
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F3F6F7] text-[#12262B]">
      {/* 1. Left Sidebar (Fixed on desktop >= lg, slide-out drawer on small screens < lg) */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={(screen) => {
          setCurrentScreen(screen);
          setIsMobileMenuOpen(false);
        }}
        pendingAlertsCount={pendingAlertsCount}
        liveSyncStatus={liveSync}
        onToggleSync={() => {
          setLiveSync(!liveSync);
          showToast(liveSync ? 'Telemetry stream paused.' : 'Live telemetry stream resumed.');
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Top Header Navigation */}
      <div className="pl-0 lg:pl-[220px]">
        <Header
          pendingAlertsCount={pendingAlertsCount}
          onOpenSentinel={() => setIsSentinelOpen(true)}
          onOpenNotifications={() => {
            setCurrentScreen('alerts-audit');
            showToast('Navigated to Alerts & Audit Trail.');
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* 3. Main Content Canvas */}
        <main className="w-full pt-20 px-3.5 sm:px-6 lg:px-8 pb-22 lg:pb-10 min-h-screen">
          {currentScreen === 'command-center' && (
            <CommandCenter
              onReviewActions={() => setCurrentScreen('alerts-audit')}
              onOpenAllUnits={() => setIsAllUnitsOpen(true)}
              onNavigateToUnit={handleNavigateToUnit}
            />
          )}

          {currentScreen === 'scenario-lab' && (
            <ScenarioLab
              onApplyIntervention={() => {
                showToast('Intervention Protocol deployed to regional command network.');
              }}
            />
          )}

          {currentScreen === 'alerts-audit' && (
            <AlertsAudit
              alerts={alerts}
              auditRecords={auditRecords}
              onApproveAlert={handleApproveAlert}
              onDismissAlert={handleDismissAlert}
              onOpenCustomRule={() => setIsCustomRuleOpen(true)}
            />
          )}

          {currentScreen === 'bottleneck-intel' && (
            <BottleneckIntel
              initialDepartmentId={focusedDeptId}
              onSimulateInLab={() => setCurrentScreen('scenario-lab')}
            />
          )}

          {currentScreen === 'seasonal-forecast' && (
            <SeasonalForecast
              onExecuteChecklist={() => setIsChecklistOpen(true)}
            />
          )}

          {currentScreen === 'digital-twin' && (
            <DigitalTwin
              initialNodeId={focusedDeptId}
              onOpenInScenarioLab={(node: FacilityNode) => {
                setFocusedDeptId(node.id);
                setCurrentScreen('scenario-lab');
                showToast(`Loaded ${node.name} baseline into Scenario Lab.`);
              }}
            />
          )}
        </main>

        {/* 4. Responsive Mobile Bottom Menu Bar (Visible on small screens < lg) */}
        <nav 
          className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0E3B40] border-t border-[#134B51] z-40 flex items-center justify-around px-2 shadow-lg select-none"
          aria-label="Mobile Navigation Bar"
        >
          {/* Item 1: Command Center */}
          <button
            onClick={() => setCurrentScreen('command-center')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors cursor-pointer ${
              currentScreen === 'command-center' ? 'text-white' : 'text-[#A7D5D8] hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${
              currentScreen === 'command-center' ? 'text-[#A1F0F5]' : ''
            }`}>
              dashboard
            </span>
            <span className="text-[10px] font-medium tracking-tight mt-0.5 truncate">
              Command
            </span>
          </button>

          {/* Item 2: Scenario Lab */}
          <button
            onClick={() => setCurrentScreen('scenario-lab')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors cursor-pointer ${
              currentScreen === 'scenario-lab' ? 'text-white' : 'text-[#A7D5D8] hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${
              currentScreen === 'scenario-lab' ? 'text-[#A1F0F5]' : ''
            }`}>
              science
            </span>
            <span className="text-[10px] font-medium tracking-tight mt-0.5 truncate">
              Scenario
            </span>
          </button>

          {/* Item 3: Alerts & Audit */}
          <button
            onClick={() => setCurrentScreen('alerts-audit')}
            className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors cursor-pointer ${
              currentScreen === 'alerts-audit' ? 'text-white' : 'text-[#A7D5D8] hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${
              currentScreen === 'alerts-audit' ? 'text-[#A1F0F5]' : ''
            }`}>
              notifications_active
            </span>
            {pendingAlertsCount > 0 && (
              <span className="absolute top-0.5 right-3 w-3.5 h-3.5 rounded-full bg-[#B3441A] text-white text-[8.5px] font-bold flex items-center justify-center">
                {pendingAlertsCount}
              </span>
            )}
            <span className="text-[10px] font-medium tracking-tight mt-0.5 truncate">
              Alerts
            </span>
          </button>

          {/* Item 4: Bottleneck Intel */}
          <button
            onClick={() => setCurrentScreen('bottleneck-intel')}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors cursor-pointer ${
              currentScreen === 'bottleneck-intel' ? 'text-white' : 'text-[#A7D5D8] hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${
              currentScreen === 'bottleneck-intel' ? 'text-[#A1F0F5]' : ''
            }`}>
              hub
            </span>
            <span className="text-[10px] font-medium tracking-tight mt-0.5 truncate">
              Bottleneck
            </span>
          </button>

          {/* Item 5: Full Menu (Toggles all screens drawer) */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-colors cursor-pointer ${
              isMobileMenuOpen ? 'text-white' : 'text-[#A7D5D8] hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              menu
            </span>
            <span className="text-[10px] font-medium tracking-tight mt-0.5 truncate">
              Menu
            </span>
          </button>
        </nav>
      </div>

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0E3B40] text-white text-[13px] font-medium shadow-lg border border-[#134B51] animate-in fade-in slide-in-from-bottom-3 duration-300">
          <span className="material-symbols-outlined text-[#A1F0F5] text-[18px]">verified</span>
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#A7D5D8] hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Modals & Dialogs */}
      <AllUnitsModal
        isOpen={isAllUnitsOpen}
        onClose={() => setIsAllUnitsOpen(false)}
        onSelectUnit={handleNavigateToUnit}
      />

      <ActiveSentinelModal
        isOpen={isSentinelOpen}
        onClose={() => setIsSentinelOpen(false)}
      />

      <CustomRuleModal
        isOpen={isCustomRuleOpen}
        onClose={() => setIsCustomRuleOpen(false)}
        onSaveRule={handleSaveCustomRule}
      />

      <PreSurgeChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Profile Dialog */}
      {isProfileOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
          onClick={() => setIsProfileOpen(false)}
        >
          <div 
            className="bg-white rounded-[16px] border border-[#DCE5E7] p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <img 
                alt="Dr. Sarah Lin" 
                className="w-14 h-14 rounded-full object-cover ring-2 ring-[#0F6E73]/30" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRBCLKakKARsiTUv8fzkWCZ-XHlb7stDK6QJPwMrj1M3vEu2zoDfIc_Ah-ilsx7bdHD80Ym_qzxkQto0Q3q0L2rWYw6poDQV0I6X-BxC2MiPum8f4lLWpfCXn1HHq40uw765410kX2eX9ygy3bxn9jIjbK1Ne5KN4yGRK6oDaSNgkeXHqeVYO1DultHf5iX26oyw1zsYySV2UG7Nj0aYgH7O-RdI5VfhLpuNd-oPGFPcNyL2vWFUU"
              />
              <div>
                <h3 className="text-[16px] font-bold text-[#12262B]">Dr. Sarah Lin, MD, MBA</h3>
                <p className="text-[12px] text-[#0F6E73] font-semibold">Director of Hospital Operations</p>
                <p className="text-[11px] text-[#4A6469]">Credential ID: CLIN-84021</p>
              </div>
            </div>
            <div className="text-[12px] text-[#4A6469] space-y-2 py-3 border-t border-b border-[#E6EDEE]">
              <div className="flex justify-between">
                <span>Shift Status:</span>
                <span className="font-semibold text-[#0B5A56]">Alpha Command Lead</span>
              </div>
              <div className="flex justify-between">
                <span>Regional Authority:</span>
                <span className="font-semibold text-[#12262B]">Level 1 Trauma Command</span>
              </div>
              <div className="flex justify-between">
                <span>EHR Cryptographic Key:</span>
                <span className="font-mono text-[10px] text-[#4A6469]">SHA256: 8f3c...4a12</span>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsProfileOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#0F6E73] text-white text-[13px] font-semibold hover:bg-[#0A4F53] transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
