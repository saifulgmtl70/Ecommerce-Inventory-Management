import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaExclamationCircle } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import Category from "./Category/Category";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchCategories = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/categories`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error("Unable to load categories.");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid category data received.");
                }

                setCategories(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Categories loading error:", err);
                    setError(
                        "Categories could not be loaded. Please try again."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchCategories();

        return () => controller.abort();
    }, []);

    const getCategoryId = (category) =>
        category?._id || category?.id || category?.categoryId;

    const visibleCategories = categories.slice(0, 10);

    return (
        <section className="bg-white py-12 sm:py-14 lg:py-[72px]">
            <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-5 lg:px-6">

                {/* Section Heading */}
                <div className="mb-7 flex flex-col items-start justify-between gap-5 sm:mb-9 sm:flex-row sm:items-end lg:mb-10">

                    <div className="max-w-2xl">
                        <span className="mb-2 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[1.7px] text-green-600 sm:text-xs">
                            <BsStars className="text-sm" />
                            Explore Our Collection
                        </span>

                        <h2 className="text-[27px] font-extrabold leading-tight tracking-tight text-gray-900 sm:text-3xl lg:text-[38px]">
                            Shop by{" "}
                            <span className="text-[#00B207]">
                                Category
                            </span>
                        </h2>

                        <p className="mt-2 max-w-xl text-xs leading-6 text-gray-500 sm:mt-3 sm:text-sm sm:leading-7">
                            Explore our popular categories and discover
                            products for your everyday needs.
                        </p>
                    </div>

                    <Link
                        to="/shop"
                        className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2.5 text-xs font-bold text-green-700 transition duration-300 hover:border-[#00B207] hover:bg-[#00B207] hover:text-white sm:px-5 sm:py-3 sm:text-sm"
                    >
                        Explore All Products
                        <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Loading Skeleton */}
                {loading && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-xl border border-gray-100 bg-white sm:rounded-2xl"
                            >
                                <div className="aspect-[1/0.82] animate-pulse bg-gray-100" />

                                <div className="space-y-2 p-3 sm:p-4">
                                    <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                                    <div className="h-2.5 w-1/2 animate-pulse rounded bg-gray-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Error Message */}
                {!loading && error && (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-10 text-center">
                        <FaExclamationCircle className="text-2xl text-red-500" />

                        <p className="text-sm text-gray-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && categories.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-12 text-center">
                        <p className="text-sm text-gray-500">
                            No categories are available right now.
                        </p>
                    </div>
                )}

                {/* Category Grid */}
                {!loading && !error && categories.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 xl:grid-cols-5">
                        {visibleCategories.map((category, index) => (
                            <Category
                                key={getCategoryId(category) || index}
                                category={category}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                {/* Mobile View All */}
                {!loading && !error && categories.length > 10 && (
                    <div className="mt-6 flex justify-center sm:mt-8">
                        <Link
                            to="/shop"
                            className="group inline-flex items-center gap-2 rounded-full bg-green-50 px-5 py-2.5 text-xs font-bold text-green-700 transition hover:bg-green-100 sm:text-sm"
                        >
                            View All Categories
                            <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Categories;