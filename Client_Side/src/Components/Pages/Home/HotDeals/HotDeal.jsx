
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    MdOutlineArrowRightAlt,
    MdOutlineLocalFireDepartment,
} from 'react-icons/md';
import {
    FaStar,
    FaRegStar,
    FaStarHalfAlt,
} from 'react-icons/fa';
import {
    FiShoppingCart,
    FiHeart,
    FiEye,
    FiClock,
} from 'react-icons/fi';
import './hotdeals.css';

const HotDeal = () => {
    const [hotDeals, setHotDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const fetchHotDeals = async () => {
            try {
                const response = await fetch(
                    'http://localhost:5000/hotdeals'
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch hot deals');
                }

                const data = await response.json();
                setHotDeals(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Hot Deals loading error:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchHotDeals();
    }, []);

    const getDealId = (deal) => deal._id || deal.id;

    const toggleWishlist = (deal) => {
        const dealId = getDealId(deal);

        setWishlist((previous) =>
            previous.includes(dealId)
                ? previous.filter((id) => id !== dealId)
                : [...previous, dealId]
        );
    };

    const getDiscount = (deal) => {
        const price = Number(deal.price);
        const originalPrice = Number(deal.original_price);

        if (
            Number.isFinite(price) &&
            Number.isFinite(originalPrice) &&
            originalPrice > price &&
            originalPrice > 0
        ) {
            return Math.round(
                ((originalPrice - price) / originalPrice) * 100
            );
        }

        return null;
    };

    const renderRating = (rating) => {
        const numericRating = Math.max(
            0,
            Math.min(5, Number(rating) || 0)
        );

        return (
            <div
                className="hot-deal-rating"
                aria-label={`Rating ${numericRating} out of 5`}
            >
                {[1, 2, 3, 4, 5].map((star) => {
                    if (numericRating >= star) {
                        return <FaStar key={star} />;
                    }

                    if (numericRating >= star - 0.5) {
                        return <FaStarHalfAlt key={star} />;
                    }

                    return <FaRegStar key={star} />;
                })}

                <span>{numericRating.toFixed(1)}</span>
            </div>
        );
    };

    return (
        <section className="hot-deals-section nunito_sans">
            <div className="hot-deals-inner">

                {/* Section heading */}
                <div className="hot-deals-heading">
                    <div className="hot-deals-title-wrap">
                        <span className="hot-deals-eyebrow">
                            <MdOutlineLocalFireDepartment />
                            SPECIAL OFFERS
                        </span>

                        <h2>Hot Deals</h2>

                        <p>
                            Grab your favorites before the offers are gone!
                        </p>
                    </div>

                    <Link
                        to="/shop"
                        className="hot-deals-view-all"
                    >
                        View All
                        <MdOutlineArrowRightAlt />
                    </Link>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="hot-deals-grid">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                className="hot-deal-skeleton"
                                key={item}
                            >
                                <div className="skeleton-image" />
                                <div className="skeleton-line" />
                                <div className="skeleton-line short" />
                                <div className="skeleton-line medium" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error state */}
                {!loading && error && (
                    <div className="hot-deals-message">
                        <h3>Unable to load hot deals</h3>
                        <p>
                            Please check your connection and try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && hotDeals.length === 0 && (
                    <div className="hot-deals-message">
                        <h3>No hot deals available right now</h3>
                        <p>Check back soon for exciting offers.</p>
                    </div>
                )}

                {/* Product cards */}
                {!loading && !error && hotDeals.length > 0 && (
                    <div className="hot-deals-grid">
                        {hotDeals.map((deal) => {
                            const dealId = getDealId(deal);
                            const discount = getDiscount(deal);
                            const isWishlisted = wishlist.includes(dealId);

                            return (
                                <article
                                    className="hot-deal-card"
                                    key={dealId}
                                >
                                    {/* Image and badges */}
                                    <div className="hot-deal-image-wrap">
                                        {deal.sale && (
                                            <span className="hot-deal-sale">
                                                {deal.sale}
                                            </span>
                                        )}

                                        {!deal.sale && discount && (
                                            <span className="hot-deal-sale">
                                                -{discount}%
                                            </span>
                                        )}

                                        <div className="hot-deal-image-actions">
                                            <button
                                                type="button"
                                                className={`hot-deal-icon-btn ${
                                                    isWishlisted
                                                        ? 'active'
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    toggleWishlist(deal)
                                                }
                                                aria-label={
                                                    isWishlisted
                                                        ? 'Remove from wishlist'
                                                        : 'Add to wishlist'
                                                }
                                                title="Wishlist"
                                            >
                                                <FiHeart />
                                            </button>

                                            <Link
                                                to={`/product/${dealId}`}
                                                className="hot-deal-icon-btn"
                                                aria-label="View product details"
                                                title="Quick view"
                                            >
                                                <FiEye />
                                            </Link>
                                        </div>

                                        <Link
                                            to={`/product/${dealId}`}
                                            className="hot-deal-image-link"
                                            aria-label={`View ${deal.name}`}
                                        >
                                            <img
                                                src={deal.image}
                                                alt={deal.name || 'Hot deal product'}
                                                loading="lazy"
                                            />
                                        </Link>
                                    </div>

                                    {/* Product information */}
                                    <div className="hot-deal-info">
                                        <Link
                                            to={`/product/${dealId}`}
                                            className="hot-deal-product-name"
                                        >
                                            {deal.name}
                                        </Link>

                                        {renderRating(deal.rating)}

                                        <div className="hot-deal-price-row">
                                            <span className="hot-deal-price">
                                                ৳{Number(deal.price || 0).toLocaleString('en-BD')}
                                            </span>

                                            {Number(deal.original_price) >
                                                Number(deal.price) && (
                                                <span className="hot-deal-original-price">
                                                    ৳{Number(deal.original_price).toLocaleString('en-BD')}
                                                </span>
                                            )}
                                        </div>

                                        <div className="hot-deal-bottom">
                                            <div className="hot-deal-time">
                                                <FiClock />
                                                <span>
                                                    {deal.deal_end_time ||
                                                        'Limited-time offer'}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                className="hot-deal-cart-btn"
                                                onClick={() =>
                                                    window.location.assign(
                                                        `/product/${dealId}`
                                                    )
                                                }
                                                aria-label={`View ${deal.name} to add to cart`}
                                            >
                                                <FiShoppingCart />
                                                <span>Add</span>
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default HotDeal;
