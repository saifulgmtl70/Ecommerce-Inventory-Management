import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaExclamationCircle } from "react-icons/fa";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import PopularProduct from "./PopularProduct";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const PopularProducts = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const [openModalId, setOpenModalId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    const fetchPopularProducts = useCallback(async (signal) => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(`${API_URL}/products`, { signal });

            if (!response.ok) {
                throw new Error(`Product request failed: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid product data received.");
            }

            const validProducts = data.filter(
                (product) =>
                    product &&
                    typeof product === "object" &&
                    (product._id || product.id)
            );

            if (!signal.aborted) {
                setPopularProducts(validProducts);
            }
        } catch (err) {
            if (err.name === "AbortError") return;

            console.error("Error fetching popular products:", err);

            if (!signal.aborted) {
                setPopularProducts([]);
                setError(
                    "We couldn't load the products. Please check your connection and try again."
                );
            }
        } finally {
            if (!signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        fetchPopularProducts(controller.signal);

        return () => controller.abort();
    }, [fetchPopularProducts, retryCount]);

    const openModal = (id) => {
        if (id) setOpenModalId(id);
    };

    const closeModal = () => {
        setOpenModalId(null);
    };

    const displayedProducts = popularProducts.slice(0, 10);

    return (
        <section className="shopery-popular-section nunito_sans">
            <ToastContainer
                position="top-center"
                autoClose={2500}
                newestOnTop
            />
            <div className="shopery-popular-container">
                <div className="shopery-popular-heading">
                    <div className="shopery-popular-heading-content">
                        <span className="shopery-popular-eyebrow">
                            HANDPICKED FOR YOU
                        </span>

                        <h2>
                            Popular <span>Products</span>
                        </h2>

                        <p>
                            Discover customer favourites and find something
                            you will love.
                        </p>
                    </div>

                    <Link
                        to="/shop"
                        className="shopery-popular-view-all"
                    >
                        <span>Explore All Products</span>
                        <MdOutlineArrowRightAlt />
                    </Link>
                </div>

                {loading && (
                    <div className="shopery-popular-grid">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div
                                className="shopery-product-skeleton"
                                key={index}
                            >
                                <div className="shopery-product-skeleton-image" />

                                <div className="shopery-product-skeleton-line short" />
                                <div className="shopery-product-skeleton-line" />
                                <div className="shopery-product-skeleton-line medium" />

                                <div className="shopery-product-skeleton-button" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && error && (
                    <div className="shopery-popular-state">
                        <FaExclamationCircle className="shopery-state-error-icon" />

                        <h3>Products are temporarily unavailable</h3>

                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={() => setRetryCount((count) => count + 1)}
                            className="shopery-retry-button"
                        >
                            Try Again <FaArrowRight />
                        </button>
                    </div>
                )}

                {!loading && !error && displayedProducts.length > 0 && (
                    <div className="shopery-popular-grid">
                        {displayedProducts.map((product) => {
                            const productId = product._id || product.id;

                            return (
                                <PopularProduct
                                    key={productId}
                                    popularProduct={product}
                                    isModalOpen={openModalId === productId}
                                    openModal={openModal}
                                    closeModal={closeModal}
                                />
                            );
                        })}
                    </div>
                )}

                {!loading && !error && popularProducts.length === 0 && (
                    <div className="shopery-popular-state">
                        <div className="shopery-empty-icon">🛍️</div>

                        <h3>No products available yet</h3>

                        <p>
                            New products will appear here when they become
                            available.
                        </p>

                        <Link
                            to="/shop"
                            className="shopery-retry-button"
                        >
                            Browse Shop <FaArrowRight />
                        </Link>
                    </div>
                )}

                {!loading && !error && popularProducts.length > 10 && (
                    <div className="shopery-popular-bottom-link">
                        <Link to="/shop">
                            View More Products <FaArrowRight />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default PopularProducts;