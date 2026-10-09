import React from 'react';
import { NavScreen } from '../types';

interface SidebarProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  pendingAlertsCount: number;
  liveSyncStatus: boolean;
  onToggleSync: () => void;
  onOpenProfile: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  pendingAlertsCount,
  liveSyncStatus,
  onToggleSync,
  onOpenProfile,
  isMobileOpen,
  onCloseMobile
}) => {
  const navItems: { id: NavScreen; label: string; icon: string; badge?: number }[] = [
    { id: 'command-center', label: 'Command Center', icon: 'dashboard' },
    { id: 'scenario-lab', label: 'Scenario Lab', icon: 'science' },
    { id: 'alerts-audit', label: 'Alerts & Audit', icon: 'notifications_active', badge: pendingAlertsCount },
    { id: 'bottleneck-intel', label: 'Bottleneck Intel', icon: 'hub' },
    { id: 'seasonal-forecast', label: 'Seasonal Forecast', icon: 'calendar_month' },
    { id: 'digital-twin', label: 'Digital Twin', icon: 'apartment' },
  ];

  const logoUrl = 'https://lh3.googleusercontent.com/aida/AEtjO1X2kQG5wz95HtEMk8b00cSENZkFiMUHq5nD3rALPr9rQpAeUTJhd6xWHPo64G1NAFjo1l2Gj5QPgqVxvQe3yRoADkCNRdyolbl7QpfKM3D2ldmBhM8GYTfYDl2JHZgtwJ_PEdFFU70SmPYD2XLvuAEQ9VpEC5KbSVzm9L6SaXcC6vwmlvYHHMt8mFzh0-rQWViw685KWo2Dv9Et5Aiown_wdA-DlhKGoUQPvxU9RsHutUQVtHJ5HM5sHg';
  const profileUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRBCLKakKARsiTUv8fzkWCZ-XHlb7stDK6QJPwMrj1M3vEu2zoDfIc_Ah-ilsx7bdHD80Ym_qzxkQto0Q3q0L2rWYw6poDQV0I6X-BxC2MiPum8f4lLWpfCXn1HHq40uw765410kX2eX9ygy3bxn9jIjbK1Ne5KN4yGRK6oDaSNgkeXHqeVYO1DultHf5iX26oyw1zsYySV2UG7Nj0aYgH7O-RdI5VfhLpuNd-oPGFPcNyL2vWFUU';

  const renderNavContent = (isMobile: boolean = false) => (
    <>
      <div className="flex flex-col gap-6">
        {/* Brand Lockup */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div 
            onClick={() => {
              onNavigate('command-center');
              if (isMobile) onCloseMobile();
            }}
            className="flex items-center gap-3 cursor-pointer group"
            role="button"
            tabIndex={0}
          >
            <div className="h-8 w-8 rounded-lg bg-[#0F6E73] flex items-center justify-center shrink-0 overflow-hidden shadow-xs ring-1 ring-[#A7D5D8]/30">
              <img 
                alt="Clinical Foresight Logo" 
                className="h-8 w-8 object-contain" 
                src={logoUrl}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="material-symbols-outlined text-[#A1F0F5] text-[20px] hidden group-has-[:hidden]:inline">
                show_chart
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-white font-semibold text-[15px] leading-tight truncate group-hover:text-[#A1F0F5] transition-colors">
                Clinical Foresight
              </span>
              <span className="text-[#A7D5D8] text-[10px] font-bold tracking-wider uppercase">
                Operations AI
              </span>
            </div>
          </div>

          {/* Close button inside mobile drawer */}
          {isMobile && (
            <button
              onClick={onCloseMobile}
              className="w-8 h-8 rounded-lg bg-[#134B51]/60 hover:bg-[#134B51] text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (isMobile) onCloseMobile();
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#0E3B40] font-semibold shadow-xs'
                    : 'text-[#CFE3E4] hover:text-white hover:bg-[#134B51]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`material-symbols-outlined text-[18px] shrink-0 ${
                    isActive ? 'text-[#0E3B40]' : 'text-[#CFE3E4]'
                  }`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#B3441A] text-white">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Telemetry & Profile */}
      <div className="flex flex-col gap-3 px-2 pt-4 border-t border-[#134B51]/60">
        <button
          onClick={onToggleSync}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#134B51]/40 hover:bg-[#134B51]/70 transition-colors text-left cursor-pointer"
          title="Click to toggle telemetry streaming feed"
        >
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            liveSyncStatus ? 'bg-[#A1F0F5] animate-pulse' : 'bg-amber-400'
          }`} />
          <span className="text-[#A7D5D8] text-[11px] font-medium truncate">
            {liveSyncStatus ? 'Live Feed Sync · 99.8%' : 'Feed Paused (Cached)'}
          </span>
        </button>

        <div 
          onClick={() => {
            onOpenProfile();
            if (isMobile) onCloseMobile();
          }}
          className="flex items-center gap-2.5 pt-1 cursor-pointer hover:opacity-90 transition-opacity"
          role="button"
          tabIndex={0}
        >
          <img 
            alt="Dr. Sarah Lin" 
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#A7D5D8]/40 shrink-0" 
            src={profileUrl}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&q=80';
            }}
          />
          <div className="flex flex-col min-w-0">
            <span className="text-white font-medium text-[13px] leading-tight truncate">
              Dr. Sarah Lin
            </span>
            <span className="text-[#A7D5D8] text-[11px] truncate">
              Operations Director
            </span>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar (Unchanged on web laptop/desktop screens >= 1024px) */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[220px] bg-[#0E3B40] z-50 flex-col justify-between py-5 px-3 border-r border-[#134B51]/40 select-none">
        {renderNavContent(false)}
      </aside>

      {/* 2. Mobile Drawer Menu for Small Screens (< lg) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-50 lg:hidden flex"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop */}
          <div 
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Panel */}
          <div className="relative w-[280px] max-w-[85vw] h-full bg-[#0E3B40] shadow-2xl flex flex-col justify-between py-5 px-3.5 z-10 animate-in slide-in-from-left duration-250 select-none">
            {renderNavContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
