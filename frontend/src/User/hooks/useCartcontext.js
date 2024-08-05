

import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export const UseCartHook = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("UseCartHook must be used within a CartContextProvider");
  }

  return context;
};
