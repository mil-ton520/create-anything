import { useRef, useEffect, useState } from "react";
import {
  Copy,
  RotateCcw,
  Share2,
  Paperclip,
  Bookmark,
  Check,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

export function MessageList({
  messages,
  selectedModelData,
  copyMessage,
  onSavePrompt,
}) {
  const messagesEndRef = useRef(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCopy = (content, messageId) => {
    copyMessage(content);
    setCopiedIndex(messageId);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full">
      <div className="space-y-8">
        {messages.map((message) => (
          <div key={message.id} className="w-full">
            <div className="flex gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.role === "user" ? (
                  <div className="w-8 h-8 bg-[#FF7A1A] rounded-lg flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">U</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-[#404040] rounded-lg flex items-center justify-center">
                    <span className="text-[#e5e5e5] font-bold text-sm">AI</span>
                  </div>
                )}
              </div>

              {/* Message content */}
              <div className="flex-1 min-w-0 group">
                {/* Model info for assistant */}
                {message.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-3 text-xs text-[#999]">
                    {selectedModelData?.icon && (
                      <span>{selectedModelData.icon}</span>
                    )}
                    <span className="font-medium text-[#e5e5e5]">
                      {message.model_used || selectedModelData?.name || "AI"}
                    </span>
                    <span>•</span>
                    <span>GDPR Compliant</span>
                  </div>
                )}

                {/* Message text */}
                <div className="text-[#e5e5e5] leading-7">
                  {message.loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FF7A1A] rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-[#FF7A1A] rounded-full animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#FF7A1A] rounded-full animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  ) : message.role === "assistant" ? (
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          code: ({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) => {
                            return inline ? (
                              <code
                                className="bg-[#404040] text-[#FF7A1A] px-1.5 py-0.5 rounded text-sm font-mono"
                                {...props}
                              >
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-[#0A0A0A] text-white p-4 rounded-lg overflow-x-auto">
                                <code className="text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              </pre>
                            );
                          },
                          p: ({ children }) => (
                            <p className="mb-4 last:mb-0 text-[#e5e5e5]">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside mb-4 space-y-1 text-[#e5e5e5]">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal list-inside mb-4 space-y-1 text-[#e5e5e5]">
                              {children}
                            </ol>
                          ),
                          a: ({ children, href }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FF7A1A] hover:underline"
                            >
                              {children}
                            </a>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-[#e5e5e5]">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap text-[#e5e5e5]">
                      {message.content}
                    </div>
                  )}
                </div>

                {/* Show attached files */}
                {message.files && message.files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {message.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-[#999] bg-[#2d2d2d] rounded-lg px-3 py-2 w-fit"
                      >
                        <Paperclip size={14} />
                        <span>{file.name}</span>
                        <span>({(file.size / 1024).toFixed(1)}KB)</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                {!message.loading && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 mt-4 transition-opacity duration-200">
                    {message.role === "user" && onSavePrompt && (
                      <button
                        onClick={() => onSavePrompt(message.content)}
                        className="p-2 text-[#999] hover:text-[#FF7A1A] hover:bg-[#2d2d2d] rounded-lg transition-colors duration-150"
                        title="Salvar prompt"
                      >
                        <Bookmark size={16} />
                      </button>
                    )}

                    {message.role === "assistant" && (
                      <>
                        <button
                          onClick={() =>
                            handleCopy(message.content, message.id)
                          }
                          className="p-2 text-[#999] hover:text-[#e5e5e5] hover:bg-[#2d2d2d] rounded-lg transition-colors duration-150"
                          title="Copiar"
                        >
                          {copiedIndex === message.id ? (
                            <Check size={16} className="text-green-400" />
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        <button
                          className="p-2 text-[#999] hover:text-[#e5e5e5] hover:bg-[#2d2d2d] rounded-lg transition-colors duration-150"
                          title="Regenerar"
                        >
                          <RotateCcw size={16} />
                        </button>
                        <button
                          className="p-2 text-[#999] hover:text-[#e5e5e5] hover:bg-[#2d2d2d] rounded-lg transition-colors duration-150"
                          title="Partilhar"
                        >
                          <Share2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
}
