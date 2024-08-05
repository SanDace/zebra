import { UseAuthContext } from "./useauthcontext";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
export const UseLogout = () => {
  const { dispatch } = UseAuthContext();
  const navigation = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    navigation("/login");
    toast.success("Loged out ");
  };

  return { logout };
};
