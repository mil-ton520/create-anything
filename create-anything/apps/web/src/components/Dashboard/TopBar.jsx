import { useState } from "react";
import { Menu, ChevronDown, Settings, CreditCard } from "lucide-react";
import WorkspaceSwitcher from "./WorkspaceSwitcher";

export function TopBar({
  currentWorkspace,
  user,
  setSidebarOpen = () => {},
  onWorkspaceChange,
  onCreateWorkspace,
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleAccountSettings = () => {
    setUserMenuOpen(false);
    window.location.href = "/account/settings";
  };

  const handleUsageAndBilling = () => {
    setUserMenuOpen(false);
    window.location.href = "/account/usage";
  };

  return (
    <div className="h-16 bg-white border-b border-[#E5E7EB] flex items-center px-6 justify-between">
      {/* Left Section - Logo and Mobile Menu */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 text-[#6B7280] hover:text-[#0A0A0A] rounded-lg transition-colors duration-150"
        >
          <Menu size={20} />
        </button>

        {/* Logo & Workspace Name */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>

          <div className="text-left">
            <div className="font-semibold text-[#0A0A0A] text-sm">
              {currentWorkspace?.name || "EuroAI Hub"}
            </div>
            <div className="text-xs text-[#6B7280]">
              GDPR Compliant AI Platform
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Workspace Switcher & User Menu */}
      <div className="flex items-center gap-3">
        {/* Workspace Switcher */}
        <WorkspaceSwitcher
          currentWorkspace={currentWorkspace}
          onWorkspaceChange={onWorkspaceChange}
          onCreateWorkspace={onCreateWorkspace}
        />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-2 hover:bg-[#F4F5F7] rounded-lg transition-colors duration-150"
          >
            <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <div className="font-medium text-[#0A0A0A] text-sm">
                {user?.name || "User"}
              </div>
              <div className="text-xs text-[#6B7280]">{user?.email}</div>
            </div>
            <ChevronDown size={14} className="text-[#6B7280]" />
          </button>

          {userMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-2 z-50">
              <div className="px-3 py-2 border-b border-[#E5E7EB]">
                <div className="font-medium text-[#0A0A0A] text-sm">
                  {user?.name || "User"}
                </div>
                <div className="text-xs text-[#6B7280]">{user?.email}</div>
                <div className="text-xs text-[#6B7280] mt-1">
                  {currentWorkspace?.name}
                </div>
              </div>

              <div className="py-1">
                <button
                  onClick={handleAccountSettings}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F4F5F7] text-[#0A0A0A] text-sm text-left"
                >
                  <Settings size={16} />
                  Configurações da Conta
                </button>
                <button
                  onClick={handleUsageAndBilling}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F4F5F7] text-[#0A0A0A] text-sm text-left"
                >
                  <CreditCard size={16} />
                  Uso e Cobrança
                </button>
              </div>

              <div className="border-t border-[#E5E7EB] pt-1">
                <a
                  href="/account/logout"
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F4F5F7] text-[#0A0A0A] text-sm"
                >
                  Sair
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {userMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setUserMenuOpen(false)}
        />
      )}
    </div>
  );
}
