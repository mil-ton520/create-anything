import { useState, useRef } from "react";
import { 
  FileText, 
  Info, 
  FolderOpen, 
  FileCode, 
  Users,
  X,
  ChevronRight,
  ChevronDown,
  Bold,
  Italic,
  List,
  Image,
  Download,
  Edit,
  Trash2,
  Star,
  Copy,
  Tag,
  Clock,
  Archive,
  MoreHorizontal,
  Plus,
  Search
} from "lucide-react";

export function UtilityTray({
  collapsed,
  selectedTab,
  setSelectedTab,
  currentConversation,
  messages,
  currentWorkspace,
  user
}) {
  const [documentContent, setDocumentContent] = useState("");
  const [conversationTitle, setConversationTitle] = useState(currentConversation?.title || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [conversationTags, setConversationTags] = useState(currentConversation?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [searchFiles, setSearchFiles] = useState("");
  const [searchPrompts, setSearchPrompts] = useState("");

  const tabs = [
    { id: "document", label: "Document", icon: FileText },
    { id: "info", label: "Info", icon: Info },
    { id: "files", label: "Files", icon: FolderOpen },
    { id: "prompts", label: "Prompts", icon: FileCode },
    { id: "team", label: "Team", icon: Users, badge: "PRO" }
  ];

  const sampleFiles = [
    {
      id: 1,
      name: "Marketing Analysis.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedAt: "2024-10-13T10:30:00Z",
      thumbnail: "/api/placeholder/80/80"
    },
    {
      id: 2,
      name: "Q3 Data.xlsx",
      type: "excel",
      size: "1.8 MB",
      uploadedAt: "2024-10-13T09:15:00Z",
      thumbnail: null
    },
    {
      id: 3,
      name: "Brand Guidelines.png",
      type: "image",
      size: "850 KB",
      uploadedAt: "2024-10-12T16:45:00Z",
      thumbnail: "/api/placeholder/80/80"
    }
  ];

  const samplePrompts = [
    {
      id: 1,
      title: "Marketing Copy Generator",
      content: "Create compelling marketing copy for {{product}} targeting {{audience}}. Focus on benefits and include a strong call-to-action.",
      tags: ["marketing", "copywriting"],
      lastUsed: "2024-10-13T10:30:00Z",
      starred: true
    },
    {
      id: 2,
      title: "Data Analysis Report",
      content: "Analyze the following data and provide insights about trends, patterns, and recommendations for {{business_area}}.",
      tags: ["analysis", "data"],
      lastUsed: "2024-10-12T14:20:00Z",
      starred: false
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: "João Silva",
      email: "joao@company.com",
      role: "Admin",
      status: "online",
      avatar: "JS",
      lastActive: "Active now"
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria@company.com",
      role: "Member",
      status: "offline",
      avatar: "MS",
      lastActive: "2 hours ago"
    }
  ];

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    // Save title to API
    console.log("Saving title:", conversationTitle);
  };

  const addTag = () => {
    if (newTag.trim() && !conversationTags.includes(newTag.trim())) {
      setConversationTags([...conversationTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setConversationTags(conversationTags.filter(tag => tag !== tagToRemove));
  };

  if (collapsed) {
    return null;
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "agora";
    if (diffInMinutes < 60) return `há ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `há ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString("pt-PT");
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf": return "📄";
      case "excel": return "📊";
      case "image": return "🖼️";
      default: return "📁";
    }
  };

  return (
    <div className="w-80 bg-[#F4F5F7] border-l border-[#E5E7EB] flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-[#E5E7EB] bg-white">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-3 px-2 text-xs font-medium transition-colors duration-150 ${
                selectedTab === tab.id
                  ? "border-b-2 border-[#FF7A1A] text-[#FF7A1A]"
                  : "text-[#6B7280] hover:text-[#0A0A0A]"
              }`}
            >
              <Icon size={14} />
              <span className="hidden lg:block">{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-1 py-0.5 bg-[#FF7A1A] text-white text-xs rounded">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Document Tab */}
        {selectedTab === "document" && (
          <div className="p-4 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0A0A0A]">Document Editor</h3>
              <div className="flex gap-1">
                <button className="p-1.5 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-white rounded" title="Bold">
                  <Bold size={14} />
                </button>
                <button className="p-1.5 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-white rounded" title="Italic">
                  <Italic size={14} />
                </button>
                <button className="p-1.5 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-white rounded" title="List">
                  <List size={14} />
                </button>
                <button className="p-1.5 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-white rounded" title="Image">
                  <Image size={14} />
                </button>
              </div>
            </div>
            
            <textarea
              value={documentContent}
              onChange={(e) => setDocumentContent(e.target.value)}
              placeholder="Start writing your document here..."
              className="flex-1 w-full p-3 bg-white border border-[#E5E7EB] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] text-sm"
            />
            
            <div className="flex gap-2 mt-4">
              <button className="flex-1 px-3 py-2 bg-[#FF7A1A] text-white rounded-lg text-sm font-medium hover:bg-[#E6691A] transition-colors duration-150">
                Save
              </button>
              <button className="px-3 py-2 bg-white border border-[#E5E7EB] text-[#6B7280] rounded-lg text-sm hover:bg-[#F4F5F7] transition-colors duration-150">
                <Download size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Info Tab */}
        {selectedTab === "info" && (
          <div className="p-4 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                Conversation Title
              </label>
              {isEditingTitle ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={conversationTitle}
                    onChange={(e) => setConversationTitle(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleTitleSave();
                      if (e.key === "Escape") setIsEditingTitle(false);
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleTitleSave}
                    className="px-3 py-2 bg-[#FF7A1A] text-white rounded-lg text-sm hover:bg-[#E6691A]"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="flex-1 text-sm text-[#0A0A0A]">
                    {conversationTitle || "Untitled Conversation"}
                  </span>
                  <button
                    onClick={() => setIsEditingTitle(true)}
                    className="p-1 text-[#6B7280] hover:text-[#0A0A0A] rounded"
                  >
                    <Edit size={14} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                Created
              </label>
              <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                <Clock size={14} />
                {currentConversation?.created_at 
                  ? new Date(currentConversation.created_at).toLocaleDateString("pt-PT", {
                      year: "numeric",
                      month: "long", 
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })
                  : "Unknown"
                }
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                Last Modified
              </label>
              <div className="text-sm text-[#6B7280]">
                {currentConversation?.updated_at 
                  ? formatTimestamp(currentConversation.updated_at)
                  : "Unknown"
                }
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-2">
                Model History
              </label>
              <div className="space-y-2">
                {messages?.reduce((models, message) => {
                  if (message.model_used && !models.find(m => m.name === message.model_used)) {
                    models.push({
                      name: message.model_used,
                      count: messages.filter(m => m.model_used === message.model_used).length
                    });
                  }
                  return models;
                }, []).map((model, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-[#0A0A0A]">{model.name}</span>
                    <span className="text-[#6B7280]">{model.count} messages</span>
                  </div>
                )) || []}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#0A0A0A]">
                  Tags
                </label>
                <button
                  onClick={addTag}
                  className="text-[#FF7A1A] hover:text-[#E6691A] text-sm"
                  disabled={!newTag.trim()}
                >
                  Add
                </button>
              </div>
              
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] mb-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTag();
                }}
              />
              
              <div className="flex flex-wrap gap-1">
                {conversationTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#FF7A1A] text-white text-xs rounded-lg"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-200"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#FF7A1A] text-white rounded-lg text-sm font-medium hover:bg-[#E6691A] transition-colors duration-150">
                <Archive size={14} className="inline mr-2" />
                Archive
              </button>
              <button className="px-3 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors duration-150">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Files Tab */}
        {selectedTab === "files" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0A0A0A]">Attached Files</h3>
              <button className="p-2 bg-[#FF7A1A] text-white rounded-lg hover:bg-[#E6691A] transition-colors duration-150">
                <Plus size={14} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                value={searchFiles}
                onChange={(e) => setSearchFiles(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]"
              />
            </div>

            <div className="space-y-3">
              {sampleFiles.filter(file => 
                file.name.toLowerCase().includes(searchFiles.toLowerCase())
              ).map((file) => (
                <div key={file.id} className="p-3 bg-white border border-[#E5E7EB] rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#F4F5F7] rounded-lg flex items-center justify-center">
                      <span className="text-lg">{getFileIcon(file.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#0A0A0A] text-sm truncate">
                        {file.name}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        {file.size} • {formatTimestamp(file.uploadedAt)}
                      </div>
                    </div>
                    <div className="relative">
                      <button className="p-1 text-[#6B7280] hover:text-[#0A0A0A] rounded">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Prompts Tab */}
        {selectedTab === "prompts" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0A0A0A]">Saved Prompts</h3>
              <button className="p-2 bg-[#FF7A1A] text-white rounded-lg hover:bg-[#E6691A] transition-colors duration-150">
                <Plus size={14} />
              </button>
            </div>

            <div className="relative mb-4">
              <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6B7280]" />
              <input
                type="text"
                value={searchPrompts}
                onChange={(e) => setSearchPrompts(e.target.value)}
                placeholder="Search prompts..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF7A1A]"
              />
            </div>

            <div className="space-y-3">
              {samplePrompts.filter(prompt => 
                prompt.title.toLowerCase().includes(searchPrompts.toLowerCase()) ||
                prompt.content.toLowerCase().includes(searchPrompts.toLowerCase())
              ).map((prompt) => (
                <div key={prompt.id} className="p-3 bg-white border border-[#E5E7EB] rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-medium text-[#0A0A0A] text-sm">
                      {prompt.title}
                    </div>
                    <div className="flex gap-1">
                      <button className={`p-1 rounded ${prompt.starred ? 'text-yellow-500' : 'text-[#6B7280] hover:text-yellow-500'}`}>
                        <Star size={12} fill={prompt.starred ? 'currentColor' : 'none'} />
                      </button>
                      <button className="p-1 text-[#6B7280] hover:text-[#0A0A0A] rounded">
                        <MoreHorizontal size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-xs text-[#6B7280] mb-2 line-clamp-2">
                    {prompt.content}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {prompt.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-0.5 bg-[#F4F5F7] text-[#6B7280] text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {formatTimestamp(prompt.lastUsed)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {selectedTab === "team" && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[#0A0A0A]">Team Members</h3>
              <span className="px-2 py-1 bg-[#FF7A1A] text-white text-xs rounded font-medium">
                PRO
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-white border border-[#E5E7EB] rounded-lg">
                  <div className="relative">
                    <div className="w-8 h-8 bg-[#FF7A1A] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {member.avatar}
                      </span>
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      member.status === "online" ? "bg-green-500" : "bg-[#E5E7EB]"
                    }`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[#0A0A0A] text-sm truncate">
                      {member.name}
                    </div>
                    <div className="text-xs text-[#6B7280]">
                      {member.role} • {member.lastActive}
                    </div>
                  </div>
                  
                  <button className="p-1 text-[#6B7280] hover:text-[#0A0A0A] rounded">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-gradient-to-r from-[#FF7A1A] to-[#E6691A] rounded-lg text-white">
              <h4 className="font-semibold mb-2">Upgrade to Business</h4>
              <p className="text-sm opacity-90 mb-3">
                Collaborate with your team, share prompts, and track usage across members.
              </p>
              <button className="w-full px-3 py-2 bg-white text-[#FF7A1A] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors duration-150">
                Upgrade Now
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resize Handle */}
      <div className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-[#FF7A1A] transition-colors duration-150" />
    </div>
  );
}