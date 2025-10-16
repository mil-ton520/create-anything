import { useState, useEffect } from "react";

export function useWorkspace(user, userLoading) {
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [usage, setUsage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load workspaces on mount
  useEffect(() => {
    if (!userLoading && user) {
      loadWorkspaces();
    } else if (!userLoading && !user) {
      setIsLoading(false);
    }
  }, [user, userLoading]);

  // Load usage when workspace changes
  useEffect(() => {
    if (currentWorkspace) {
      loadUsage();
    }
  }, [currentWorkspace]);

  const loadWorkspaces = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/workspaces");
      if (response.ok) {
        const data = await response.json();
        setWorkspaces(data.workspaces || []);
        if (data.workspaces && data.workspaces.length > 0) {
          setCurrentWorkspace(data.workspaces[0]);
        }
      }
    } catch (error) {
      console.error("Failed to load workspaces:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsage = async () => {
    if (!currentWorkspace) return;

    try {
      const response = await fetch(
        `/api/workspaces/${currentWorkspace.id}/usage`,
      );
      if (response.ok) {
        const data = await response.json();
        setUsage(data.usage);
        // Update workspace with usage info
        setCurrentWorkspace((prev) => ({
          ...prev,
          usage: data.usage,
        }));
      }
    } catch (error) {
      console.error("Failed to load usage:", error);
    }
  };

  const switchWorkspace = async (workspaceId) => {
    const workspace = workspaces.find((w) => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      // This will trigger useEffect to reload usage
    }
  };

  const createWorkspace = async (workspaceData) => {
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workspaceData),
      });

      if (response.ok) {
        const data = await response.json();
        const newWorkspace = data.workspace;
        setWorkspaces((prev) => [newWorkspace, ...prev]);
        setCurrentWorkspace(newWorkspace);
        return newWorkspace;
      }
    } catch (error) {
      console.error("Failed to create workspace:", error);
    }
    return null;
  };

  return {
    currentWorkspace,
    workspaces,
    usage,
    isLoading,
    switchWorkspace,
    createWorkspace,
    loadWorkspaces,
    loadUsage,
  };
}
