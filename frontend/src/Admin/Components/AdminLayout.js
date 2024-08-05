import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import Sidebardata from "./Sidebardata";
import AdminRouters from "../../AdminRouters";
const AdminLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleComponent = () => {
    setIsOpen(!isOpen);
  };

  const firstComponentWidth = isOpen ? "20rem" : "5rem";

  return (
    <div>
      <div className="flex  h-screen w-full box-border ">
        <div
          style={{ width: firstComponentWidth }}
          className="bg-blue-200 transition-width duration-300 box-border p-2 h-screen sm:h-[10%] "
        >
          {isOpen ? (
            <>
              <ul>
                {Sidebardata.map((item, index) => (
                  <li
                    key={index}
                    className="text-neutral-400 text-lg py-4 px-6 hover:bg-neutral-900"
                  >
                    <Link
                      to={item.path}
                      className="flex items-center space-x-4"
                    >
                      <span>{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              {Sidebardata.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="flex items-center space-x-4"
                >
                  <li className="text-neutral-400 text-lg py-4 px-6 hover:bg-neutral-900  list-none">
                    {item.icon}
                    {isOpen && <span>{item.title}</span>}
                  </li>
                </Link>
              ))}
            </>
          )}
        </div>
        <div className=" sm:w-[100%] w-[80%]  py-3 px-4 ">
          <AdminRouters />
        </div>

        <button
          className="absolute bottom-2 left-0 p-5 bg-gray-100 rounded text-2xl hover:bg-green-300"
          onClick={toggleComponent}
        >
          {isOpen ? <FaIcons.FaArrowLeft /> : <FaIcons.FaList />}
        </button>
      </div>
    </div>
  );
};

export default AdminLayout;
