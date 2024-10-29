import { Toaster } from "react-hot-toast";
const ToasterProvider = () => (
  <Toaster
    toastOptions={{
      success: {
        style: {
          background: "green",
          color: "white",
        },
      },
      error: {
        style: {
          background: "red",
          color: "white",
        },
      },
    }}
  />
);
export default ToasterProvider;
