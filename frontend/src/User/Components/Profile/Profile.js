import React from "react";
import { UseAuthContext } from "../../hooks/useauthcontext";

const Profile = () => {
  const { user } = UseAuthContext();

  return (
    <div className="flex flex-wrap justify-center">
      <div className="w-full max-w-md p-4">
        <div className="bg-white p-4 rounded-md shadow-md">
          {user ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">User Details</h2>
              <p>
                <strong>Name:</strong> {user.user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.user.email}
              </p>
              <p>
                <strong>Joined At:</strong>{" "}
                {new Date(user.user.updatedAt).toLocaleDateString()}{" "}
                {/* Assuming joinedAt is a valid date */}
              </p>
              <p>
                <strong>Role:</strong> {user.user.role}
                {/* Assuming you have a role */}
              </p>
              {user.photo && (
                <div className="mt-4">
                  <img
                    src={user.photo}
                    alt="Profile"
                    className="rounded-full h-24 w-24 object-cover"
                  />
                </div>
              )}
            </>
          ) : (
            <p>No user details available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
