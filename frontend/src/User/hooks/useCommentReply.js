import { useContext } from "react";
import { CommentReply } from "../context/CommentContext";

export const UseCommentReplyHook = () => {
  const context = useContext(CommentReply);

  if (!context) {
    throw new Error("UseCartHook must be used within a CommentReplyProvider");
  }

  return context;
};
