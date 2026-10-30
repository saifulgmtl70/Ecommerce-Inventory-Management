import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiOutlineHome } from "react-icons/hi";
import {
    FaShoppingCart,
    FaArrowRight,
    FaStore,
    FaShieldAlt,
} from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//import Newsletter from "../Shop/Products/Newsletter";
import useCart from "../../Hooks/useCart";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAuth from "../../Hooks/useAuth";
import "./cart.css";

const Cart = () => {
    const [cart, refetch, isLoading, isError] = useCart();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [quantities, setQuantities] = useState({});
    const [deletingItems, setDeletingItems] = useState([]);

    const items = Array.isArray(cart) ? cart : [];

    useEffect(() => {
        setQuantities((previousQuantities) => {
            const updatedQuantities = {};

            items.forEach((item) => {
                updatedQuantities[item._id] =
                    previousQuantities[item._id] ?? 1;
            });

            return updatedQuantities;
        });
    }, [cart]);

    const formatPrice = (price) =>
        (Number(price) || 0).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const handleQuantityChange = (id, amount) => {
        setQuantities((previousQuantities) => ({
            ...previousQuantities,
            [id]: Math.max(
                1,
                (previousQuantities[id] ?? 1) + amount
            ),
        }));
    };

    const handleDeleteItem = async (id) => {
        if (deletingItems.includes(id)) return;

        if (!user?.email) {
            toast.error("Please log in to manage your cart.", {
                position: "top-center",
                autoClose: 2500,
            });
            return;
        }

        setDeletingItems((previous) => [...previous, id]);

        try {
            const response = await axiosPublic.delete(`/carts/${id}`, {
                params: {
                    email: user.email,
                },
            });

            if (response.data.deletedCount > 0) {
                setQuantities((previousQuantities) => {
                    const updatedQuantities = {
                        ...previousQuantities,
                    };

                    delete updatedQuantities[id];

                    return updatedQuantities;
                });

                await refetch();

                toast.success("Product removed from your cart.", {
                    position: "top-center",
                    autoClose: 2500,
                });
            } else {
                toast.error("This cart item could not be found.", {
                    position: "top-center",
                    autoClose: 2500,
                });

                await refetch();
            }
        } catch (error) {
            console.error("Cart deletion error:", error);

            toast.error(
                error.response?.data?.message ||
                    "Failed to remove product. Please try again.",
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );
        } finally {
            setDeletingItems((previous) =>
                previous.filter((itemId) => itemId !== id)
            );
        }
    };

    const totalPrice = items.reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = quantities[item._id] ?? 1;

        return total + price * quantity;
    }, 0);

    const totalItems = items.reduce(
        (total, item) => total + (quantities[item._id] ?? 1),
        0
    );

    const handleCheckout = () => {
        if (items.length === 0) {
            toast.info("Your cart is empty.", {
                position: "top-center",
                autoClose: 2500,
            });
            return;
        }

        if (!user?.email) {
            toast.info("Please log in before proceeding to checkout.", {
                position: "top-center",
                autoClose: 2500,
            });
            return;
        }

        navigate("/checkout", {
            state: {
                cart: items,
                quantities,
                totalPrice,
            },
        });
    };

    return (
        <section className="nunito_sans min-h-screen bg-[#f7f8f7]">
            <Helmet>
                <title>Shopery | Shopping Cart</title>
                <meta
                    name="description"
                    content="Review your Shopery cart and proceed to checkout."
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
                                    Shopping Cart
                                </li>
                            </ul>
                        </div>

                        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
                            Shopping Cart
                        </h1>

                        <p className="mt-2 text-sm text-gray-200 sm:text-base">
                            Review your items before checking out.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
                {/* Page heading */}
                <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <FaShoppingCart className="text-xl text-[#00B207]" />
                            <h2 className="text-2xl font-extrabold text-[#1a1a1a] sm:text-3xl">
                                My Shopping Cart
                            </h2>
                        </div>

                        <p className="text-sm text-gray-500">
                            Check your selected products and quantities.
                        </p>
                    </div>

                    {!isLoading && !isError && items.length > 0 && (
                        <div className="flex w-fit items-center gap-2 rounded-full border border-[#dceedd] bg-white px-4 py-2 text-sm font-semibold text-[#2c742f]">
                            <FaShoppingCart />
                            {totalItems}{" "}
                            {totalItems === 1 ? "Item" : "Items"}
                        </div>
                    )}
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
                        <span className="loading loading-spinner loading-lg text-[#00B207]" />
                        <p className="mt-4 text-sm text-gray-500">
                            Loading your cart...
                        </p>
                    </div>
                )}

                {/* Error state */}
                {!isLoading && isError && (
                    <div className="rounded-2xl border border-red-100 bg-white px-5 py-14 text-center shadow-sm">
                        <h3 className="text-xl font-bold text-gray-800">
                            Unable to load your cart
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

                {/* Cart content */}
                {!isLoading && !isError && (
                    <>
                        {items.length === 0 ? (
                            <div className="rounded-2xl border border-gray-100 bg-white px-5 py-14 text-center shadow-sm sm:py-20">
                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#eaf8eb]">
                                    <FaShoppingCart className="text-3xl text-[#00B207]" />
                                </div>

                                <h3 className="mt-6 text-xl font-extrabold text-gray-800 sm:text-2xl">
                                    Your cart is empty
                                </h3>

                                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                                    Looks like you haven't added anything to
                                    your cart yet. Explore our products and
                                    find something you love.
                                </p>

                                <Link
                                    to="/shop"
                                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-[#00B207] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#008f06]"
                                >
                                    <FaStore />
                                    Start Shopping
                                    <FaArrowRight />
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
                                {/* Products */}
                                <div className="min-w-0 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-2">
                                    {/* Desktop table */}
                                    <div className="hidden overflow-x-auto md:block">
                                        <table className="w-full min-w-[650px] border-collapse">
                                            <thead>
                                                <tr className="border-b border-gray-100 bg-[#f8faf8] text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                    <th className="px-5 py-5">
                                                        Product
                                                    </th>
                                                    <th className="px-4 py-5">
                                                        Price
                                                    </th>
                                                    <th className="px-4 py-5">
                                                        Quantity
                                                    </th>
                                                    <th className="px-5 py-5 text-right">
                                                        Subtotal
                                                    </th>
                                                    <th className="px-4 py-5">
                                                        Remove
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {items.map((item) => {
                                                    const quantity =
                                                        quantities[item._id] ?? 1;
                                                    const price =
                                                        Number(item.price) || 0;
                                                    const deleting =
                                                        deletingItems.includes(
                                                            item._id
                                                        );

                                                    return (
                                                        <tr
                                                            key={item._id}
                                                            className="border-b border-gray-100 last:border-b-0 hover:bg-[#fbfdfb]"
                                                        >
                                                            <td className="px-5 py-5">
                                                                <div className="flex min-w-[180px] items-center gap-3">
                                                                    <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-xl bg-[#f7f9f7] p-2">
                                                                        <img
                                                                            src={
                                                                                item.image
                                                                            }
                                                                            alt={
                                                                                item.product ||
                                                                                "Product"
                                                                            }
                                                                            loading="lazy"
                                                                            className="h-full w-full object-contain"
                                                                        />
                                                                    </div>

                                                                    <h3 className="max-w-[170px] text-sm font-bold leading-5 text-[#222]">
                                                                        {
                                                                            item.product
                                                                        }
                                                                    </h3>
                                                                </div>
                                                            </td>

                                                            <td className="whitespace-nowrap px-4 py-5 text-sm font-semibold text-gray-700">
                                                                ৳
                                                                {formatPrice(
                                                                    price
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-5">
                                                                <div className="flex w-fit items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleQuantityChange(
                                                                                item._id,
                                                                                -1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            deleting ||
                                                                            quantity <=
                                                                                1
                                                                        }
                                                                        aria-label="Decrease quantity"
                                                                        className="font-bold text-gray-600 transition hover:text-[#00B207] disabled:cursor-not-allowed disabled:opacity-30"
                                                                    >
                                                                        −
                                                                    </button>

                                                                    <span className="min-w-[16px] text-center text-sm font-bold text-gray-800">
                                                                        {
                                                                            quantity
                                                                        }
                                                                    </span>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleQuantityChange(
                                                                                item._id,
                                                                                1
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            deleting
                                                                        }
                                                                        aria-label="Increase quantity"
                                                                        className="font-bold text-gray-600 transition hover:text-[#00B207] disabled:opacity-30"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </td>

                                                            <td className="whitespace-nowrap px-5 py-5 text-right text-sm font-extrabold text-[#202820]">
                                                                ৳
                                                                {formatPrice(
                                                                    price *
                                                                        quantity
                                                                )}
                                                            </td>

                                                            <td className="px-4 py-5">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDeleteItem(
                                                                            item._id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deleting
                                                                    }
                                                                    aria-label={`Remove ${item.product} from cart`}
                                                                    title="Remove product"
                                                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-xl text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                                >
                                                                    {deleting ? (
                                                                        <span className="loading loading-spinner loading-xs" />
                                                                    ) : (
                                                                        <IoCloseOutline />
                                                                    )}
                                                                </button>
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
                                            const quantity =
                                                quantities[item._id] ?? 1;
                                            const price =
                                                Number(item.price) || 0;
                                            const deleting =
                                                deletingItems.includes(
                                                    item._id
                                                );

                                            return (
                                                <div
                                                    key={item._id}
                                                    className="p-4 sm:p-5"
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#f7f9f7] p-2">
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

                                                        <div className="min-w-0 flex-1">
                                                            <h3 className="break-words text-sm font-bold leading-5 text-[#222]">
                                                                {item.product}
                                                            </h3>

                                                            <p className="mt-2 text-base font-extrabold text-[#202820]">
                                                                ৳
                                                                {formatPrice(
                                                                    price
                                                                )}
                                                            </p>

                                                            <div className="mt-3 flex w-fit items-center gap-4 rounded-full border border-gray-200 px-3 py-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            item._id,
                                                                            -1
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deleting ||
                                                                        quantity <=
                                                                            1
                                                                    }
                                                                    aria-label="Decrease quantity"
                                                                    className="font-bold text-gray-600 disabled:opacity-30"
                                                                >
                                                                    −
                                                                </button>

                                                                <span className="min-w-[16px] text-center text-sm font-bold">
                                                                    {quantity}
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            item._id,
                                                                            1
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deleting
                                                                    }
                                                                    aria-label="Increase quantity"
                                                                    className="font-bold text-gray-600 disabled:opacity-30"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteItem(
                                                                    item._id
                                                                )
                                                            }
                                                            disabled={deleting}
                                                            aria-label={`Remove ${item.product} from cart`}
                                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-xl text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                                                        >
                                                            {deleting ? (
                                                                <span className="loading loading-spinner loading-xs" />
                                                            ) : (
                                                                <IoCloseOutline />
                                                            )}
                                                        </button>
                                                    </div>

                                                    <div className="mt-4 flex items-center justify-between rounded-xl bg-[#f8faf8] px-3 py-3">
                                                        <span className="text-xs font-medium text-gray-500">
                                                            Subtotal
                                                        </span>

                                                        <span className="text-sm font-extrabold text-[#202820]">
                                                            ৳
                                                            {formatPrice(
                                                                price * quantity
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex flex-col gap-3 border-t border-gray-100 bg-[#fcfdfc] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <Link
                                            to="/shop"
                                            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#00B207] transition hover:text-[#008f06]"
                                        >
                                            <FaStore />
                                            Continue Shopping
                                        </Link>

                                        <span className="text-xs text-gray-400">
                                            {items.length}{" "}
                                            {items.length === 1
                                                ? "product"
                                                : "products"}{" "}
                                            in your cart
                                        </span>
                                    </div>
                                </div>

                                {/* Order summary */}
                                <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
                                    <h2 className="text-xl font-extrabold text-[#202820] sm:text-2xl">
                                        Cart Summary
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Review your order total.
                                    </p>

                                    <div className="mt-6 space-y-4">
                                        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                                            <span className="text-sm text-gray-500">
                                                Subtotal ({totalItems}{" "}
                                                {totalItems === 1
                                                    ? "item"
                                                    : "items"})
                                            </span>

                                            <span className="text-sm font-bold text-gray-800">
                                                ৳{formatPrice(totalPrice)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4">
                                            <span className="text-sm text-gray-500">
                                                Shipping
                                            </span>

                                            <span className="rounded-full bg-[#e9f8eb] px-3 py-1 text-xs font-bold text-[#2c742f]">
                                                Free
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-4 pt-1">
                                            <span className="text-base font-bold text-gray-800">
                                                Total
                                            </span>

                                            <span className="text-xl font-extrabold text-[#00A82B]">
                                                ৳{formatPrice(totalPrice)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleCheckout}
                                        className="mt-7 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#00B207] px-5 py-3.5 text-sm font-extrabold text-white transition hover:bg-[#008f06] focus:outline-none focus:ring-4 focus:ring-green-100"
                                    >
                                        Proceed to Checkout
                                        <FaArrowRight />
                                    </button>

                                    <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#f7faf7] p-4">
                                        <FaShieldAlt className="mt-0.5 shrink-0 text-lg text-[#00B207]" />

                                        <div>
                                            <p className="text-xs font-bold text-gray-700">
                                                Safe and Secure Checkout
                                            </p>

                                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                                Review your order details
                                                before confirming your purchase.
                                            </p>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        )}
                    </>
                )}
            </div>


        </section>
    );
};

export default Cart;