
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createTransaction = async (data) => {
  const response = await api.post("/api/transactions", data);
  return response.data;
};

export const getTransactions = async (params = {}) => {
  const response = await api.get("/api/transactions", { params });
  return response.data;
};

export const getTransactionSummary = async () => {
  const response = await api.get("/api/transactions/summary");
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await api.patch(`/api/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await api.delete(`/api/transactions/${id}`);
  return response.data;
};

export const getTransactionById = async (id) => {
  const response = await api.get(`/api/transactions/${id}`);
  return response.data;
};

// AI Smart Entry Preview
export const previewAITransaction = async (message) => {
  const response = await api.post("/api/expenses/ai/preview", {
    message
  });

  return response.data;
};
