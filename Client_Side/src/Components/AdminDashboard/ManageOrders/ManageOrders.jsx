import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
//import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import { FaSyncAlt } from "react-icons/fa";

const ManageOrders = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: orders = [],
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ["admin-orders"],
        queryFn: async () => {
            const response = await axiosSecure.get("/allorders");
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p className="text-lg font-semibold text-gray-600">
                    Loading orders...
                </p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6">
                <h2 className="text-xl font-bold text-red-600">
                    Failed to load orders
                </h2>

                <p className="mt-2 text-gray-600">
                    {error?.response?.data?.message ||
                        error?.message ||
                        "Something went wrong."}
                </p>

                <button
                    onClick={() => refetch()}
                    className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-4 md:p-8">
            <Helmet>
                <title>Shopery | Manage Orders</title>
            </Helmet>

            
            {/* Manage Orders Header */}
            <div className="relative my-16 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-200 via-green-100 to-teal-200 px-6 py-7 shadow-md md:px-8 md:py-8">

                {/* Decorative Background Circles */}
                <div className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 rounded-full bg-white/30"></div>

                <div className="pointer-events-none absolute -bottom-16 right-32 h-40 w-40 rounded-full bg-white/30"></div>

                {/* Header Content */}
                <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                    {/* Heading and Description */}
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-white/70 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-800">
                            <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                            ADMIN PANEL
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight text-emerald-950 md:text-3xl lg:text-4xl">
                            Manage Orders
                        </h1>

                        <p className="mt-2 max-w-lg text-sm leading-6 text-gray-700 md:text-base">
                            Track customer orders, monitor their status, and manage every order from one place.
                        </p>
                    </div>

                    {/* Refresh Button */}
                    <button
                        onClick={() => refetch()}
                        disabled={isLoading}
                        className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-emerald-200 bg-white px-5 py-3 text-sm font-bold text-emerald-800 shadow-md transition duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 sm:self-auto"
                    >
                        <FaSyncAlt
                            className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                        />

                        {isLoading ? "Refreshing..." : "Refresh Orders"}
                    </button>

                </div>
            </div>
            

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Total Orders
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-gray-800">
                        {orders.length}
                    </h2>
                </div>

                <div className="rounded-lg bg-white p-5 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Pending Orders
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-orange-500">
                        {
                            orders.filter(
                                (order) =>
                                    (order.status || "pending").toLowerCase() ===
                                    "pending"
                            ).length
                        }
                    </h2>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
                <table className="w-full min-w-[850px] text-left">
                    <thead className="bg-gray-100 text-sm uppercase text-gray-600">
                        <tr>
                            <th className="px-5 py-4">#</th>
                            <th className="px-5 py-4">Order ID</th>
                            <th className="px-5 py-4">Customer Name</th>
                            <th className="px-5 py-4">Customer Email</th>
                            <th className="px-5 py-4">Order Date</th>
                            <th className="px-5 py-4">Total</th>
                            <th className="px-5 py-4">Status</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {orders.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-5 py-12 text-center text-gray-500"
                                >
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order, index) => {
                                const status = (
                                    order.status || "pending"
                                ).toLowerCase();

                                const statusClasses = {
                                    pending: "bg-yellow-100 text-yellow-700",
                                    confirmed: "bg-blue-100 text-blue-700",
                                    processing: "bg-indigo-100 text-indigo-700",
                                    shipped: "bg-purple-100 text-purple-700",
                                    delivered: "bg-green-100 text-green-700",
                                    cancelled: "bg-red-100 text-red-700"
                                };

                                const orderDate = order.createdAt
                                    ? new Date(order.createdAt).toLocaleString()
                                    : "N/A";

                                return (
                                    <tr
                                        key={order._id}
                                        className="transition hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4">
                                            {index + 1}
                                        </td>

                                        <td className="px-5 py-4 font-mono text-s text-gray-600">
                                            {order._id}
                                        </td>

                                        <td className="px-5 py-4 font-medium text-gray-800">
                                            {order.customerName || order.name || "N/A"}
                                        </td>

                                        <td className="px-5 py-4 text-[15.5px] text-gray-600">
                                            {order.email || "N/A"}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                                            {orderDate}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 font-semibold text-gray-800">
                                            ৳{
                                                order.totalPrice ??
                                                order.totalAmount ??
                                                order.total ??
                                                "N/A"
                                            }
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                    statusClasses[status] ||
                                                    "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageOrders;