import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://your-production-domain.com"
    : "http://localhost:5000";

const newRequest = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },

});
// Intercept every request to add the Authorization header dynamically
newRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default newRequest;
