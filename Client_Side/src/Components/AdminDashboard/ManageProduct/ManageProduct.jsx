
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

import {
  FaRegEdit,
  FaTrashAlt,
  FaSearch,
  FaSyncAlt,
  FaBoxOpen,
  FaTags,
  FaMoneyBillWave,
  FaChartLine,
  FaTimes,
  FaExclamationTriangle,
  FaImage,
  FaFilter,
  FaBoxes,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const formatPrice = (price) =>
  `৳${(Number(price) || 0).toLocaleString("en-BD", {
    maximumFractionDigits: 2,
  })}`;

const getStockInfo = (product) => {
  const stock = Number(product.stockQuantity);
  const threshold = Number(product.lowStockThreshold ?? 5);

  // Legacy products without stockQuantity
  if (
    product.stockQuantity === undefined ||
    product.stockQuantity === null ||
    product.stockQuantity === ""
  ) {
    if (product.availability === "Out of Stock") {
      return {
        status: "Out of Stock",
        quantity: null,
        className: "bg-rose-100 text-rose-700",
      };
    }

    return {
      status: "Not Tracked",
      quantity: null,
      className: "bg-slate-100 text-slate-600",
    };
  }

  if (!Number.isFinite(stock) || stock < 0) {
    return {
      status: "Invalid Stock",
      quantity: stock,
      className: "bg-rose-100 text-rose-700",
    };
  }

  if (stock === 0) {
    return {
      status: "Out of Stock",
      quantity: stock,
      className: "bg-rose-100 text-rose-700",
    };
  }

  if (stock <= threshold) {
    return {
      status: "Low Stock",
      quantity: stock,
      className: "bg-amber-100 text-amber-700",
    };
  }

  return {
    status: "In Stock",
    quantity: stock,
    className: "bg-emerald-100 text-emerald-700",
  };
};

const ManageProduct = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch products
  const {
    data: products = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");

      if (!Array.isArray(res.data)) {
        throw new Error("Products data format is invalid.");
      }

      return res.data;
    },
  });

  // Unique categories
  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(
            (category) =>
              typeof category === "string" && category.trim() !== ""
          )
      ),
    ].sort((a, b) => a.localeCompare(b));
  }, [products]);

  // Inventory statistics
  const inventoryStats = useMemo(() => {
    let totalStock = 0;
    let trackedProducts = 0;
    let lowStockProducts = 0;
    let outOfStockProducts = 0;
    let inStockProducts = 0;
    let untrackedProducts = 0;

    products.forEach((product) => {
      const info = getStockInfo(product);

      if (info.quantity === null) {
        untrackedProducts++;

        if (info.status === "Out of Stock") {
          outOfStockProducts++;
        }

        return;
      }

      trackedProducts++;
      totalStock += info.quantity;

      if (info.status === "Out of Stock") {
        outOfStockProducts++;
      } else if (info.status === "Low Stock") {
        lowStockProducts++;
      } else if (info.status === "In Stock") {
        inStockProducts++;
      }
    });

    return {
      totalStock,
      trackedProducts,
      lowStockProducts,
      outOfStockProducts,
      inStockProducts,
      untrackedProducts,
    };
  }, [products]);

  // Search, category filter, stock filter and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    const search = searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter((product) => {
        const name = String(product.name || "").toLowerCase();
        const category = String(product.category || "").toLowerCase();
        const id = String(product._id || "").toLowerCase();

        return (
          name.includes(search) ||
          category.includes(search) ||
          id.includes(search)
        );
      });
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (selectedStockStatus !== "all") {
      result = result.filter((product) => {
        const info = getStockInfo(product);

        return info.status === selectedStockStatus;
      });
    }

    switch (sortBy) {
      case "price-low":
        result.sort(
          (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0)
        );
        break;

      case "price-high":
        result.sort(
          (a, b) => (Number(b.price) || 0) - (Number(a.price) || 0)
        );
        break;

      case "name":
        result.sort((a, b) =>
          String(a.name || "").localeCompare(String(b.name || ""))
        );
        break;

      case "stock-low":
        result.sort(
          (a, b) =>
            (Number(a.stockQuantity) || 0) -
            (Number(b.stockQuantity) || 0)
        );
        break;

      case "stock-high":
        result.sort(
          (a, b) =>
            (Number(b.stockQuantity) || 0) -
            (Number(a.stockQuantity) || 0)
        );
        break;

      default:
        break;
    }

    return result;
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedStockStatus,
    sortBy,
  ]);

  // Price statistics
  const totalPrice = products.reduce(
    (sum, product) => sum + (Number(product.price) || 0),
    0
  );

  const averagePrice =
    products.length > 0 ? totalPrice / products.length : 0;

  // Delete product
  const handleDeleteProduct = async () => {
    if (!deleteProduct?._id || isDeleting) return;

    setIsDeleting(true);

    try {
      const res = await axiosSecure.delete(
        `/products/${deleteProduct._id}`
      );

      if (res.data?.deletedCount > 0) {
        toast.success("Product deleted successfully!");

        setDeleteProduct(null);

        await queryClient.invalidateQueries({
          queryKey: ["products"],
        });
      } else {
        toast.error(
          res.data?.message || "Product could not be deleted."
        );
      }
    } catch (err) {
      console.error("Delete product error:", err);

      toast.error(
        err.response?.data?.message ||
          "Failed to delete product. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedStockStatus("all");
    setSortBy("default");
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    selectedCategory !== "all" ||
    selectedStockStatus !== "all" ||
    sortBy !== "default";

  return (
    <section className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <Helmet>
        <title>Shopery | Manage Products</title>
      </Helmet>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="light"
      />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Shopery Admin Panel
            </p>

            <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
              Manage Products
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage products, monitor stock levels and identify inventory
              shortages.
            </p>
          </div>

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-500 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
          >
            <FaSyncAlt className={isFetching ? "animate-spin" : ""} />
            Refresh Products
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Products"
            value={products.length.toLocaleString("en-BD")}
            description="Products in your catalog"
            icon={<FaBoxOpen />}
            iconClass="bg-emerald-100 text-emerald-600"
          />

          <StatCard
            title="Total Stock Units"
            value={inventoryStats.totalStock.toLocaleString("en-BD")}
            description={`${inventoryStats.trackedProducts} products have tracked stock`}
            icon={<FaBoxes />}
            iconClass="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Low Stock Products"
            value={inventoryStats.lowStockProducts.toLocaleString("en-BD")}
            description="Products at or below their stock threshold"
            icon={<FaExclamationCircle />}
            iconClass="bg-amber-100 text-amber-600"
          />

          <StatCard
            title="Out of Stock"
            value={inventoryStats.outOfStockProducts.toLocaleString("en-BD")}
            description="Products with no available stock"
            icon={<FaExclamationTriangle />}
            iconClass="bg-rose-100 text-rose-600"
          />

          <StatCard
            title="Total Categories"
            value={categories.length.toLocaleString("en-BD")}
            description="Categories currently in use"
            icon={<FaTags />}
            iconClass="bg-cyan-100 text-cyan-600"
          />

          <StatCard
            title="Average Price"
            value={formatPrice(averagePrice)}
            description="Average price per product"
            icon={<FaChartLine />}
            iconClass="bg-violet-100 text-violet-600"
          />

          <StatCard
            title="Combined Prices"
            value={formatPrice(totalPrice)}
            description="Sum of listed product prices"
            icon={<FaMoneyBillWave />}
            iconClass="bg-orange-100 text-orange-600"
          />

          <StatCard
            title="In Stock Products"
            value={inventoryStats.inStockProducts.toLocaleString("en-BD")}
            description="Products above their low-stock threshold"
            icon={<FaCheckCircle />}
            iconClass="bg-green-100 text-green-600"
          />
        </div>

        {/* Legacy data notice */}
        {inventoryStats.untrackedProducts > 0 && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            <FaExclamationCircle className="mt-0.5 shrink-0" />

            <p>
              <strong>{inventoryStats.untrackedProducts}</strong> product(s)
              do not have a Stock Quantity saved yet. Their inventory status
              will appear as Not Tracked until stock is added through product
              management.
            </p>
          </div>
        )}

        {/* Main panel */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Panel heading */}
          <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Product Inventory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Stock Monitoring
            </span>
          </div>

          {/* Search and filters */}
          <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 lg:grid-cols-12 lg:p-5">
            <div className="relative lg:col-span-5">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, category or ID..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="relative lg:col-span-3">
              <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-8 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-4">
              <select
                value={selectedStockStatus}
                onChange={(e) => setSelectedStockStatus(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="all">All Stock Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Not Tracked">Not Tracked</option>
              </select>
            </div>

            <div className="lg:col-span-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="default">Default Order</option>
                <option value="name">Name: A to Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock-low">Stock: Low to High</option>
                <option value="stock-high">Stock: High to Low</option>
              </select>
            </div>

            {hasActiveFilters && (
              <div className="lg:col-span-12">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 transition hover:text-rose-700"
                >
                  <FaTimes />
                  Clear search and filters
                </button>
              </div>
            )}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-4 p-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex animate-pulse items-center gap-4"
                >
                  <div className="h-12 w-12 rounded-xl bg-slate-200" />

                  <div className="flex-1">
                    <div className="mb-2 h-3 w-1/3 rounded bg-slate-200" />
                    <div className="h-3 w-1/5 rounded bg-slate-100" />
                  </div>

                  <div className="h-8 w-20 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && !isLoading && (
            <div className="px-5 py-16 text-center">
              <FaExclamationTriangle className="mx-auto mb-4 text-3xl text-rose-500" />

              <h3 className="text-lg font-bold text-slate-800">
                Could not load products
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                {error?.response?.data?.message ||
                  error?.message ||
                  "Something went wrong while loading products."}
              </p>

              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filteredProducts.length === 0 && (
            <div className="px-5 py-16 text-center">
              <FaBoxOpen className="mx-auto mb-4 text-4xl text-slate-300" />

              <h3 className="text-lg font-bold text-slate-800">
                {products.length === 0
                  ? "No products available"
                  : "No matching products"}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {products.length === 0
                  ? "Products will appear here when added to your store."
                  : "Try changing your search, category or stock filter."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          {/* Products table */}
          {!isLoading && !isError && filteredProducts.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left">
                  <thead>
                    <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <th className="px-5 py-4 font-semibold">#</th>
                      <th className="px-5 py-4 font-semibold">Product</th>
                      <th className="px-5 py-4 font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Price</th>
                      <th className="px-5 py-4 font-semibold">Stock Qty</th>
                      <th className="px-5 py-4 font-semibold">Threshold</th>
                      <th className="px-5 py-4 font-semibold">Inventory Status</th>
                      <th className="px-5 py-4 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product, index) => {
                      const image =
                        product.images?.[0] || product.image || "";

                      const stockInfo = getStockInfo(product);

                      return (
                        <tr
                          key={product._id}
                          className="transition hover:bg-emerald-50/40"
                        >
                          <td className="px-5 py-4 text-sm text-slate-500">
                            {String(index + 1).padStart(2, "0")}
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                                {image ? (
                                  <img
                                    src={image}
                                    alt={product.name || "Product"}
                                    loading="lazy"
                                    className="h-full w-full object-contain p-1"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <FaImage className="text-xl text-slate-300" />
                                )}
                              </div>

                              <div className="max-w-xs">
                                <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                                  {product.name || "Unnamed Product"}
                                </p>

                                <p className="mt-1 truncate text-xs text-slate-400">
                                  ID: {product._id}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            {product.category ? (
                              <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                                {product.category}
                              </span>
                            ) : (
                              <span className="text-sm text-slate-400">
                                Not specified
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4">
                            <span className="text-sm font-bold text-slate-800">
                              {formatPrice(product.price)}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            {stockInfo.quantity === null ? (
                              <span className="text-sm text-slate-400">—</span>
                            ) : (
                              <span className="text-sm font-bold text-slate-800">
                                {stockInfo.quantity.toLocaleString("en-BD")}
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-4 text-sm text-slate-600">
                            {product.stockQuantity == null
                              ? "—"
                              : Number(product.lowStockThreshold ?? 5).toLocaleString(
                                  "en-BD"
                                )}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${stockInfo.className}`}
                            >
                              {stockInfo.status === "Low Stock" ||
                              stockInfo.status === "Out of Stock" ? (
                                <FaExclamationTriangle />
                              ) : stockInfo.status === "In Stock" ? (
                                <FaCheckCircle />
                              ) : (
                                <FaBoxOpen />
                              )}

                              {stockInfo.status}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <Link
                                to={`/admindashboard/updateProduct/${product._id}`}
                                title="Edit product"
                                aria-label={`Edit ${product.name || "product"}`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white"
                              >
                                <FaRegEdit />
                              </Link>

                              <button
                                type="button"
                                onClick={() => setDeleteProduct(product)}
                                title="Delete product"
                                aria-label={`Delete ${product.name || "product"}`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-100 bg-rose-50 text-rose-600 transition hover:border-rose-600 hover:bg-rose-600 hover:text-white"
                              >
                                <FaTrashAlt />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Displaying {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""}
                </p>

                <p>Shopery Inventory Management</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => {
            if (!isDeleting) setDeleteProduct(null);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-2xl text-rose-600">
              <FaExclamationTriangle />
            </div>

            <h3
              id="delete-product-title"
              className="text-center text-xl font-bold text-slate-800"
            >
              Delete this product?
            </h3>

            <p className="mt-3 text-center text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-800">
                {deleteProduct.name || "this product"}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteProduct(null)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProduct}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaTrashAlt />
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const StatCard = ({ title, value, description, icon, iconClass }) => {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h3 className="mt-3 break-words text-2xl font-bold text-slate-800">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">{description}</p>
    </div>
  );
};

export default ManageProduct;
