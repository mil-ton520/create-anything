import { useRef } from "react";
import { Send, Paperclip, Mic, MicOff, X, Clock } from "lucide-react";

export function ChatInput({
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
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleRecordingComplete = (audioFile) => {
    handleFileSelect({ target: { files: [audioFile] } });
  };

  const handleStartRecording = () => {
    startRecording(handleRecordingComplete);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input?.trim() && !isLoading) {
      onSendMessage();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="py-6 bg-[#1a1a1a]">
      <div className="w-full">
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
                      <Paperclip size={14} className="text-[#999]" />
                      <span className="truncate max-w-32">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-[#999] hover:text-[#e5e5e5] transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Input Field */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={input || ""}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      placeholders?.[placeholderIndex] ||
                      "Digite sua mensagem..."
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
                    onClick={isRecording ? stopRecording : handleStartRecording}
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
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
