const Product = require("../../models/product");


const searchProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 products per page
        const skip = (page - 1) * limit; // Pagination offset
        const searchQuery = req.query.q || ""; // Capture the search query from URL

        // Define search filter
        let searchOptions = {};

        if (searchQuery.trim() !== "") {
            // Create a regex for case-insensitive search (for both name and details)
            const regex = new RegExp(searchQuery, "i");
            searchOptions = {
                $or: [
                    { name: regex }, // Search in the name field
                    // { details: regex } // If you want to search the details field as well
                ]
            };
        }

        // Fetch products from the database with the search and pagination filter
        const products = await Product.find(searchOptions)
            .skip(skip) // Apply pagination
            .limit(limit); // Apply limit to results

        // Get the total number of products for pagination
        const totalProducts = await Product.countDocuments(searchOptions);

        // Send response
        res.json({
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};


module.exports = { searchProducts };
