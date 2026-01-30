
import React from 'react';
import LoginPage from "@/modules/auth/features/login/pages/LoginPage";
import WorkspaceSelector from "@/modules/workspaces/pages/WorkspaceSelector";
import ChatPage from "@/modules/assistant/pages/ChatPage";

// Define strict types for the Workspace object based on usage
interface Workspace {
  id: string; // sometimes public_id
  public_id?: string;
  name: string;
}

export default function App() {
  const [view, setView] = React.useState<"login" | "workspaces" | "chat">("login");
  const [currentWorkspace, setCurrentWorkspace] = React.useState<Workspace | null>(null);

  // Simple auth check on mount
  React.useEffect(() => {
    const token = localStorage.getItem("TOKEN_AUTH");
    if (token) {
      setView("workspaces");
    }
  }, []);

  const handleLoginSuccess = () => {
    setView("workspaces");
  };

  const handleWorkspaceSelected = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
    setView("chat");
  };

  const handleLogout = () => {
    localStorage.removeItem("TOKEN_AUTH");
    setCurrentWorkspace(null);
    setView("login");
  };

  if (view === "login") {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (view === "workspaces") {
    return <WorkspaceSelector onWorkspaceSelected={handleWorkspaceSelected} onLogout={handleLogout} />;
  }

  if (view === "chat" && currentWorkspace) {
    return <ChatPage workspace={currentWorkspace} onBack={() => setView("workspaces")} />;
  }

  // Fallback if chat is selected but no workspace (should not happen)
  if (view === "chat" && !currentWorkspace) {
      setView("workspaces");
      return null;
  }

  return null;
}
