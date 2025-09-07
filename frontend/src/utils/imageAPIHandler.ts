import axios from "axios";

const apiUrl = window.location.origin;
const api = axios.create({
  baseURL: `${apiUrl}/api/images`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(
      error.response ? error.response.data : { message: "Network Error" }
    );
  }
);

export const uploadImage = async (formData: FormData) => {
  const response = await api.post("/upload", formData);
  return response.data;
};

export const detectImage = async (imageId: string) => {
  const response = await api.post(`/detect/${imageId}`);
  return response.data;
};

export const getImageData = async (imageId: string) => {
  const response = await api.get(`/image-data/${imageId}`);
  return response.data;
};

export const getUserImages = async () => {
  const response = await api.get("/user-images");
  return response.data;
};

export const removeImage = async (imageId: string) => {
  const response = await api.delete(`/delete/${imageId}`);
  return response.data;
};
