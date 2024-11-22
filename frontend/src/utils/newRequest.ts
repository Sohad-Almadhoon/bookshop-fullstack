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
const token = localStorage.getItem("token");
if (token) {
  newRequest.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default newRequest;
