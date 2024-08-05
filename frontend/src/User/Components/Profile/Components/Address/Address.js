import React, { useState, useEffect } from "react";
import axios from "axios";
import { UseAuthContext } from "../../../../hooks/useauthcontext";
import AddressForm from "./AddressForm";
import UpdateAddress from "./UpdateAddress";
import { FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";

const Address = () => {
  const { user } = UseAuthContext();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exist, setExist] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAddressId, setCurrentAddressId] = useState(null);
  const [view, setView] = useState("list"); // State to toggle between 'list' and 'form'

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/address/user/${user.user._id}`);
        setAddresses(response.data);
        setExist(response.data.length > 0);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [user.user._id, isProcessing]);

  const handleDelete = async (id) => {
    try {
      setIsProcessing(true);
      await axios.delete(`/address/${id}`);
      setAddresses((prevAddresses) =>
        prevAddresses.filter((address) => address._id !== id)
      );
      toast.success("Address Deleted");
    } catch (error) {
      console.error("Error deleting address:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressChange = () => {
    setIsProcessing(true);
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`/address/user/${user.user._id}`);
        setAddresses(response.data);
        setExist(response.data.length > 0);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    fetchAddresses();
  };
  const handleAddressUpdate = async () => {
    // Fetch addresses to reflect the changes after updating an address
    setIsProcessing(true);
    try {
      const response = await axios.get(`/address/user/${user.user._id}`);
      setAddresses(response.data);
      setExist(response.data.length > 0);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsProcessing(false);
      setView("list"); // Switch back to list view
    }
  };

  const handleUpdateClick = (id) => {
    setCurrentAddressId(id);
    setView("form"); // Switch to update form view
  };

  const handleFormClose = () => {
    setView("list"); // Switch back to list view
    setCurrentAddressId(null); // Clear the current address ID
  };

  if (loading) {
    return <FaSpinner className="animate-spin h-5 w-5 ml-1 text-white" />;
  }

  const currentAddress = addresses.find(
    (address) => address._id === currentAddressId
  );

  return (
    <div className="max-w-md mx-auto pt-3">
      {view === "list" ? (
        <>
          {!exist ? (
            <AddressForm
              onAddressChange={handleAddressChange}
              onAddressUpdate={handleAddressUpdate}
            />
          ) : (
            <ul className="list-none">
            {addresses.map((address) => (
              <li
                key={address._id}
                className="mb-6 p-6 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Address</h3>
                <p className="text-gray-600">
                  <span className="font-medium">City:</span> {address.city}, <span className="font-medium">State:</span> {address.state}, <span className="font-medium">Postal Code:</span> {address.postalCode}, <span className="font-medium">Country:</span> {address.country}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Tole:</span> {address.tole}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone Number:</span> {address.phone}
                </p>
                <div className="mt-4 flex justify-end space-x-4">
                  <button
                    onClick={() => handleUpdateClick(address._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(address._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    {isProcessing ? (
                      <FaSpinner className="animate-spin h-5 w-5 ml-1 text-white" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          
          )}
        </>
      ) : (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <button onClick={handleFormClose} className="mb-4 text-red-500">
            Back
          </button>
          <UpdateAddress
            address={currentAddress}
            onAddressUpdate={handleAddressUpdate}
            onClose={handleFormClose}
          />
        </div>
      )}
    </div>
  );
};

export default Address;
