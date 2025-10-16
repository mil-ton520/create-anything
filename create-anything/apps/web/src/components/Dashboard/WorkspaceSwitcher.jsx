'use client';

import { useState, useEffect, useRef } from 'react';
import { Building2, ChevronDown, Check, Crown, Plus } from 'lucide-react';

export default function WorkspaceSwitcher({ currentWorkspace, onWorkspaceChange, onCreateWorkspace }) {
  const [isOpen, setIsOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      loadWorkspaces();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadWorkspaces = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/workspaces');
      if (!response.ok) throw new Error('Failed to load workspaces');
      
      const data = await response.json();
      setWorkspaces(data.workspaces || []);
    } catch (error) {
      console.error('Failed to load workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchWorkspace = async (workspace) => {
    try {
      const response = await fetch('/api/workspaces/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: workspace.id }),
      });

      if (!response.ok) throw new Error('Failed to switch workspace');

      onWorkspaceChange(workspace);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to switch workspace:', error);
    }
  };

  const getPlanBadgeColor = (plan) => {
    const colors = {
      free: 'bg-[#E5E7EB] text-[#6B7280]',
      starter: 'bg-blue-100 text-blue-700',
      pro: 'bg-[#FF7A1A] bg-opacity-10 text-[#FF7A1A]',
      enterprise: 'bg-purple-100 text-purple-700',
    };
    return colors[plan] || colors.free;
  };

  const getPlanLabel = (plan) => {
    return plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : 'Free';
  };

  const getMemberCount = (workspace) => {
    return workspace.member_count || 1;
  };

  const isOwner = (workspace) => {
    return workspace.role === 'owner';
  };

  const truncateName = (name, maxLength = 20) => {
    return name.length > maxLength ? name.substring(0, maxLength) + '...' : name;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F4F5F7] transition-colors border border-[#E5E7EB]"
      >
        <Building2 size={16} className="text-[#6B7280]" />
        <span className="text-sm font-medium text-[#0A0A0A]">
          {currentWorkspace ? truncateName(currentWorkspace.name) : 'Select Workspace'}
        </span>
        <ChevronDown size={16} className={`text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[280px] max-h-[400px] bg-white rounded-lg shadow-xl border border-[#E5E7EB] overflow-hidden z-50">
          <div className="p-3 border-b border-[#E5E7EB]">
            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">My Workspaces</p>
          </div>

          <div className="overflow-y-auto max-h-[300px]">
            {loading ? (
              <div className="p-4 text-center text-sm text-[#6B7280]">Loading...</div>
            ) : workspaces.length === 0 ? (
              <div className="p-4 text-center text-sm text-[#6B7280]">No workspaces found</div>
            ) : (
              workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => handleSwitchWorkspace(workspace)}
                  className={`w-full px-3 py-2.5 flex items-center gap-3 hover:bg-[#F4F5F7] transition-colors ${
                    currentWorkspace?.id === workspace.id ? 'bg-[#F4F5F7]' : ''
                  }`}
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[#0A0A0A] truncate max-w-[150px]">
                        {workspace.name}
                      </p>
                      {isOwner(workspace) && (
                        <Crown size={12} className="text-[#FF7A1A]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded ${getPlanBadgeColor(workspace.plan)}`}>
                        {getPlanLabel(workspace.plan)}
                      </span>
                      <span className="text-xs text-[#6B7280]">
                        {getMemberCount(workspace)} member{getMemberCount(workspace) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  {currentWorkspace?.id === workspace.id && (
                    <Check size={16} className="text-[#FF7A1A]" />
                  )}
                </button>
              ))
            )}
          </div>

          <div className="p-2 border-t border-[#E5E7EB]">
            <button
              onClick={() => {
                setIsOpen(false);
                onCreateWorkspace();
              }}
              className="w-full px-3 py-2 flex items-center gap-2 rounded-lg hover:bg-[#F4F5F7] transition-colors"
            >
              <Plus size={16} className="text-[#FF7A1A]" />
              <span className="text-sm font-medium text-[#FF7A1A]">Create New Workspace</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
