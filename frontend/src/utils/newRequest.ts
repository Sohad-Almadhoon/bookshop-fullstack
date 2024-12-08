import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://bookshop-hanx.onrender.com"
    : "http://localhost:5000";

const newRequest = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  }, withCredentials: true,

});

newRequest.interceptors.request.use(
  (config) => {
    const { token } = localStorage.getItem("currentUser") ? JSON.parse(localStorage.getItem("currentUser") as string) : { token: null };

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
