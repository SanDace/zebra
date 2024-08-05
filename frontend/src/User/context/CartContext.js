import { createContext, useReducer, useState } from "react";

export const CartContext = createContext();

export const CartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "DELETE_CART_ITEM":
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.filter(
            (item) => item.product._id !== action.payload.productId
          ),
        },
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: {
          ...state.cart,
          items: state.cart.items.map((item) =>
            item.product._id === action.payload.productId
              ? { ...item, quantity: action.payload.quantity }
              : item
          ),
        },
      };
    default:
      return state;
  }
};

export const CartContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(CartReducer, { cart: { items: [] } });
  const updateQuantity = (productId, quantity) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity },
    });
  };
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = (count) => setCartCount(count);
  const resetCartCount = () => {
    setCartCount(0);
  };
  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        updateQuantity,
        cartCount,
        updateCartCount,
        resetCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
