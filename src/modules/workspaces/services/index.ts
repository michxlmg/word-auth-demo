
import { axiosInstance } from "../../../interceptors";

interface Workspace {
  id: string;
  public_id?: string;
  name: string;
}

interface WorkspaceResponse {
  data: {
    workspaces: Workspace[];
  };
}

export const getWorkspaces = async (): Promise<WorkspaceResponse> => {
  const { data } = await axiosInstance.get<WorkspaceResponse>("/workspaces");
  return data;
};

export const createWorkspace = async (name: string) => {
  const { data } = await axiosInstance.post("/workspaces", { name });
  return data;
};
