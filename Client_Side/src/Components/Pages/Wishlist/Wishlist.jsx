import { useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import {
    FaHeart,
    FaShoppingCart,
    FaArrowRight,
    FaRegHeart,
} from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import Newsletter from "../Shop/Products/Newsletter";
import useWishlist from "../../Hooks/useWishlist";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const Wishlist = () => {
    const [wishlist, refetch, isLoading, isError] = useWishlist();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const [processingItems, setProcessingItems] = useState([]);

    const items = Array.isArray(wishlist) ? wishlist : [];

    const formatPrice = (price) =>
        (Number(price) || 0).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const isProcessing = (id) => processingItems.includes(id);

    const startProcessing = (id) => {
        setProcessingItems((previous) =>
            previous.includes(id) ? previous : [...previous, id]
        );
    };

    const stopProcessing = (id) => {
        setProcessingItems((previous) =>
            previous.filter((itemId) => itemId !== id)
        );
    };

    const handleDeleteItem = async (id) => {
        if (isProcessing(id)) return;

        startProcessing(id);

        try {
            const response = await axiosPublic.delete(`/wishlist/${id}`);

            if (response.data.deletedCount > 0) {
                await refetch();

                toast.success("Product removed from your wishlist.", {
                    position: "top-center",
                    autoClose: 2500,
                });
            } else {
                toast.error("Unable to find this wishlist item.", {
                    position: "top-center",
                    autoClose: 2500,
                });

                await refetch();
            }
        } catch (error) {
            console.error("Wishlist deletion error:", error);

            toast.error(
                error.response?.data?.message ||
                    "Failed to remove product. Please try again.",
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );
        } finally {
            stopProcessing(id);
        }
    };

    const handleAddToCart = async (item) => {
        if (isProcessing(item._id)) return;

        if (item.availability !== "In Stock") {
            toast.warning("This product is currently out of stock.", {
                position: "top-center",
                autoClose: 2500,
            });
            return;
        }

        startProcessing(item._id);

        try {
            const cartItem = {
                email: item.email,
                productId: item.productId,
                product: item.product,
                price: item.price,
                image: item.image,
                quantity: 1,
            };

            const response = await axiosPublic.post("/carts", cartItem);

            if (response.data.insertedId) {
                await axiosPublic.delete(`/wishlist/${item._id}`);
                await refetch();

                toast.success("Product added to cart successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                    onClose: () => navigate("/cart"),
                });
            } else {
                toast.error(
                    "The product could not be added to your cart.",
                    {
                        position: "top-center",
                        autoClose: 3000,
                    }
                );
            }
        } catch (error) {
            console.error("Add to cart error:", error);

            toast.error(
                error.response?.data?.message ||
                    "Failed to add product to cart. Please try again.",
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );
        } finally {
            stopProcessing(item._id);
        }
    };

    return (
        <section className="nunito_sans min-h-screen bg-[#f7f8f7]">
            <Helmet>
                <title>Shopery | My Wishlist</title>
                <meta
                    name="description"
                    content="View and manage your favorite products on Shopery."
                />
            </Helmet>

            <ToastContainer />

            {/* Breadcrumb banner */}
            <div className="specific_product_banner relative mb-2 min-h-[150px] lg:min-h-[190px]">
                <div className="relative z-10 flex min-h-[150px] items-center px-5 py-8 sm:px-8 lg:min-h-[190px] lg:px-16">
                    <div>
                        <div className="breadcrumbs mb-3 text-sm text-white">
                            <ul>
                                <li>
                                    <Link
                                        to="/"
                                        className="flex items-center gap-2 transition hover:text-[#00B207]"
                                    >
                                        <HiOutlineHome />
                                        Home
                                    </Link>
                                </li>
                                <li className="font-semibold text-[#00B207]">
                                    Wishlist
                                </li>
                            </ul>
                        </div>

                        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                            My Wishlist
                        </h1>

                        <p className="mt-2 text-sm text-gray-200 sm:text-base">
                            Your favorite products, all in one place.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                {/* Page heading */}
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <FaHeart className="text-xl text-[#00B207]" />
                            <h2 className="text-2xl font-extrabold text-[#1a1a1a] sm:text-3xl">
                                Saved Products
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            Keep track of products you love.
                        </p>
                    </div>

                    {!isLoading && !isError && items.length > 0 && (
                        <div className="flex w-fit items-center gap-2 rounded-full border border-[#dceedd] bg-white px-4 py-2 text-sm font-semibold text-[#2c742f]">
                            <FaRegHeart />
                            {items.length}{" "}
                            {items.length === 1 ? "Product" : "Products"}
                        </div>
                    )}
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
                        <span className="loading loading-spinner loading-lg text-[#00B207]" />
                        <p className="mt-4 text-sm text-gray-500">
                            Loading your wishlist...
                        </p>
                    </div>
                )}

                {/* Error state */}
                {!isLoading && isError && (
                    <div className="rounded-2xl border border-red-100 bg-white px-5 py-14 text-center shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800">
                            Unable to load your wishlist
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                            Please check your connection and try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-6 rounded-full bg-[#00B207] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#008f06]"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !isError && items.length === 0 && (
                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-14 text-center shadow-sm sm:py-20">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf8eb]">
                            <FaHeart className="text-3xl text-[#00B207]" />
                        </div>

                        <h3 className="mt-6 text-xl font-extrabold text-gray-800 sm:text-2xl">
                            Your wishlist is empty
                        </h3>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                            You haven't saved any products yet. Explore our
                            collection and save your favorite items here.
                        </p>

                        <Link
                            to="/shop"
                            className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#00B207] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#008f06]"
                        >
                            Explore Products
                            <FaArrowRight />
                        </Link>
                    </div>
                )}

                {/* Wishlist products */}
                {!isLoading && !isError && items.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                        {/* Desktop table */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="w-full min-w-[760px] border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-[#f8faf8] text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                        <th className="px-6 py-5">Product</th>
                                        <th className="px-5 py-5">Price</th>
                                        <th className="px-5 py-5">Availability</th>
                                        <th className="px-6 py-5 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {items.map((item) => {
                                        const processing = isProcessing(item._id);
                                        const inStock =
                                            item.availability === "In Stock";

                                        return (
                                            <tr
                                                key={item._id}
                                                className="border-b border-gray-100 last:border-b-0 hover:bg-[#fbfdfb]"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex min-w-[240px] items-center gap-4">
                                                        <div className="flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-xl bg-[#f7f9f7] p-2">
                                                            <img
                                                                src={item.image}
                                                                alt={
                                                                    item.product ||
                                                                    "Product"
                                                                }
                                                                loading="lazy"
                                                                className="h-full w-full object-contain"
                                                            />
                                                        </div>

                                                        <div>
                                                            <h3 className="max-w-[260px] text-sm font-bold leading-6 text-[#222]">
                                                                {item.product}
                                                            </h3>
                                                            <p className="mt-1 text-xs text-gray-400">
                                                                Saved to wishlist
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-5">
                                                    <span className="whitespace-nowrap text-base font-extrabold text-[#202820]">
                                                        ৳{formatPrice(item.price)}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-5">
                                                    <span
                                                        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${
                                                            inStock
                                                                ? "bg-[#e9f8eb] text-[#2c742f]"
                                                                : "bg-red-50 text-red-600"
                                                        }`}
                                                    >
                                                        <span
                                                            className={`h-1.5 w-1.5 rounded-full ${
                                                                inStock
                                                                    ? "bg-[#00B207]"
                                                                    : "bg-red-500"
                                                            }`}
                                                        />
                                                        {inStock
                                                            ? "In Stock"
                                                            : "Out of Stock"}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleAddToCart(item)
                                                            }
                                                            disabled={
                                                                processing ||
                                                                !inStock
                                                            }
                                                            className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#00B207] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#008f06] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                                                        >
                                                            {processing ? (
                                                                <span className="loading loading-spinner loading-xs" />
                                                            ) : (
                                                                <FaShoppingCart />
                                                            )}
                                                            Add to Cart
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteItem(
                                                                    item._id
                                                                )
                                                            }
                                                            disabled={processing}
                                                            aria-label={`Remove ${item.product} from wishlist`}
                                                            title="Remove from wishlist"
                                                            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-xl text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <IoCloseOutline />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile product cards */}
                        <div className="divide-y divide-gray-100 md:hidden">
                            {items.map((item) => {
                                const processing = isProcessing(item._id);
                                const inStock =
                                    item.availability === "In Stock";

                                return (
                                    <div
                                        key={item._id}
                                        className="p-4 sm:p-5"
                                    >
                                        <div className="flex gap-4">
                                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#f7f9f7] p-2">
                                                <img
                                                    src={item.image}
                                                    alt={item.product || "Product"}
                                                    loading="lazy"
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="break-words text-sm font-bold leading-5 text-[#222]">
                                                    {item.product}
                                                </h3>

                                                <p className="mt-2 text-base font-extrabold text-[#202820]">
                                                    ৳{formatPrice(item.price)}
                                                </p>

                                                <span
                                                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                        inStock
                                                            ? "bg-[#e9f8eb] text-[#2c742f]"
                                                            : "bg-red-50 text-red-600"
                                                    }`}
                                                >
                                                    {inStock
                                                        ? "In Stock"
                                                        : "Out of Stock"}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteItem(item._id)
                                                }
                                                disabled={processing}
                                                aria-label={`Remove ${item.product} from wishlist`}
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-xl text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                            >
                                                <IoCloseOutline />
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleAddToCart(item)}
                                            disabled={processing || !inStock}
                                            className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#00B207] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#008f06] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                                        >
                                            {processing ? (
                                                <span className="loading loading-spinner loading-xs" />
                                            ) : (
                                                <FaShoppingCart />
                                            )}
                                            Add to Cart
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex flex-col gap-4 border-t border-gray-100 bg-[#fcfdfc] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p className="text-sm text-gray-500">
                                You have saved{" "}
                                <span className="font-bold text-gray-800">
                                    {items.length}
                                </span>{" "}
                                {items.length === 1 ? "product" : "products"}.
                            </p>

                            <Link
                                to="/shop"
                                className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#00B207] transition hover:text-[#008f06]"
                            >
                                Continue Shopping
                                <FaArrowRight />
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            
        </section>
    );
};

export default Wishlist;