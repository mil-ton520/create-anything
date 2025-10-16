'use client';

import { useState, useEffect } from 'react';
import useUser from '@/utils/useUser';
import { Settings, Users, BarChart3, AlertTriangle, X, Crown, Mail, Trash2, Send } from 'lucide-react';

export default function WorkspaceSettingsPage() {
  const { data: user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState('general');
  const [workspace, setWorkspace] = useState(null);
  const [members, setMembers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // General tab state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');
  
  // Invite modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    if (!userLoading && user) {
      loadWorkspaceData();
    }
  }, [user, userLoading]);

  const loadWorkspaceData = async () => {
    try {
      setLoading(true);
      
      // Load current workspace
      const wsResponse = await fetch('/api/workspaces');
      if (!wsResponse.ok) throw new Error('Failed to load workspace');
      const wsData = await wsResponse.json();
      const currentWorkspace = wsData.workspaces[0];
      
      setWorkspace(currentWorkspace);
      setName(currentWorkspace.name || '');
      setDescription(currentWorkspace.description || '');
      setLogo(currentWorkspace.logo_url || '');

      // Load members
      const membersResponse = await fetch(`/api/workspaces/${currentWorkspace.id}/members`);
      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        setMembers(membersData.members || []);
      }

      // Load pending invites
      const invitesResponse = await fetch(`/api/workspaces/${currentWorkspace.id}/invites`);
      if (invitesResponse.ok) {
        const invitesData = await invitesResponse.json();
        setPendingInvites(invitesData.invites || []);
      }

    } catch (err) {
      console.error('Failed to load workspace data:', err);
      setError('Failed to load workspace data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGeneral = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch(`/api/workspaces/${workspace.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, logo_url: logo }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update workspace');
      }

      setSuccess('Workspace updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSendInvite = async () => {
    setError('');
    setInviteLoading(true);

    try {
      const response = await fetch('/api/workspaces/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workspace_id: workspace.id,
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send invite');
      }

      setSuccess('Invite sent successfully');
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('member');
      loadWorkspaceData(); // Reload to show new invite
    } catch (err) {
      setError(err.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await fetch(`/api/workspaces/${workspace.id}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove member');

      setSuccess('Member removed successfully');
      loadWorkspaceData();
    } catch (err) {
      setError(err.message);
    }
  };

  const canEdit = workspace?.role === 'owner' || workspace?.role === 'admin';
  const isOwner = workspace?.role === 'owner';

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/sign-in';
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <a
            href="/dashboard"
            className="text-[#6B7280] hover:text-[#0A0A0A] mb-4 text-sm flex items-center gap-2 inline-block"
          >
            ← Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-[#0A0A0A]">Workspace Settings</h1>
          <p className="text-[#6B7280] mt-2">{workspace?.name}</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] overflow-hidden">
          <div className="border-b border-[#E5E7EB] flex">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'general'
                  ? 'text-[#FF7A1A] border-b-2 border-[#FF7A1A]'
                  : 'text-[#6B7280] hover:text-[#0A0A0A]'
              }`}
            >
              <Settings size={16} />
              General
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'members'
                  ? 'text-[#FF7A1A] border-b-2 border-[#FF7A1A]'
                  : 'text-[#6B7280] hover:text-[#0A0A0A]'
              }`}
            >
              <Users size={16} />
              Members
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'usage'
                  ? 'text-[#FF7A1A] border-b-2 border-[#FF7A1A]'
                  : 'text-[#6B7280] hover:text-[#0A0A0A]'
              }`}
            >
              <BarChart3 size={16} />
              Usage
            </button>
            {isOwner && (
              <button
                onClick={() => setActiveTab('danger')}
                className={`px-6 py-4 font-medium text-sm flex items-center gap-2 ${
                  activeTab === 'danger'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-[#6B7280] hover:text-red-600'
                }`}
              >
                <AlertTriangle size={16} />
                Danger Zone
              </button>
            )}
          </div>

          <div className="p-6">
            {/* General Tab */}
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                    Workspace Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={!canEdit}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none disabled:bg-[#F4F5F7] disabled:cursor-not-allowed"
                    maxLength={100}
                  />
                  <p className="text-xs text-[#6B7280] mt-1">{name.length}/100</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={!canEdit}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none resize-none disabled:bg-[#F4F5F7] disabled:cursor-not-allowed"
                    maxLength={500}
                  />
                  <p className="text-xs text-[#6B7280] mt-1">{description.length}/500</p>
                </div>

                {canEdit && (
                  <div className="flex gap-3 pt-4">
                    <a
                      href="/dashboard"
                      className="px-6 py-3 rounded-lg border border-[#E5E7EB] text-[#0A0A0A] font-medium hover:bg-[#F4F5F7]"
                    >
                      Cancel
                    </a>
                    <button
                      onClick={handleSaveGeneral}
                      disabled={saving}
                      className="px-6 py-3 rounded-lg bg-[#FF7A1A] text-white font-semibold hover:bg-[#E6691A] disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-[#0A0A0A]">
                      Team Members ({members.length})
                    </h3>
                    {canEdit && (
                      <button
                        onClick={() => setShowInviteModal(true)}
                        className="px-4 py-2 bg-[#FF7A1A] text-white rounded-lg font-medium hover:bg-[#E6691A] flex items-center gap-2"
                      >
                        <Mail size={16} />
                        Invite Member
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-[#F4F5F7] rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {member.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-[#0A0A0A]">{member.name}</p>
                              {member.role === 'owner' && (
                                <Crown size={14} className="text-[#FF7A1A]" />
                              )}
                            </div>
                            <p className="text-sm text-[#6B7280]">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-[#6B7280] border border-[#E5E7EB]">
                            {member.role}
                          </span>
                          {canEdit && member.role !== 'owner' && member.id !== user.id && (
                            <button
                              onClick={() => handleRemoveMember(member.id)}
                              className="p-2 text-[#6B7280] hover:text-red-600 hover:bg-white rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {pendingInvites.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-[#0A0A0A] mb-4">
                      Pending Invitations ({pendingInvites.length})
                    </h3>
                    <div className="space-y-3">
                      {pendingInvites.map((invite) => (
                        <div
                          key={invite.id}
                          className="flex items-center justify-between p-4 bg-[#F4F5F7] rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-[#0A0A0A]">{invite.email}</p>
                            <p className="text-sm text-[#6B7280]">
                              Invited {new Date(invite.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-[#6B7280] border border-[#E5E7EB]">
                            {invite.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Usage Tab */}
            {activeTab === 'usage' && (
              <div className="space-y-6">
                <div className="bg-[#F4F5F7] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#0A0A0A] mb-4">Current Plan</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-[#0A0A0A] capitalize">
                        {workspace?.plan || 'Free'} Plan
                      </p>
                      <p className="text-[#6B7280] mt-1">
                        {members.length} / {workspace?.user_limit || '∞'} members
                      </p>
                    </div>
                    <button className="px-6 py-3 bg-[#FF7A1A] text-white rounded-lg font-semibold hover:bg-[#E6691A]">
                      Upgrade Plan
                    </button>
                  </div>
                </div>

                <div className="text-center py-12">
                  <BarChart3 size={48} className="text-[#E5E7EB] mx-auto mb-4" />
                  <p className="text-[#6B7280]">📊 Detailed analytics coming soon</p>
                </div>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && isOwner && (
              <div className="space-y-6">
                <div className="border-2 border-red-200 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <AlertTriangle size={24} className="text-red-600 mt-1" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-600 mb-2">
                        Delete Workspace
                      </h3>
                      <p className="text-[#6B7280] mb-4">
                        Once you delete a workspace, there is no going back. All data, conversations, and settings will be permanently deleted.
                      </p>
                      <button className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700">
                        Delete Workspace
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowInviteModal(false)} />
          
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
              <h2 className="text-xl font-bold text-[#0A0A0A]">Invite Team Member</h2>
              <button onClick={() => setShowInviteModal(false)} className="text-[#6B7280] hover:text-[#0A0A0A]">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none"
                >
                  <option value="member">Member - Can use workspace</option>
                  <option value="admin">Admin - Can manage settings</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#E5E7EB] text-[#0A0A0A] font-medium hover:bg-[#F4F5F7]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvite}
                  disabled={inviteLoading || !inviteEmail}
                  className="flex-1 px-4 py-3 rounded-lg bg-[#FF7A1A] text-white font-semibold hover:bg-[#E6691A] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send size={16} />
                  {inviteLoading ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
