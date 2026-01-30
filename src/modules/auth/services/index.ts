
import { axiosInstance } from "../../../interceptors";

export const login = async (email: string, password: string) => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return data;
};
