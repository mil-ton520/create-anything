import { useRef, useState } from "react";
import {
  Paperclip,
  Mic,
  MicOff,
  Send,
  X,
  Plus,
  Clock,
  Code,
  PenTool,
  Target,
  BookOpen,
  User as UserIcon,
} from "lucide-react";

export function WelcomeScreen({
  userName,
  input,
  setInput,
  attachedFiles,
  handleFileSelect,
  removeFile,
  isRecording,
  startRecording,
  stopRecording,
  onSendMessage,
  isLoading,
  placeholders,
  placeholderIndex,
}) {
  const fileInputRef = useRef(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const suggestions = [
    {
      icon: Code,
      label: "Código",
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      icon: PenTool,
      label: "Escrever",
      color: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    {
      icon: Target,
      label: "Estratégias",
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      icon: BookOpen,
      label: "Aprender",
      color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
    {
      icon: UserIcon,
      label: "Assuntos pessoais",
      color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  const getFirstName = (fullName) => {
    if (!fullName) return "aí";
    return fullName.split(" ")[0];
  };

  const handleSuggestionClick = (label) => {
    let prompt = "";
    switch (label) {
      case "Código":
        prompt =
          "Preciso de ajuda com programação. Podes me ajudar a escrever código?";
        break;
      case "Escrever":
        prompt = "Preciso de ajuda para escrever. Podes me ajudar com redação?";
        break;
      case "Estratégias":
        prompt =
          "Preciso de ajuda com estratégias de negócio. Tens algumas sugestões?";
        break;
      case "Aprender":
        prompt = "Quero aprender algo novo. O que sugeres?";
        break;
      case "Assuntos pessoais":
        prompt = "Preciso de conselhos sobre assuntos pessoais.";
        break;
    }
    setInput(prompt);
    setShowSuggestions(false);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (e.target.value && showSuggestions) {
      setShowSuggestions(false);
    } else if (!e.target.value && !showSuggestions) {
      setShowSuggestions(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input?.trim() && !isLoading) {
      onSendMessage();
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12">
      {/* Orange Asterisk Icon */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-[#FF7A1A] rounded-2xl flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
          >
            <path
              d="M12 2L12 22M22 12L2 12M19.07 4.93L4.93 19.07M19.07 19.07L4.93 4.93"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Greeting */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-light text-[#e5e5e5] mb-2">
          {getGreeting()}, {getFirstName(userName)}
        </h1>
      </div>

      {/* Input Area */}
      <div className="w-full max-w-3xl mb-8">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <div className="bg-[#2d2d2d] border border-[#404040] rounded-xl p-4 focus-within:border-[#FF7A1A] transition-colors">
              {/* Attached Files */}
              {attachedFiles && attachedFiles.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {attachedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-[#404040] rounded-lg px-3 py-2 text-sm text-[#e5e5e5]"
                    >
                      <span className="truncate max-w-32">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-[#999] hover:text-[#e5e5e5] transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Field */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={input || ""}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      placeholders?.[placeholderIndex] ||
                      "Como posso ajudar você hoje?"
                    }
                    className="w-full bg-transparent text-[#e5e5e5] placeholder-[#999] resize-none focus:outline-none text-lg leading-relaxed min-h-[24px] max-h-32"
                    rows={1}
                    style={{
                      height: "auto",
                      minHeight: "24px",
                    }}
                    onInput={(e) => {
                      e.target.style.height = "auto";
                      e.target.style.height =
                        Math.min(e.target.scrollHeight, 128) + "px";
                    }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <label className="cursor-pointer p-2 text-[#999] hover:text-[#e5e5e5] hover:bg-[#404040] rounded-lg transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <Paperclip size={18} />
                  </label>

                  <button
                    type="button"
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-2 rounded-lg transition-colors ${
                      isRecording
                        ? "text-red-400 hover:text-red-300 bg-red-500/10"
                        : "text-[#999] hover:text-[#e5e5e5] hover:bg-[#404040]"
                    }`}
                    title={isRecording ? "Parar gravação" : "Gravar áudio"}
                  >
                    {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>

                  <button
                    type="button"
                    className="p-2 text-[#999] hover:text-[#e5e5e5] hover:bg-[#404040] rounded-lg transition-colors"
                    title="Histórico"
                  >
                    <Clock size={18} />
                  </button>

                  <button
                    type="submit"
                    disabled={!input?.trim() || isLoading}
                    className="p-2 bg-[#FF7A1A] hover:bg-[#E6691A] disabled:bg-[#555] disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                    title="Enviar mensagem"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Suggestion Pills */}
      {showSuggestions && !input && (
        <div className="flex flex-wrap gap-3 justify-center max-w-2xl">
          {suggestions.map((suggestion) => {
            const IconComponent = suggestion.icon;
            return (
              <button
                key={suggestion.label}
                onClick={() => handleSuggestionClick(suggestion.label)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${suggestion.color} hover:scale-105 transform`}
              >
                <IconComponent size={16} />
                <span className="text-sm font-medium">{suggestion.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
