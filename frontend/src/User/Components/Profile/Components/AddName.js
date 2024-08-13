import React, { useState, useEffect } from "react";
import axios from "axios";
import { UseAuthContext } from "../../../hooks/useauthcontext";
import { toast } from "react-toastify";

const AddName = () => {
  const { user } = UseAuthContext();
  const [name, setName] = useState("");
  const [updatedName, setUpdatedName] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); // State to manage update form display
  const apiUrl = process.env.REACT_APP_API_URL ; // Default for development

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${apiUrl}/profile/getUserName`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setName(response.data.name);
      } catch (error) {
        setMessage("Error fetching user name");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleUpdate = () => {
    setIsUpdating(true);
    setUpdatedName(name); // Set the current name as updated name initially
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!updatedName.trim()) {
      setMessage("Please enter a name");
      return;
    }

    if (!user) {
      setMessage("User is not authenticated");
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = isUpdating ? `${apiUrl}/profile/updateName` : `${apiUrl}/profile/addName`;
      const response = await axios.post(
        endpoint,
        { name: updatedName },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      // Assuming the API responds with a status code and a message
      if (response.status === 200) {
        toast.success(isUpdating ? "User Name Updated" : "User Name Added");
        setName(updatedName); // Update name state
        setUpdatedName(""); // Clear updated name state
        setIsUpdating(false); // Hide update form after successful update
        setMessage(""); // Clear any previous error messages
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Error updating user name");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-xl mb-5 font-semibold">User Name</h2>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : name && !isUpdating ? (
        <div className="text-center">
          <p className="mb-4">Current User Name: {name}</p>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Update User Name
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              placeholder="Enter your user name"
              className="border border-gray-300 p-2 rounded"
            />
            <div className="flex gap-5">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                {isUpdating ? "Update Name" : "Add Name"}
              </button>
              {isUpdating && (
                <button
                  onClick={() => setIsUpdating(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
          {message && <p className="text-red-500">{message}</p>}
        </form>
      )}
    </div>
  );
};

export default AddName;
