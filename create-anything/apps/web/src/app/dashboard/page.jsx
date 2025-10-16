"use client";

import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";
import { useDashboard } from "@/hooks/useDashboard";
import { useChat } from "@/hooks/useChat";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { useSavedPrompts } from "@/hooks/useSavedPrompts";
import { Sidebar } from "@/components/Dashboard/Sidebar";
import { TopBar } from "@/components/Dashboard/TopBar";
import { WelcomeScreen } from "@/components/Dashboard/WelcomeScreen";
import { MessageList } from "@/components/Dashboard/MessageList";
import { ChatInput } from "@/components/Dashboard/ChatInput";
import { SavePromptModal } from "@/components/Dashboard/SavePromptModal";
import { CreatePersonaModal } from "@/components/Dashboard/CreatePersonaModal";
import CreateWorkspaceModal from "@/components/Dashboard/CreateWorkspaceModal";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { models } from "@/constants/models";
import { placeholders } from "@/constants/placeholders";

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [createPersonaModal, setCreatePersonaModal] = useState(false);
  const [createWorkspaceModal, setCreateWorkspaceModal] = useState(false);
  const [savePromptModal, setSavePromptModal] = useState({
    isOpen: false,
    content: "",
  });
  const [errorState, setErrorState] = useState(null);

  // Dashboard state with error boundary
  const dashboardState = useDashboard(user, userLoading);
  const {
    currentWorkspace,
    conversations,
    currentConversation,
    messages,
    setMessages,
    createNewConversation,
    selectConversation,
    startNewChat,
    isLoadingWorkspace,
    loadConversations,
  } = dashboardState || {};

  // Chat state with error boundary
  const chatState = useChat();
  const {
    input,
    setInput,
    selectedModel,
    setSelectedModel,
    isLoading,
    attachedFiles,
    handleFileSelect,
    removeFile,
    sendMessage,
  } = chatState || {};

  // Audio recording with error boundary
  const audioState = useAudioRecording();
  const { isRecording, startRecording, stopRecording } = audioState || {};

  // Saved prompts with error boundary
  const promptsState = useSavedPrompts(currentWorkspace?.id);
  const { savedPrompts, savePrompt, deletePrompt } = promptsState || {};

  // Error boundary effect
  useEffect(() => {
    const handleError = (error) => {
      console.error("Dashboard error:", error);
      setErrorState("Something went wrong. Please refresh the page.");
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectConversation = (conversation) => {
    if (selectConversation) {
      selectConversation(conversation);
      setSidebarOpen(false);
    }
  };

  const handleStartNewChat = () => {
    if (startNewChat) {
      startNewChat();
      setSidebarOpen(false);
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      console.log(`🗑️ Deleting conversation ${conversationId}`);

      const response = await fetch(`/api/conversations/${conversationId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      console.log("Delete response:", data);

      if (response.ok) {
        console.log("✅ Conversation deleted successfully");

        // Update local state immediately for better UX
        if (conversations) {
          const updatedConversations = conversations.filter(
            (conv) => conv.id !== conversationId,
          );
          // Force update the conversations state if possible
          console.log(
            `📝 Updated local state: ${updatedConversations.length} conversations remaining`,
          );
        }

        // If the deleted conversation was the current one, clear it
        if (currentConversation?.id === conversationId) {
          startNewChat();
        }

        // Reload conversations to reflect the deletion from server
        if (loadConversations) {
          await loadConversations();
        }
      } else {
        console.error("❌ Delete failed:", data.error);
        alert(
          `Erro ao eliminar conversa: ${data.error || "Erro desconhecido"}`,
        );
      }
    } catch (error) {
      console.error("❌ Failed to delete conversation:", error);
      alert(`Erro ao eliminar conversa: ${error.message}`);
    }
  };

  const handleCreatePersona = () => {
    setCreatePersonaModal(true);
  };

  const handlePersonaCreated = (newPersona) => {
    // Optionally set the newly created persona as active
    setSelectedPersona(newPersona);
    // Refresh personas list if needed
  };

  const handleWorkspaceChange = async (workspace) => {
    // Reload the page to switch workspace context
    window.location.reload();
  };

  const handleCreateWorkspace = () => {
    setCreateWorkspaceModal(true);
  };

  const handleWorkspaceCreated = async (workspace) => {
    // Switch to the new workspace and reload
    await fetch("/api/workspaces/switch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workspace_id: workspace.id }),
    });
    window.location.reload();
  };

  const handleSendMessage = () => {
    if (sendMessage && createNewConversation && setMessages) {
      sendMessage(
        currentConversation,
        createNewConversation,
        messages,
        setMessages,
      );
    }
  };

  const copyMessage = (content) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content);
    }
  };

  const handleSavePrompt = (content) => {
    setSavePromptModal({ isOpen: true, content });
  };

  const handleSavePromptConfirm = async (title, content) => {
    if (savePrompt) {
      await savePrompt(title, content);
    }
    setSavePromptModal({ isOpen: false, content: "" });
  };

  const handleUsePrompt = (content) => {
    if (setInput) {
      setInput(content);
    }
  };

  const selectedModelData =
    models.find((m) => m.id === selectedModel) || models[0];

  // Error state
  if (errorState) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">!</span>
          </div>
          <h1 className="text-xl font-semibold text-[#0A0A0A] mb-2">
            Something went wrong
          </h1>
          <p className="text-[#6B7280] mb-4">{errorState}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#FF7A1A] text-white rounded-lg font-semibold hover:bg-[#E6691A] transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (userLoading || isLoadingWorkspace) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-[#6B7280]">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/account/signin";
    }
    return null;
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Newsreader:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <div
        className="h-screen bg-[#1a1a1a] flex overflow-hidden"
        style={{ fontFamily: "Inter, system-ui, sans-serif" }}
      >
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          conversations={conversations || []}
          currentConversation={currentConversation}
          currentWorkspace={currentWorkspace}
          user={user}
          onSelectConversation={handleSelectConversation}
          onStartNewChat={handleStartNewChat}
          onDeleteConversation={handleDeleteConversation}
          formatTimestamp={formatTimestamp}
          savedPrompts={savedPrompts || []}
          onSavePrompt={handleSavePrompt}
          onDeletePrompt={deletePrompt}
          onUsePrompt={handleUsePrompt}
        />

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col bg-[#1a1a1a] relative">
          {/* Model selector in top-right */}
          <div className="absolute top-6 right-6 z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#2d2d2d] rounded-lg px-3 py-2 border border-[#404040]">
                <span className="text-[#e5e5e5] text-sm">
                  {selectedModelData?.name || "Auto"}
                </span>
                <button className="text-[#999] hover:text-[#e5e5e5]">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <button className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center hover:bg-[#E6691A] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3v10M3 8h10"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 flex flex-col">
            {!messages || messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="max-w-2xl w-full px-6">
                  <WelcomeScreen
                    userName={user?.name}
                    input={input || ""}
                    setInput={setInput}
                    selectedModel={selectedModel || "auto"}
                    setSelectedModel={setSelectedModel}
                    selectedPersona={selectedPersona}
                    setSelectedPersona={setSelectedPersona}
                    workspaceId={currentWorkspace?.id}
                    models={models}
                    attachedFiles={attachedFiles || []}
                    handleFileSelect={handleFileSelect}
                    removeFile={removeFile}
                    isRecording={isRecording || false}
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading || false}
                    placeholders={placeholders}
                    placeholderIndex={placeholderIndex}
                    onCreatePersona={handleCreatePersona}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  <div className="max-w-4xl mx-auto px-6 py-6">
                    <MessageList
                      messages={messages}
                      selectedModelData={selectedModelData}
                      copyMessage={copyMessage}
                      onSavePrompt={handleSavePrompt}
                    />
                  </div>
                </div>
                <div className="border-t border-[#2d2d2d]">
                  <div className="max-w-4xl mx-auto px-6">
                    <ChatInput
                      input={input || ""}
                      setInput={setInput}
                      selectedModel={selectedModel || "auto"}
                      setSelectedModel={setSelectedModel}
                      selectedPersona={selectedPersona}
                      setSelectedPersona={setSelectedPersona}
                      workspaceId={currentWorkspace?.id}
                      models={models}
                      attachedFiles={attachedFiles || []}
                      handleFileSelect={handleFileSelect}
                      removeFile={removeFile}
                      isRecording={isRecording || false}
                      startRecording={startRecording}
                      stopRecording={stopRecording}
                      onSendMessage={handleSendMessage}
                      isLoading={isLoading || false}
                      placeholders={placeholders}
                      placeholderIndex={placeholderIndex}
                      onCreatePersona={handleCreatePersona}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <SavePromptModal
        isOpen={savePromptModal.isOpen}
        onClose={() => setSavePromptModal({ isOpen: false, content: "" })}
        onSave={handleSavePromptConfirm}
        promptContent={savePromptModal.content}
      />

      <CreatePersonaModal
        isOpen={createPersonaModal}
        onClose={() => setCreatePersonaModal(false)}
        onSave={handlePersonaCreated}
        workspaceId={currentWorkspace?.id}
      />

      <CreateWorkspaceModal
        isOpen={createWorkspaceModal}
        onClose={() => setCreateWorkspaceModal(false)}
        onSuccess={handleWorkspaceCreated}
      />
    </>
  );
}
