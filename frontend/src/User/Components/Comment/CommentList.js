import { GoPaperAirplane } from "react-icons/go";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { format } from "date-fns";

import { useCommentContext } from "../../context/CommentContext";

const CommentList = ({ user_id, product_id, reload }) => {
  const { state, dispatch } = useCommentContext();
  const { comments } = state;
  const [replyTexts, setReplyTexts] = useState({});
  const [replyFormsOpen, setReplyFormsOpen] = useState({});
  const [expandedReplies, setExpandedReplies] = useState({});
  const [showComments, setShowComments] = useState(false);
  const replyFormRefs = useRef({});
  const [loadReplies, setLoadReplies] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Default for development

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${apiUrl}/comment/${product_id}`);
        dispatch({ type: "SET_COMMENTS", payload: response.data });
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [product_id, reload, loadReplies, dispatch]);

  const handleReply = (commentId) => {
    setReplyFormsOpen((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const handleReplySubmit = async (parentCommentId) => {
    setLoadReplies(true);
    try {
      const response = await axios.post(`${apiUrl}/comment/reply/${parentCommentId}`, {
        text: replyTexts[parentCommentId] || "",
        user_id,
      });
      const newReply = response.data;
      setReplyTexts((prevState) => ({
        ...prevState,
        [parentCommentId]: "",
      }));
      setReplyFormsOpen((prevState) => ({
        ...prevState,
        [parentCommentId]: false,
      }));
      // Update comments state with the new reply
      dispatch({
        type: "ADD_REPLY",
        payload: { commentId: parentCommentId, reply: newReply },
      });
    } catch (error) {
      console.error("Error adding reply:", error);
    } finally {
      setLoadReplies(false);
    }
  };

  const toggleExpandReplies = (commentId) => {
    setExpandedReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const toggleShowComments = () => {
    setShowComments((prevShowComments) => !prevShowComments);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`${apiUrl}/comment/delete/${commentId}`, {
        data: { user_id }, // Send user_id in the request body
      });
      if (response.status === 200) {
        // Remove the deleted comment from state
        dispatch({
          type: "DELETE_COMMENT",
          payload: { commentId },
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteReply = async (parentCommentId, replyId) => {
    try {
      const response = await axios.delete(`${apiUrl}/comment/reply/delete/${replyId}`, {
        data: { user_id }, // Ensure user_id is passed correctly if required
      });
      if (response.status === 200) {
        // Update comments state to remove the deleted reply
        dispatch({
          type: "DELETE_REPLY",
          payload: { commentId: parentCommentId, replyId },
        });
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
      // Handle the error case appropriately in the UI
    }
  };

  return (
    <>
      <div className="flex flex-col text-center">
        {comments.length > 0 && (
          <>
            <div className=" flex flex-row justify-center item-center">
              <hr className="my-4 border-gray-300 w-[42%]" />

              <button
                className="text-gray-500  px-3 hover:underline text-sm "
                onClick={toggleShowComments}
              >
                {showComments ? "Hide Comments" : "Show Comments"}
              </button>
              <hr className="my-4 border-gray-300 w-[42%]" />
            </div>
          </>
        )}
      </div>

      <div className="max-w-2xl py-6">
        {showComments && (
          <>
            {comments.length > 0 ? (
              <ul className="space-y-6">
                {comments.map((comment) => (
                  <li
                    key={comment._id}
                    className="border-b border-gray-200 pb-4"
                  >
                    <div className="flex items-center mb-2">
                      <img
                        src={`/profileimages/${comment.user_id.photo}`}
                        alt={comment.user_id.name}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div>
                        <p className="font-bold text-sm">
                          {comment.user_id.name ?? comment.user_id.email}
                        </p>
                        <p className="text-xs text-gray-600">
                          {format(new Date(comment.createdAt), "PPP p")}
                        </p>
                      </div>
                      {user_id === comment.user_id._id && (
                        <button
                          className="ml-auto text-red-500 hover:text-red-700"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p>{comment.text}</p>

                    {user_id && (
                      <button
                        className="text-blue-500 hover:underline text-sm mt-2 ml-4"
                        onClick={() => handleReply(comment._id)}
                      >
                        {replyFormsOpen[comment._id] ? "Cancel" : "Reply"}
                      </button>
                    )}
                    {replyFormsOpen[comment._id] && (
                      <div
                        ref={(el) => (replyFormRefs.current[comment._id] = el)}
                        className="mt-2 flex space-x-4"
                      >
                        <input
                          type="text"
                          value={replyTexts[comment._id] || ""}
                          onChange={(e) =>
                            setReplyTexts((prevState) => ({
                              ...prevState,
                              [comment._id]: e.target.value,
                            }))
                          }
                          placeholder="Write your reply..."
                          className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                        <button
                          className="bg-green-500 text-white rounded px-2 text-sm"
                          onClick={() => handleReplySubmit(comment._id)}
                          disabled={loadReplies} // Disable button during reply submission
                        >
                          <GoPaperAirplane />
                        </button>
                      </div>
                    )}
                    {expandedReplies[comment._id] && (
                      <ul className="mt-4 pl-4 space-y-2">
                        {comment.replies.map((reply) => (
                          <li key={reply._id} className="border-gray-200 pb-2">
                            <div className="flex items-center mb-1">
                              <img
                                src={`/profileimages/${reply.user_id.photo}`}
                                alt={reply.user_id.email}
                                className="w-10 h-10 rounded-full mr-4"
                              />
                              <div>
                                <p className="font-bold text-sm">
                                  {reply.user_id.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {format(new Date(reply.createdAt), "PPP p")}
                                </p>
                              </div>
                              {user_id === reply.user_id._id && (
                                <button
                                  className="ml-auto text-red-500 hover:text-red-700"
                                  onClick={() =>
                                    handleDeleteReply(comment._id, reply._id)
                                  }
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                            <p>{reply.text}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                    {comment.replies.length > 0 && (
                      <button
                        className="text-blue-500 hover:underline text-sm mt-2"
                        onClick={() => toggleExpandReplies(comment._id)}
                      >
                        {expandedReplies[comment._id]
                          ? "Hide Replies"
                          : `Show ${comment.replies.length} ${
                              comment.replies.length === 1 ? "Reply" : "Replies"
                            }`}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No comments yet.</p>
            )}
          </>
        )}
        {!showComments && comments.length === 0 && <p>No comments yet.</p>}
      </div>
    </>
  );
};

export default CommentList;
