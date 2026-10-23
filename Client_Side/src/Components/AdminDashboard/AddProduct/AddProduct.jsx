
import { useState } from "react";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Helmet } from "react-helmet-async";

const AddProduct = () => {
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const imgbbAPIKey = "d8071d1fd460bb31d496e9077fef1917";

    const uploadImageToImgbb = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("image", file);

        const response = await axiosPublic.post(
            `https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`,
            formData
        );

        return response.data.data.url;
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        const form = e.target;

        const name = form.name.value.trim();
        const category = form.category.value;
        const price = Number(form.price.value);
        const sale = form.discount.value.trim();
        const rating = Number(form.rating.value);
        const stockQuantity = Number(form.stockQuantity.value);
        const lowStockThreshold = Number(form.lowStockThreshold.value);
        const description = form.description.value.trim();

        if (!name || !category) {
            toast.error("Please provide product name and category.");
            return;
        }

        if (!Number.isFinite(price) || price < 0) {
            toast.error("Please enter a valid price.");
            return;
        }

        if (!Number.isFinite(rating) || rating < 0 || rating > 5) {
            toast.error("Rating must be between 0 and 5.");
            return;
        }

        if (
            !Number.isInteger(stockQuantity) ||
            stockQuantity < 0
        ) {
            toast.error("Stock quantity must be a non-negative whole number.");
            return;
        }

        if (
            !Number.isInteger(lowStockThreshold) ||
            lowStockThreshold < 0
        ) {
            toast.error("Low stock threshold must be a non-negative whole number.");
            return;
        }

        const imageFiles = [
            form.image_1.files[0],
            form.image_2.files[0],
            form.image_3.files[0],
            form.image_4.files[0],
        ];

        if (!imageFiles[0]) {
            toast.error("Please select Product Image 1.");
            return;
        }

        setIsSubmitting(true);

        try {
            const uploadedImages = await Promise.all(
                imageFiles.map((file) =>
                    file ? uploadImageToImgbb(file) : Promise.resolve(null)
                )
            );

            const images = uploadedImages.filter(Boolean);

            const availability =
                stockQuantity > 0 ? "In Stock" : "Out of Stock";

            const productItem = {
                name,
                category,
                price,
                sale,
                rating,
                availability,
                description,
                images,
                stockQuantity,
                lowStockThreshold,
            };

            const response = await axiosSecure.post(
                "/products",
                productItem
            );

            if (response.status === 200 || response.status === 201) {
                toast.success("Product added successfully!", {
                    position: "top-center",
                    autoClose: 1500,
                });

                form.reset();
            } else {
                toast.error("Product could not be added.");
            }
        } catch (error) {
            console.error("Error adding product:", error);

            const message =
                error.response?.data?.message ||
                "Failed to add product. Please try again.";

            toast.error(message, {
                position: "top-center",
                autoClose: 2500,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "px-4 py-4 w-full focus:outline-none border focus:border-[#02B308] rounded-[3px] bg-[#F1F5F9]";

    const labelClass =
        "text-[17px] text-[#454545] font-[600] mb-2 block";

    return (
        <section className="px-4 lg:px-12 my-20 py-12">
            <Helmet>
                <title>Shopery | Add Product</title>
            </Helmet>

            <ToastContainer />

            <div className="text-center font_Inter mb-10">
                <h2 className="text-[27px] leading-relaxed uppercase text-[#333] font-bold">
                    ADD A PRODUCT
                </h2>
            </div>

            <div className="w-full bg-white h-auto px-5 lg:px-10 mb-12 py-3 rounded-[1px]">
                <form onSubmit={handleAddProduct} className="w-full my-6">
                    {/* Product Name and Category */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="mb-8">
                            <label className={labelClass}>
                                Product name*
                            </label>

                            <input
                                type="text"
                                name="name"
                                className={inputClass}
                                placeholder="Product Name"
                                required
                            />
                        </div>

                        <div className="mb-8">
                            <label className={labelClass}>
                                Category*
                            </label>

                            <select
                                defaultValue="default"
                                name="category"
                                required
                                className={inputClass}
                            >
                                <option disabled value="default">
                                    Select a Category
                                </option>

                                <option value="Beverages">Beverages</option>
                                <option value="Grocery">Grocery</option>
                                <option value="Snacks">Snacks</option>
                                <option value="Personal Care">Personal Care</option>
                                <option value="Cosmetics">Cosmetics</option>
                                <option value="Baby Care">Baby Care</option>
                                <option value="Health & Hygiene">
                                    Health &amp; Hygiene
                                </option>
                                <option value="Electrical">Electrical</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Home & Kitchen">
                                    Home &amp; Kitchen
                                </option>
                                <option value="Jewellery">Jewellery</option>
                                <option value="Perfume & Attar">
                                    Perfume &amp; Attar
                                </option>
                                <option value="Stationery">Stationery</option>
                            </select>
                        </div>
                    </div>

                    {/* Price and Discount */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="mb-8">
                            <label className={labelClass}>
                                Price*
                            </label>

                            <input
                                type="number"
                                name="price"
                                min="0"
                                step="0.01"
                                className={inputClass}
                                placeholder="Price"
                                required
                            />
                        </div>

                        <div className="mb-8">
                            <label className={labelClass}>
                                Discount
                            </label>

                            <input
                                type="text"
                                name="discount"
                                className={inputClass}
                                placeholder="Discount (e.g. 10%)"
                            />
                        </div>
                    </div>

                    {/* Rating and Stock */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="mb-8">
                            <label className={labelClass}>
                                Rating (0–5)*
                            </label>

                            <input
                                type="number"
                                name="rating"
                                min="0"
                                max="5"
                                step="0.1"
                                className={inputClass}
                                placeholder="Product Rating"
                                required
                            />
                        </div>

                        <div className="mb-8">
                            <label className={labelClass}>
                                Stock Quantity*
                            </label>

                            <input
                                type="number"
                                name="stockQuantity"
                                min="0"
                                step="1"
                                defaultValue="10"
                                className={inputClass}
                                placeholder="Available quantity"
                                required
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Enter 0 if the product is out of stock.
                            </p>
                        </div>
                    </div>

                    {/* Low Stock Threshold */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="mb-8">
                            <label className={labelClass}>
                                Low Stock Threshold*
                            </label>

                            <input
                                type="number"
                                name="lowStockThreshold"
                                min="0"
                                step="1"
                                defaultValue="5"
                                className={inputClass}
                                placeholder="e.g. 5"
                                required
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Low stock is detected when quantity is at or
                                below this number, provided it is above zero.
                            </p>
                        </div>

                        <div className="mb-8">
                            <label className={labelClass}>
                                Availability
                            </label>

                            <input
                                type="text"
                                value="Automatically determined from stock"
                                readOnly
                                className={`${inputClass} text-gray-600`}
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Stock above 0: In Stock. Stock at 0: Out of Stock.
                            </p>
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="mb-8">
                        <label className={labelClass}>
                            Product Description
                        </label>

                        <textarea
                            name="description"
                            className={`${inputClass} py-6 h-48 resize-none`}
                            placeholder="Product Description"
                        />
                    </div>

                    {/* Product Images */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
                        {[1, 2, 3, 4].map((number) => (
                            <div className="mb-8" key={number}>
                                <label className={labelClass}>
                                    Product Image {number}
                                    {number === 1 ? "*" : ""}
                                </label>

                                <input
                                    type="file"
                                    name={`image_${number}`}
                                    accept="image/*"
                                    required={number === 1}
                                    className="px-4 py-4 w-full border bg-[#F6F6F6] focus:outline-none rounded-[3px]"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-center my-5">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-sm bg-gradient-to-r from-[#02B308] to-[#02b30899] text-white text-[16px] font-bold disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Adding Product..." : "Add Product"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default AddProduct;
