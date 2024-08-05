import React, { useState, useEffect } from "react";
import axios from "axios";
import { UseAuthContext } from "../../../hooks/useauthcontext";
import { toast } from "react-toastify";

const AddPhoto = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null); // State to store user's current photo
  const [isUpdating, setIsUpdating] = useState(false); // State to manage update mode
  const [loading, setLoading] = useState(false); // State to manage loading
  const { user } = UseAuthContext();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/profile/getProfile", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setPhoto(response.data.photo);
      } catch (error) {
        setMessage("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 1048576) {
        setMessage("File size should be less than 1MB");
      } else {
        setFile(selectedFile);
        setMessage("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      return;
    }

    if (!user) {
      setMessage("User is not authenticated");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const endpoint = isUpdating
        ? "/profile/updatePhoto"
        : "/profile/uploadPhoto";
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      toast.success(
        isUpdating ? "Profile Picture Updated" : "Profile Picture Uploaded"
      );
      setPhoto(response.data.user.photo); // Update photo state
      setIsUpdating(false);
    } catch (error) {
      setMessage("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!user) {
      setMessage("User is not authenticated");
      return;
    }

    setLoading(true);
    try {
      await axios.delete("/profile/removePhoto", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      toast.success("Profile Picture Removed");
      setPhoto(null); // Clear photo state
    } catch (error) {
      setMessage("Error removing photo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <h2 className="text-xl mb-5 font-semibold">
        {isUpdating ? "Update Photo" : "Profile Photo"}
      </h2>

      {loading ? (
        <div className="flex justify-center">
          <div className="loader"> Loading..</div>
        </div>
      ) : (
        <>
          {!isUpdating && photo ? (
            <div className="text-center">
              <img
                src={`/profileImages/${photo}`}
                alt="Profile"
                className="mb-4 w-[150px] h-[150px] border shadow-lg object-contain rounded-full mx-auto"
              />
              <button
                onClick={() => setIsUpdating(true)}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Change Photo
              </button>
              <button
                onClick={handleRemove}
                className="bg-red-500 text-white py-2 px-4 rounded ml-2"
              >
                Remove Photo
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {photo && (
                <img
                  src={`/profileImages/${photo}`}
                  alt="Profile"
                  className="mb-4 w-[150px] h-[150px] border shadow-lg object-contain rounded-full mx-auto"
                />
              )}
              <div className="flex flex-col items-center space-y-4">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="border border-gray-300 p-2 rounded"
                />
                <div className="flex gap-5">
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    {photo ? "Update Photo" : "Upload Photo"}
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
        </>
      )}
    </div>
  );
};

export default AddPhoto;
