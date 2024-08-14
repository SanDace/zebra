import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./Admin/Pages/AdminPage";
import AddProduct from "./Admin/Product/AddProduct";
import ProductList from "./Admin/Product/ProductList";
import ProductList2 from "./Admin/Product/ProductList2";
import SingleProduct from "./Admin/Product/SingleProduct";
import UpdateProduct from "./Admin/Product/UpdateProduct";
import AddDiscount from "./Admin/Discount/AddDiscount";
import AddCategory from "./Admin/Category/AddCategory";
import AddCategory2 from "./Admin/Category/AddCategory2";
import { UseAuthContext } from "./User/hooks/useauthcontext";
import NotFound from "./Error/NotFound";
import Order from "./Admin/Payments/Order";
import Payment from "./Admin/Payments/Payment";

const AdminRoutes = () => {
  const { user } = UseAuthContext();

  // Check if the user is logged in and is an admin
  const isAdmin = user && user.user.role === "admin";

  // Check if the user is logged in
  const isLoggedIn = user !== null;

  return (
    <Routes>
      {/* If user is not logged in, navigate to login */}
      {!isLoggedIn && <Route path="/*" element={<Navigate to="/login" />} />}
      {/* If user is not an admin, navigate to forbidden page */}
      {!isAdmin && <Route path="/*" element={<Navigate to="/forbidden" />} />}
      {/* If user is an admin, render the admin routes */}
      {isAdmin && (
        <>
          <Route path="/" element={<AdminPage />} />
          <Route path="/products/addproduct" element={<AddProduct />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products2" element={<ProductList2 />} />
          <Route path="/products/:id" element={<SingleProduct />} />
          <Route path="/products/update/:id" element={<UpdateProduct />} />
          <Route path="/discounts/create" element={<AddDiscount />} />
          <Route path="/category" element={<AddCategory />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/payments" element={<Payment />} />
          <Route path="/category2" element={<AddCategory2 />} />
          <Route path="*" element={<NotFound />} />
        </>
      )}
      {/* Route for forbidden page */}
    </Routes>
  );
};

export default AdminRoutes;
