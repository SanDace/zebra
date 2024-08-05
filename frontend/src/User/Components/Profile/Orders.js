import React, { useEffect, useState } from "react";
import axios from "axios";
import { UseAuthContext } from "../../hooks/useauthcontext";
import { FaDownload, FaEye } from "react-icons/fa"; // FaEye for preview
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";

const Orders = () => {
  const { user } = UseAuthContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [limit] = useState(1); // Number of orders per page
  const userId = user.user._id; // Replace this with the actual user ID
  const [previewOrder, setPreviewOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`/api/orders/${userId}`, {
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
  }, [userId, page, limit]);

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

  const downloadReceiptAsImage = async (order) => {
    const element = document.getElementById(`order-${order._id}`);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const dataURL = canvas.toDataURL("image/png");
      saveAs(dataURL, `receipt-${order._id}.png`);
    } catch (error) {
      console.error("Error generating PNG:", error);
    }
  };

  const downloadReceiptAsPdf = async (order) => {
    const element = document.getElementById(`order-${order._id}`);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`receipt-${order._id}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
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
              <th className="py-2 px-2 border-b">Item Name</th>
              <th className="py-2 px-2 border-b">Image</th>
              <th className="py-2 px-2 border-b">Total Price</th>
              <th className="py-2 px-2 border-b">Payment Method</th>
              <th className="py-2 px-2 border-b">Payment Status</th>
              <th className="py-2 px-2 border-b">Delivery Status</th>
              <th className="py-2 px-2 border-b">Purchase Date</th>
              <th className="py-2 px-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-100">
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
                  <td className="py-2 px-2 border-b">{order.paymentStatus}</td>
                  <td className="py-2 px-2 border-b">{order.deliveryStatus}</td>
                  <td className="py-2 px-2 border-b">
                    {new Date(order.purchaseDate).toLocaleString()}
                  </td>
                  <td className="py-2 px-2 border-b text-center">
                    <button onClick={() => setPreviewOrder(order)}>
                      <FaEye />
                    </button>
                    <button onClick={() => downloadReceiptAsImage(order)}>
                      <FaDownload />
                    </button>
                    <button onClick={() => downloadReceiptAsPdf(order)}>
                      <FaDownload /> PDF
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-2 px-2 border-b text-center">
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

      {previewOrder && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setPreviewOrder(null)}
        >
          <div
            className="bg-white p-8 rounded-lg shadow-md"
            id={`order-${previewOrder._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">Receipt Preview</h2>
            <p>Item Name: {previewOrder.itemDetails.name}</p>
            <p>Total Price: {previewOrder.totalPrice}</p>
            <p>Payment Method: {previewOrder.paymentMethod}</p>
            <p>Payment Status: {previewOrder.paymentStatus}</p>
            <p>Delivery Status: {previewOrder.deliveryStatus}</p>
            <p>
              Purchase Date:{" "}
              {new Date(previewOrder.purchaseDate).toLocaleString()}
            </p>
            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
                onClick={() => downloadReceiptAsImage(previewOrder)}
              >
                <FaDownload /> Download as PNG
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => downloadReceiptAsPdf(previewOrder)}
              >
                <FaDownload /> Download as PDF
              </button>
              <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setPreviewOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
