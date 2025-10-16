'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function CreateWorkspaceModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    if (!loading) {
      setName('');
      setDescription('');
      setError('');
      onClose();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 3) {
      setError('Workspace name must be at least 3 characters');
      return;
    }

    if (name.trim().length > 100) {
      setError('Workspace name must be less than 100 characters');
      return;
    }

    const nameRegex = /^[a-zA-Z0-9\s_-]+$/;
    if (!nameRegex.test(name.trim())) {
      setError('Name can only contain letters, numbers, spaces, hyphens, and underscores');
      return;
    }

    if (description.length > 500) {
      setError('Description must be less than 500 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/workspaces/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create workspace');
      }

      const data = await response.json();
      onSuccess(data.workspace);
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[500px] animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-[#0A0A0A]">Create New Workspace</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-[#6B7280] hover:text-[#0A0A0A] transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="workspace-name" className="block text-sm font-medium text-[#0A0A0A] mb-2">
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              id="workspace-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Marketing Team"
              className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors"
              disabled={loading}
              maxLength={100}
            />
            <p className="text-xs text-[#6B7280] mt-1 text-right">{name.length}/100</p>
          </div>

          <div>
            <label htmlFor="workspace-description" className="block text-sm font-medium text-[#0A0A0A] mb-2">
              Description
            </label>
            <textarea
              id="workspace-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this workspace..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] focus:border-[#FF7A1A] focus:ring-2 focus:ring-[#FF7A1A] focus:ring-opacity-20 outline-none transition-colors resize-none"
              disabled={loading}
              maxLength={500}
            />
            <p className="text-xs text-[#6B7280] mt-1 text-right">{description.length}/500</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-lg border border-[#E5E7EB] text-[#0A0A0A] font-medium hover:bg-[#F4F5F7] transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || name.trim().length < 3}
              className="flex-1 px-4 py-3 rounded-lg bg-[#FF7A1A] text-white font-semibold hover:bg-[#E6691A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out, zoom-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
