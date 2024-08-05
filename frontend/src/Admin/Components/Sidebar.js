import React, { useState } from "react";
import { Link } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import Sidebardata from "./Sidebardata";
import AdminRouters from "../../AdminRouters";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState({});

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleSubmenu = (index) => {
    setSubmenuOpen((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="flex h-screen w-full relative">
      <div
        className={`bg-dashbg ${
          isOpen ? "w-64" : "w-16"
        } flex-shrink-0 transition-width duration-300 overflow-y-auto border-r shadow-[2px_2px_10px_rgba(0,0,0,0.1)] bg-neutral-100`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="text-lg font-semibold text-gray-800">
            {isOpen ? (
              "DashBoard"
            ) : (
              <button onClick={toggleSidebar}>
                <FaIcons.FaBars className="text-gray-600" />
              </button>
            )}
          </div>
          {isOpen && (
            <button onClick={toggleSidebar}>
              <FaIcons.FaBars className="text-gray-600" />
            </button>
          )}
        </div>
        <ul>
          {Sidebardata.map((item, index) => (
            <li key={index} className="relative pl-3 py-2  hover:bg-gray-400 ">
              {item.subNav && Array.isArray(item.subNav) ? (
                <>
                  <button
                    className="text-gray-700 group hover:text-slate-100 flex items-center space-x-4 w-full text-left p-2"
                    onClick={() => toggleSubmenu(index)}
                  >
                    <span>{item.icon}</span>
                    {isOpen && <span>{item.title}</span>}
                    {isOpen && (
                      <FaIcons.FaChevronDown
                        className={`text-gray-600 transition-transform duration-300 group-hover:text-slate-100  ${
                          submenuOpen[index] ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {submenuOpen[index] && isOpen && (
                    <ul className="pl-8 hover:text-slate-100">
                      {item.subNav.map((subItem, subIndex) => (
                        <li
                          key={subIndex}
                          className="py-0.5 hover:text-slate-100 "
                        >
                          <Link
                            to={subItem.path}
                            className="text-gray-700 flex items-center space-x-4 pl-1  py-2 hover:text-slate-100"
                          >
                            <span className>{subItem.icon}</span>
                            <span>{subItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className="text-gray-700 flex items-center space-x-4 p-2 hover:text-slate-100"
                >
                  <span>{item.icon}</span>
                  {isOpen && <span>{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        <AdminRouters />
      </div>
    </div>
  );
};

export default Sidebar;
