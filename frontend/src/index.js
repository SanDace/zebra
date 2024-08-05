import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./app.css"; // Importing app.css file
import "./index.css"; // Importing app.css file

import { AuthContextProvider } from "./User/context/authcontext";
import { CartContextProvider } from "./User/context/CartContext";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CommentContextProvider } from "./User/context/CommentContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <BrowserRouter basename="/Ecommerce">
      <CartContextProvider>
        <CommentContextProvider>
          <App />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
            theme="light"
            bodyClassName="toastBody
          transition: Bounce"
          />
        </CommentContextProvider>
      </CartContextProvider>
    </BrowserRouter>
  </AuthContextProvider>
);
