import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrashAlt, FaEye, FaSearch, FaPlus } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 2; // Number of products per page
  const [editField, setEditField] = useState({
    id: null,
    field: "",
    value: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`/products/list`, {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
        },
      });
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      setError(error);
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again later.");
      toast.error("Failed to delete product. Please try again later.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleDoubleClick = (id, field, value) => {
    setEditField({ id, field, value });
  };

  const handleInputChange = (e) => {
    setEditField((prev) => ({ ...prev, value: e.target.value }));
  };

  const handleKeyPress = async (e, id, field) => {
    if (e.key === "Enter") {
      try {
        await axios.put(`/products/${id}`, {
          [field]: editField.value,
        });
        toast.success("Product updated successfully");
        setEditField({ id: null, field: "", value: "" });
        fetchProducts(); // Refresh the product list after updating
      } catch (error) {
        console.error("Error updating product:", error);
        setError("Failed to update product. Please try again later.");
        toast.error("Failed to update product. Please try again later.");
      }
    }
  };

  const renderEditableCell = (id, field, value) => {
    if (editField.id === id && editField.field === field) {
      return (
        <input
          type="text"
          value={editField.value}
          onChange={handleInputChange}
          onKeyPress={(e) => handleKeyPress(e, id, field)}
          autoFocus
        />
      );
    } else {
      return (
        <span onDoubleClick={() => handleDoubleClick(id, field, value)}>
          {value}
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center text-indigo-700 my-6">
        Product List
      </h1>

      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        </div>

        <span className="ml-4 text-gray-600 hidden md:block">
          Total Products: {products.length}
        </span>
        <span className="border-x-2 p-2 rounded-xl shadow-lg border-x-indigo-800 hover:shadow-xl">
          <Link
            to="/admin/products/addproduct"
            className="text-indigo-500 hover:text-in-700 flex items-center "
          >
            <FaPlus className="mr-1" />
            Add Product
          </Link>
        </span>
      </div>
      {error && <div className="text-red-600">{error.toString()}</div>}
      {products.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No products found.</p>
          <Link
            to="/admin/products/addproduct"
            className="border-blue-500 border-b-2 hover:border-r-[6px] hover:border-b-[6px] hover:shadow-inner p-2"
          >
            Add Product
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Details</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Stock</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-200">
                  <td className="py-2 px-4 border-b relative">
                    <img
                      src={`/images/${product.photo}`}
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />
                  </td>
                  <td
                    className="py-2 px-1 border-b text-center"
                    onDoubleClick={() =>
                      handleDoubleClick(product._id, "name", product.name)
                    }
                  >
                    {renderEditableCell(product._id, "name", product.name)}
                  </td>
                  <td
                    className="py-2 px-1 border-b text-center"
                    onDoubleClick={() =>
                      handleDoubleClick(product._id, "details", product.details)
                    }
                  >
                    {renderEditableCell(
                      product._id,
                      "details",
                      product.details
                    )}
                  </td>
                  <td
                    className="py-2 px-1 border-b text-center"
                    onDoubleClick={() =>
                      handleDoubleClick(product._id, "price", product.price)
                    }
                  >
                    {renderEditableCell(product._id, "price", product.price)}
                  </td>
                  <td
                    className="py-2 px-1 border-b text-center"
                    onDoubleClick={() =>
                      handleDoubleClick(product._id, "stock", product.stock)
                    }
                  >
                    {renderEditableCell(product._id, "stock", product.stock)}
                  </td>
                  <td className="py-2 border-b space-x-3 px-1 text-center">
                    <Link
                      to={`/admin/products/update/${product._id}`}
                      className="text-blue-500 hover:text-blue-700 inline-block"
                      data-tooltip-id={product._id}
                      data-tooltip-content="Update"
                    >
                      <FaEdit size={18} />
                    </Link>
                    <Link
                      to={`/admin/products/${product._id}`}
                      className="text-green-600 hover:text-green-700 inline-block"
                      data-tooltip-id={product._id}
                      data-tooltip-content="View"
                    >
                      <FaEye size={18} />
                    </Link>
                    <button
                      className="text-red-500 hover:text-orange-500 inline-block"
                      onClick={() => handleDeleteClick(product._id)}
                      data-tooltip-id={product._id}
                      data-tooltip-content="Delete"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                    <ReactTooltip place={"bottom-end"} id={product._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 mx-1 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2 mx-1">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 mx-1 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
