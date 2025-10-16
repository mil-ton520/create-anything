import { useState } from "react";

export function useChat() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setAttachedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const sendMessage = async (
    currentConversation,
    createNewConversation,
    messages,
    setMessages,
  ) => {
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;

    const messageContent = input.trim();
    setInput("");
    const filesToSend = [...attachedFiles];
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      let conversation = currentConversation;

      // Create new conversation if none exists
      if (!conversation) {
        conversation = await createNewConversation(messageContent);
        if (!conversation) {
          setIsLoading(false);
          return;
        }
      }

      // Add optimistic user message
      const optimisticUserMessage = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content: messageContent,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticUserMessage]);

      // Add loading AI message
      const optimisticAiMessage = {
        id: `temp-ai-${Date.now()}`,
        role: "assistant",
        content: "",
        loading: true,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimisticAiMessage]);

      // Send message to API
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: conversation.id,
          message: messageContent,
          model: selectedModel === "auto" ? null : selectedModel,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send message");
      }

      const data = await response.json();

      // Replace optimistic messages with real ones
      setMessages((prev) =>
        prev
          .filter(
            (msg) =>
              msg.id !== optimisticUserMessage.id &&
              msg.id !== optimisticAiMessage.id,
          )
          .concat([data.userMessage, data.assistantMessage]),
      );
    } catch (error) {
      console.error("Failed to send message:", error);

      // Remove optimistic messages on error
      setMessages((prev) =>
        prev.filter(
          (msg) =>
            !msg.id.toString().startsWith("temp-user-") &&
            !msg.id.toString().startsWith("temp-ai-"),
        ),
      );

      // Show error to user
      alert(error.message || "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    input,
    setInput,
    selectedModel,
    setSelectedModel,
    isLoading,
    attachedFiles,
    handleFileSelect,
    removeFile,
    sendMessage,
  };
}
