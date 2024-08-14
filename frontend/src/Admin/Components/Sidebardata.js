import { React } from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";

const Sidebardata = [
  {
    title: "Dashboard",
    path: "/admin",
    icon: <AiIcons.AiFillHome />,
  },
  {
    title: "Product",
    path: "#",
    icon: <FaIcons.FaUser />,
    subNav: [
      {
        title: "Add Product",
        path: "/admin/products/addproduct",
        icon: <FaIcons.FaPlusCircle />,
      },
      {
        title: "Manage Products",
        path: "/admin/products/",
        icon: <FaIcons.FaTasks />,
      },
    ],
  },
  {
    title: "User",
    path: "/admin/addproduct",
    icon: <FaIcons.FaUser />,
  },
  {
    title: "Discounts",
    path: "#",
    icon: <FaIcons.FaCartPlus />,
    subNav: [
      {
        title: "All Products",
        path: "/admin/discounts/create",
        icon: <FaIcons.FaList />,
      },
      {
        title: "Categories",
        path: "/products/categories",
        icon: <FaIcons.FaTags />,
      },
    ],
  },

  {
    title: "Category",
    path: "/admin/category",
    icon: <FaIcons.FaCartPlus />,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: <FaIcons.FaBoxOpen />,
  },
  {
    title: "Payments",
    path: "/admin/payments",
    icon: <FaIcons.FaMoneyBill />,
  },
];

export default Sidebardata;
