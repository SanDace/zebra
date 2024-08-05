import { createContext, useReducer } from "react";

export const AuthContext = createContext();

export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const [state, dispatch] = useReducer(AuthReducer, { user: user });

  console.log("authContext:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

//

// const [state, dispatch] = useReducer(AuthReducer, {
//   user: JSON.parse(localStorage.getItem("user")),
//   user: null,
// });
// useEffect(() => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   if (user) {
//     dispatch({ type: "LOGIN", payload: user });
//   }
// }, [dispatch]);
