import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./pages/Main";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import {BrowserRouter } from 'react-router-dom';
import Register from "./pages/Register";
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    {/* <Profile />
     */}
    {/* <Login /> */}
    <Register/>
  </BrowserRouter>
);
