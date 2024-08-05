import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UseAuthContext } from "./User/hooks/useauthcontext";
import Navbar from "./User/Components/Navbar";
import Routers from "./Routers";
import Sidebar from "./Admin/Components/Sidebar";
import NotAllowed from "./Error/NotAllowed";
import Footer from "./User/Components/Footer";

function App() {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    const checkTokenExpiration = () => {
      const userFromStorage = JSON.parse(localStorage.getItem("user"));

      if (userFromStorage && userFromStorage.token) {
        const token = userFromStorage.token;
        try {
          const decodedToken = jwtDecode(token);

          if (decodedToken.exp * 1000 < Date.now()) {
            setLoad(true);
            localStorage.removeItem("user");
            window.location.href = "/login"; // Redirect to login page
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    };
    checkTokenExpiration();
  }, [load]);

  return (
    <Routes>
      <Route path="/*" element={<UserPage />} />
      <Route path="/admin/*" element={<AdminPage />} />
      <Route path="/not-allowed" element={<NotAllowed />} />
    </Routes>
  );
}

const AdminPage = () => {
  const { user } = UseAuthContext();
  if (!user || user.user.role !== "admin") {
    return <NotAllowed />;
  }
  return <Sidebar />;
};

const UserPage = () => {
  return (
    <>
      <Navbar />
      <Routers />
      <Footer />
    </>
  );
};

export default App;
