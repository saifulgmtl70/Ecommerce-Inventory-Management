
import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdCancel } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Helmet } from "react-helmet-async";

import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

import OrderTracking from "./OrderTracking";

const OrderHistory = () => {
    const { user, loading } = useAuth();

    const axiosSecure = useAxiosSecure();

    const [cancellingId, setCancellingId] = useState(null);

    // =====================================
    // GET LOGGED-IN USER'S ORDER HISTORY
    // =====================================

    const {
        data: orders = [],
        refetch,
        isLoading,
        isError
    } = useQuery({
        queryKey: ["orders", user?.email],

        enabled: !loading && !!user?.email,

        queryFn: async () => {
            const response = await axiosSecure.get(
                `/orders?email=${encodeURIComponent(user.email)}`
            );

            return response.data;
        },

        // Automatically refresh order status every 10 seconds.
        refetchInterval: 10000,

        // Do not poll when the browser tab is in the background.
        refetchIntervalInBackground: false
    });

    // =====================================
    // FORMAT ORDER DATE
    // =====================================

    const formatDate = (dateString) => {
        if (!dateString) {
            return "N/A";
        }

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) {
            return "N/A";
        }

        const options = {
            day: "numeric",
            month: "long",
            year: "numeric"
        };

        return date.toLocaleDateString("en-US", options);
    };

    // =====================================
    // CANCEL ORDER
    // =====================================

    const handleCancelOrder = async (id) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmCancel) {
            return;
        }

        try {
            setCancellingId(id);

            const response = await axiosSecure.patch(
                `/orders/${id}/cancel`
            );

            if (response.data.modifiedCount > 0) {
                toast.success(
                    "Your order has been cancelled successfully!",
                    {
                        position: "top-center",
                        autoClose: 3000
                    }
                );

                await refetch();
            } else {
                toast.error(
                    response.data.message || "Unable to cancel this order.",
                    {
                        position: "top-center",
                        autoClose: 3000
                    }
                );

                await refetch();
            }
        } catch (error) {
            console.error("Order cancellation failed:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to cancel order!",
                {
                    position: "top-center",
                    autoClose: 3000
                }
            );
        } finally {
            setCancellingId(null);
        }
    };

    // =====================================
    // ORDER STATUS STYLE
    // =====================================

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "confirmed":
                return "bg-sky-100 text-sky-700";

            case "processing":
                return "bg-blue-100 text-blue-700";

            case "packed":
                return "bg-indigo-100 text-indigo-700";

            case "shipped":
                return "bg-purple-100 text-purple-700";

            case "out_for_delivery":
                return "bg-orange-100 text-orange-700";

            case "delivered":
                return "bg-green-100 text-green-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // =====================================
    // ORDER HISTORY UI
    // =====================================

    return (
        <div className="h-auto">
            <Helmet>
                <title>Shopery | Order History</title>
            </Helmet>

            <ToastContainer />

            <div className="w-full mb-8 overflow-x-auto rounded-[6px] border shadow-sm">
                <div className="w-full min-w-[750px]">

                    {/* TABLE HEADER */}

                    <div className="flex items-center justify-between gap-4 p-4">
                        <h2 className="text-[18px] font-bold text-[#222]">
                            Recent Order History
                        </h2>

                        <h2 className="text-[18px] font-bold text-[#00B307]">
                            Total Orders: {orders.length}
                        </h2>
                    </div>

                    {/* LOADING */}

                    {(loading || isLoading) ? (
                        <div className="py-12 text-center text-gray-500">
                            Loading your order history...
                        </div>
                    ) : !user ? (
                        <div className="py-12 text-center text-gray-500">
                            Please log in to view your orders.
                        </div>
                    ) : isError ? (
                        <div className="py-12 text-center text-red-500">
                            Failed to load order history. Please try again.
                            <br />

                            <button
                                type="button"
                                onClick={() => refetch()}
                                className="mt-3 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                            >
                                Try Again
                            </button>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">
                            You haven't placed any orders yet.
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#F2F2F2] text-left text-[15px] font-semibold tracking-wide text-[#111]">
                                    <th className="px-4 py-3 uppercase">
                                        #Order ID
                                    </th>

                                    <th className="px-4 py-3 uppercase">
                                        Date
                                    </th>

                                    <th className="px-4 py-3 uppercase">
                                        Total
                                    </th>

                                    <th className="px-4 py-3 uppercase">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {orders.map((order) => {
                                    const orderStatus = (
                                        order.status || "pending"
                                    ).toLowerCase();

                                    return (
                                        <Fragment key={order._id}>
                                            {/* MAIN ORDER ROW */}

                                            <tr className="border-b text-gray-700">
                                                {/* ORDER ID */}

                                                <td className="px-4 py-3">
                                                    <h3 className="break-all text-[14px] font-semibold text-[#191919]">
                                                        {order._id}
                                                    </h3>
                                                </td>

                                                {/* ORDER DATE */}

                                                <td className="px-4 py-3 text-sm font-semibold">
                                                    {formatDate(order.createdAt)}
                                                </td>

                                                {/* TOTAL PRICE */}

                                                <td className="px-4 py-3 text-sm font-semibold">
                                                    <div className="flex items-center justify-center">
                                                        ৳
                                                        {Number(
                                                            order.totalPrice || 0
                                                        ).toFixed(2)}
                                                    </div>
                                                </td>

                                                {/* ORDER STATUS */}

                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(orderStatus)}`}
                                                    >
                                                        {orderStatus.replaceAll(
                                                            "_",
                                                            " "
                                                        )}
                                                    </span>
                                                </td>

                                                {/* CANCEL ORDER */}

                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center">
                                                        {orderStatus === "pending" ? (
                                                            <div
                                                                className="tooltip"
                                                                data-tip="Cancel Order"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleCancelOrder(
                                                                            order._id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        cancellingId ===
                                                                        order._id
                                                                    }
                                                                    aria-label="Cancel order"
                                                                    className="text-[20px] font-bold text-[#00B207] disabled:cursor-not-allowed disabled:opacity-50 lg:text-[25px]"
                                                                >
                                                                    <MdCancel />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400">
                                                                —
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {/* ORDER TRACKING ROW */}

                                            <tr className="border-b bg-gray-50">
                                                <td
                                                    colSpan={5}
                                                    className="px-4 py-3"
                                                >
                                                    <details className="group">
                                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-md border bg-white px-4 py-3 font-semibold text-gray-700 transition hover:border-green-500 hover:text-green-700">
                                                            <span>
                                                                Track Your Order
                                                            </span>

                                                            <span className="text-sm text-green-600 group-open:hidden">
                                                                + View Tracking
                                                            </span>

                                                            <span className="hidden text-sm text-green-600 group-open:inline">
                                                                − Hide Tracking
                                                            </span>
                                                        </summary>

                                                        <OrderTracking
                                                            status={orderStatus}
                                                        />
                                                    </details>
                                                </td>
                                            </tr>
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
