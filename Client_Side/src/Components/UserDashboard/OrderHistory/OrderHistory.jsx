import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import {
    HiOutlineClipboardList,
    HiOutlineRefresh,
} from "react-icons/hi";
import { MdCancel } from "react-icons/md";

import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

import OrderTracking from "./OrderTracking";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const getStatusClass = (status) => {
    const normalized = (status || "pending")
        .toLowerCase()
        .replaceAll(" ", "_");

    return `dashboard-status dashboard-status-${normalized}`;
};

const OrderHistory = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [cancellingId, setCancellingId] = useState(null);

    const {
        data: orders = [],
        refetch,
        isLoading,
        isFetching,
        isError,
    } = useQuery({
        queryKey: ["orders", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const response = await axiosSecure.get("/orders", {
                params: { email: user.email },
            });

            return Array.isArray(response.data) ? response.data : [];
        },
        refetchInterval: 10000,
        refetchIntervalInBackground: false,
    });

    const handleCancelOrder = async (order) => {
        const status = (order.status || "pending").toLowerCase();

        if (status !== "pending") {
            toast.info("Only pending orders can be cancelled.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmed) return;

        try {
            setCancellingId(order._id);

            const response = await axiosSecure.patch(
                `/orders/${order._id}/cancel`
            );

            if (response.status >= 200 && response.status < 300) {
                toast.success("Your order has been cancelled successfully.");
                await refetch();
            } else {
                toast.error(
                    response.data?.message || "Unable to cancel this order."
                );
            }
        } catch (error) {
            console.error(
                "Order cancellation failed:",
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to cancel your order. Please try again."
            );
        } finally {
            setCancellingId(null);
        }
    };

    if (loading || (!user && loading)) {
        return (
            <div className="dashboard-card dashboard-empty-state">
                Loading your account...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="dashboard-card dashboard-empty-state">
                Please log in to view your orders.
            </div>
        );
    }

    return (
        <section>
            <Helmet>
                <title>Shopery | Order History</title>
            </Helmet>

            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="mb-1 text-sm font-semibold text-green-700">
                        YOUR SHOPPING ACTIVITY
                    </p>

                    <h2 className="dashboard-section-title mb-2">
                        Order History
                    </h2>

                    <p className="dashboard-muted-text">
                        View your orders, check their status and track deliveries.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:border-green-500 hover:text-green-700 disabled:opacity-50"
                >
                    <HiOutlineRefresh
                        className={isFetching ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </div>

            <div className="dashboard-card overflow-hidden">
                <div className="dashboard-card-heading">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-2xl text-green-700">
                            <HiOutlineClipboardList />
                        </div>

                        <div>
                            <h2>All Orders</h2>
                            <p className="mt-1 text-xs text-gray-500">
                                {orders.length} {orders.length === 1 ? "order" : "orders"} found
                            </p>
                        </div>
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-extrabold text-green-700">
                        Auto-refresh: 10s
                    </span>
                </div>

                {loading || isLoading ? (
                    <div className="dashboard-empty-state">
                        Loading your order history...
                    </div>
                ) : isError ? (
                    <div className="dashboard-empty-state">
                        <p className="mb-3 text-red-600">
                            Failed to load order history.
                        </p>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700"
                        >
                            Try again
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="dashboard-empty-state">
                        <HiOutlineClipboardList className="mx-auto mb-3 text-4xl text-gray-300" />

                        <h3 className="mb-2 font-bold text-gray-700">
                            No orders yet
                        </h3>

                        <p className="mb-4">
                            Your placed orders will appear here.
                        </p>

                        <a
                            href="/"
                            className="inline-flex rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-700"
                        >
                            Start shopping
                        </a>
                    </div>
                ) : (
                    <div className="dashboard-table-wrapper">
                        <table className="dashboard-table min-w-[680px]">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Order Date</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th className="text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => {
                                    const status = (
                                        order.status || "pending"
                                    ).toLowerCase();

                                    return (
                                        <Fragment key={order._id}>
                                            <tr>
                                                <td>
                                                    <span
                                                        className="block max-w-[140px] break-all font-bold text-gray-800"
                                                        title={order._id}
                                                    >
                                                        #{String(order._id).slice(-8).toUpperCase()}
                                                    </span>
                                                </td>

                                                <td className="whitespace-nowrap">
                                                    {formatDate(order.createdAt)}
                                                </td>

                                                <td className="whitespace-nowrap font-bold text-gray-800">
                                                    ৳{Number(order.totalPrice || 0).toFixed(2)}
                                                </td>

                                                <td>
                                                    <span className={getStatusClass(status)}>
                                                        {status.replaceAll("_", " ")}
                                                    </span>
                                                </td>

                                                <td>
                                                    <div className="flex justify-center">
                                                        {status === "pending" ? (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleCancelOrder(order)
                                                                }
                                                                disabled={
                                                                    cancellingId === order._id
                                                                }
                                                                title="Cancel order"
                                                                aria-label="Cancel order"
                                                                className="rounded-lg p-2 text-xl text-gray-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                            >
                                                                <MdCancel />
                                                            </button>
                                                        ) : (
                                                            <span className="text-gray-300">
                                                                —
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td colSpan={5} className="!p-3 !bg-gray-50">
                                                    <details className="group">
                                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:border-green-400 hover:text-green-700">
                                                            <span>
                                                                Track order{" "}
                                                                <span className="ml-1 text-xs font-normal text-gray-400">
                                                                    #{String(order._id).slice(-8).toUpperCase()}
                                                                </span>
                                                            </span>

                                                            <span className="text-xs font-bold text-green-700 group-open:hidden">
                                                                + View tracking
                                                            </span>

                                                            <span className="hidden text-xs font-bold text-green-700 group-open:inline">
                                                                − Hide tracking
                                                            </span>
                                                        </summary>

                                                        <OrderTracking status={status} />
                                                    </details>
                                                </td>
                                            </tr>
                                        </Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OrderHistory;