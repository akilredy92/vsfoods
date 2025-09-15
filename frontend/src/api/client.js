import axios from "axios";

const API_BASE = "http://localhost:5001/api";

const api = axios.create({ baseURL: API_BASE });

// attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vsfoods_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// products
export async function getProducts() {
  const { data } = await api.get("/products");
  return data;
}
export async function getProduct(id) {
  const { data } = await api.get(`/products/${id}`);
  return data;
}

// orders
export async function createOrder(payload) {
  const { data } = await api.post("/orders", payload);
  return data;
}

// contact
export async function sendContact(payload) {
  const { data } = await api.post("/contact", payload);
  return data;
}

// auth
export async function signup(payload) {
  const { data } = await api.post("/auth/signup", payload);
  return data; // { token, user }
}
export async function login(payload) {
  const { data } = await api.post("/auth/login", payload);
  return data; // { token, user }
}
export async function me() {
  const { data } = await api.get("/auth/me");
  return data; // { user }
}

export default api;
