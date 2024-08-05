import React, { useEffect, useState } from "react";
import axios from "axios";

const Payments = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit] = useState(1); // Number of orders per page

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders`, {
          params: { page, limit },
        });
        setOrders(response.data.orders || []); // Ensure orders is an array
        setTotalOrders(response.data.totalOrders || 0);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page, limit]);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < Math.ceil(totalOrders / limit)) {
      setPage(page + 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen">
        <div>
          <img src="/pikachu.gif" alt="Pikachu" className="w-[70px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-slate-100">
              <th className="py-2 px-2 border-b">Order ID</th>
              <th className="py-2 px-2 border-b">User Name</th>
              <th className="py-2 px-2 border-b">Item Name</th>
              <th className="py-2 px-2 border-b">Image</th>
              <th className="py-2 px-2 border-b">Total Price</th>
              <th className="py-2 px-2 border-b">Payment Method</th>
              <th className="py-2 px-2 border-b">Status</th>
              <th className="py-2 px-2 border-b">Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
                  <td className="py-2 px-2 border-b">{order._id}</td>
                  <td className="py-2 px-2 border-b">
                    {order.userId.name ? order.userId.name : order.userId.email}
                  </td>

                  <td className="py-2 px-2 border-b">
                    {order.itemDetails.name}
                  </td>
                  <td className="py-2 px-2 border-b">
                    <img
                      src={`/images/${order.itemDetails.photo}`}
                      alt={order.itemDetails.photo}
                      className="w-20 h-20 object-cover mr-4 sm:w-24 sm:h-24"
                    />
                  </td>
                  <td className="py-2 px-2 border-b">{order.totalPrice}</td>
                  <td className="py-2 px-2 border-b">{order.paymentMethod}</td>
                  <td className="py-2 px-2 border-b">{order.status}</td>

                  <td className="py-2 px-2 border-b">
                    {new Date(order.purchaseDate).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-2 px-2 border-b text-center">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {page} of {Math.ceil(totalOrders / limit)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={page === Math.ceil(totalOrders / limit)}
          className="px-4 py-2 bg-gray-400 rounded text-black font-600 hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Payments;
