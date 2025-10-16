import { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus } from "lucide-react";

export function PersonaSelector({ 
  selectedPersona, 
  onPersonaSelect, 
  workspaceId, 
  className = "",
  onCreatePersona 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (workspaceId) {
      fetchPersonas();
    }
  }, [workspaceId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPersonas = async () => {
    if (!workspaceId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/personas?workspace_id=${workspaceId}`);
      const data = await response.json();
      setPersonas(data.personas || []);
    } catch (error) {
      console.error('Failed to fetch personas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaSelect = (persona) => {
    onPersonaSelect(persona);
    setIsOpen(false);
  };

  const getTagColor = (tags) => {
    if (!tags || tags.length === 0) return 'bg-gray-100 text-gray-600';
    
    const tag = tags[0].toLowerCase();
    switch (tag) {
      case 'marketing':
        return 'bg-[#FF7A1A] text-white';
      case 'analysis':
        return 'bg-blue-500 text-white';
      case 'programming':
        return 'bg-green-500 text-white';
      case 'writing':
        return 'bg-purple-500 text-white';
      case 'strategy':
        return 'bg-indigo-500 text-white';
      case 'research':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const displayPersona = selectedPersona || { name: "General", avatar_emoji: "🤖" };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors duration-150"
      >
        <div className="w-6 h-6 bg-[#FF7A1A] rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-xs">
            {displayPersona.avatar_emoji || displayPersona.name?.charAt(0) || "G"}
          </span>
        </div>
        <span className="text-sm font-medium text-[#0A0A0A]">
          {displayPersona.name || "General"}
        </span>
        {selectedPersona && (
          <div className="w-2 h-2 bg-[#FF7A1A] rounded-full"></div>
        )}
        <ChevronDown size={14} className="text-[#6B7280]" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-2 z-20 max-h-[400px] overflow-y-auto">
          <div className="px-3 py-2 border-b border-[#E5E7EB]">
            <div className="text-sm font-semibold text-[#0A0A0A]">
              Your Personas
            </div>
          </div>
          
          {loading ? (
            <div className="px-3 py-4 text-center text-[#6B7280]">
              Loading personas...
            </div>
          ) : (
            <>
              {/* Default General Persona */}
              <button
                onClick={() => handlePersonaSelect(null)}
                className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-[#F4F5F7] transition-colors duration-150 ${
                  !selectedPersona ? "bg-[#F4F5F7]" : ""
                }`}
              >
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">🤖</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-[#0A0A0A] text-sm">
                    General
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    Default AI assistant without specific persona
                  </div>
                </div>
              </button>

              {/* Custom Personas */}
              <div className="max-h-60 overflow-y-auto">
                {personas.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => handlePersonaSelect(persona)}
                    className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-[#F4F5F7] transition-colors duration-150 ${
                      selectedPersona?.id === persona.id ? "bg-[#F4F5F7]" : ""
                    }`}
                  >
                    <div className="w-8 h-8 bg-[#FF7A1A] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {persona.avatar_emoji || persona.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-medium text-[#0A0A0A] text-sm">
                          {persona.name}
                        </div>
                        {persona.tags && persona.tags.length > 0 && (
                          <div className={`px-2 py-0.5 rounded text-xs ${getTagColor(persona.tags)}`}>
                            {persona.tags[0]}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-[#6B7280] truncate">
                        {persona.system_prompt.length > 60 
                          ? persona.system_prompt.substring(0, 60) + "..."
                          : persona.system_prompt
                        }
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Create New Persona */}
              <div className="border-t border-[#E5E7EB] pt-2 px-3">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onCreatePersona?.();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F4F5F7] rounded-lg transition-colors duration-150"
                >
                  <div className="w-8 h-8 border-2 border-dashed border-[#E5E7EB] rounded-full flex items-center justify-center">
                    <Plus size={16} className="text-[#6B7280]" />
                  </div>
                  <span className="text-sm text-[#6B7280]">Create Persona</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}