import { AuthContext } from "../context/authcontext";
import { useContext } from "react";

export const UseAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("UseAuthContext must be used within an AuthProvider");
  }
  return context;
};
