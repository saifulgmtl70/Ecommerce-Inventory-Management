import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import useAxiosPublic from "../Hooks/useAxiosPublic";

const ProductSearch = ({ isOpen, onClose }) => {
    const [searchText, setSearchText] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchRef = useRef(null);
    const inputRef = useRef(null);

    const axiosPublic = useAxiosPublic();

    // Focus input when search opens
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    // Close search on outside click or Escape
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                onClose();
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, onClose]);

    // Search products with debounce
    useEffect(() => {
        if (!isOpen) return;

        const query = searchText.trim();

        if (!query) {
            setProducts([]);
            setLoading(false);
            setError("");
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            setLoading(true);
            setError("");

            try {
                const response = await axiosPublic.get(
                    `/products/search?q=${encodeURIComponent(query)}`,
                    {
                        signal: controller.signal,
                    }
                );

                setProducts(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );
            } catch (err) {
                if (
                    err.code === "ERR_CANCELED" ||
                    err.name === "CanceledError"
                ) {
                    return;
                }

                console.error("Search error:", err);
                setProducts([]);
                setError("Something went wrong. Please try again.");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }, 350);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [searchText, isOpen, axiosPublic]);

    // Close search popup and reset search
    const handleClose = () => {
        setSearchText("");
        setProducts([]);
        setLoading(false);
        setError("");
        onClose();
    };

    // Handle product click
    const handleProductClick = () => {
        setSearchText("");
        setProducts([]);
        setLoading(false);
        setError("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/40 px-4 pt-20 sm:pt-24">
            <div
                ref={searchRef}
                className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            >
                {/* Search Input */}
                <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
                    <CiSearch className="shrink-0 text-2xl text-[#00B207]" />

                    <input
                        ref={inputRef}
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search for fresh products..."
                        className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 sm:text-base"
                    />

                    {searchText && (
                        <button
                            type="button"
                            onClick={() => setSearchText("")}
                            className="text-xs font-medium text-gray-500 hover:text-[#00B207]"
                        >
                            Clear
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Close search"
                        className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100"
                    >
                        <IoCloseOutline className="text-2xl" />
                    </button>
                </div>

                {/* Search Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                    {!searchText.trim() ? (
                        <div className="px-6 py-12 text-center">
                            <CiSearch className="mx-auto mb-3 text-5xl text-gray-300" />

                            <h3 className="font-semibold text-gray-700">
                                What are you looking for?
                            </h3>

                            <p className="mt-2 text-sm text-gray-400">
                                Start typing to find your favorite products.
                            </p>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-[#00B207]" />

                            <p className="mt-3 text-sm text-gray-500">
                                Searching products...
                            </p>
                        </div>
                    ) : error ? (
                        <div className="px-6 py-12 text-center">
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <CiSearch className="mx-auto mb-3 text-5xl text-gray-300" />

                            <h3 className="font-semibold text-gray-700">
                                No products found
                            </h3>

                            <p className="mt-2 text-sm text-gray-400">
                                Try searching with a different product name.
                            </p>
                        </div>
                    ) : (
                        <div className="p-3">
                            <div className="mb-2 flex items-center justify-between px-3 py-2">
                                <h3 className="text-sm font-semibold text-gray-700">
                                    Search Results
                                </h3>

                                <span className="text-xs text-gray-400">
                                    {products.length} results
                                </span>
                            </div>

                            <div className="space-y-1">
                                {products.map((product) => (
                                    <Link
                                        key={product._id}
                                        to={`/product/${product._id}`}
                                        onClick={handleProductClick}
                                        className="flex w-full items-center gap-4 rounded-xl p-3 text-left transition hover:bg-[#F2FAF2]"
                                    >
                                        {/* Product Image */}
                                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50">
                                            <img
                                                src={
                                                    Array.isArray(product.images)
                                                        ? product.images[0] || ""
                                                        : product.images || ""
                                                }
                                                alt={product.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>

                                        {/* Product Information */}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="truncate text-sm font-semibold text-gray-800">
                                                {product.name}
                                            </h4>

                                            <p className="mt-1 text-sm font-bold text-[#00B207]">
                                                ৳{product.price}
                                            </p>
                                        </div>

                                        <span className="text-xl text-gray-400">
                                            →
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">
                    <p className="text-center text-xs text-gray-400">
                        Find fresh and quality products at Ecobazaar
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductSearch;