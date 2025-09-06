import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/auth`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error.response ? error.response.data : "Network Error"
    );
  }
);

export const register = async (username: string, password: string) => {
  const response = await api.post("/register", {
    params: { username, password },
  });
  return response.data;
};

export const login = async (username: string, password: string) => {
  const response = await api.post("/login", {
    params: { username, password },
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.post("/logout");
  return response.data;
};

export const getSelf = async () => {
  const response = await api.post("/self");
  return response.data;
};
