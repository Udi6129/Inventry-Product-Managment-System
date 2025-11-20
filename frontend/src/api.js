import axios from "axios";

const api = axios.create({
  baseURL: "https://inventry-product-managment-system-backend.onrender.com", // <- Backend deploy URL daalna
});

export default api;
