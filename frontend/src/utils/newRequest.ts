import axios from "axios";
import toast from "react-hot-toast";
import { clearSession, getStoredToken } from "./session";

const baseURL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://bookshop-hanx.onrender.com"
    : "http://localhost:5000");

const newRequest = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

newRequest.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Turns any axios failure into a human readable sentence. */
export const getErrorMessage = (error: any, fallback = "Something went wrong."): string => {
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === "ERR_NETWORK") return "Cannot reach the server. Please try again.";
  return error?.message || fallback;
};

const AUTH_FREE_PATHS = ["/api/auth/login", "/api/auth/register"];

newRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url || "";
    const isAuthCall = AUTH_FREE_PATHS.some((path) => url.includes(path));

    // An expired or invalid session should log the user out once, not spam
    // every screen that happens to be fetching at that moment.
    if (status === 401 && !isAuthCall && getStoredToken()) {
      clearSession();
      toast.error("Your session expired. Please log in again.");
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default newRequest;
