import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./User/Home";
import Welcome from "./User/Welcome";
import Login from "./User/Auth/Login";
import Register from "./User/Auth/Register";
import { UseAuthContext } from "./User/hooks/useauthcontext";
import ResetPassword from "./User/Auth/ResetPassword";
import SendEmail from "./User/Auth/SendEmail";
import AdminPage from "./Admin/Pages/AdminPage";
import Page from "./Admin/Pages/Page";
import SearchResults from "./User/Components/SearchResults";
import ProductDetails from "./User/Pages/ProductDetails";
import ProductWithCategory from "./User/Pages/ProductWithCategory";
import CartPage from "./User/Pages/CartPage";
import Profile from "./User/Components/Profile/Profile";
import NotFound from "./Error/NotFound";
import SideMenu from "./User/Components/Profile/SideMenu";
import EsewaPaymentForm from "./User/Payment/EsewapaymenrtForm";

import Success from "./User/Payment/Success";
import Failure from "./User/Payment/Failure";
import Form from "./User/Payment/Form";
import PaymentOptions from "./User/Payment/PaymentOptions";
import MakeOrder from "./User/Payment/MakeOrder";
import UpdateAddress from "./User/Components/Profile/Components/Address/UpdateAddress";

const Routers = () => {
  const { user } = UseAuthContext();

  return (
    <Routes>
      {/* If user is logged in, redirect them to Home, otherwise render Login */}
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/page" element={<Page />} />
      {/* <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} /> */}
      <Route path="/" element={<Home />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forget-password" element={<SendEmail />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      {/* Route for admin */}
      <Route path="/admin" element={<AdminPage />} />\
      <Route path="/cart" element={<CartPage />} />\
      {/* <Route path="/products/*" element={<Navigate to="/products/:id" />} /> */}
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route
        path="/products/category/:categoryId"
        element={<ProductWithCategory />}
      />
      <Route path="/search" element={<SearchResults />} />
      <Route
        path="/profile/setting/updateAddress/:id"
        element={<UpdateAddress />}
      />
      <Route path="/payment/:id" element={<EsewaPaymentForm />} />
      <Route path="/paymentoptions/:id" element={<PaymentOptions />} />
      <Route path="/makeorder/:id" element={<MakeOrder />} />
      <Route path="/payment_success" element={<Success />} />
      <Route path="/payment_failure/:transaction_uuid" element={<Failure />} />
      <Route
        path="/profile/*"
        element={!user ? <Navigate to="/login" /> : <SideMenu />}
      />
      <Route path="*" element={<NotFound />} />
      {!user && <Route path="*" element={<Navigate to="/login" />} />}
    </Routes>
  );
};

export default Routers;
