import React, { createContext, useReducer, useContext } from "react";

// Action Types
const SET_COMMENTS = "SET_COMMENTS";
const ADD_REPLY = "ADD_REPLY";
const DELETE_COMMENT = "DELETE_COMMENT";
const DELETE_REPLY = "DELETE_REPLY";

// Initial state for comments and replies
const initialState = {
  comments: [],
};

// Reducer Function
const commentReducer = (state, action) => {
  switch (action.type) {
    case SET_COMMENTS:
      return { ...state, comments: action.payload };

    case ADD_REPLY:
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload.commentId
            ? {
                ...comment,
                replies: [...comment.replies, action.payload.reply],
              }
            : comment
        ),
      };

    case DELETE_COMMENT:
      return {
        ...state,
        comments: state.comments.filter(
          (comment) => comment._id !== action.payload.commentId
        ),
      };

    case DELETE_REPLY:
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload.commentId
            ? {
                ...comment,
                replies: comment.replies.filter(
                  (reply) => reply._id !== action.payload.replyId
                ),
              }
            : comment
        ),
      };

    default:
      return state;
  }
};

// Create Context
export const CommentContext = createContext();

// Provider Component
export const CommentContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, initialState);

  return (
    <CommentContext.Provider value={{ state, dispatch }}>
      {children}
    </CommentContext.Provider>
  );
};

// Custom Hook
export const useCommentContext = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error(
      "useCommentContext must be used within a CommentContextProvider"
    );
  }
  return context;
};
