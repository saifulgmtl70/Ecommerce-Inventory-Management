
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import Newsletter from "../Shop/Products/Newsletter";
import useCart from "../../Hooks/useCart";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./cart.css";
import { Helmet } from "react-helmet-async";
import useAuth from "../../Hooks/useAuth";

const Cart = () => {
    const [cart, refetch, isLoading, isError] = useCart();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const { user } = useAuth();

    const [quantities, setQuantities] = useState({});
    const [deletingItems, setDeletingItems] = useState([]);

    // Keep quantity state synchronized with cart data
    useEffect(() => {
        setQuantities((previousQuantities) => {
            const updatedQuantities = {};

            cart.forEach((item) => {
                updatedQuantities[item._id] =
                    previousQuantities[item._id] ?? 1;
            });

            return updatedQuantities;
        });
    }, [cart]);

    // Change product quantity
    const handleQuantityChange = (id, amount) => {
        setQuantities((previousQuantities) => ({
            ...previousQuantities,
            [id]: Math.max(
                1,
                (previousQuantities[id] ?? 1) + amount
            ),
        }));
    };

    // Delete cart item
    const handleDeleteItem = async (id) => {
        if (deletingItems.includes(id)) {
            return;
        }

        setDeletingItems((previous) => [...previous, id]);

        try {
            const response =  await axiosPublic.delete(`/carts/${id}`, {
                                params: {
                                    email: user.email
                                }
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

                toast.success("Item deleted successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                });
            } else {
                toast.error("Item could not be found.", {
                    position: "top-center",
                    autoClose: 3000,
                });

                await refetch();
            }
        } catch (error) {
            console.error("Cart deletion error:", error);

            toast.error(
                error.response?.data?.message ||
                    "Failed to delete item. Please try again.",
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

    // Calculate cart total
    const totalPrice = cart.reduce((total, item) => {
        const price = Number(item.price) || 0;
        const quantity = quantities[item._id] ?? 1;

        return total + price * quantity;
    }, 0);

    // Navigate to checkout
    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.info("Your cart is empty.", {
                position: "top-center",
                autoClose: 2500,
            });

            return;
        }

        navigate("/checkout", {
            state: {
                cart,
                quantities,
                totalPrice,
            },
        });
    };

    return (
        <section className="nunito_sans">
            <Helmet>
                <title>Shopery | Cart</title>
            </Helmet>

            <ToastContainer />

            {/* Page banner */}
            <div className="specific_product_banner h-full lg:h-[30vh] mb-2">
                <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">
                    <ul>
                        <li>
                            <Link
                                to="/"
                                className="flex items-center gap-1"
                            >
                                <HiOutlineHome />
                                Home
                            </Link>
                        </li>

                        <li className="text-[#00B207] font-bold">
                            Shopping Cart
                        </li>
                    </ul>
                </div>
            </div>

            <div className="px-5 lg:px-14 py-10">
                <div className="text-center mb-10">
                    <h2 className="text-[#222] font-bold text-[34px]">
                        My Shopping Cart
                    </h2>
                </div>

                {/* Loading state */}
                {isLoading && (
                    <div className="text-center py-10">
                        <span className="loading loading-spinner loading-lg"></span>
                        <p className="mt-3 text-gray-600">
                            Loading your cart...
                        </p>
                    </div>
                )}

                {/* Error state */}
                {!isLoading && isError && (
                    <div className="text-center py-10">
                        <p className="text-red-600 mb-4">
                            Unable to load your cart. Please try again.
                        </p>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="px-6 py-3 rounded-full bg-[#00B207] text-white"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Cart content */}
                {!isLoading && !isError && (
                    <>
                        {cart.length === 0 ? (
                            <div className="text-center py-12 border rounded-lg">
                                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                                    Your cart is empty
                                </h3>

                                <p className="text-gray-500 mb-6">
                                    Add some products to your cart to get started.
                                </p>

                                <Link
                                    to="/shop"
                                    className="inline-block px-8 py-3 rounded-full bg-[#00B207] text-white"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                                {/* Product table */}
                                <div className="h-auto lg:col-span-2">
                                    <div className="w-full mb-8 overflow-x-auto border rounded-[6px] shadow-sm">
                                        <div className="w-full">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-[15px] font-semibold tracking-wide text-left text-[#111] uppercase rounded-t-md border-b font_Inter">
                                                        <th className="px-4 py-3">
                                                            Product
                                                        </th>

                                                        <th className="px-4 py-3">
                                                            Price
                                                        </th>

                                                        <th className="px-4 py-3">
                                                            Quantity
                                                        </th>

                                                        <th className="px-4 py-3">
                                                            Subtotal
                                                        </th>

                                                        <th className="px-4 py-3">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody className="bg-white">
                                                    {cart.map((item) => {
                                                        const quantity =
                                                            quantities[item._id] ?? 1;

                                                        const price =
                                                            Number(item.price) || 0;

                                                        const isDeleting =
                                                            deletingItems.includes(
                                                                item._id
                                                            );

                                                        return (
                                                            <tr
                                                                key={item._id}
                                                                className="text-gray-700 border-b last:border-none"
                                                            >
                                                                <td className="px-4 py-3">
                                                                    <div className="flex items-center gap-2 min-w-[180px]">
                                                                        <div>
                                                                            <img
                                                                                src={item.image}
                                                                                alt={item.product || "Product"}
                                                                                className="w-[65px] h-[65px] lg:w-[80px] lg:h-[80px] object-contain"
                                                                            />
                                                                        </div>

                                                                        <div>
                                                                            <h3 className="text-[16px] lg:text-[18px] text-[#191919] font-semibold mb-1">
                                                                                {item.product}
                                                                            </h3>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">
                                                                    ৳{price.toFixed(2)}
                                                                </td>

                                                                <td className="px-2 py-3 text-sm font-semibold">
                                                                    <div className="flex items-center gap-1 border w-fit p-2 rounded-[5px]">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleQuantityChange(
                                                                                    item._id,
                                                                                    -1
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                isDeleting ||
                                                                                quantity <= 1
                                                                            }
                                                                            className="text-gray-600 transition hover:opacity-75 disabled:opacity-40"
                                                                            aria-label="Decrease quantity"
                                                                        >
                                                                            -
                                                                        </button>

                                                                        <span className="px-3">
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
                                                                            disabled={isDeleting}
                                                                            className="text-gray-600 transition hover:opacity-75 disabled:opacity-40"
                                                                            aria-label="Increase quantity"
                                                                        >
                                                                            +
                                                                        </button>
                                                                    </div>
                                                                </td>

                                                                <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">
                                                                    ৳{(
                                                                        price * quantity
                                                                    ).toFixed(2)}
                                                                </td>

                                                                <td className="px-4 py-3">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleDeleteItem(
                                                                                item._id
                                                                            )
                                                                        }
                                                                        disabled={isDeleting}
                                                                        aria-label={`Delete ${item.product} from cart`}
                                                                        className="text-[#6d5656] text-[23px] p-[6px] border rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                                                    >
                                                                        {isDeleting ? (
                                                                            <span className="loading loading-spinner loading-xs"></span>
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
                                    </div>
                                </div>

                                {/* Cart total */}
                                <div className="h-auto shadow-sm rounded-lg border px-7 py-5">
                                    <h2 className="text-[#222] font-bold text-[28px] mb-4">
                                        Cart Total
                                    </h2>

                                    <ul className="space-y-3">
                                        <li className="flex items-center justify-between border-b pb-[14px] px-3 py-2">
                                            <h2 className="text-[19px] text-[#555]">
                                                Subtotal
                                            </h2>

                                            <h2 className="text-[19px] text-[#333] font-bold">
                                                ৳{totalPrice.toFixed(2)}
                                            </h2>
                                        </li>

                                        <li className="flex items-center justify-between border-b pb-[14px] px-3 py-2">
                                            <h2 className="text-[19px] text-[#555]">
                                                Shipping
                                            </h2>

                                            <h2 className="text-[19px] text-[#333] font-bold">
                                                Free
                                            </h2>
                                        </li>

                                        <li className="flex items-center justify-between border-b pb-[14px] px-3 py-2">
                                            <h2 className="text-[19px] text-[#555]">
                                                Total
                                            </h2>

                                            <h2 className="text-[19px] text-[#333] font-bold">
                                                ৳{totalPrice.toFixed(2)}
                                            </h2>
                                        </li>
                                    </ul>

                                    <div className="my-8 bg-white">
                                        <div className="flex flex-col gap-3 justify-around">
                                            <button
                                                type="button"
                                                onClick={handleCheckout}
                                                className="px-12 py-3 mb-4 text-center rounded-[24px] bg-[#00B207] text-white"
                                            >
                                                Checkout
                                            </button>

                                            <Link
                                                to="/shop"
                                                className="px-12 py-3 text-center rounded-[24px] bg-[#EEF7EE] text-[#00B207] font-bold"
                                            >
                                                Continue to Shop
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Newsletter />
        </section>
    );
};

export default Cart;
