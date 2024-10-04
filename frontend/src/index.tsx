import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./pages/Main";
import Profile from "./pages/Profile";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Profile />
  </React.StrictMode>
);
