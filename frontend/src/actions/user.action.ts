import toast from "react-hot-toast";
import { clearSession } from "../utils/session";

const logout = () => {
    clearSession();
    toast.success("Logged out successfully");
    // Full reload so every cached react-query result is dropped with the session.
    window.location.replace("/login");
};

export { logout };
