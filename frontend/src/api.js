import axios from "axios";

const api = axios.create({
  baseURL: "https://inventry-product-managment-system-backend.onrender.com/api", // <- Backend deploy URL daalna
});

export default api;
