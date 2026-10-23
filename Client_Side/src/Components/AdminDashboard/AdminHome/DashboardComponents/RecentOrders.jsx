
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
    FaShoppingBag,
    FaArrowRight,
    FaExternalLinkAlt,
} from "react-icons/fa";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const formatCurrency = (amount) =>
    `৳${(Number(amount) || 0).toLocaleString("en-BD")}`;

const getStatusClass = (status) => {
    switch (String(status || "pending").toLowerCase()) {
        case "confirmed":
            return "bg-blue-50 text-blue-700";

        case "delivered":
            return "bg-green-50 text-green-700";

        case "cancelled":
            return "bg-red-50 text-red-700";

        case "pending":
        default:
            return "bg-amber-50 text-amber-700";
    }
};

const RecentOrders = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: orders = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["admin-recent-orders"],
        queryFn: async () => {
            const response = await axiosSecure.get("/allorders");

            return Array.isArray(response.data)
                ? response.data
                : [];
        },
    });

    const recentOrders = [...orders]
        .sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();

            return dateB - dateA;
        })
        .slice(0, 5);

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

            {/* Heading */}
            <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="rounded-lg bg-green-50 p-2 text-green-600">
                            <FaShoppingBag />
                        </span>

                        <h2 className="text-lg font-bold text-gray-800">
                            Recent Orders
                        </h2>
                    </div>

                    <p className="mt-2 text-sm text-gray-500">
                        Review the latest orders in your store.
                    </p>
                </div>

                <Link
                    to="/dashboard/manageOrders"
                    className="inline-flex w-fit items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                >
                    View All
                    <FaArrowRight className="text-xs" />
                </Link>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-4 p-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-12 animate-pulse rounded-lg bg-gray-100"
                        />
                    ))}
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="p-8 text-center">
                    <p className="text-sm text-red-600">
                        Unable to load recent orders.
                    </p>

                    <button
                        onClick={() => refetch()}
                        className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && recentOrders.length === 0 && (
                <div className="p-10 text-center">
                    <FaShoppingBag className="mx-auto text-3xl text-gray-300" />

                    <p className="mt-3 font-semibold text-gray-600">
                        No orders yet
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        New customer orders will appear here.
                    </p>
                </div>
            )}

            {/* Desktop Table */}
            {!isLoading && !isError && recentOrders.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left">
                        <thead className="bg-gray-50">
                            <tr className="text-xs uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4 font-semibold">
                                    Customer
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Order Date
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Amount
                                </th>

                                <th className="px-6 py-4 font-semibold">
                                    Status
                                </th>

                                <th className="px-6 py-4 text-right font-semibold">
                                    Details
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {recentOrders.map((order) => (
                                <tr
                                    key={order._id}
                                    className="transition hover:bg-gray-50/80"
                                >
                                    <td className="px-6 py-4">
                                        <p className="max-w-[240px] truncate text-sm font-semibold text-gray-800">
                                            {order.name?.trim() ||
                                                order.email ||
                                                "Unknown Customer"}
                                        </p>

                                        {order.name?.trim() && (
                                            <p className="mt-1 max-w-[240px] truncate text-xs text-gray-400">
                                                {order.email}
                                            </p>
                                        )}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {order.createdAt &&
                                        !Number.isNaN(
                                            new Date(order.createdAt).getTime()
                                        )
                                            ? new Date(
                                                  order.createdAt
                                              ).toLocaleDateString("en-GB", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                              })
                                            : "—"}
                                    </td>

                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-800">
                                        {formatCurrency(order.totalPrice)}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                                                order.status
                                            )}`}
                                        >
                                            {order.status || "pending"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            to="/admindashboard/manageorders"
                                            title="View all orders"
                                            aria-label="View all orders"
                                            className="inline-flex rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                                        >
                                            <FaExternalLinkAlt className="text-xs" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Bottom note */}
            {!isLoading && !isError && recentOrders.length > 0 && (
                <div className="border-t border-gray-100 bg-gray-50/70 px-6 py-3">
                    <p className="text-xs text-gray-400">
                        Showing the 5 most recent orders, when available.
                    </p>
                </div>
            )}
        </div>
    );
};

export default RecentOrders;
