import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import CategorySelect from "../Components/CategorySelect";

const ProductWithCategory = () => {
  const [products, setProducts] = useState([]);
  const { categoryId } = useParams();
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data
    axios
      .get(`${apiUrl}/api/products/category/${categoryId}`)
      .then((response) => {
        setProducts(response.data);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false); // Set loading to false if there's an error
      });
  }, [categoryId]);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    setFilteredProducts(filtered);
  }, [products, priceRange]);

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching data
    axios
      .get(`${apiUrl}/category/${categoryId}`)
      .then((response) => {
        setSelectedCategoryId(response.data._id);
        setLoading(false); // Set loading to false when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching category name:", error);
        setLoading(false); // Set loading to false if there's an error
      });
  }, [categoryId]);

  const handlePriceRangeChange = (e) => {
    const newMaxPrice = parseInt(e.target.value);
    setPriceRange([0, newMaxPrice]);
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <div className="">
          <CategorySelect selectedCategoryId={selectedCategoryId} />
        </div>

        <div className="flex items-center mb-4">
          <label className="mr-4">Price Range:</label>
          <input
            type="range"
            min="0"
            max="10000" // Adjust the max value according to your maximum price range
            value={priceRange[1]} // Use the maximum value of the price range as the input value
            onChange={handlePriceRangeChange}
            className="w-1/2 mr-4"
          />
          <span className="text-lg font-semibold">${priceRange[1]}</span>{" "}
          {/* Display the selected maximum price */}
        </div>
        {loading ? (
          <div>Loading...</div> // Render loading indicator while data is being fetched
        ) : filteredProducts.length === 0 ? (
          <div>No products found in the selected price range.</div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <li
                key={product._id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <Link
                  to={`/products/${product._id}`}
                  className="block hover:shadow-lg"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center  group  overflow-hidden">
                    <img
                      src={`${apiUrl}/images/${product.photo}`}
                      alt={product.name}
                      className="h-full w-full object-cover  group-hover:scale-105  transform transition duration-200"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-2 line-clamp-1">
                      {product.details}
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      {product.categoryId.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        Rs.{product.price}
                      </span>
                      <button className="bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded hover:bg-blue-700 transition duration-200">
                        View Product
                      </button>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductWithCategory;
