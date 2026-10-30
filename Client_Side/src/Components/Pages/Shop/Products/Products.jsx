
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    FiSearch,
    FiSliders,
    FiX,
    FiRefreshCw,
    FiChevronLeft,
    FiChevronRight,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import Product from "./Product";

const API_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const PAGE_SIZE = 12;

const numberValue = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
};

const categoryName = (product) =>
    typeof product?.category === "object"
        ? product.category?.name ||
          product.category?.categoryName ||
          ""
        : String(product?.category || "");

const isOutOfStock = (product) =>
    product.stockQuantity !== undefined &&
    product.stockQuantity !== null
        ? numberValue(product.stockQuantity) <= 0
        : String(product.availability || "").toLowerCase() ===
          "out of stock";

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const categoryQuery = searchParams.get("category") || "";

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [openModalId, setOpenModalId] = useState(null);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(categoryQuery);
    const [maxPrice, setMaxPrice] = useState(null);
    const [availability, setAvailability] = useState("");
    const [rating, setRating] = useState(0);
    const [sort, setSort] = useState("featured");
    const [page, setPage] = useState(1);
    const [mobileFilters, setMobileFilters] = useState(false);

    useEffect(() => {
        setCategory(categoryQuery);
        setPage(1);
    }, [categoryQuery]);

    useEffect(() => {
        const controller = new AbortController();

        const loadProducts = async () => {
            setLoading(true);
            setError("");

            try {
                const [productResponse, categoryResponse] =
                    await Promise.all([
                        fetch(`${API_URL}/products`, {
                            signal: controller.signal,
                        }),
                        fetch(`${API_URL}/categories`, {
                            signal: controller.signal,
                        }).catch(() => null),
                    ]);

                if (!productResponse.ok) {
                    throw new Error(
                        `Products request failed (${productResponse.status})`
                    );
                }

                const productData = await productResponse.json();

                if (!Array.isArray(productData)) {
                    throw new Error("Invalid products response");
                }

                const categoryData = categoryResponse?.ok
                    ? await categoryResponse
                          .json()
                          .catch(() => [])
                    : [];

                if (!controller.signal.aborted) {
                    setProducts(productData);
                    setCategories(
                        Array.isArray(categoryData)
                            ? categoryData
                            : []
                    );
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Shop products:", err);
                    setError(
                        "Products could not be loaded. Please try again."
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadProducts();

        return () => controller.abort();
    }, []);

    const highestPrice = useMemo(
        () =>
            Math.max(
                100,
                ...products.map((product) =>
                    numberValue(product.price)
                )
            ),
        [products]
    );

    const selectedMax =
        maxPrice === null
            ? highestPrice
            : Math.min(maxPrice, highestPrice);

    const categoryOptions = useMemo(() => {
        const list = new Map();

        categories.forEach((item) => {
            const name = String(
                item.name ||
                item.categoryName ||
                item.title ||
                ""
            ).trim();

            const id = String(
                item._id ||
                item.id ||
                item.categoryId ||
                name
            );

            if (name) {
                list.set(id, { id, name });
            }
        });

        products.forEach((product) => {
            const name = categoryName(product).trim();

            const exists = [...list.values()].some(
                (item) =>
                    item.name.toLowerCase() === name.toLowerCase()
            );

            if (name && !exists) {
                list.set(name, { id: name, name });
            }
        });

        return [...list.values()];
    }, [categories, products]);

    const changeCategory = (value) => {
        setCategory(value);
        setPage(1);

        const next = new URLSearchParams(searchParams);

        if (value) {
            next.set("category", value);
        } else {
            next.delete("category");
        }

        setSearchParams(next, { replace: true });
    };

    const clearFilters = () => {
        changeCategory("");
        setSearch("");
        setMaxPrice(null);
        setAvailability("");
        setRating(0);
        setSort("featured");
        setPage(1);
    };

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        const selectedCategory = categoryOptions.find(
            (item) =>
                item.id.toLowerCase() === category.toLowerCase()
        );

        const selectedName = (
            selectedCategory?.name || category
        ).toLowerCase();

        const result = products.filter((product) => {
            const productCategory =
                categoryName(product).toLowerCase();

            const productCategoryId = String(
                product.categoryId ||
                product.category_id ||
                (typeof product.category === "object"
                    ? product.category?._id ||
                      product.category?.id ||
                      ""
                    : "")
            ).toLowerCase();

            if (
                category &&
                productCategory !== selectedName &&
                productCategoryId !== category.toLowerCase()
            ) {
                return false;
            }

            if (
                query &&
                !`${product.name || ""} ${categoryName(product)} ${
                    product.description || ""
                }`
                    .toLowerCase()
                    .includes(query)
            ) {
                return false;
            }

            if (numberValue(product.price) > selectedMax) {
                return false;
            }

            if (
                availability === "in" &&
                isOutOfStock(product)
            ) {
                return false;
            }

            if (
                availability === "out" &&
                !isOutOfStock(product)
            ) {
                return false;
            }

            if (numberValue(product.rating) < rating) {
                return false;
            }

            return true;
        });

        if (sort === "price-asc") {
            result.sort(
                (a, b) =>
                    numberValue(a.price) - numberValue(b.price)
            );
        }

        if (sort === "price-desc") {
            result.sort(
                (a, b) =>
                    numberValue(b.price) - numberValue(a.price)
            );
        }

        if (sort === "rating") {
            result.sort(
                (a, b) =>
                    numberValue(b.rating) - numberValue(a.rating)
            );
        }

        if (sort === "name") {
            result.sort((a, b) =>
                String(a.name || "").localeCompare(
                    String(b.name || "")
                )
            );
        }

        if (sort === "latest") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt || 0) -
                    new Date(a.createdAt || 0)
            );
        }

        return result;
    }, [
        products,
        category,
        categoryOptions,
        search,
        selectedMax,
        availability,
        rating,
        sort,
    ]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredProducts.length / PAGE_SIZE)
    );

    const currentPage = Math.min(page, totalPages);

    const visibleProducts = filteredProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const updateFilter = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const activeCount =
        Number(Boolean(category)) +
        Number(Boolean(search.trim())) +
        Number(
            maxPrice !== null && selectedMax < highestPrice
        ) +
        Number(Boolean(availability)) +
        Number(rating > 0);

    const filters = (
        <div className="space-y-7">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-gray-900">
                    Filters
                </h3>

                <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs font-bold text-green-700 hover:underline"
                >
                    Clear all
                </button>
            </div>

            {/* Categories */}
            <div>
                <h4 className="mb-3 text-sm font-bold text-gray-800">
                    Categories
                </h4>

                <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
                    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-600">
                        <input
                            type="radio"
                            name="shop-category"
                            checked={!category}
                            onChange={() => changeCategory("")}
                            className="accent-green-600"
                        />
                        All categories
                    </label>

                    {categoryOptions.map((item) => (
                        <label
                            key={item.id}
                            className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-gray-600"
                        >
                            <input
                                type="radio"
                                name="shop-category"
                                checked={category === item.id}
                                onChange={() =>
                                    changeCategory(item.id)
                                }
                                className="accent-green-600"
                            />
                            <span>{item.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price */}
            <div className="border-t border-gray-100 pt-6">
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-800">
                        Price range
                    </h4>

                    <span className="text-xs font-bold text-green-700">
                        Up to ৳
                        {selectedMax.toLocaleString("en-BD")}
                    </span>
                </div>

                <input
                    type="range"
                    min="0"
                    max={highestPrice}
                    step={Math.max(
                        1,
                        Math.ceil(highestPrice / 100)
                    )}
                    value={selectedMax}
                    onChange={(event) =>
                        updateFilter(setMaxPrice)(
                            Number(event.target.value)
                        )
                    }
                    className="w-full accent-green-600"
                />

                <div className="flex justify-between text-xs text-gray-400">
                    <span>৳0</span>
                    <span>
                        ৳{highestPrice.toLocaleString("en-BD")}
                    </span>
                </div>
            </div>

            {/* Availability */}
            <div className="border-t border-gray-100 pt-6">
                <h4 className="mb-3 text-sm font-bold text-gray-800">
                    Availability
                </h4>

                {[
                    ["", "All products"],
                    ["in", "In stock"],
                    ["out", "Out of stock"],
                ].map(([value, label]) => (
                    <label
                        key={value}
                        className="mb-2 flex cursor-pointer items-center gap-2.5 text-sm text-gray-600"
                    >
                        <input
                            type="radio"
                            name="shop-availability"
                            checked={availability === value}
                            onChange={() =>
                                updateFilter(setAvailability)(value)
                            }
                            className="accent-green-600"
                        />
                        {label}
                    </label>
                ))}
            </div>

            {/* Rating */}
            <div className="border-t border-gray-100 pt-6">
                <h4 className="mb-3 text-sm font-bold text-gray-800">
                    Customer rating
                </h4>

                {[0, 4, 3, 2, 1].map((value) => (
                    <label
                        key={value}
                        className="mb-2 flex cursor-pointer items-center gap-2.5 text-sm text-gray-600"
                    >
                        <input
                            type="radio"
                            name="shop-rating"
                            checked={rating === value}
                            onChange={() =>
                                updateFilter(setRating)(value)
                            }
                            className="accent-green-600"
                        />

                        {value ? (
                            <>
                                <FaStar className="text-amber-400" />
                                {value}+ stars
                            </>
                        ) : (
                            "All ratings"
                        )}
                    </label>
                ))}
            </div>
        </div>
    );

    return (
        <section
            id="shop-products"
            className="shopery-shop-shell scroll-mt-6 py-12 sm:py-16"
        >
            {/* Heading */}
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-[2px] text-green-600">
                        THE SHOPERY COLLECTION
                    </span>

                    <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                        Explore{" "}
                        <span className="text-[#00B207]">
                            Products
                        </span>
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Find the right products for every moment.
                    </p>
                </div>

               
            </div>

            <div className="grid gap-7 lg:grid-cols-[245px_minmax(0,1fr)] xl:gap-9">
                {/* Desktop Sidebar */}
                <aside className="hidden self-start rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_6px_25px_rgba(0,0,0,.025)] lg:block">
                    {filters}
                </aside>

                <div className="min-w-0">
                    {/* Toolbar */}
                    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-gray-100 bg-[#fafdfb] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                        <div className="flex min-w-0 flex-1 gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setMobileFilters(true)
                                }
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 lg:hidden"
                            >
                                <FiSliders />
                                Filters
                                {activeCount > 0
                                    ? ` (${activeCount})`
                                    : ""}
                            </button>

                            <label className="relative block min-w-0 flex-1 sm:max-w-sm">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                                <input
                                    value={search}
                                    onChange={(event) =>
                                        updateFilter(setSearch)(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search products..."
                                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-green-500"
                                    aria-label="Search products"
                                />
                            </label>
                        </div>

                        <div className="flex items-center gap-2">
                            <label
                                htmlFor="shop-sort"
                                className="whitespace-nowrap text-xs font-semibold text-gray-500"
                            >
                                Sort by
                            </label>

                            <select
                                id="shop-sort"
                                value={sort}
                                onChange={(event) =>
                                    updateFilter(setSort)(
                                        event.target.value
                                    )
                                }
                                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-700 outline-none focus:border-green-500 sm:flex-none"
                            >
                                <option value="featured">
                                    Featured
                                </option>
                                <option value="latest">
                                    Newest
                                </option>
                                <option value="price-asc">
                                    Price: Low to High
                                </option>
                                <option value="price-desc">
                                    Price: High to Low
                                </option>
                                <option value="rating">
                                    Top Rated
                                </option>
                                <option value="name">
                                    Name: A to Z
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {activeCount > 0 && (
                        <div className="mb-5 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500">
                                Active filters:
                            </span>

                            {category && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        changeCategory("")
                                    }
                                    className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                                >
                                    {categoryOptions.find(
                                        (item) =>
                                            item.id === category
                                    )?.name || category}{" "}
                                    ×
                                </button>
                            )}

                            {search.trim() && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateFilter(setSearch)("")
                                    }
                                    className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                                >
                                    Search: {search} ×
                                </button>
                            )}

                            {(availability ||
                                rating > 0 ||
                                (maxPrice !== null &&
                                    selectedMax <
                                        highestPrice)) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-xs font-bold text-green-700 underline"
                                >
                                    Reset filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Loading */}
                    {loading ? (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                            {Array.from(
                                { length: 8 },
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="overflow-hidden rounded-2xl border border-gray-100"
                                    >
                                        <div className="aspect-square animate-pulse bg-gray-100" />

                                        <div className="space-y-3 p-4">
                                            <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                                            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    ) : error ? (
                        <div className="rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
                            <p className="text-sm text-red-700">
                                {error}
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    window.location.reload()
                                }
                                className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-bold text-white"
                            >
                                <FiRefreshCw />
                                Try Again
                            </button>
                        </div>
                    ) : visibleProducts.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                            <FiSearch className="mx-auto mb-3 text-3xl text-gray-400" />

                            <h3 className="text-lg font-bold text-gray-800">
                                No matching products
                            </h3>

                            <p className="mt-2 text-sm text-gray-500">
                                Try another search or adjust your
                                filters.
                            </p>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-5 rounded-full bg-[#00B207] px-5 py-2.5 text-sm font-bold text-white"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
                            {visibleProducts.map((product) => (
                                <Product
                                    key={
                                        product._id ||
                                        product.id
                                    }
                                    product={product}
                                    popularProduct={product}
                                    isModalOpen={
                                        openModalId ===
                                        (product._id ||
                                            product.id)
                                    }
                                    openModal={setOpenModalId}
                                    closeModal={() =>
                                        setOpenModalId(null)
                                    }
                                />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading &&
                        !error &&
                        totalPages > 1 && (
                            <nav
                                aria-label="Product pages"
                                className="mt-9 flex items-center justify-center gap-2"
                            >
                                <button
                                    type="button"
                                    disabled={
                                        currentPage === 1
                                    }
                                    onClick={() =>
                                        setPage((previous) =>
                                            Math.max(
                                                1,
                                                previous - 1
                                            )
                                        )
                                    }
                                    className="rounded-full border p-2.5 disabled:opacity-30"
                                >
                                    <FiChevronLeft />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                )
                                    .filter(
                                        (number) =>
                                            totalPages <= 7 ||
                                            number === 1 ||
                                            number === totalPages ||
                                            Math.abs(
                                                number -
                                                    currentPage
                                            ) <= 1
                                    )
                                    .map((number) => (
                                        <button
                                            key={number}
                                            type="button"
                                            onClick={() =>
                                                setPage(number)
                                            }
                                            aria-current={
                                                currentPage ===
                                                number
                                                    ? "page"
                                                    : undefined
                                            }
                                            className={`h-9 w-9 rounded-full text-sm font-bold ${
                                                currentPage ===
                                                number
                                                    ? "bg-[#00B207] text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-green-50"
                                            }`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                <button
                                    type="button"
                                    disabled={
                                        currentPage ===
                                        totalPages
                                    }
                                    onClick={() =>
                                        setPage((previous) =>
                                            Math.min(
                                                totalPages,
                                                previous + 1
                                            )
                                        )
                                    }
                                    className="rounded-full border p-2.5 disabled:opacity-30"
                                >
                                    <FiChevronRight />
                                </button>
                            </nav>
                        )}
                </div>
            </div>

            {/* Mobile Filters */}
            {mobileFilters && (
                <div className="fixed inset-0 z-[10000] lg:hidden">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/50"
                        aria-label="Close filters"
                        onClick={() =>
                            setMobileFilters(false)
                        }
                    />

                    <div className="absolute inset-y-0 left-0 w-[min(340px,90vw)] overflow-y-auto bg-white p-5 shadow-xl">
                        <div className="mb-5 flex justify-end">
                            <button
                                type="button"
                                aria-label="Close filters"
                                onClick={() =>
                                    setMobileFilters(false)
                                }
                            >
                                <FiX size={22} />
                            </button>
                        </div>

                        {filters}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileFilters(false)
                            }
                            className="mt-7 w-full rounded-full bg-[#00B207] py-3 text-sm font-bold text-white"
                        >
                            Show {filteredProducts.length} products
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Products;
