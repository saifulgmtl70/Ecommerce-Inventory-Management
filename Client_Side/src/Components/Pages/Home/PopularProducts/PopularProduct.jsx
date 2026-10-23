
import React, { useEffect, useState } from "react";

import { FiShoppingCart } from "react-icons/fi";
import { FaRegEye, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { FaFacebookF, FaTwitter, FaPinterestP, FaInstagram } from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./popularproducts.css";

import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useWishlist from "../../../Hooks/useWishlist";
import useAdmin from "../../../Hooks/useAdmin";

const PopularProduct = ({
    popularProduct,
    isModalOpen,
    openModal,
    closeModal,
}) => {
    // Safely handle missing product data.
    const product =
        popularProduct && typeof popularProduct === "object"
            ? popularProduct
            : {};

    const {
        _id,
        name,
        category,
        price,
        sale,
        rating,
        availability,
        description,
        stockQuantity,
        lowStockThreshold,
    } = product;

    const images = Array.isArray(product.images)
        ? product.images
        : [];

    const { user } = useAuth();
    const [isAdmin] = useAdmin();
    const [, refetch] = useWishlist();

    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const [selectedImage, setSelectedImage] = useState(images[0] || "");
    const [quantity, setQuantity] = useState(1);

    // Stock information.
    const hasStockTracking =
        stockQuantity !== undefined &&
        stockQuantity !== null &&
        stockQuantity !== "";

    const parsedStock = Number(stockQuantity);

    const stock = hasStockTracking
        ? Number.isFinite(parsedStock)
            ? Math.max(0, Math.floor(parsedStock))
            : 0
        : null;

    const hasThreshold =
        lowStockThreshold !== undefined &&
        lowStockThreshold !== null &&
        lowStockThreshold !== "";

    const parsedThreshold = Number(lowStockThreshold);

    const threshold = hasThreshold
        ? Number.isFinite(parsedThreshold)
            ? Math.max(0, parsedThreshold)
            : 0
        : null;

    // If stockQuantity exists, use it as the source of truth.
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

    const stockStatusClass = isOutOfStock
        ? "bg-[#FDEDED] text-[#EA4B48]"
        : isLowStock
        ? "bg-orange-100 text-orange-700"
        : "bg-[#D2F0D4] text-[#2C742F]";

    const stockDotClass = isOutOfStock
        ? "bg-red-500"
        : isLowStock
        ? "bg-orange-500"
        : "bg-green-600";

    // Reset image and quantity when switching products.
    useEffect(() => {
        setSelectedImage(images[0] || "");
        setQuantity(1);
    }, [_id, images[0]]);

    // Prevent invalid products from rendering.
    // Hooks are declared above, so this does not violate React's Rules of Hooks.
    if (!_id) {
        return null;
    }

    // Quantity controls.
    const increaseQuantity = () => {
        if (isOutOfStock) {
            return;
        }

        if (hasStockTracking && quantity >= stock) {
            toast.info(`Only ${stock} item(s) available in stock.`, {
                position: "top-center",
                autoClose: 2500,
            });

            return;
        }

        setQuantity((previous) => previous + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((previous) => Math.max(1, previous - 1));
    };

    const handleQuantityChange = (event) => {
        const inputValue = event.target.value;

        if (inputValue === "") {
            setQuantity("");
            return;
        }

        const value = Number(inputValue);

        if (!Number.isFinite(value) || value < 1) {
            setQuantity(1);
            return;
        }

        const requestedQuantity = Math.floor(value);

        if (hasStockTracking && requestedQuantity > stock) {
            setQuantity(Math.max(1, stock));

            toast.info(`Only ${stock} item(s) available in stock.`, {
                position: "top-center",
                autoClose: 2500,
            });

            return;
        }

        setQuantity(requestedQuantity);
    };

    const handleQuantityBlur = () => {
        if (quantity === "" || quantity < 1) {
            setQuantity(isOutOfStock ? 1 : 1);
        }
    };

    // Rating stars.
    const renderStars = (productRating) => {
        const safeRating = Math.min(
            5,
            Math.max(0, Number(productRating) || 0)
        );

        const fullStars = Math.floor(safeRating);
        const hasHalfStar = safeRating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                {Array.from({ length: fullStars }, (_, index) => (
                    <FaStar
                        key={`full-${index}`}
                        className="text-yellow-500"
                    />
                ))}

                {hasHalfStar && (
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

    // Wishlist functionality.
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

            const wishlistItems = Array.isArray(response.data)
                ? response.data
                : [];

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
                availability: isOutOfStock ? "Out of Stock" : "In Stock",
            };

            const result = await axiosPublic.post("/wishlist", wishlist);

            if (result.data?.insertedId) {
                toast.success(`${name} is added to the Wishlist.`, {
                    position: "top-center",
                    autoClose: 3000,
                    onClose: () => navigate("/wishlist"),
                });

                refetch();
            } else {
                toast.info("The wishlist could not be updated.", {
                    position: "top-center",
                    autoClose: 2500,
                });
            }
        } catch (error) {
            console.error("Wishlist error:", error);

            toast.error("Could not update your wishlist. Please try again.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    // Continue to the product details page.
    // The details page should perform the actual cart operation.
    const handleAddToCart = () => {
        if (!user) {
            toast.info("Please log in before adding products to your cart.", {
                position: "top-center",
                autoClose: 2500,
            });

            navigate("/login");
            return;
        }

        if (isAdmin) {
            toast.info("Admin users cannot add products to the cart.", {
                position: "top-center",
                autoClose: 2500,
            });

            return;
        }

        if (isOutOfStock) {
            toast.error("This product is currently out of stock.", {
                position: "top-center",
                autoClose: 2500,
            });

            return;
        }

        const finalQuantity = Number(quantity);

        if (!Number.isInteger(finalQuantity) || finalQuantity < 1) {
            toast.info("Please select a valid quantity.", {
                position: "top-center",
                autoClose: 2500,
            });

            return;
        }

        if (hasStockTracking && finalQuantity > stock) {
            toast.error(`Only ${stock} item(s) are available.`, {
                position: "top-center",
                autoClose: 2500,
            });

            return;
        }

        closeModal?.();

        navigate(`/product/${_id}`, {
            state: {
                productId: _id,
                quantity: finalQuantity,
            },
        });
    };

    return (
        <div>
            <ToastContainer />

            {/* Product Card */}
            <div
                className="h-auto p-4 border rounded-[3px] product_Card relative"
               
            >
                {/* Product Image */}
                <Link
                    to={`/product/${_id}`}
                    state={{ productId: _id }}
                >
                    <img
                        src={images[0] || ""}
                        alt={name || "Product"}
                        className="w-auto lg:w-[260px] h-auto lg:h-[160px] mx-auto"
                    />
                </Link>

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

                    <button
                        type="button"
                        onClick={() => openModal?.(_id)}
                        disabled={isOutOfStock}
                        className={`p-2 rounded-full cart ${
                            isOutOfStock
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-[#eee] text-[#111] cursor-pointer"
                        }`}
                        title={
                            isOutOfStock
                                ? "Out of Stock"
                                : "View product details"
                        }
                        aria-label="View product details"
                    >
                        <FiShoppingCart />
                    </button>
                </div>

                {/* Stock Status Badge */}
                <div className="mt-3">
                    <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded font-semibold ${stockStatusClass}`}
                    >
                        <span
                            className={`inline-block h-2 w-2 rounded-full ${stockDotClass}`}
                        />
                        {stockStatus}
                    </span>
                </div>

                {/* Wishlist and Quick View */}
                <div className="absolute top-2 right-2 text-[17px] heart_eye">
                    <CiHeart
                        className="cursor-pointer"
                        onClick={handleWishList}
                        title="Add to wishlist"
                    />

                    <FaRegEye
                        className="cursor-pointer"
                        onClick={() => openModal?.(_id)}
                        title="Quick view"
                    />
                </div>

                {/* Sale Badge */}
                {sale ? (
                    <p className="absolute bg-red-500 p-2 rounded-[4px] text-white top-2 left-2">
                        Sale {sale}
                    </p>
                ) : null}

                {/* Quick View Modal */}
                {isModalOpen &&
                    typeof document !== "undefined" &&
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
                                    aria-label="Close quick view"
                                >
                                    <IoMdClose size={22} />
                                </button>

                                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                                    {/* Product Images */}
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col gap-3">
                                            {images.map((img, index) => (
                                                <img
                                                    key={`${img}-${index}`}
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

                                        <div className="flex flex-1 items-center justify-center">
                                            <img
                                                src={
                                                    selectedImage ||
                                                    images[0] ||
                                                    ""
                                                }
                                                alt={name || "Product"}
                                                className="max-h-[350px] w-full object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Product Information */}
                                    <div className="space-y-5">
                                        {/* Name and Stock Status */}
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-2xl font-bold text-gray-800">
                                                {name}
                                            </h2>

                                            <span
                                                className={`inline-flex items-center gap-1 text-sm px-3 py-1 rounded font-semibold ${stockStatusClass}`}
                                            >
                                                <span
                                                    className={`inline-block h-2 w-2 rounded-full ${stockDotClass}`}
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

                                        {/* Available Quantity */}
                                        {hasStockTracking && (
                                            <p className="text-gray-700">
                                                <strong>
                                                    Available quantity:
                                                </strong>{" "}
                                                {stock}
                                            </p>
                                        )}

                                        {/* Quantity and Add to Cart */}
                                        <div className="flex flex-wrap items-center gap-4">
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
                                                    onBlur={handleQuantityBlur}
                                                    min={1}
                                                    max={
                                                        hasStockTracking
                                                            ? stock
                                                            : undefined
                                                    }
                                                    disabled={isOutOfStock}
                                                    className="w-16 border-x py-2 text-center outline-none disabled:cursor-not-allowed"
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
                                                onClick={handleAddToCart}
                                                disabled={isOutOfStock}
                                                className={`flex items-center gap-3 rounded-full px-8 py-3 font-semibold text-white transition ${
                                                    isOutOfStock
                                                        ? "bg-gray-400 cursor-not-allowed"
                                                        : "bg-[#00B307] hover:bg-green-700"
                                                }`}
                                                title={
                                                    isOutOfStock
                                                        ? "This product is currently unavailable"
                                                        : "Continue to product page"
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

                                        {/* Low Stock Notice */}
                                        {isLowStock && (
                                            <p className="text-sm font-medium text-orange-700">
                                                Hurry! Only {stock} item(s) left
                                                in stock.
                                            </p>
                                        )}

                                        {/* Out of Stock Notice */}
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

export default PopularProduct;
