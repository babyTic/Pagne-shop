import axios from "axios";

const API = axios.create({
  baseURL: "https://pagne-shop-production.up.railway.app/api",
  headers: {
    "Content-Type": "application/json",
    "Accept":       "application/json", // important pour Laravel
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;