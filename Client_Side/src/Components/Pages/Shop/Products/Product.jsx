import React, { useEffect, useState } from "react";

import { FiShoppingCart } from "react-icons/fi";
import { FaRegEye, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { FaFacebookF } from "react-icons/fa6";
import {
    FaTwitter,
    FaPinterestP,
    FaInstagram,
} from "react-icons/fa";

import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./products.css";

import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useWishlist from "../../../Hooks/useWishlist";
import useAdmin from "../../../Hooks/useAdmin";


const Product = ({
    product,
    isModalOpen,
    openModal,
    closeModal,
}) => {
    const {
        _id,
        name,
        category,
        price,
        images = [],
        rating,
        availability,
        description,
        stockQuantity,
        lowStockThreshold,
    } = product;

    const { user } = useAuth();
    const [isAdmin] = useAdmin();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const [, refetch] = useWishlist();

    const [selectedImage, setSelectedImage] = useState(images[0] || "");
    const [quantity, setQuantity] = useState(1);

    // Stock information
    const hasStockTracking =
        stockQuantity !== undefined && stockQuantity !== null;

    const stock = hasStockTracking
        ? Math.max(0, Number(stockQuantity) || 0)
        : null;

    const threshold =
        lowStockThreshold !== undefined &&
        lowStockThreshold !== null &&
        lowStockThreshold !== ""
            ? Math.max(0, Number(lowStockThreshold) || 0)
            : null;

    // Determine current availability
    const isOutOfStock = hasStockTracking
        ? stock <= 0
        : availability === "Out of Stock";

    const isLowStock =
        !isOutOfStock &&
        hasStockTracking &&
        threshold !== null &&
        threshold > 0 &&
        stock <= threshold;

    const stockStatus = isOutOfStock
        ? "Out of Stock"
        : isLowStock
        ? `Only ${stock} left!`
        : "In Stock";

    const getStockStatusClass = () => {
        if (isOutOfStock) {
            return "bg-[#FDEDED] text-[#EA4B48]";
        }

        if (isLowStock) {
            return "bg-orange-100 text-orange-700";
        }

        return "bg-[#D2F0D4] text-[#2C742F]";
    };

    // Reset image and quantity when the product changes
    useEffect(() => {
        setSelectedImage(images[0] || "");
        setQuantity(1);
    }, [_id, images]);

    // Quantity controls
    const increaseQuantity = () => {
        if (isOutOfStock) return;

        setQuantity((previousQuantity) => {
            if (
                hasStockTracking &&
                previousQuantity >= stock
            ) {
                toast.info(
                    "You cannot select more than the available stock.",
                    {
                        position: "top-center",
                        autoClose: 2500,
                    }
                );

                return previousQuantity;
            }

            return previousQuantity + 1;
        });
    };

    const decreaseQuantity = () => {
        setQuantity((previousQuantity) =>
            Math.max(1, previousQuantity - 1)
        );
    };

    const handleQuantityChange = (event) => {
        const value = Number(event.target.value);

        if (!Number.isFinite(value) || value < 1) {
            setQuantity(1);
            return;
        }

        if (hasStockTracking && value > stock) {
            setQuantity(stock);

            toast.info(`Only ${stock} item(s) available in stock.`, {
                position: "top-center",
                autoClose: 2500,
            });

            return;
        }

        setQuantity(Math.floor(value));
    };

    // Rating stars
    const renderStars = (productRating) => {
        const safeRating = Math.min(
            5,
            Math.max(0, Number(productRating) || 0)
        );

        const fullStars = Math.floor(safeRating);
        const halfStar = safeRating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                {Array.from({ length: fullStars }, (_, index) => (
                    <FaStar
                        key={`full-${index}`}
                        className="text-yellow-500"
                    />
                ))}

                {halfStar && (
                    <FaStarHalfAlt className="text-yellow-500" />
                )}

                {Array.from({ length: emptyStars }, (_, index) => (
                    <FaRegStar
                        key={`empty-${index}`}
                        className="text-yellow-500"
                    />
                ))}
            </div>
        );
    };

    // Wishlist functionality
    const handleWishList = async () => {
        if (!user) {
            toast.info("Please log in to add products to your wishlist.", {
                position: "top-center",
                autoClose: 2500,
            });

            navigate("/login");
            return;
        }

        if (isAdmin) {
            toast.info("Admin users cannot add items to the wishlist.", {
                position: "top-center",
                autoClose: 3000,
            });

            return;
        }

        try {
            const response = await axiosPublic.get("/wishlist", {
                params: {
                    email: user.email,
                },
            });

            const wishlistItems = response.data;

            const alreadyExists = wishlistItems.some(
                (item) => item.cartId === _id
            );

            if (alreadyExists) {
                toast.info(`${name} is already added to the Wishlist.`, {
                    position: "top-center",
                    autoClose: 3000,
                });

                return;
            }

            const wishlist = {
                cartId: _id,
                email: user.email,
                product: name,
                image: images[0] || "",
                price,
                availability: isOutOfStock
                    ? "Out of Stock"
                    : "In Stock",
            };

            const result = await axiosPublic.post(
                "/wishlist",
                wishlist
            );

            if (result.data.insertedId) {
                toast.success(`${name} is added to the Wishlist.`, {
                    position: "top-center",
                    autoClose: 3000,
                    onClose: () => navigate("/wishlist"),
                });

                refetch();
            }
        } catch (error) {
            console.error("Wishlist error:", error);

            toast.error(
                "Could not update your wishlist. Please try again.",
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );
        }
    };

    return (
        <div>
            <ToastContainer />

            {/* Product Card */}
            <div
                className="h-auto p-4 border rounded-[3px] product_Card relative"
                
            >
                {/* Product Image */}
                <div>
                    <img
                        src={images[0] || ""}
                        alt={name}
                        className="w-auto lg:w-[260px] h-auto lg:h-[160px] mx-auto"
                    />
                </div>

                {/* Product Information */}
                <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <Link
                            to={`/product/${_id}`}
                            state={{ productId: _id }}
                        >
                            <h4 className="text-[#333] font-[600] text-[17px] hover-text-color">
                                {name}
                            </h4>
                        </Link>

                        <p className="text-bold text-[#111]">
                            ৳{price}
                        </p>

                        <div className="flex items-center">
                            {renderStars(rating)}
                        </div>
                    </div>

                    <div
                        className={`p-2 rounded-full ${
                            isOutOfStock
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#eee] text-[#111] cursor-pointer"
                        } cart`}
                        title={
                            isOutOfStock
                                ? "Out of Stock"
                                : "View product details"
                        }
                    >
                        <FiShoppingCart />
                    </div>
                </div>

                {/* Stock Status on Product Card */}
                <div className="mt-3">
                    <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded font-semibold ${getStockStatusClass()}`}
                    >
                        <span
                            className={`inline-block h-2 w-2 rounded-full ${
                                isOutOfStock
                                    ? "bg-red-500"
                                    : isLowStock
                                    ? "bg-orange-500"
                                    : "bg-green-600"
                            }`}
                        />

                        {stockStatus}
                    </span>
                </div>

                {/* Wishlist and Quick View */}
                <div className="absolute top-2 right-2 text-[17px] heart_eye">
                    <CiHeart
                        className="cursor-pointer"
                        onClick={handleWishList}
                    />

                    <FaRegEye
                        className="cursor-pointer"
                        onClick={() => openModal(_id)}
                    />
                </div>

                {/* Original Availability Badge Position */}
                
            

                {/* Quick View Modal */}
                {isModalOpen &&
                    createPortal(
                        <div
                            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
                            onClick={closeModal}
                        >
                            <div
                                className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
                                onClick={(event) => event.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-red-500 hover:text-white"
                                    aria-label="Close product details"
                                >
                                    <IoMdClose size={22} />
                                </button>

                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                    {/* Product Images */}
                                    <div className="flex items-center gap-4">
                                        {/* Thumbnails */}
                                        <div className="flex flex-col gap-3">
                                            {images.map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    onClick={() =>
                                                        setSelectedImage(img)
                                                    }
                                                    className={`h-16 w-16 cursor-pointer rounded-lg border-2 object-cover ${
                                                        selectedImage === img
                                                            ? "border-green-600"
                                                            : "border-gray-200"
                                                    }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Main Image */}
                                        <div className="flex flex-1 items-center justify-center">
                                            <img
                                                src={
                                                    selectedImage ||
                                                    images[0] ||
                                                    ""
                                                }
                                                alt={name}
                                                className="max-h-[350px] w-full object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Product Information */}
                                    <div className="space-y-5">
                                        {/* Product Name and Stock */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-2xl font-bold text-gray-800">
                                                {name}
                                            </h2>

                                            <span
                                                className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded font-semibold ${getStockStatusClass()}`}
                                            >
                                                <span
                                                    className={`inline-block h-2 w-2 rounded-full ${
                                                        isOutOfStock
                                                            ? "bg-red-500"
                                                            : isLowStock
                                                            ? "bg-orange-500"
                                                            : "bg-green-600"
                                                    }`}
                                                />

                                                {stockStatus}
                                            </span>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-3">
                                            {renderStars(rating)}
                                        </div>

                                        {/* Price */}
                                        <p className="text-3xl font-bold text-green-600">
                                            ৳{price}
                                        </p>

                                        <hr />

                                        {/* Description */}
                                        <p className="leading-7 text-gray-600">
                                            {description}
                                        </p>

                                        {/* Category */}
                                        <p className="text-gray-700">
                                            <strong>Category:</strong>{" "}
                                            {category}
                                        </p>

                                        {/* Quantity and Add to Cart */}
                                        <div className="flex flex-wrap items-center gap-4">
                                            {/* Quantity Selector */}
                                            <div
                                                className={`flex items-center rounded-lg border ${
                                                    isOutOfStock
                                                        ? "opacity-50"
                                                        : ""
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={decreaseQuantity}
                                                    disabled={
                                                        isOutOfStock ||
                                                        quantity <= 1
                                                    }
                                                    className="px-4 py-2 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    aria-label="Decrease quantity"
                                                >
                                                    -
                                                </button>

                                                <input
                                                    type="number"
                                                    value={
                                                        isOutOfStock
                                                            ? 0
                                                            : quantity
                                                    }
                                                    onChange={handleQuantityChange}
                                                    min={1}
                                                    max={
                                                        hasStockTracking
                                                            ? stock
                                                            : undefined
                                                    }
                                                    disabled={isOutOfStock}
                                                    className="w-14 border-x py-2 text-center outline-none disabled:cursor-not-allowed"
                                                    aria-label="Product quantity"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={increaseQuantity}
                                                    disabled={
                                                        isOutOfStock ||
                                                        (hasStockTracking &&
                                                            quantity >= stock)
                                                    }
                                                    className="px-4 py-2 text-lg hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    aria-label="Increase quantity"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Add to Cart */}
                                            <button
                                                type="button"
                                                disabled={isOutOfStock}
                                                className={`flex items-center gap-3 rounded-full px-8 py-3 font-semibold text-white transition ${
                                                    isOutOfStock
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-[#00B307] hover:bg-green-700"
                                                }`}
                                                title={
                                                    isOutOfStock
                                                        ? "This product is currently unavailable"
                                                        : "Add to Cart"
                                                }
                                            >
                                                {isOutOfStock
                                                    ? "Out of Stock"
                                                    : "Add to Cart"}

                                                <FiShoppingCart />
                                            </button>

                                            {/* Wishlist */}
                                            <button
                                                type="button"
                                                onClick={handleWishList}
                                                className="rounded-full border p-3 text-xl hover:bg-gray-100"
                                                aria-label="Add to wishlist"
                                            >
                                                <CiHeart />
                                            </button>
                                        </div>

                                        {/* Low Stock Message */}
                                        {isLowStock && (
                                            <p className="text-sm font-medium text-orange-700">
                                                Hurry! Only {stock} item(s)
                                                left in stock.
                                            </p>
                                        )}

                                        {/* Out of Stock Message */}
                                        {isOutOfStock && (
                                            <p className="text-sm font-medium text-red-600">
                                                This product is currently
                                                unavailable.
                                            </p>
                                        )}

                                        <hr />

                                        {/* Social Share */}
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-gray-700">
                                                Share:
                                            </span>

                                            <div className="flex items-center gap-3 text-gray-600">
                                                <FaFacebookF className="cursor-pointer hover:text-green-600" />

                                                <FaTwitter className="cursor-pointer hover:text-green-600" />

                                                <FaPinterestP className="cursor-pointer hover:text-green-600" />

                                                <FaInstagram className="cursor-pointer hover:text-green-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}
            </div>
        </div>
    );
};

export default Product;