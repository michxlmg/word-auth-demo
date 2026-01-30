
import React, { useState, useEffect } from "react";
import { Briefcase, LogOut, Plus } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { getWorkspaces, createWorkspace } from "@/modules/workspaces/services";

interface Workspace {
  id: string;
  public_id?: string;
  name: string;
}

interface WorkspaceSelectorProps {
  onWorkspaceSelected: (workspace: Workspace) => void;
  onLogout: () => void;
}

export default function WorkspaceSelector({ onWorkspaceSelected, onLogout }: WorkspaceSelectorProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const response = await getWorkspaces();
      setWorkspaces(response.data?.workspaces || []);
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("401")) {
         onLogout();
      }
      setError("Error al cargar espacios de trabajo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;

    setIsCreating(true);
    setError("");
    try {
      await createWorkspace(newWorkspaceName);
      setNewWorkspaceName("");
      await fetchList();
    } catch (err: any) {
      setError(err.message || "Error al crear espacio.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-4 text-foreground font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-serif font-bold">Mis Espacios</h2>
        <Button variant="ghost" size="icon" onClick={onLogout}>
          <LogOut size={18} />
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-4">
          <div className="space-y-2">
            {workspaces.map(ws => (
              <button
                key={ws.id || ws.public_id}
                onClick={() => onWorkspaceSelected(ws)}
                className="w-full p-4 rounded-xl border border-border/50 bg-card/20 hover:bg-card/40 hover:border-primary/30 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div className="font-medium text-foreground/90 group-hover:text-primary transition-colors">{ws.name}</div>
                    <div className="text-xs text-muted-foreground">Espacio de trabajo</div>
                  </div>
                </div>
              </button>
            ))}
            {workspaces.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No tienes espacios de trabajo creados.
              </div>
            )}
          </div>
          
          <div className="border-t border-border pt-4 mt-4">
             <h3 className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-widest">Crear Nuevo Espacio</h3>
             {error && <p className="text-xs text-destructive mb-2">{error}</p>}
             <form onSubmit={handleCreate} className="flex gap-2">
               <Input 
                 placeholder="Nombre del espacio..." 
                 value={newWorkspaceName}
                 onChange={(e) => setNewWorkspaceName(e.target.value)}
                 className="flex-1 bg-card/50"
               />
               <Button type="submit" size="icon" disabled={!newWorkspaceName} isLoading={isCreating}>
                 <Plus size={20} />
               </Button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
