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

export default newRequest;
