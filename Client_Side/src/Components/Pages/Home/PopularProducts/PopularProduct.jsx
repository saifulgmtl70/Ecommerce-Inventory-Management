import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import {
    FaArrowRight,
    FaCheckCircle,
    FaFacebookF,
    FaInstagram,
    FaPinterestP,
    FaRegEye,
    FaRegHeart,
    FaStar,
    FaStarHalfAlt,
    FaTwitter,
} from "react-icons/fa";

import { FaRegStar } from "react-icons/fa6";
import { FiShoppingCart } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";

import { toast } from "react-toastify";


import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useWishlist from "../../../Hooks/useWishlist";
import useAdmin from "../../../Hooks/useAdmin";

import "./popularproducts.css";

const PopularProduct = ({
    popularProduct,
    isModalOpen,
    openModal,
    closeModal,
}) => {
    const product =
        popularProduct && typeof popularProduct === "object"
            ? popularProduct
            : {};

    const {
        _id,
        id,
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

    const productId = _id || id;

    const images = Array.isArray(product.images)
        ? product.images.filter(
              (image) => typeof image === "string" && image.trim()
          )
        : [];

    const mainImage =
        images[0] ||
        product.image ||
        product.imageUrl ||
        "";

    const { user } = useAuth();
    const [isAdmin] = useAdmin();
    const [, refetch] = useWishlist();

    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const [selectedImage, setSelectedImage] = useState(mainImage);
    const [quantity, setQuantity] = useState(1);
    const [imageError, setImageError] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

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
          ? `Only ${stock} left`
          : "In Stock";

    const stockClass = isOutOfStock
        ? "shopery-stock-out"
        : isLowStock
          ? "shopery-stock-low"
          : "shopery-stock-in";

    const numericPrice = Number(price);
    const validPrice = Number.isFinite(numericPrice) && numericPrice >= 0;

    const parsedSale = Number(
        typeof sale === "string" ? sale.replace("%", "") : sale
    );

    const discountPercent =
        sale !== undefined &&
        sale !== null &&
        sale !== "" &&
        Number.isFinite(parsedSale) &&
        parsedSale > 0 &&
        parsedSale <= 100
            ? parsedSale
            : 0;

    const originalPrice =
        discountPercent > 0 && validPrice
            ? numericPrice / (1 - discountPercent / 100)
            : null;

    useEffect(() => {
        setSelectedImage(mainImage);
        setQuantity(1);
        setImageError(false);
    }, [productId, mainImage]);

    useEffect(() => {
        if (!isModalOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeModal?.();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isModalOpen, closeModal]);

    if (!productId) return null;

    const renderStars = (value) => {
        const safeRating = Math.min(
            5,
            Math.max(0, Number(value) || 0)
        );

        const fullStars = Math.floor(safeRating);
        const hasHalfStar =
            safeRating - fullStars >= 0.5 &&
            fullStars < 5;

        const emptyStars =
            5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div
                className="shopery-rating-stars"
                aria-label={`Rating ${safeRating} out of 5`}
            >
                {Array.from({ length: fullStars }).map((_, index) => (
                    <FaStar key={`full-${index}`} />
                ))}

                {hasHalfStar && <FaStarHalfAlt />}

                {Array.from({ length: emptyStars }).map((_, index) => (
                    <FaRegStar key={`empty-${index}`} />
                ))}
            </div>
        );
    };

    const handleWishList = async () => {
        if (!user) {
            toast.info("Please log in to add products to your wishlist.");
            navigate("/login");
            return;
        }

        if (isAdmin) {
            toast.info("Admin users cannot add items to the wishlist.");
            return;
        }

        if (wishlistLoading) return;

        if (!user.email) {
            toast.error("Your account email could not be verified.");
            return;
        }

        setWishlistLoading(true);

        try {
            const response = await axiosPublic.get("/wishlist", {
                params: { email: user.email },
            });

            const wishlistItems = Array.isArray(response.data)
                ? response.data
                : [];

            const alreadyExists = wishlistItems.some(
                (item) =>
                    String(item.cartId) === String(productId)
            );

            if (alreadyExists) {
                toast.info(`${name || "This product"} is already in your wishlist.`);
                return;
            }

            const wishlist = {
                cartId: productId,
                email: user.email,
                product: name || "Product",
                image: mainImage,
                price,
                availability: isOutOfStock
                    ? "Out of Stock"
                    : "In Stock",
            };

            const result = await axiosPublic.post(
                "/wishlist",
                wishlist
            );

            if (result.data?.insertedId) {
                toast.success("Product added to your wishlist.");
                refetch();
            } else {
                toast.info(
                    result.data?.message ||
                    "The wishlist could not be updated."
                );
            }
        } catch (error) {
            console.error("Wishlist error:", error);
            toast.error("Could not update your wishlist. Please try again.");
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!user) {
            toast.info("Please log in before adding products to your cart.");
            navigate("/login");
            return;
        }

        if (isAdmin) {
            toast.info("Admin users cannot add products to the cart.");
            return;
        }

        if (isOutOfStock) {
            toast.error("This product is currently out of stock.");
            return;
        }

        const finalQuantity = Number(quantity);

        if (
            !Number.isInteger(finalQuantity) ||
            finalQuantity < 1
        ) {
            toast.info("Please select a valid quantity.");
            return;
        }

        if (hasStockTracking && finalQuantity > stock) {
            toast.error(`Only ${stock} item(s) are available.`);
            return;
        }

        closeModal?.();

        navigate(`/product/${productId}`, {
            state: {
                productId,
                quantity: finalQuantity,
            },
        });
    };

    const increaseQuantity = () => {
        if (isOutOfStock) return;

        if (hasStockTracking && quantity >= stock) {
            toast.info(`Only ${stock} item(s) are available.`);
            return;
        }

        setQuantity((current) => current + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((current) => Math.max(1, current - 1));
    };

    const handleQuantityChange = (event) => {
        const value = Number(event.target.value);

        if (!Number.isFinite(value) || value < 1) {
            setQuantity(1);
            return;
        }

        const requestedQuantity = Math.floor(value);

        if (hasStockTracking && requestedQuantity > stock) {
            setQuantity(Math.max(1, stock));
            toast.info(`Only ${stock} item(s) are available.`);
            return;
        }

        setQuantity(requestedQuantity);
    };

    const handleProductNavigation = () => {
        navigate(`/product/${productId}`, {
            state: { productId },
        });
    };

    const shareUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/product/${productId}`
            : "";

    const shareLinks = [
        {
            label: "Facebook",
            icon: <FaFacebookF />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            label: "Twitter",
            icon: <FaTwitter />,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
        },
        {
            label: "Pinterest",
            icon: <FaPinterestP />,
            url: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}`,
        },
        {
            label: "Instagram",
            icon: <FaInstagram />,
            url: "",
        },
    ];

    const quickViewModal =
        isModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
            <div
                className="shopery-quickview-backdrop"
                onClick={closeModal}
                role="presentation"
            >
                <div
                    className="shopery-quickview-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Quick view ${name || "product"}`}
                    onClick={(event) => event.stopPropagation()}
                >
                    <button
                        type="button"
                        className="shopery-quickview-close"
                        onClick={closeModal}
                        aria-label="Close quick view"
                    >
                        <IoMdClose size={23} />
                    </button>

                    <div className="shopery-quickview-grid">
                        <div className="shopery-quickview-gallery">
                            <div className="shopery-quickview-thumbnails">
                                {images.map((image, index) => (
                                    <button
                                        type="button"
                                        key={`${image}-${index}`}
                                        className={`shopery-quickview-thumbnail ${
                                            selectedImage === image
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={() => setSelectedImage(image)}
                                        aria-label={`View image ${index + 1}`}
                                    >
                                        <img
                                            src={image}
                                            alt={`${name || "Product"} ${index + 1}`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <div className="shopery-quickview-main-image">
                                {selectedImage ? (
                                    <img
                                        src={selectedImage}
                                        alt={name || "Product"}
                                    />
                                ) : (
                                    <div className="shopery-image-placeholder">
                                        Product image unavailable
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="shopery-quickview-details">
                            <span className={`shopery-stock-badge ${stockClass}`}>
                                <FaCheckCircle />
                                {stockStatus}
                            </span>

                            <h2>{name || "Product"}</h2>

                            <div className="shopery-quickview-rating">
                                {renderStars(rating)}
                                <span>
                                    {Number(rating) > 0
                                        ? `${Number(rating).toFixed(1)} / 5`
                                        : "Not rated yet"}
                                </span>
                            </div>

                            <div className="shopery-quickview-price">
                                <strong>
                                    {validPrice
                                        ? `৳${numericPrice.toLocaleString("en-BD")}`
                                        : "Price unavailable"}
                                </strong>

                                {originalPrice !== null &&
                                    Number.isFinite(originalPrice) && (
                                        <del>
                                            ৳{Math.round(originalPrice).toLocaleString("en-BD")}
                                        </del>
                                    )}
                            </div>

                            {description && (
                                <p className="shopery-quickview-description">
                                    {description}
                                </p>
                            )}

                            {category && (
                                <p className="shopery-quickview-category">
                                    <strong>Category:</strong> {category}
                                </p>
                            )}

                            {hasStockTracking && (
                                <p className="shopery-quickview-availability">
                                    <strong>Available quantity:</strong> {stock}
                                </p>
                            )}

                            {isLowStock && (
                                <p className="shopery-quickview-low-stock">
                                    Hurry! Only {stock} item(s) left.
                                </p>
                            )}

                            <div className="shopery-quickview-actions">
                                <div className="shopery-quantity-control">
                                    <button
                                        type="button"
                                        onClick={decreaseQuantity}
                                        disabled={isOutOfStock || quantity <= 1}
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>

                                    <input
                                        type="number"
                                        min="1"
                                        max={hasStockTracking ? stock : undefined}
                                        value={isOutOfStock ? 0 : quantity}
                                        onChange={handleQuantityChange}
                                        disabled={isOutOfStock}
                                        aria-label="Product quantity"
                                    />

                                    <button
                                        type="button"
                                        onClick={increaseQuantity}
                                        disabled={
                                            isOutOfStock ||
                                            (hasStockTracking && quantity >= stock)
                                        }
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleAddToCart}
                                    disabled={isOutOfStock}
                                    className="shopery-quickview-add-button"
                                >
                                    {isOutOfStock ? "Out of Stock" : "Continue"}
                                    <FiShoppingCart />
                                </button>

                                <button
                                    type="button"
                                    onClick={handleWishList}
                                    disabled={wishlistLoading}
                                    className="shopery-quickview-wishlist"
                                    aria-label="Add to wishlist"
                                    title="Add to wishlist"
                                >
                                    <FaRegHeart />
                                </button>
                            </div>

                            <button
                                type="button"
                                className="shopery-quickview-details-link"
                                onClick={handleProductNavigation}
                            >
                                View Full Product Details <FaArrowRight />
                            </button>

                            <div className="shopery-quickview-share">
                                <span>Share:</span>

                                {shareLinks.map((item) =>
                                    item.url ? (
                                        <a
                                            key={item.label}
                                            href={item.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={`Share on ${item.label}`}
                                            title={item.label}
                                        >
                                            {item.icon}
                                        </a>
                                    ) : (
                                        <button
                                            type="button"
                                            key={item.label}
                                            title="Instagram sharing is not available through a direct share link."
                                            aria-label={item.label}
                                            onClick={() => {
                                                if (navigator.clipboard && shareUrl) {
                                                    navigator.clipboard
                                                        .writeText(shareUrl)
                                                        .then(() =>
                                                            toast.success(
                                                                "Product link copied."
                                                            )
                                                        )
                                                        .catch(() =>
                                                            toast.info(
                                                                "Copy the product URL from your browser."
                                                            )
                                                        );
                                                } else {
                                                    toast.info(
                                                        "Copy the product URL from your browser."
                                                    );
                                                }
                                            }}
                                        >
                                            {item.icon}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
            document.body
        );

    return (
        <>
            <article className="shopery-product-card">
                <div className="shopery-product-image-area">
                    <Link
                        to={`/product/${productId}`}
                        state={{ productId }}
                        className="shopery-product-image-link"
                        aria-label={`View ${name || "product"}`}
                    >
                        {mainImage && !imageError ? (
                            <img
                                src={mainImage}
                                alt={name || "Product"}
                                className="shopery-product-image"
                                loading="lazy"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="shopery-product-image-placeholder">
                                <FiShoppingCart />
                                <span>Image unavailable</span>
                            </div>
                        )}
                    </Link>

                    {discountPercent > 0 && (
                        <span className="shopery-product-sale-badge">
                            -{discountPercent}%
                        </span>
                    )}

                    {isOutOfStock && (
                        <span className="shopery-product-out-badge">
                            Out of Stock
                        </span>
                    )}

                    <div className="shopery-product-card-actions">
                        <button
                            type="button"
                            onClick={handleWishList}
                            disabled={wishlistLoading}
                            title="Add to wishlist"
                            aria-label="Add to wishlist"
                        >
                            <FaRegHeart />
                        </button>

                        <button
                            type="button"
                            onClick={() => openModal?.(productId)}
                            title="Quick view"
                            aria-label="Quick view"
                        >
                            <FaRegEye />
                        </button>
                    </div>
                </div>

                <div className="shopery-product-card-body">
                    {category && (
                        <span className="shopery-product-category">
                            {category}
                        </span>
                    )}

                    <Link
                        to={`/product/${productId}`}
                        state={{ productId }}
                        className="shopery-product-title-link"
                    >
                        <h3>{name || "Unnamed product"}</h3>
                    </Link>

                    <div className="shopery-product-rating-row">
                        {renderStars(rating)}
                        <span>
                            {Number(rating) > 0
                                ? Number(rating).toFixed(1)
                                : "New"}
                        </span>
                    </div>

                    <div className="shopery-product-price-row">
                        <strong>
                            {validPrice
                                ? `৳${numericPrice.toLocaleString("en-BD")}`
                                : "Price unavailable"}
                        </strong>

                        {originalPrice !== null &&
                            Number.isFinite(originalPrice) && (
                                <del>
                                    ৳{Math.round(originalPrice).toLocaleString("en-BD")}
                                </del>
                            )}
                    </div>

                    <div className="shopery-product-stock-row">
                        <span className={`shopery-stock-dot ${stockClass}`} />
                        <span className={stockClass}>{stockStatus}</span>
                    </div>

                    <button
                        type="button"
                        className="shopery-product-quick-button"
                        onClick={() => openModal?.(productId)}
                    >
                        <FaRegEye />
                        Quick View
                    </button>
                </div>
            </article>

            {quickViewModal}
        </>
    );
};

export default PopularProduct;