import React from 'react';

interface HeaderProps {
  pendingAlertsCount: number;
  onOpenSentinel: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  pendingAlertsCount,
  onOpenSentinel,
  onOpenNotifications,
  onOpenSettings,
  onOpenProfile,
  onToggleMobileMenu
}) => {
  const profileUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRBCLKakKARsiTUv8fzkWCZ-XHlb7stDK6QJPwMrj1M3vEu2zoDfIc_Ah-ilsx7bdHD80Ym_qzxkQto0Q3q0L2rWYw6poDQV0I6X-BxC2MiPum8f4lLWpfCXn1HHq40uw765410kX2eX9ygy3bxn9jIjbK1Ne5KN4yGRK6oDaSNgkeXHqeVYO1DultHf5iX26oyw1zsYySV2UG7Nj0aYgH7O-RdI5VfhLpuNd-oPGFPcNyL2vWFUU';

  return (
    <header className="fixed top-0 left-0 lg:left-[220px] right-0 h-16 bg-[#F0FBFF]/95 backdrop-blur-md border-b border-[#DCE5E7] z-40 px-3.5 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left: Mobile Hamburger Toggle + Regional Telemetry Tag */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Button - visible ONLY on screens < lg */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-[#DCF2F8] hover:bg-[#D1E6ED] active:scale-95 text-[#0E3B40] transition-all cursor-pointer shadow-2xs"
          aria-label="Open mobile menu"
          title="Open Navigation Menu"
        >
          <span className="material-symbols-outlined text-[22px]">
            menu
          </span>
        </button>

        {/* Hospital Icon & Regional Tag */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3C656A] text-[20px] shrink-0 hidden sm:inline">
            local_hospital
          </span>
          <span className="text-[11px] sm:text-[12px] font-semibold text-[#3C656A] uppercase tracking-wider truncate max-w-[130px] sm:max-w-none">
            Regional Telemetry
          </span>
        </div>
      </div>

      {/* Right Action Icons & Sentinel */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Surge Sentinel button */}
        <button
          onClick={onOpenSentinel}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#DCF2F8] hover:bg-[#D1E6ED] border border-[#BEC9C9]/50 transition-colors cursor-pointer group"
          title="Autonomous Surge Protocol Sentinel - Online"
        >
          <span className="material-symbols-outlined text-[#005458] group-hover:rotate-180 transition-transform duration-500 text-[17px] sm:text-[18px]">
            sync
          </span>
          <span className="text-[11px] sm:text-[12px] font-medium text-[#3E4949] hidden sm:inline">
            Active Surge Sentinel
          </span>
          <span className="text-[11px] font-medium text-[#3E4949] sm:hidden">
            Sentinel
          </span>
        </button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#D6ECF3] hover:bg-[#C8DEE4] text-[#3E4949] hover:text-[#0A1E23] transition-colors cursor-pointer"
          title="Pending Alerts & Clinical Triage"
          aria-label="View notifications"
        >
          <span className="material-symbols-outlined text-[19px] sm:text-[20px]">
            notifications
          </span>
          {pendingAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B3441A] text-white text-[9px] font-bold flex items-center justify-center border-2 border-[#F0FBFF]">
              {pendingAlertsCount}
            </span>
          )}
        </button>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#D6ECF3] hover:bg-[#C8DEE4] text-[#3E4949] hover:text-[#0A1E23] transition-colors cursor-pointer hidden xs:flex"
          title="Operations Center Settings"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-[19px] sm:text-[20px]">
            settings
          </span>
        </button>

        {/* User Avatar */}
        <button
          onClick={onOpenProfile}
          className="w-8 h-8 rounded-full overflow-hidden ml-0.5 sm:ml-1 ring-1 ring-[#0F6E73]/30 hover:ring-[#0F6E73] transition-all cursor-pointer shrink-0"
          title="Dr. Sarah Lin (Operations Director)"
          aria-label="User profile"
        >
          <img 
            alt="Profile" 
            className="w-full h-full object-cover" 
            src={profileUrl}
          />
        </button>
      </div>
    </header>
  );
};
