
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    MdOutlineArrowRightAlt,
    MdOutlineLocalFireDepartment,
} from "react-icons/md";

import {
    FaStar,
    FaRegStar,
    FaStarHalfAlt,
} from "react-icons/fa";

import {
    FiShoppingCart,
    FiHeart,
    FiEye,
    FiClock,
    FiRefreshCw,
} from "react-icons/fi";

import "./hotdeals.css";

const API_URL = "http://localhost:5000/hotdeals";

const HotDeal = () => {
    const navigate = useNavigate();

    const [hotDeals, setHotDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [wishlist, setWishlist] = useState([]);

    const fetchHotDeals = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(
                    `Failed to load hot deals (${response.status})`
                );
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid hot deals data received.");
            }

            setHotDeals(data);
        } catch (err) {
            console.error("Hot Deals Error:", err);
            setError(
                "Hot deals load করা যাচ্ছে না। ইন্টারনেট অথবা সার্ভার সংযোগ পরীক্ষা করে আবার চেষ্টা করো।"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHotDeals();
    }, [fetchHotDeals]);

    const getDealId = (deal) => deal?._id || deal?.id;

    const getDiscount = (deal) => {
        const price = Number(deal?.price);
        const originalPrice = Number(deal?.original_price);

        if (
            !Number.isFinite(price) ||
            !Number.isFinite(originalPrice) ||
            originalPrice <= price ||
            originalPrice <= 0
        ) {
            return 0;
        }

        return Math.round(
            ((originalPrice - price) / originalPrice) * 100
        );
    };

    const formatPrice = (price) => {
        const value = Number(price);

        return `৳${(Number.isFinite(value) ? value : 0).toLocaleString(
            "en-BD"
        )}`;
    };

    const toggleWishlist = (dealId) => {
        if (!dealId) return;

        setWishlist((previous) =>
            previous.includes(dealId)
                ? previous.filter((id) => id !== dealId)
                : [...previous, dealId]
        );
    };

    const renderRating = (rating) => {
        const numericRating = Number(rating);
        const safeRating = Number.isFinite(numericRating)
            ? Math.min(5, Math.max(0, numericRating))
            : 0;

        const fullStars = Math.floor(safeRating);
        const hasHalfStar = safeRating - fullStars >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        return (
            <div
                className="hot-deal-rating"
                aria-label={`Rating ${safeRating.toFixed(1)} out of 5`}
            >
                {Array.from({ length: fullStars }, (_, index) => (
                    <FaStar key={`full-${index}`} />
                ))}

                {hasHalfStar && <FaStarHalfAlt />}

                {Array.from({ length: emptyStars }, (_, index) => (
                    <FaRegStar key={`empty-${index}`} />
                ))}

                <span>{safeRating.toFixed(1)}</span>
            </div>
        );
    };

    const handleViewProduct = (deal) => {
        const dealId = getDealId(deal);

        if (!dealId) return;

        navigate(`/product/${dealId}`);
    };

    const handleAddToCart = (deal) => {
        // Existing behavior retained:
        // clicking Add opens the product details page.
        handleViewProduct(deal);
    };

    const renderSkeletons = () =>
        Array.from({ length: 4 }, (_, index) => (
            <div className="hot-deal-card hot-deal-skeleton" key={index}>
                <div className="hot-deal-skeleton-image" />

                <div className="hot-deal-skeleton-content">
                    <div className="hot-deal-skeleton-line short" />
                    <div className="hot-deal-skeleton-line" />
                    <div className="hot-deal-skeleton-line medium" />
                    <div className="hot-deal-skeleton-line button" />
                </div>
            </div>
        ));

    return (
        <section className="hot-deals-section">
            <div className="hot-deals-container">
                {/* Section heading */}
                <div className="hot-deals-heading">
                    <div className="hot-deals-heading-content">
                        <span className="hot-deals-eyebrow">
                            <MdOutlineLocalFireDepartment />
                            SPECIAL OFFERS
                        </span>

                        <h2>
                            Hot <span>Deals</span>
                        </h2>

                        <p>
                            Grab your favorites at special prices before
                            these offers end.
                        </p>
                    </div>

                    <Link to="/shop" className="hot-deals-view-all">
                        View All Deals
                        <MdOutlineArrowRightAlt />
                    </Link>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="hot-deals-grid">
                        {renderSkeletons()}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="hot-deals-message hot-deals-error">
                        <div className="hot-deals-message-icon">
                            <MdOutlineLocalFireDepartment />
                        </div>

                        <h3>Unable to load hot deals</h3>

                        <p>{error}</p>

                        <button
                            type="button"
                            className="hot-deals-retry"
                            onClick={fetchHotDeals}
                        >
                            <FiRefreshCw />
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty */}
                {!loading && !error && hotDeals.length === 0 && (
                    <div className="hot-deals-message hot-deals-empty">
                        <div className="hot-deals-message-icon">
                            <FiShoppingCart />
                        </div>

                        <h3>No hot deals available</h3>

                        <p>
                            নতুন অফার যোগ হলে এখানে দেখা যাবে।
                            আপাতত আমাদের সব পণ্য দেখে নিতে পারো।
                        </p>

                        <Link to="/shop" className="hot-deals-retry">
                            Explore Products
                            <MdOutlineArrowRightAlt />
                        </Link>
                    </div>
                )}

                {/* Product cards */}
                {!loading && !error && hotDeals.length > 0 && (
                    <div className="hot-deals-grid">
                        {hotDeals.slice(0,4).map((deal, index) => {
                            const dealId = getDealId(deal);
                            const discount = getDiscount(deal);
                            const isWishlisted = wishlist.includes(dealId);

                            const price = Number(deal.price);
                            const originalPrice = Number(
                                deal.original_price
                            );

                            const hasOriginalPrice =
                                Number.isFinite(originalPrice) &&
                                originalPrice > 0 &&
                                Number.isFinite(price) &&
                                originalPrice > price;

                            return (
                                <article
                                    className="hot-deal-card"
                                    key={dealId || `hot-deal-${index}`}
                                >
                                    <div className="hot-deal-image-wrapper">
                                        <Link
                                            to={
                                                dealId
                                                    ? `/product/${dealId}`
                                                    : "/shop"
                                            }
                                            className="hot-deal-image-link"
                                            aria-label={`View ${
                                                deal.name || "product"
                                            }`}
                                        >
                                            {deal.image ? (
                                                <img
                                                    src={deal.image}
                                                    alt={
                                                        deal.name ||
                                                        "Hot deal product"
                                                    }
                                                    className="hot-deal-image"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="hot-deal-no-image">
                                                    <FiShoppingCart />
                                                    <span>
                                                        Image unavailable
                                                    </span>
                                                </div>
                                            )}
                                        </Link>

                                        {discount > 0 ? (
                                            <span className="hot-deal-sale-badge">
                                                -{discount}%
                                            </span>
                                        ) : deal.sale ? (
                                            <span className="hot-deal-sale-badge">
                                                {deal.sale}
                                            </span>
                                        ) : null}

                                        <div className="hot-deal-actions">
                                            <button
                                                type="button"
                                                className={`hot-deal-icon-button ${
                                                    isWishlisted
                                                        ? "is-wishlisted"
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    toggleWishlist(dealId)
                                                }
                                                aria-label={
                                                    isWishlisted
                                                        ? "Remove from wishlist"
                                                        : "Add to wishlist"
                                                }
                                                aria-pressed={isWishlisted}
                                                disabled={!dealId}
                                            >
                                                <FiHeart />
                                            </button>

                                            <button
                                                type="button"
                                                className="hot-deal-icon-button"
                                                onClick={() =>
                                                    handleViewProduct(deal)
                                                }
                                                aria-label="View product details"
                                                disabled={!dealId}
                                            >
                                                <FiEye />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="hot-deal-content">
                                        <div className="hot-deal-category">
                                            <MdOutlineLocalFireDepartment />
                                            Limited Offer
                                        </div>

                                        <h3 className="hot-deal-title">
                                            <Link
                                                to={
                                                    dealId
                                                        ? `/product/${dealId}`
                                                        : "/shop"
                                                }
                                            >
                                                {deal.name || "Shopery Product"}
                                            </Link>
                                        </h3>

                                        {renderRating(deal.rating)}

                                        <div className="hot-deal-price-row">
                                            <span className="hot-deal-current-price">
                                                {formatPrice(deal.price)}
                                            </span>

                                            {hasOriginalPrice && (
                                                <span className="hot-deal-original-price">
                                                    {formatPrice(
                                                        deal.original_price
                                                    )}
                                                </span>
                                            )}
                                        </div>

                                        <div className="hot-deal-time">
                                            <FiClock />

                                            <span>
                                                {deal.deal_end_time
                                                    ? `Offer ends: ${deal.deal_end_time}`
                                                    : "Limited-time offer"}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="hot-deal-add-button"
                                            onClick={() =>
                                                handleAddToCart(deal)
                                            }
                                            disabled={!dealId}
                                        >
                                            <FiShoppingCart />
                                            View Product
                                            <MdOutlineArrowRightAlt />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Bottom note */}
                {!loading && !error && hotDeals.length > 0 && (
                    <div className="hot-deals-bottom-note">
                        <MdOutlineLocalFireDepartment />
                        <span>
                            Don’t miss out — discover more deals at Shopery.
                        </span>
                        <Link to="/shop">Shop Now</Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default HotDeal;