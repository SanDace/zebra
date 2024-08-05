import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import AddPhoto from "./Components/AddPhoto";
import EditProfile from "./Components/EditProfile";
import AddName from "./Components/AddName";
import ChangePassword from "./Components/ChangePassword";
import Address from "./Components/Address/Address";

const Setting = () => {
  const location = useLocation();

  const isRouteActive = (route) => location.pathname.includes(route);

  return (
    <div className="flex ">
      <nav className="w-1/5  px-4 py-2 lg:sticky lg:top-2 border-r rounded-md bg-gray-50 shadow-md h-screen ">
        <ul>
          <li className="py-2 text-sm border-b">
            <NavLink
              to="/profile/setting/addphoto"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-600 font-bold"
                  : "text-gray-500 hover:text-neutral-900"
              }
            >
              Add Photo
            </NavLink>
          </li>
          <li className="py-2 text-sm border-b">
            <NavLink
              to="/profile/setting/addName"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-600 font-bold"
                  : "text-gray-500  hover:text-neutral-900"
              }
            >
              Add Username
            </NavLink>
          </li>
          <li className="py-2 text-sm border-b">
            <NavLink
              to="/profile/setting/editProfil"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-600 font-bold"
                  : "text-gray-500  hover:text-neutral-900"
              }
            >
              Edit Profile
            </NavLink>
          </li>
          <li className="py-2 text-sm border-b">
            <NavLink
              to="/profile/setting/changePassword"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-600 font-bold"
                  : "text-gray-500 hover:text-neutral-900"
              }
            >
              Change Password
            </NavLink>
          </li>
          <li className="py-2 text-sm border-b">
            <NavLink
              to="/profile/setting/Address"
              className={({ isActive }) =>
                isActive
                  ? "text-gray-600 font-bold"
                  : "text-gray-500 hover:text-neutral-900"
              }
            >
              Address
            </NavLink>
          </li>
        </ul>
      </nav>
      {(isRouteActive("/profile/setting/addphoto") ||
        isRouteActive("/profile/setting/addName") ||
        isRouteActive("/profile/setting/changePassword") ||
        isRouteActive("/profile/setting/Address") ||
        isRouteActive("/profile/setting/editProfil")) && (
        <div className="w-full p-2 bg-neutral-50">
          <Routes>
            <Route path="/addPhoto" element={<AddPhoto />} />
            <Route path="/editProfil" element={<EditProfile />} />
            <Route path="/addName" element={<AddName />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/Address" element={<Address />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default Setting;
