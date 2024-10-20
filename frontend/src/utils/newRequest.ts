import axios from "axios";

const newRequest = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
});

export default newRequest;
