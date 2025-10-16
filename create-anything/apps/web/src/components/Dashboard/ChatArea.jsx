import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  X, 
  Shield,
  ChevronDown,
  Zap,
  Eye,
  Video,
  AtSign,
  Slash,
  FileText,
  Share2,
  Settings,
  Users
} from "lucide-react";
import { MessageList } from "./MessageList";
import { useChat } from "@/hooks/useChat";
import { useAudioRecording } from "@/hooks/useAudioRecording";
import { placeholders } from "@/constants/placeholders";
import { models } from "@/constants/models";

export function ChatArea({
  currentConversation,
  messages,
  selectedModel,
  selectedPersona,
  personas,
  onModelSelect,
  onPersonaSelect,
  utilityTrayCollapsed,
  setSelectedUtilityTab
}) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [distractionFree, setDistractionFree] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [documentEditorOpen, setDocumentEditorOpen] = useState(false);

  const {
    input,
    setInput,
    isLoading,
    attachedFiles,
    handleFileSelect,
    removeFile,
    sendMessage,
  } = useChat();

  const { isRecording, startRecording, stopRecording } = useAudioRecording();

  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    // This would integrate with the chat hooks
    console.log("Sending message:", input);
    console.log("Attached files:", attachedFiles);
    console.log("Selected model:", selectedModel);
    console.log("Selected persona:", selectedPersona);
  };

  const selectedModelData = models.find(m => m.id === selectedModel) || models[0];

  const getFirstName = (fullName) => {
    if (!fullName) return "aí";
    return fullName.split(" ")[0];
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header - 56px */}
      <div className="h-14 border-b border-[#E5E7EB] flex items-center justify-between px-6">
        {/* Left - Model Selector */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setShowModelSelector(!showModelSelector)}
              className="flex items-center gap-3 px-4 py-2 bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors duration-150"
            >
              <span className="text-lg">{selectedModelData.icon}</span>
              <div className="text-left">
                <div className="font-semibold text-[#0A0A0A] text-sm">
                  {selectedModelData.name}
                </div>
                <div className="text-xs text-[#6B7280]">
                  {selectedModelData.badge}
                </div>
              </div>
              <ChevronDown size={16} className="text-[#6B7280]" />
            </button>

            {showModelSelector && (
              <div className="absolute top-full left-0 mt-2 w-96 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-4 z-20">
                <div className="px-4 mb-4">
                  <div className="flex gap-2 mb-4">
                    <button className="px-3 py-1.5 bg-[#FF7A1A] text-white rounded-lg text-sm font-medium">
                      Text
                    </button>
                    <button className="px-3 py-1.5 bg-[#F4F5F7] text-[#6B7280] rounded-lg text-sm font-medium hover:bg-[#E5E7EB]">
                      Vision
                    </button>
                    <button className="px-3 py-1.5 bg-[#F4F5F7] text-[#6B7280] rounded-lg text-sm font-medium hover:bg-[#E5E7EB]">
                      Video
                    </button>
                    <button className="px-3 py-1.5 bg-[#F4F5F7] text-[#6B7280] rounded-lg text-sm font-medium hover:bg-[#E5E7EB]">
                      All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 px-4">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        onModelSelect(model.id);
                        setShowModelSelector(false);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-150 text-left ${
                        selectedModel === model.id
                          ? "border-[#FF7A1A] bg-orange-50"
                          : "border-[#E5E7EB] hover:border-[#FF7A1A]"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{model.icon}</span>
                        <div className="font-semibold text-[#0A0A0A] text-sm">
                          {model.name}
                        </div>
                        <div className="ml-auto">
                          {model.badge === "Rápido" && <Zap size={12} className="text-green-500" />}
                          {model.badge === "Poderoso" && <span className="text-xs">💎</span>}
                        </div>
                      </div>
                      <div className="text-xs text-[#6B7280] mb-2">
                        {model.description}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="px-2 py-1 bg-[#FF7A1A] text-white text-xs rounded">
                          {model.badge}
                        </div>
                        <div className="text-xs text-[#6B7280]">
                          {model.id === "gpt-4" ? "3x" : model.id === "claude" ? "2x" : "1x"}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Persona Selector */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaSelector(!showPersonaSelector)}
              className="flex items-center gap-2 px-3 py-2 bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg hover:bg-[#E5E7EB] transition-colors duration-150"
            >
              <div className="w-6 h-6 bg-[#FF7A1A] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">
                  {selectedPersona?.name?.charAt(0) || "G"}
                </span>
              </div>
              <span className="text-sm font-medium text-[#0A0A0A]">
                {selectedPersona?.name || "General"}
              </span>
              <ChevronDown size={14} className="text-[#6B7280]" />
            </button>

            {showPersonaSelector && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-2 z-20">
                <div className="px-3 py-2 border-b border-[#E5E7EB]">
                  <div className="text-sm font-semibold text-[#0A0A0A]">
                    Your Personas
                  </div>
                </div>
                
                <div className="max-h-60 overflow-y-auto">
                  {personas?.map((persona) => (
                    <button
                      key={persona.id}
                      onClick={() => {
                        onPersonaSelect(persona);
                        setShowPersonaSelector(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 hover:bg-[#F4F5F7] transition-colors duration-150 ${
                        selectedPersona?.id === persona.id ? "bg-[#F4F5F7]" : ""
                      }`}
                    >
                      <div className="w-8 h-8 bg-[#FF7A1A] rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {persona.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-[#0A0A0A] text-sm">
                          {persona.name}
                        </div>
                        <div className="text-xs text-[#6B7280] truncate">
                          {persona.description}
                        </div>
                      </div>
                    </button>
                  )) || []}
                </div>

                <div className="border-t border-[#E5E7EB] pt-2 px-3">
                  <button className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#F4F5F7] rounded-lg transition-colors duration-150">
                    <div className="w-8 h-8 border-2 border-dashed border-[#E5E7EB] rounded-full flex items-center justify-center">
                      <span className="text-[#6B7280] text-xs">+</span>
                    </div>
                    <span className="text-sm text-[#6B7280]">Create Persona</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - View Options */}
        <div className="flex items-center gap-2">
          {/* Document Editor Toggle */}
          <button
            onClick={() => {
              setDocumentEditorOpen(!documentEditorOpen);
              setSelectedUtilityTab("document");
            }}
            className={`p-2 rounded-lg transition-colors duration-150 ${
              documentEditorOpen 
                ? "bg-[#FF7A1A] text-white" 
                : "text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#F4F5F7]"
            }`}
            title="Toggle Document Editor"
          >
            <FileText size={16} />
          </button>

          {/* Share */}
          <button
            onClick={() => setShowShareModal(true)}
            className="p-2 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#F4F5F7] rounded-lg transition-colors duration-150"
            title="Share Conversation"
          >
            <Share2 size={16} />
          </button>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => setShowViewMenu(!showViewMenu)}
              className="p-2 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#F4F5F7] rounded-lg transition-colors duration-150"
              title="View Options"
            >
              <Settings size={16} />
            </button>

            {showViewMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-2 z-20">
                <div className="px-3 py-2 border-b border-[#E5E7EB]">
                  <div className="text-sm font-semibold text-[#0A0A0A]">
                    View Options
                  </div>
                </div>
                
                <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#F4F5F7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={documentEditorOpen}
                    onChange={(e) => setDocumentEditorOpen(e.target.checked)}
                    className="rounded border-[#E5E7EB]"
                  />
                  <span className="text-sm text-[#0A0A0A]">Document Editor</span>
                </label>
                
                <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#F4F5F7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={distractionFree}
                    onChange={(e) => setDistractionFree(e.target.checked)}
                    className="rounded border-[#E5E7EB]"
                  />
                  <span className="text-sm text-[#0A0A0A]">Distraction Free</span>
                </label>
                
                <label className="flex items-center gap-3 px-3 py-2 hover:bg-[#F4F5F7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showMetadata}
                    onChange={(e) => setShowMetadata(e.target.checked)}
                    className="rounded border-[#E5E7EB]"
                  />
                  <span className="text-sm text-[#0A0A0A]">Show Metadata</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          {!currentConversation ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#FF7A1A] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">AI</span>
              </div>
              <h2 
                className="text-5xl font-bold text-[#0A0A0A] mb-4 leading-tight"
                style={{ fontFamily: "Newsreader, serif" }}
              >
                Olá {getFirstName("User")}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-[#F4F5F7] rounded-xl text-left">
                  <div className="text-[#FF7A1A] mb-2">💡</div>
                  <h3 className="font-semibold text-[#0A0A0A] text-sm mb-1">
                    Análise de dados
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Interprete dados e gere insights para o seu negócio
                  </p>
                </div>
                <div className="p-4 bg-[#F4F5F7] rounded-xl text-left">
                  <div className="text-[#FF7A1A] mb-2">🚀</div>
                  <h3 className="font-semibold text-[#0A0A0A] text-sm mb-1">
                    Estratégia
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Desenvolva planos de marketing e crescimento
                  </p>
                </div>
                <div className="p-4 bg-[#F4F5F7] rounded-xl text-left">
                  <div className="text-[#FF7A1A] mb-2">💻</div>
                  <h3 className="font-semibold text-[#0A0A0A] text-sm mb-1">
                    Automatização
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    Crie código e automatize processos
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <MessageList 
              messages={messages} 
              selectedModelData={selectedModelData}
              showMetadata={showMetadata}
            />
          )}
        </div>
      </div>

      {/* Input Bar - 72px expandable to 200px */}
      <div className="border-t border-[#E5E7EB] bg-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Attached files */}
          {attachedFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 bg-[#F4F5F7] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm">
                  <Paperclip size={14} className="text-[#6B7280]" />
                  <span className="text-[#0A0A0A] truncate max-w-[150px]">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-[#6B7280] hover:text-red-500 transition-colors duration-150"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            {/* Input Controls Row */}
            <div className="flex items-center gap-2 mb-3">
              {/* @ Persona */}
              <button className="p-2 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#F4F5F7] rounded-lg transition-colors duration-150" title="@ Persona">
                <AtSign size={16} />
              </button>
              
              {/* / Commands */}
              <button className="p-2 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#F4F5F7] rounded-lg transition-colors duration-150" title="/ Commands">
                <Slash size={16} />
              </button>
              
              {/* File Upload */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#F4F5F7] rounded-lg transition-colors duration-150"
                title="Attach Files"
              >
                <Paperclip size={16} />
              </button>
              
              {/* Voice Input */}
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-lg transition-colors duration-150 ${
                  isRecording
                    ? "bg-red-500 text-white"
                    : "text-[#6B7280] hover:text-[#0A0A0A] hover:bg-[#F4F5F7]"
                }`}
                title={isRecording ? "Stop Recording" : "Voice Input"}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            {/* Main Input */}
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={placeholders[placeholderIndex]}
                rows={1}
                className="w-full min-h-[48px] max-h-[200px] px-4 py-3 pr-12 bg-[#F4F5F7] border border-[#E5E7EB] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:border-transparent transition-all duration-150 text-[#0A0A0A] placeholder-[#6B7280]"
                style={{ 
                  height: "auto",
                  overflowY: "auto"
                }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
                }}
              />
              
              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF7A1A] focus:ring-offset-2 ${
                  (input.trim() || attachedFiles.length > 0) && !isLoading
                    ? "bg-[#FF7A1A] hover:bg-[#E6691A] text-white shadow-lg hover:shadow-xl"
                    : "bg-[#E5E7EB] text-[#6B7280] cursor-not-allowed"
                }`}
              >
                <Send size={16} />
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
            
            {/* Footer Info */}
            <div className="flex items-center justify-between mt-3 text-xs text-[#6B7280]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Shield size={12} className="text-green-500" />
                  <span>Processado na UE • GDPR Compliant</span>
                </div>
                <div>
                  [Model: {selectedModelData.name}] • [Persona: {selectedPersona?.name || "General"}]
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span>Enter para enviar • Shift+Enter para quebra</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}