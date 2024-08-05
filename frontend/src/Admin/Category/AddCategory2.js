import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";

const AddCategory2 = () => {
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/category", {
        params: { search: searchQuery, page, limit },
      });
      setCategories(response.data.category);
      setTotalPages(Math.ceil(response.data.totalCount / limit));
      setError("");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [searchQuery, page, limit]);

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`/category/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category. Please try again later.");
      toast.error("Failed to delete category. Please try again later.");
    }
  };

  const handlePaginationClick = (newPage) => {
    setPage(newPage);
  };

  const renderPaginationButtons = () => {
    const buttonsPerPage = 5;
    const totalPagesGroups = Math.ceil(totalPages / buttonsPerPage);

    let startPage = Math.max(1, page - 2);
    let endPage = Math.min(startPage + buttonsPerPage - 1, totalPages);

    if (endPage - startPage < buttonsPerPage - 1) {
      startPage = Math.max(1, endPage - buttonsPerPage + 1);
    }

    const handleClickChangeGroup = (direction) => {
      if (direction === "previous") {
        setPage((prevPage) => Math.max(1, prevPage - 1));
      } else if (direction === "next") {
        setPage((prevPage) => Math.min(totalPages, prevPage + 1));
      }
    };

    return (
      <div>
        {page !== 1 && (
          <button onClick={() => handleClickChangeGroup("previous")}>
            Previous
          </button>
        )}
        {[...Array(endPage - startPage + 1)].map((_, index) => {
          const pageNumber = startPage + index;
          return (
            <button
              key={pageNumber}
              className={`mx-1 px-3 py-1 rounded-full border ${
                pageNumber === page
                  ? "bg-indigo-500 text-white"
                  : "text-indigo-500 border-gray-300"
              }`}
              onClick={() => handlePaginationClick(pageNumber)}
            >
              {pageNumber}
            </button>
          );
        })}
        {page !== totalPages && (
          <button onClick={() => handleClickChangeGroup("next")}>Next</button>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-semibold text-center text-indigo-700 my-6">
        Category
      </h1>

      <div>
        <label className="block font-semibold text-xl text-gray-700">
          Category Name
        </label>

        <div className="flex flex-row py-3 gap-3 flex-wrap">
          <form className="space-x-2 ">
            <input
              type="text"
              value={name}
              placeholder="Enter Category"
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              className={`inline-block px-3 py-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            />

            <button
              type="submit"
              className="py-2 px-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>

          <form className="">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search categories"
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              className="inline-block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </form>
        </div>
        {error && <p className="text-sm mt-2 text-red-500">{error}</p>}
      </div>

      {loading ? (
        <div className="text-center my-6">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center my-6">No categories found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-200">
                  <td className="py-2 px-5 border-b text-center capitalize">
                    {category.name}
                  </td>
                  <td className="py-2 border-b px-1 text-center">
                    <div className="flex justify-center">
                      <button
                        className="text-red-500 hover:text-orange-500 inline-block"
                        onClick={() => handleDeleteClick(category._id)}
                        data-tooltip-id={category._id}
                        data-tooltip-content="Delete"
                      >
                        <FaTrashAlt size={18} />
                      </button>
                      <ReactTooltip place={"bottom-end"} id={category._id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          {renderPaginationButtons()}
        </div>
      )}
    </div>
  );
};

export default AddCategory2;
