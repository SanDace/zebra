import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrashAlt } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editField, setEditField] = useState({
    id: null,
    field: "",
    value: "",
    error: "",
  });
  const apiUrl = process.env.REACT_APP_API_URL;


  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/category`, {
        params: { search: searchQuery, page, limit },
      });
      setCategories(response.data.category);
      setTotalPages(Math.ceil(response.data.totalCount / limit));
      setError("");
      // setSearchQuery("");
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to fetch categories. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCategories();
    }, 240); // 2 seconds delay

    return () => clearTimeout(timer);
  }, [searchQuery, page, limit]);

  const handlePaginationClick = (newPage) => {
    setPage(newPage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (!name) {
      setError("Category name is required");
      return;
    }

    if (name.trim().length < 3) {
      setError("At least 3 characters are required");
      return;
    }

    if (name.trim().split(" ").length > 1) {
      setError("Only one word is allowed");
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(name.trim())) {
      setError("Name must contain only letters and numbers");
      return;
    }

    try {
      const response = await axios.post("/category/create", { name });
      if (response.status === 201) {
        toast.success("Category created successfully");
        fetchCategories();
        setName("");
        setError("");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Name already taken");
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("Server error");
      }
      console.error("Error creating category:", error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`${apiUrl}/category/${id}`);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Failed to delete category. Please try again later.");
      toast.error("Failed to delete category. Please try again later.");
    }
  };

  const handleDoubleClick = (id, field, value) => {
    setEditField({ id, field, value, error: "" });
  };

  const handleInputChange = (e) => {
    setEditField((prev) => ({ ...prev, value: e.target.value, error: "" }));
  };

  const validateEditField = (value) => {
    if (!value.trim()) {
      return "Category name is required";
    }
    if (value.trim().length < 3) {
      return "At least 3 characters are required";
    }
    if (value.trim().split(" ").length > 1) {
      return "Only one word is allowed";
    }
    if (!/^[a-zA-Z0-9]+$/.test(value.trim())) {
      return "Name must contain only letters and numbers";
    }
    return "";
  };

  const handleKeyPress = async (e, id, field) => {
    if (e.key === "Enter") {
      const validationError = validateEditField(editField.value);
      if (validationError) {
        setEditField((prev) => ({ ...prev, error: validationError }));
        return;
      }

      try {
        const response = await axios.put(`${apiUrl}/category/${id}`, {
          [field]: editField.value,
        });
        if (response.status === 200) {
          toast.success("Category updated successfully");
          setEditField({ id: null, field: "", value: "", error: "" });
          fetchCategories();
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setEditField((prev) => ({
            ...prev,
            error: "Name already taken",
          }));
        } else {
          console.error("Error updating category:", error);
          setEditField((prev) => ({
            ...prev,
            error: "Failed to update category. Please try again later.",
          }));
          toast.error("Failed to update category. Please try again later.");
        }
      }
    }
  };

  const handleBlur = (id, field, originalValue) => {
    if (editField.value.trim() === "") {
      setEditField({ id: null, field: "", value: "", error: "" });
      const updatedCategories = categories.map((category) =>
        category._id === id ? { ...category, [field]: originalValue } : category
      );
      setCategories(updatedCategories);
    }
  };

  useEffect(() => {
    setEditField({ id: null, field: "", value: "", error: "" });
  }, [searchQuery]);

  const renderEditableCell = (id, field, value) => {
    if (editField.id === id && editField.field === field) {
      return (
        <>
          <input
            className={`text-center ${editField.error ? "border-red-500" : ""}`}
            type="text"
            value={editField.value}
            onChange={handleInputChange}
            onKeyPress={(e) => handleKeyPress(e, id, field)}
            onBlur={() => handleBlur(id, field, value)}
            autoFocus
          />
          {editField.error && (
            <p className="text-sm mt-2 text-red-500">{editField.error}</p>
          )}
        </>
      );
    } else {
      return (
        <span onDoubleClick={() => handleDoubleClick(id, field, value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      );
    }
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
          <form className="space-x-2 " onSubmit={handleSubmit}>
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
                setEditField({ id: null, field: "", value: "", error: "" });
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
                  <td
                    className="py-2 px-5 border-b text-center capitalize"
                    onDoubleClick={() =>
                      handleDoubleClick(category._id, "name", category.name)
                    }
                  >
                    {renderEditableCell(
                      category._id,
                      "name",
                      category.name.toLowerCase()
                    )}
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
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`mx-1 px-3 py-1 rounded-full border ${
                page === index + 1
                  ? "bg-indigo-500 text-white"
                  : "text-indigo-500 border-gray-300"
              }`}
              onClick={() => handlePaginationClick(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddCategory;
