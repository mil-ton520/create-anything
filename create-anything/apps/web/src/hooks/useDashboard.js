import { useState, useEffect, useCallback } from "react";

export function useDashboard(user, userLoading) {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [selectedModel, setSelectedModel] = useState("auto");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false);
  const [error, setError] = useState(null);

  // Load workspace and data when user is available
  useEffect(() => {
    if (!userLoading && user) {
      loadWorkspace();
    }
  }, [user, userLoading]);

  // Load conversations when workspace or search query changes
  useEffect(() => {
    if (currentWorkspace) {
      loadConversations();
    }
  }, [currentWorkspace, searchQuery]);

  const loadWorkspace = useCallback(async () => {
    if (!user) return;

    setIsLoadingWorkspace(true);
    setError(null);

    try {
      const response = await fetch("/api/workspaces");
      if (!response.ok) {
        throw new Error(`Failed to load workspaces: ${response.status}`);
      }

      const data = await response.json();
      if (data.workspaces && data.workspaces.length > 0) {
        setCurrentWorkspace(data.workspaces[0]);
      } else {
        // User has no workspace, create a default one
        await createDefaultWorkspace();
      }
    } catch (error) {
      console.error("Failed to load workspace:", error);
      setError("Failed to load workspace");
    } finally {
      setIsLoadingWorkspace(false);
    }
  }, [user]);

  const createDefaultWorkspace = useCallback(async () => {
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Meu Workspace",
          description: "Seu workspace padrão",
          plan_type: "starter",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create workspace: ${response.status}`);
      }

      const data = await response.json();
      setCurrentWorkspace(data.workspace);
    } catch (error) {
      console.error("Failed to create default workspace:", error);
      setError("Failed to create workspace");
    }
  }, []);

  const loadConversations = useCallback(async () => {
    if (!currentWorkspace) return;

    try {
      console.log(
        `📥 Loading conversations for workspace ${currentWorkspace.id}`,
      );

      const params = new URLSearchParams({
        workspace_id: currentWorkspace.id,
        ...(searchQuery && { search: searchQuery }),
      });

      const response = await fetch(`/api/conversations?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to load conversations: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Loaded ${data.conversations?.length || 0} conversations`);
      setConversations(data.conversations || []);
    } catch (error) {
      console.error("❌ Failed to load conversations:", error);
      setError("Failed to load conversations");
    }
  }, [currentWorkspace, searchQuery]);

  const loadMessages = useCallback(async (conversationId) => {
    if (!conversationId) return;

    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/messages`,
      );
      if (!response.ok) {
        throw new Error(`Failed to load messages: ${response.status}`);
      }

      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setError("Failed to load messages");
    }
  }, []);

  const createNewConversation = useCallback(
    async (title) => {
      if (!currentWorkspace || !title?.trim()) return null;

      try {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workspace_id: currentWorkspace.id,
            title: title.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to create conversation: ${response.status}`);
        }

        const data = await response.json();
        const newConversation = data.conversation;

        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversation(newConversation);
        setMessages([]);

        return newConversation;
      } catch (error) {
        console.error("Failed to create conversation:", error);
        setError("Failed to create conversation");
        return null;
      }
    },
    [currentWorkspace],
  );

  const selectConversation = useCallback(
    (conversation) => {
      if (!conversation) return;

      setCurrentConversation(conversation);
      loadMessages(conversation.id);
    },
    [loadMessages],
  );

  const startNewChat = useCallback(() => {
    setCurrentConversation(null);
    setMessages([]);
  }, []);

  const search = useCallback((query) => {
    setSearchQuery(query || "");
  }, []);

  return {
    currentWorkspace,
    conversations,
    currentConversation,
    messages,
    selectedModel,
    searchQuery,
    isLoadingWorkspace,
    error,
    setMessages,
    setSelectedModel,
    createNewConversation,
    selectConversation,
    startNewChat,
    search,
    loadConversations,
    loadMessages,
  };
}
