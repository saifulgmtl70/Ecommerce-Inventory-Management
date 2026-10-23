
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";

const UpdateProdut = () => {
    const { id } = useParams();
    const products = useLoaderData();
    const navigate = useNavigate();

    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const product = Array.isArray(products)
        ? products.find((item) => item._id === id)
        : products && products._id === id
        ? products
        : null;

    const [isUpdating, setIsUpdating] = useState(false);

    const [stockQuantity, setStockQuantity] = useState(
        product?.stockQuantity ?? 0
    );

    const [lowStockThreshold, setLowStockThreshold] = useState(
        product?.lowStockThreshold ?? 5
    );

    const imgbbAPIKey = "d8071d1fd460bb31d496e9077fef1917";

    if (!product) {
        return (
            <section className="nunito_sans">
                <div className="px-6 md:px-14 py-10">
                    <h1 className="text-3xl font-bold">
                        This product is not found
                    </h1>

                    <p className="mt-4">
                        We couldn't find the product you're looking for.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admindashboard/manageproduct")
                        }
                        className="mt-6 px-6 py-3 bg-[#00B207] text-white rounded"
                    >
                        Back to Manage Products
                    </button>
                </div>
            </section>
        );
    }

    const uploadImageToImgbb = async (file) => {
        if (!file) {
            return null;
        }

        const formData = new FormData();
        formData.append("image", file);

        const response = await axiosPublic.post(
            `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
            formData
        );

        return response.data.data.url;
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        if (isUpdating) return;

        const form = e.currentTarget;

        const name = form.name.value.trim();
        const category = form.category.value;
        const price = Number(form.price.value);
        const sale = form.discount.value.trim();
        const rating = Number(form.rating.value);
        const description = form.description.value.trim();

        const quantity = Number(form.stockQuantity.value);
        const threshold = Number(form.lowStockThreshold.value);

        if (!name) {
            toast.error("Product name is required.");
            return;
        }

        if (!Number.isFinite(price) || price < 0) {
            toast.error("Please enter a valid product price.");
            return;
        }

        if (
            !Number.isFinite(rating) ||
            rating < 0 ||
            rating > 5
        ) {
            toast.error("Rating must be between 0 and 5.");
            return;
        }

        if (
            !Number.isInteger(quantity) ||
            quantity < 0
        ) {
            toast.error("Stock quantity must be a whole number of 0 or more.");
            return;
        }

        if (
            !Number.isInteger(threshold) ||
            threshold < 0
        ) {
            toast.error("Low stock threshold must be a whole number of 0 or more.");
            return;
        }

        setIsUpdating(true);

        try {
            const selectedFiles = [
                form.image_1.files[0],
                form.image_2.files[0],
                form.image_3.files[0],
                form.image_4.files[0],
            ];

            const uploadedImages = await Promise.all(
                selectedFiles.map((file) => uploadImageToImgbb(file))
            );

            // Keep existing images when no new image is selected.
            const existingImages = Array.isArray(product.images)
                ? product.images
                : [];

            const images = existingImages.map(
                (existingImage) => existingImage
            );

            uploadedImages.forEach((imageUrl, index) => {
                if (imageUrl) {
                    images[index] = imageUrl;
                }
            });

            const availability =
                quantity > 0 ? "In Stock" : "Out of Stock";

            const productItem = {
                name,
                category,
                price,
                sale,
                rating,
                availability,
                description,
                images,
                stockQuantity: quantity,
                lowStockThreshold: threshold,
            };

            const response = await axiosSecure.patch(
                `/products/${product._id}`,
                productItem
            );

            console.log("Product update response:", response.data);

            toast.success(`${name} updated successfully!`, {
                position: "top-center",
                autoClose: 1200,
            });

            setTimeout(() => {
                navigate("/admindashboard/manageproduct");
            }, 1300);
        } catch (error) {
            console.error("Error updating product:", error);

            const errorMessage =
                error.response?.data?.message ||
                "Failed to update product. Please try again.";

            toast.error(errorMessage, {
                position: "top-center",
                autoClose: 2500,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const currentStock = Number(product.stockQuantity ?? 0);
    const currentThreshold = Number(product.lowStockThreshold ?? 5);

    const currentInventoryStatus =
        currentStock <= 0
            ? "Out of Stock"
            : currentStock <= currentThreshold
            ? "Low Stock"
            : "In Stock";

    const inventoryStatusClass =
        currentInventoryStatus === "Out of Stock"
            ? "bg-red-100 text-red-700"
            : currentInventoryStatus === "Low Stock"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-green-100 text-green-700";

    return (
        <section className="px-4 md:px-12 my-10 md:my-20 py-8 md:py-12">
            <Helmet>
                <title>Shopery | Update Product</title>
            </Helmet>

            <ToastContainer />

            <div className="text-center font_Inter mb-10">
                <h2 className="text-2xl md:text-[27px] leading-relaxed uppercase text-[#333] font-bold">
                    Update the{" "}
                    <span className="text-[#00B207]">
                        {product.name}
                    </span>
                </h2>

                <p className="text-gray-500 mt-2">
                    Update product details, images and inventory.
                </p>
            </div>

            <div className="w-full bg-white h-auto px-4 md:px-10 mb-12 py-6 rounded-md shadow-sm">
                {/* Current Inventory Summary */}
                <div className="mb-8 rounded-lg border border-gray-200 p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Current Inventory
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-50 rounded-md p-4">
                            <p className="text-sm text-gray-500">
                                Current Stock
                            </p>

                            <p className="text-2xl font-bold text-gray-800">
                                {product.stockQuantity ?? "Not set"}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-md p-4">
                            <p className="text-sm text-gray-500">
                                Low Stock Threshold
                            </p>

                            <p className="text-2xl font-bold text-gray-800">
                                {product.lowStockThreshold ?? 5}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-md p-4">
                            <p className="text-sm text-gray-500 mb-2">
                                Inventory Status
                            </p>

                            <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${inventoryStatusClass}`}
                            >
                                {currentInventoryStatus}
                            </span>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleUpdateProduct}
                    className="w-full my-6"
                >
                    {/* Product Name and Category */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="mb-5">
                            <label
                                htmlFor="productName"
                                className="block text-[17px] text-[#3e3d3d] font-semibold mb-2"
                            >
                                Product Name *
                            </label>

                            <input
                                id="productName"
                                type="text"
                                defaultValue={product.name}
                                name="name"
                                className="px-4 py-4 w-full focus:outline-none border focus:border-[#02B308] rounded-[3px] bg-[#F1F5F9]"
                                placeholder="Product Name"
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="productCategory"
                                className="block text-[17px] text-[#454545] font-semibold mb-2"
                            >
                                Category *
                            </label>

                            <select
                                id="productCategory"
                                defaultValue={product.category}
                                name="category"
                                required
                                className="px-4 py-4 w-full focus:outline-none border focus:border-[#02B308] rounded-[3px] bg-[#F1F5F9]"
                            >
                                <option value="Beverages">Beverages</option>
                                <option value="Grocery">Grocery</option>
                                <option value="Snacks">Snacks</option>
                                <option value="Personal Care">Personal Care</option>
                                <option value="Cosmetics">Cosmetics</option>
                                <option value="Baby Care">Baby Care</option>
                                <option value="Health & Hygiene">
                                    Health & Hygiene
                                </option>
                                <option value="Electrical">Electrical</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Home & Kitchen">
                                    Home & Kitchen
                                </option>
                                <option value="Jewellery">Jewellery</option>
                                <option value="Perfume & Attar">
                                    Perfume & Attar
                                </option>
                                <option value="Stationery">Stationery</option>
                            </select>
                        </div>
                    </div>

                    {/* Price and Discount */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="mb-5">
                            <label
                                htmlFor="productPrice"
                                className="block text-[17px] text-[#454545] font-semibold mb-2"
                            >
                                Price (৳) *
                            </label>

                            <input
                                id="productPrice"
                                type="number"
                                min="0"
                                step="0.01"
                                defaultValue={product.price}
                                name="price"
                                className="px-4 py-4 w-full focus:outline-none border focus:border-[#02B308] rounded-[3px] bg-[#F1F5F9]"
                                placeholder="Price"
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="productDiscount"
                                className="block text-[17px] text-[#3e3d3d] font-semibold mb-2"
                            >
                                Discount
                            </label>

                            <input
                                id="productDiscount"
                                type="text"
                                defaultValue={product.sale ?? ""}
                                name="discount"
                                className="px-4 py-4 w-full focus:outline-none border focus:border-[#02B308] rounded-[3px] bg-[#F1F5F9]"
                                placeholder="Discount"
                            />
                        </div>
                    </div>

                    {/* Rating and Stock Quantity */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="mb-5">
                            <label
                                htmlFor="productRating"
                                className="block text-[17px] text-[#3e3d3d] font-semibold mb-2"
                            >
                                Rating (0–5) *
                            </label>

                            <input
                                id="productRating"
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                defaultValue={product.rating ?? 0}
                                name="rating"
                                className="px-4 py-4 w-full focus:outline-none border focus:border-[#02B308] rounded-[3px] bg-[#F1F5F9]"
                                placeholder="Product Rating"
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="stockQuantity"
                                className="block text-[17px] text-[#3e3d3d] font-semibold mb-2"
                            >
                                Stock Quantity *
                            </label>

                            <input
                                id="stockQuantity"
                                type="number"
                                min="0"
                                step="1"
                                name="stockQuantity"
                                value={stockQuantity}
                                onChange={(e) =>
                                    setStockQuantity(e.target.value)
                                }
                                className="px-4 py-4 w-full focus:outline-none border focus:border-[#02B308] rounded-[3px] bg-[#F1F5F9]"
                                placeholder="Available quantity"
                                required
                            />

                            <p className="text-xs text-gray-500 mt-2">
                                Enter the number of units currently available.
                            </p>
                        </div>
                    </div>

                    {/* Low Stock Threshold and Availability */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="mb-5">
                            <label
                                htmlFor="lowStockThreshold"
                                className="block text-[17px] text-[#3e3d3d] font-semibold mb-2"
                            >
                                Low Stock Threshold *
                            </label>

                            <input
                                id="lowStockThreshold"
                                type="number"
                                min="0"
                                step="1"
                                name="lowStockThreshold"
                                value={lowStockThreshold}
                                onChange={(e) =>
                                    setLowStockThreshold(e.target.value)
                                }
                                className="px-4 py-4 w-full focus:outline-none border focus:border-[#02B308] rounded-[3px] bg-[#F1F5F9]"
                                placeholder="Example: 5"
                                required
                            />

                            <p className="text-xs text-gray-500 mt-2">
                                Products at or below this quantity will be
                                marked Low Stock.
                            </p>
                        </div>

                        <div className="mb-5">
                            <label
                                htmlFor="availability"
                                className="block text-[17px] text-[#454545] font-semibold mb-2"
                            >
                                Availability (Automatic)
                            </label>

                            <input
                                id="availability"
                                type="text"
                                value={
                                    Number(stockQuantity) > 0
                                        ? "In Stock"
                                        : "Out of Stock"
                                }
                                readOnly
                                className="px-4 py-4 w-full border rounded-[3px] bg-gray-100 text-gray-700 cursor-not-allowed"
                            />

                            <p className="text-xs text-gray-500 mt-2">
                                This value updates automatically when stock
                                quantity changes.
                            </p>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mb-8">
                        <label
                            htmlFor="productDescription"
                            className="block text-[17px] text-[#454545] font-semibold mb-2"
                        >
                            Product Description *
                        </label>

                        <textarea
                            id="productDescription"
                            name="description"
                            defaultValue={product.description ?? ""}
                            className="px-4 py-6 w-full focus:outline-none border focus:border-[#02B308] h-48 rounded-[3px] bg-[#F1F5F9] resize-none"
                            placeholder="Product Description"
                            required
                        />
                    </div>

                    {/* Existing Product Images */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">
                            Product Images
                        </h3>

                        <p className="text-sm text-gray-500 mb-4">
                            Select a new image only if you want to replace
                            that image. Leave the field empty to keep the
                            existing image.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[0, 1, 2, 3].map((index) => (
                                <div
                                    key={index}
                                    className="border rounded-md p-3"
                                >
                                    <p className="text-sm font-semibold mb-3">
                                        Product Image {index + 1}
                                    </p>

                                    {product.images?.[index] && (
                                        <img
                                            src={product.images[index]}
                                            alt={`${product.name} image ${index + 1}`}
                                            className="w-full h-32 object-contain bg-gray-50 rounded mb-3"
                                        />
                                    )}

                                    <input
                                        type="file"
                                        name={`image_${index + 1}`}
                                        accept="image/*"
                                        className="w-full text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 my-8">
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/admindashboard/manageproduct")
                            }
                            disabled={isUpdating}
                            className="px-8 py-3 rounded-sm border border-gray-300 text-gray-700 font-bold disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-sm bg-gradient-to-r from-[#02B308] to-[#02b30899] text-white text-[16px] font-bold disabled:opacity-60"
                        >
                            {isUpdating
                                ? "Updating Product..."
                                : "Update Product"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UpdateProdut;
