import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CommentList from "./CommentList";
import { UseAuthContext } from "../../hooks/useauthcontext";
import { FaSpinner } from "react-icons/fa";

const CommentForm = ({ product_id }) => {
  const { user } = UseAuthContext();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const user_id = user.user._id;
  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Default for development

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/comment/create`, {
        text,
        user_id,
        product_id,
      });

      if (response.status === 201) {
        setText("");
        setReload((prevReload) => !prevReload); // Toggle reload to refresh comments
        toast.success("Comment Posted");
      } else {
        throw new Error("Failed to add comment");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      // Handle error feedback
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-5">
        <div>
          <label htmlFor="text" className="block mb-2">
            Add Comment:
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <div className="flex items-center">
              <FaSpinner className="animate-spin mr-2" />
              Submitting...
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </form>
      <div className="comment-section">
        {user_id && (
          <CommentList
            user_id={user_id}
            product_id={product_id}
            reload={reload}
          />
        )}
      </div>
    </>
  );
};

export default CommentForm;
