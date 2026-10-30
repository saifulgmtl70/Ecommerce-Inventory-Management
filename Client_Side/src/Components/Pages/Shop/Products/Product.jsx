
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import {
    FiShoppingCart,
    FiEye,
    FiHeart,
    FiX,
    FiMinus,
    FiPlus,
    FiArrowRight,
} from "react-icons/fi";

import {
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
} from "react-icons/fa";

import { toast } from "react-toastify";

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
        id,
        name,
        category,
        price,
        rating,
        availability,
        description,
        stockQuantity,
        lowStockThreshold,
    } = product;

    const productId = _id || id;

    const images = Array.isArray(product.images)
        ? product.images
        : product.image
        ? [product.image]
        : [];

    const { user } = useAuth();
    const [isAdmin] = useAdmin();
    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();
    const [, refetch] = useWishlist();

    const [selectedImage, setSelectedImage] = useState(
        images[0] || ""
    );

    const [quantity, setQuantity] = useState(1);
    const [wishBusy, setWishBusy] = useState(false);

    // Stock information
    const hasStockTracking =
        stockQuantity !== undefined &&
        stockQuantity !== null;

    const stock = hasStockTracking
        ? Math.max(0, Number(stockQuantity) || 0)
        : null;

    const threshold =
        lowStockThreshold !== undefined &&
        lowStockThreshold !== null &&
        lowStockThreshold !== ""
            ? Math.max(0, Number(lowStockThreshold) || 0)
            : null;

    const isOutOfStock = hasStockTracking
        ? stock <= 0
        : String(availability || "").toLowerCase() ===
          "out of stock";

    const isLowStock =
        !isOutOfStock &&
        hasStockTracking &&
        threshold !== null &&
        threshold > 0 &&
        stock <= threshold;

    const stockStatus = isOutOfStock
        ? "Out of stock"
        : isLowStock
        ? `Only ${stock} left`
        : "In stock";

    const stockClass = isOutOfStock
        ? "bg-red-50 text-red-600"
        : isLowStock
        ? "bg-orange-50 text-orange-700"
        : "bg-green-50 text-green-700";

    // Rating
    const safeRating = Math.min(
        5,
        Math.max(0, Number(rating) || 0)
    );

    const fullStars = Math.floor(safeRating);
    const halfStar = safeRating - fullStars >= 0.5;

    const stars = (
        <span
            className="inline-flex items-center gap-0.5 text-[11px] text-amber-400"
            aria-label={`${safeRating.toFixed(1)} out of 5 stars`}
        >
            {Array.from(
                { length: fullStars },
                (_, index) => (
                    <FaStar key={`full-${index}`} />
                )
            )}

            {halfStar && <FaStarHalfAlt />}

            {Array.from(
                {
                    length:
                        5 -
                        fullStars -
                        (halfStar ? 1 : 0),
                },
                (_, index) => (
                    <FaRegStar key={`empty-${index}`} />
                )
            )}
        </span>
    );

    // Price
    const formattedPrice = `৳${(
        Number(price) || 0
    ).toLocaleString("en-BD")}`;

    const originalPrice = Number(
        product.original_price ||
        product.originalPrice ||
        0
    );

    const discount =
        originalPrice > Number(price) &&
        Number(price) >= 0
            ? Math.round(
                  ((originalPrice - Number(price)) /
                      originalPrice) *
                      100
              )
            : 0;

    const productPath = productId
        ? `/product/${productId}`
        : "/shop";

    // Reset modal
    useEffect(() => {
        if (isModalOpen) {
            setSelectedImage(images[0] || "");
            setQuantity(1);
        }
    }, [isModalOpen, productId]);

    // Escape key closes modal
    useEffect(() => {
        if (!isModalOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeModal();
            }
        };

        window.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
    }, [isModalOpen, closeModal]);

    // Wishlist
    const handleWishlist = async () => {
        if (!user) {
            toast.info(
                "Please log in to add products to your wishlist."
            );

            navigate("/login");
            return;
        }

        if (isAdmin) {
            toast.info(
                "Admin users cannot add items to the wishlist."
            );
            return;
        }

        if (!productId || wishBusy) return;

        setWishBusy(true);

        try {
            const response = await axiosPublic.get(
                "/wishlist",
                {
                    params: {
                        email: user.email,
                    },
                }
            );

            const wishlistItems = Array.isArray(
                response.data
            )
                ? response.data
                : [];

            const alreadyExists = wishlistItems.some(
                (item) =>
                    String(item.cartId) ===
                    String(productId)
            );

            if (alreadyExists) {
                toast.info(
                    `${name} is already in your wishlist.`
                );
                return;
            }

            const wishlist = {
                cartId: productId,
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
                toast.success(
                    `${name} added to your wishlist.`
                );

                refetch();
            }
        } catch (error) {
            console.error("Wishlist error:", error);

            toast.error(
                "Could not update wishlist. Please try again."
            );
        } finally {
            setWishBusy(false);
        }
    };

    // Quantity
    const setSafeQuantity = (next) => {
        const numeric = Math.max(
            1,
            Math.floor(Number(next) || 1)
        );

        if (hasStockTracking && numeric > stock) {
            toast.info(
                `Only ${stock} item(s) available.`
            );

            setQuantity(Math.max(1, stock));
            return;
        }

        setQuantity(numeric);
    };

    return (
        <>
            {/* Product Card */}
            <article className="shopery-product-card group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-[0_12px_32px_rgba(0,100,30,.09)]">
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-[#f8faf8]">
                    <Link
                        to={productPath}
                        state={{ productId }}
                        className="flex h-full w-full items-center justify-center p-4"
                        aria-label={`View ${name}`}
                    >
                        {images[0] ? (
                            <img
                                src={images[0]}
                                alt={name || "Product"}
                                loading="lazy"
                                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <span className="text-xs font-semibold text-gray-400">
                                Image unavailable
                            </span>
                        )}
                    </Link>

                    {/* Discount Badge */}
                    {discount > 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white">
                            -{discount}%
                        </span>
                    )}

                    {/* Actions */}
                    <div className="absolute right-2 top-2 flex flex-col gap-2">
                        <button
                            type="button"
                            disabled={wishBusy}
                            onClick={handleWishlist}
                            aria-label="Add to wishlist"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-[#00B207] hover:text-white disabled:opacity-50"
                        >
                            <FiHeart />
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                openModal(productId)
                            }
                            aria-label="Quick view"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-700 shadow-sm transition hover:bg-[#00B207] hover:text-white"
                        >
                            <FiEye />
                        </button>
                    </div>
                </div>

                {/* Product Information */}
                <div className="flex flex-1 flex-col p-3 sm:p-4">
                    <p className="mb-1 truncate text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {typeof category === "object"
                            ? category?.name
                            : category ||
                              "Shopery Collection"}
                    </p>

                    <Link
                        to={productPath}
                        state={{ productId }}
                        className="line-clamp-2 min-h-[40px] text-[13px] font-bold leading-5 text-gray-800 transition-colors hover:text-green-700 sm:text-sm"
                    >
                        {name || "Shopery Product"}
                    </Link>

                    {/* Rating */}
                    <div className="mt-2 flex items-center gap-1.5">
                        {stars}

                        <span className="text-[10px] text-gray-400">
                            ({safeRating.toFixed(1)})
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        <strong className="text-base font-extrabold text-[#172b22]">
                            {formattedPrice}
                        </strong>

                        {discount > 0 && (
                            <span className="text-xs text-gray-400 line-through">
                                ৳
                                {originalPrice.toLocaleString(
                                    "en-BD"
                                )}
                            </span>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="mt-3">
                        <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${stockClass}`}
                        >
                            {stockStatus}
                        </span>
                    </div>

                    {/* Product Button */}
                    <Link
                        to={productPath}
                        state={{ productId }}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2.5 text-xs font-bold text-green-700 transition hover:border-[#00B207] hover:bg-[#00B207] hover:text-white"
                    >
                        <FiShoppingCart />
                        View Product
                        <FiArrowRight />
                    </Link>
                </div>
            </article>

            {/* Quick View Modal */}
            {isModalOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 sm:p-5"
                        onMouseDown={(event) => {
                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeModal();
                            }
                        }}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-label={`${name} quick view`}
                            className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8"
                        >
                            {/* Close */}
                            <button
                                type="button"
                                onClick={closeModal}
                                aria-label="Close quick view"
                                className="absolute right-4 top-4 z-10 rounded-full bg-gray-100 p-2.5 text-gray-700 hover:bg-red-500 hover:text-white"
                            >
                                <FiX />
                            </button>

                            <div className="grid gap-8 md:grid-cols-2">
                                {/* Images */}
                                <div>
                                    <div className="flex aspect-square items-center justify-center rounded-2xl bg-gray-50 p-5">
                                        {selectedImage ? (
                                            <img
                                                src={selectedImage}
                                                alt={name}
                                                className="h-full w-full object-contain"
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-400">
                                                Image unavailable
                                            </span>
                                        )}
                                    </div>

                                    {images.length > 1 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {images.map(
                                                (img, index) => (
                                                    <button
                                                        type="button"
                                                        key={`${img}-${index}`}
                                                        onClick={() =>
                                                            setSelectedImage(
                                                                img
                                                            )
                                                        }
                                                        className={`h-16 w-16 rounded-lg border-2 p-1 ${
                                                            selectedImage ===
                                                            img
                                                                ? "border-green-500"
                                                                : "border-gray-200"
                                                        }`}
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`View ${
                                                                index +
                                                                1
                                                            }`}
                                                            className="h-full w-full object-contain"
                                                        />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="pt-5 md:pt-2">
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${stockClass}`}
                                    >
                                        {stockStatus}
                                    </span>

                                    <h2 className="mt-4 pr-8 text-2xl font-extrabold text-gray-900">
                                        {name}
                                    </h2>

                                    <div className="mt-3 flex items-center gap-2">
                                        {stars}

                                        <span className="text-xs text-gray-400">
                                            {safeRating.toFixed(
                                                1
                                            )}{" "}
                                            / 5
                                        </span>
                                    </div>

                                    <p className="mt-5 text-3xl font-extrabold text-green-700">
                                        {formattedPrice}
                                    </p>

                                    <p className="mt-5 text-sm leading-7 text-gray-600">
                                        {description ||
                                            "Explore this product for more details."}
                                    </p>

                                    <p className="mt-4 text-sm text-gray-600">
                                        <strong>
                                            Category:
                                        </strong>{" "}
                                        {typeof category ===
                                        "object"
                                            ? category?.name
                                            : category ||
                                              "Uncategorized"}
                                    </p>

                                    {/* Quantity and Actions */}
                                    <div className="mt-6 flex flex-wrap items-center gap-3">
                                        <div className="flex items-center overflow-hidden rounded-full border border-gray-200">
                                            <button
                                                type="button"
                                                disabled={
                                                    isOutOfStock ||
                                                    quantity <= 1
                                                }
                                                onClick={() =>
                                                    setSafeQuantity(
                                                        quantity -
                                                            1
                                                    )
                                                }
                                                className="p-3 disabled:opacity-40"
                                                aria-label="Decrease quantity"
                                            >
                                                <FiMinus />
                                            </button>

                                            <input
                                                type="number"
                                                min="1"
                                                max={
                                                    hasStockTracking
                                                        ? stock
                                                        : undefined
                                                }
                                                disabled={
                                                    isOutOfStock
                                                }
                                                value={
                                                    isOutOfStock
                                                        ? 0
                                                        : quantity
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setSafeQuantity(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                aria-label="Quantity"
                                                className="w-12 text-center text-sm outline-none disabled:opacity-50"
                                            />

                                            <button
                                                type="button"
                                                disabled={
                                                    isOutOfStock ||
                                                    (hasStockTracking &&
                                                        quantity >=
                                                            stock)
                                                }
                                                onClick={() =>
                                                    setSafeQuantity(
                                                        quantity +
                                                            1
                                                    )
                                                }
                                                className="p-3 disabled:opacity-40"
                                                aria-label="Increase quantity"
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>

                                        {/* Navigate to Product Details */}
                                        <Link
                                            to={productPath}
                                            state={{
                                                productId,
                                            }}
                                            onClick={
                                                closeModal
                                            }
                                            className="inline-flex items-center gap-2 rounded-full bg-[#00B207] px-5 py-3 text-sm font-bold text-white hover:bg-green-700"
                                        >
                                            <FiShoppingCart />

                                            {isOutOfStock
                                                ? "View Details"
                                                : "View Product"}
                                        </Link>

                                        {/* Wishlist */}
                                        <button
                                            type="button"
                                            onClick={
                                                handleWishlist
                                            }
                                            disabled={
                                                wishBusy
                                            }
                                            className="rounded-full border border-gray-200 p-3 text-gray-700 hover:text-green-700"
                                            aria-label="Add to wishlist"
                                        >
                                            <FiHeart />
                                        </button>
                                    </div>

                                    {isLowStock && (
                                        <p className="mt-4 text-xs font-semibold text-orange-600">
                                            Hurry! Only{" "}
                                            {stock} left
                                            in stock.
                                        </p>
                                    )}

                                    {isOutOfStock && (
                                        <p className="mt-4 text-xs font-semibold text-red-600">
                                            This product is
                                            currently
                                            unavailable.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

export default Product;
