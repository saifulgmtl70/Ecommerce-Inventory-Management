import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MdCancel } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Helmet } from "react-helmet-async";

import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

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

        }

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

                toast.error("Unable to cancel this order.");

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

            case "processing":
                return "bg-blue-100 text-blue-700";

            case "shipped":
                return "bg-purple-100 text-purple-700";

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

        <div className="">

            <Helmet>
                <title>Shopery | Order History</title>
            </Helmet>

            <ToastContainer />

            <div className="h-auto">

                <div className="w-full mb-8 overflow-x-auto border rounded-[6px] shadow-sm">

                    <div className="w-full">

                        {/* TABLE HEADER */}

                        <div className="p-4 flex items-center justify-between">

                            <h2 className="text-[#222] font-bold text-[18px]">
                                Recent Order History
                            </h2>

                            <h2 className="text-[#00B307] font-bold text-[18px]">
                                Total Orders: {orders.length}
                            </h2>

                        </div>

                        {/* LOADING */}

                        {(loading || isLoading) ? (

                            <div className="text-center py-12 text-gray-500">
                                Loading your order history...
                            </div>

                        ) : isError ? (

                            <div className="text-center py-12 text-red-500">
                                Failed to load order history.
                            </div>

                        ) : !user ? (

                            <div className="text-center py-12 text-gray-500">
                                Please log in to view your orders.
                            </div>

                        ) : orders.length === 0 ? (

                            <div className="text-center py-12 text-gray-500">
                                You haven't placed any orders yet.
                            </div>

                        ) : (

                            <table className="w-full">

                                <thead>

                                    <tr className="text-[15px] font-semibold tracking-wide text-left text-[#111] uppercase bg-[#F2F2F2]">

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

                                            <tr
                                                key={order._id}
                                                className="text-gray-700 border-b"
                                            >

                                                {/* ORDER ID */}

                                                <td className="px-4 py-3">

                                                    <div className="flex items-center gap-2">

                                                        <h3 className="text-[14px] text-[#191919] font-[600] break-all">

                                                            {order._id}

                                                        </h3>

                                                    </div>

                                                </td>

                                                {/* ORDER DATE */}

                                                <td className="px-4 py-3 text-sm font-semibold">

                                                    {formatDate(order.createdAt)}

                                                </td>

                                                {/* TOTAL PRICE */}

                                                <td className="px-4 py-3 text-sm font-semibold">

                                                    <div className="flex items-center justify-center">

                                                        <h2>
                                                            ৳{Number(order.totalPrice || 0).toFixed(2)}
                                                        </h2>

                                                    </div>

                                                </td>

                                                {/* ORDER STATUS */}

                                                <td className="px-4 py-3">

                                                    <div className="flex items-center gap-3">

                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(orderStatus)}`}
                                                        >

                                                            {orderStatus}

                                                        </span>

                                                    </div>

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
                                                                    onClick={() => handleCancelOrder(order._id)}
                                                                    disabled={cancellingId === order._id}
                                                                    className="text-[#00B207] text-[20px] lg:text-[25px] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >

                                                                    <MdCancel />

                                                                </button>

                                                            </div>

                                                        ) : (

                                                            <span className="text-gray-400 text-sm">
                                                                —
                                                            </span>

                                                        )}

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    })}

                                </tbody>

                            </table>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

};

export default OrderHistory;