import { useState, useEffect } from "react";

export function useSavedPrompts(workspaceId) {
  const [savedPrompts, setSavedPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (workspaceId) {
      loadSavedPrompts();
    }
  }, [workspaceId]);

  const loadSavedPrompts = async () => {
    if (!workspaceId) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/saved-prompts?workspace_id=${workspaceId}`,
      );

      if (response.ok) {
        const data = await response.json();
        setSavedPrompts(data.prompts || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Failed to load prompts - status:",
          response.status,
          "error:",
          errorData,
        );
      }
    } catch (error) {
      console.error("Failed to load saved prompts:", error);
    } finally {
      setLoading(false);
    }
  };

  const savePrompt = async (title, content) => {
    if (!workspaceId || !title?.trim() || !content?.trim()) {
      console.error("Save prompt validation failed:", {
        workspaceId,
        title: !!title?.trim(),
        content: !!content?.trim(),
      });
      return null;
    }

    try {
      const response = await fetch("/api/saved-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace_id: workspaceId,
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newPrompt = data.prompt;
        setSavedPrompts((prev) => [newPrompt, ...prev]);
        return newPrompt;
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error(
          "Failed to save prompt - status:",
          response.status,
          "error:",
          errorData,
        );
      }
    } catch (error) {
      console.error("Failed to save prompt:", error);
    }
    return null;
  };

  const deletePrompt = async (promptId) => {
    try {
      const response = await fetch(`/api/saved-prompts/${promptId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSavedPrompts((prev) => prev.filter((p) => p.id !== promptId));
        return true;
      }
    } catch (error) {
      console.error("Failed to delete prompt:", error);
    }
    return false;
  };

  const updatePrompt = async (promptId, title, content) => {
    try {
      const response = await fetch(`/api/saved-prompts/${promptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedPrompt = data.prompt;
        setSavedPrompts((prev) =>
          prev.map((p) => (p.id === promptId ? updatedPrompt : p)),
        );
        return updatedPrompt;
      }
    } catch (error) {
      console.error("Failed to update prompt:", error);
    }
    return null;
  };

  return {
    savedPrompts,
    loading,
    savePrompt,
    deletePrompt,
    updatePrompt,
    loadSavedPrompts,
  };
}
