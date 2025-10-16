import { useState } from "react";
import {
  Plus,
  X,
  MessageSquare,
  Bookmark,
  Trash2,
  UserPlus,
  MoreHorizontal,
  FolderPlus,
  Zap,
  Settings,
  LogOut,
  User,
} from "lucide-react";

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  conversations = [],
  currentConversation,
  currentWorkspace,
  user,
  onSelectConversation,
  onStartNewChat,
  onDeleteConversation,
  formatTimestamp,
  savedPrompts = [],
  onUsePrompt,
  onDeletePrompt,
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [conversationMenuOpen, setConversationMenuOpen] = useState(null);

  const handleDeleteConversation = async (conversationId, e) => {
    e.stopPropagation();
    if (window.confirm("Tem certeza que deseja eliminar esta conversa?")) {
      if (onDeleteConversation) {
        await onDeleteConversation(conversationId);
      }
    }
    setConversationMenuOpen(null);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-[#2d2d2d] border-r border-[#404040]">
          {/* Header */}
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-[#e5e5e5] font-semibold text-lg">
                  {currentWorkspace?.name || "EuroAI Hub"}
                </span>
              </div>
            </div>

            {/* New Chat Button */}
            <div className="px-4 mb-6">
              <button
                onClick={onStartNewChat}
                className="w-full flex items-center gap-3 px-3 py-2 bg-[#FF7A1A] hover:bg-[#E6691A] rounded-lg transition-colors"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <Plus size={16} className="text-white" />
                </div>
                <span className="text-white font-medium">Novo bate-papo</span>
              </button>
            </div>

            {/* Navigation */}
            <div className="px-4 mb-6">
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 text-[#e5e5e5] bg-[#404040] rounded-lg transition-colors text-left">
                  <MessageSquare size={16} />
                  <span>Conversas</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-[#999] hover:bg-[#404040] hover:text-[#e5e5e5] rounded-lg transition-colors text-left">
                  <FolderPlus size={16} />
                  <span>Projetos</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-[#999] hover:bg-[#404040] hover:text-[#e5e5e5] rounded-lg transition-colors text-left">
                  <Zap size={16} />
                  <span>Artefatos</span>
                </button>
              </nav>
            </div>

            {/* Recent Conversations */}
            <div className="px-4 flex-1 overflow-y-auto">
              <div className="mb-3">
                <h3 className="text-[#999] text-xs font-medium uppercase tracking-wider px-3">
                  Recentes
                </h3>
              </div>
              <div className="space-y-1">
                {conversations.slice(0, 15).map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={currentConversation?.id === conversation.id}
                    onSelect={onSelectConversation}
                    onDelete={onDeleteConversation}
                    formatTimestamp={formatTimestamp}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex-shrink-0 flex border-t border-[#404040] p-4 relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 text-left hover:bg-[#404040] rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center flex-shrink-0">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[#e5e5e5] text-sm font-medium truncate">
                  {user?.name || "Usuário"}
                </div>
                <div className="text-[#999] text-xs">Plano Pro</div>
              </div>
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-[#2d2d2d] border border-[#404040] rounded-lg shadow-lg z-50">
                <div className="py-1">
                  <a
                    href="/account/settings"
                    className="flex items-center gap-3 px-3 py-2 text-[#e5e5e5] hover:bg-[#404040] text-sm"
                  >
                    <Settings size={14} />
                    <span>Configurações</span>
                  </a>
                  <a
                    href="/account/logout"
                    className="flex items-center gap-3 px-3 py-2 text-[#e5e5e5] hover:bg-[#404040] text-sm"
                  >
                    <LogOut size={14} />
                    <span>Sair</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-[#2d2d2d] border-r border-[#404040] transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#404040]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <span className="text-[#e5e5e5] font-semibold text-lg">
                {currentWorkspace?.name || "EuroAI Hub"}
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-[#999] hover:text-[#e5e5e5]"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* New Chat Button */}
            <button
              onClick={onStartNewChat}
              className="w-full flex items-center gap-3 px-3 py-2 bg-[#FF7A1A] hover:bg-[#E6691A] rounded-lg transition-colors mb-6"
            >
              <Plus size={16} className="text-white" />
              <span className="text-white font-medium">Novo bate-papo</span>
            </button>

            {/* Navigation */}
            <nav className="space-y-1 mb-6">
              <button className="w-full flex items-center gap-3 px-3 py-2 text-[#e5e5e5] bg-[#404040] rounded-lg transition-colors text-left">
                <MessageSquare size={16} />
                <span>Conversas</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-[#999] hover:bg-[#404040] hover:text-[#e5e5e5] rounded-lg transition-colors text-left">
                <FolderPlus size={16} />
                <span>Projetos</span>
              </button>
              <button className="w-full flex items-center gap-3 px-3 py-2 text-[#999] hover:bg-[#404040] hover:text-[#e5e5e5] rounded-lg transition-colors text-left">
                <Zap size={16} />
                <span>Artefatos</span>
              </button>
            </nav>

            {/* Recent Conversations */}
            <div>
              <h3 className="text-[#999] text-xs font-medium uppercase tracking-wider px-3 mb-3">
                Recentes
              </h3>
              <div className="space-y-1">
                {conversations.slice(0, 15).map((conversation) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                    isActive={currentConversation?.id === conversation.id}
                    onSelect={onSelectConversation}
                    onDelete={onDeleteConversation}
                    formatTimestamp={formatTimestamp}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="border-t border-[#404040] p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-[#e5e5e5] text-sm font-medium">
                  {user?.name || "Usuário"}
                </div>
                <div className="text-[#999] text-xs">Plano Pro</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const ConversationItem = ({
  conversation,
  isActive,
  onSelect,
  onDelete,
  formatTimestamp,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="relative group">
      <button
        onClick={() => onSelect(conversation)}
        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
          isActive
            ? "bg-[#404040] text-[#e5e5e5]"
            : "text-[#999] hover:bg-[#404040] hover:text-[#e5e5e5]"
        }`}
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {conversation.title}
          </div>
          <div className="text-xs opacity-60">
            {formatTimestamp
              ? formatTimestamp(conversation.updated_at)
              : "Agora"}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#555] rounded transition-opacity"
        >
          <MoreHorizontal size={12} />
        </button>
      </button>

      {showMenu && (
        <div className="absolute right-0 top-0 mt-8 bg-[#2d2d2d] border border-[#404040] rounded-lg shadow-lg z-50 min-w-[120px]">
          <button
            onClick={() => {
              onDelete(conversation.id);
              setShowMenu(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-[#404040] text-sm"
          >
            <Trash2 size={12} />
            <span>Excluir</span>
          </button>
        </div>
      )}
    </div>
  );
};
