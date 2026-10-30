import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { HiOutlineUser, HiOutlineLocationMarker, HiOutlineClipboardList, HiOutlineArrowRight, HiOutlinePencil } from "react-icons/hi";
import { MdCancel } from "react-icons/md";

import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

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

const statusClass = (status) => {
    const normalized = (status || "pending")
        .toLowerCase()
        .replaceAll(" ", "_");

    return `dashboard-status dashboard-status-${normalized}`;
};

const Userhome = () => {
    const { user, loading } = useAuth();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();

    const {
        data: billings = [],
        isLoading: billingLoading,
        isError: billingError,
    } = useQuery({
        queryKey: ["billings", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const response = await axiosPublic.get("/billings", {
                params: { email: user.email },
            });

            const data = response.data;

            if (Array.isArray(data)) return data;
            if (Array.isArray(data?.billings)) return data.billings;
            if (data?._id) return [data];

            return [];
        },
    });

    const {
        data: orders = [],
        isLoading: ordersLoading,
        isError: ordersError,
        refetch: refetchOrders,
    } = useQuery({
        queryKey: ["orders", user?.email],
        enabled: !loading && !!user?.email,
        queryFn: async () => {
            const response = await axiosSecure.get("/orders", {
                params: { email: user.email },
            });

            return Array.isArray(response.data) ? response.data : [];
        },
    });

    const handleCancelOrder = async (order) => {
        if (order.status !== "pending") {
            toast.info("Only pending orders can be cancelled.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to cancel this order?"
        );

        if (!confirmed) return;

        try {
            const response = await axiosSecure.patch(
                `/orders/${order._id}/cancel`
            );

            if (response.status >= 200 && response.status < 300) {
                toast.success("Your order has been cancelled.");
                await refetchOrders();
            } 
            else {
                toast.error(
                    response.data?.message || "Unable to cancel this order."
                );
            }
        } 
        catch (error) {
            console.error("Order cancellation error:", error);

            toast.error(
                error.response?.data?.message || "Failed to cancel the order. Please try again."
            );
        }
    };

    if (loading || !user) {
        return (
            <div className="dashboard-card dashboard-empty-state">
                {loading ? "Loading your account..." : "Please log in to continue."}
            </div>
        );
    }

    const billing = billings[0];

    return (
        <section>
            <Helmet>
                <title>Shopery | Dashboard Overview</title>
            </Helmet>

            <div className="mb-6">
                <p className="mb-1 text-sm font-semibold text-green-700"> CUSTOMER OVERVIEW </p>

                <h2 className="dashboard-section-title mb-2 text-[#eee]"> Welcome back, {user.displayName?.trim().split(/\s+/)[0] || "Customer"}! </h2>

                <p className="dashboard-muted-text"> Here is an overview of your account and recent shopping activity. </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Profile card */}
                <section className="dashboard-card overflow-hidden">
                    <div className="dashboard-card-heading">
                        <div className="flex items-center gap-2">
                            <HiOutlineUser className="text-xl text-green-600" />
                            <h2>My Profile</h2>
                        </div>

                        <Link to="/userdashboard/settings" className="dashboard-primary-link inline-flex items-center gap-1"
                        >
                            <HiOutlinePencil />
                            Edit
                        </Link>
                    </div>

                    <div className="dashboard-card-body">
                        <div className="mb-5 flex items-center gap-4">
                            <img
                                src={
                                    user.photoURL ||
                                    "https://placehold.co/120x120?text=User"
                                }
                                alt="Profile"
                                className="h-[76px] w-[76px] rounded-full border-4 border-green-50 object-cover"
                            />

                            <div className="min-w-0">
                                <h3 className="break-words text-lg font-extrabold text-gray-800"> {user.displayName || "Shopery Customer"} </h3>

                                <p className="mt-1 break-all text-sm text-gray-500"> {user.email} </p>

                                <span className="mt-2 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700"> Customer Account </span>
                            </div>
                        </div>

                        <Link to="/userdashboard/settings" className="inline-flex items-center gap-2 text-sm font-bold text-green-700 hover:text-green-900" >
                            Manage your profile
                            <HiOutlineArrowRight />
                        </Link>
                    </div>
                </section>

                {/* Billing card */}
                <section className="dashboard-card">
                    <div className="dashboard-card-heading">
                        <div className="flex items-center gap-2">
                            <HiOutlineLocationMarker className="text-xl text-green-600" />
                            <h2>Billing Address</h2>
                        </div>

                        <Link to="/userdashboard/settings" className="dashboard-primary-link inline-flex items-center gap-1"
                        >
                            <HiOutlinePencil />
                            Edit
                        </Link>
                    </div>

                    <div className="dashboard-card-body">
                        {billingLoading ? (
                            <p className="dashboard-muted-text"> Loading billing address... </p>
                        ) : billingError ? (
                            <div>
                                <p className="text-sm font-semibold text-red-600">Unable to load your billing address. </p>
                                <p className="mt-2 text-sm text-gray-500"> Please try again later. </p>
                            </div>
                        ) : billing ? (
                            <div>
                                <h3 className="mb-2 text-base font-extrabold text-gray-800">
                                    {billing.fullname ||
                                    billing.fullName ||
                                    "Name not provided"}
                                </h3>

                                <p className="text-sm leading-6 text-gray-500">
                                    {billing.streetaddress ||
                                    billing.streetAddress ||
                                    "Address not provided"}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {[billing.district, billing.division] .filter(Boolean) .join(", ") || "Location not provided"}
                                </p>

                                <p className="mt-3 break-all text-sm text-gray-600"> {billing.email || user.email} </p>

                                <p className="mt-1 text-sm text-gray-600"> {billing.phone || "Phone not provided"} </p>
                            </div>
                        ) : (
                            <div>
                                <p className="mb-4 text-sm leading-6 text-gray-500"> You have not saved a billing address yet. </p>

                                <Link to="/userdashboard/settings" className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700"
                                >
                                    Add Billing Address
                                    <HiOutlineArrowRight />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Order history */}
            <section className="dashboard-card overflow-hidden">
                <div className="dashboard-card-heading">
                    <div>
                        <div className="flex items-center gap-2">
                            <HiOutlineClipboardList className="text-xl text-green-600" />
                            <h2>Recent Orders</h2>
                        </div>

                        <p className="mt-1 text-xs text-gray-500"> Your latest shopping activity </p>
                    </div>
                    <Link to="/userdashboard/orderhistory" className="dashboard-primary-link inline-flex items-center gap-1"
                    >
                        View all
                        <HiOutlineArrowRight />
                    </Link>
                </div>

                <div className="dashboard-table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {ordersLoading ? (
                                <tr>
                                    <td colSpan={5} className="dashboard-empty-state">
                                        Loading your orders...
                                    </td>
                                </tr>
                            ) : ordersError ? (
                                <tr>
                                    <td colSpan={5} className="dashboard-empty-state">
                                        <p className="mb-3 text-red-600"> Failed to load orders. </p>

                                        <button
                                            type="button"
                                            onClick={() => refetchOrders()}
                                            className="rounded-full bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700"
                                        >
                                            Try again
                                        </button>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="dashboard-empty-state">
                                        <p className="mb-3"> You have not placed any orders yet. </p>
                                        <Link to="/" className="font-bold text-green-700 hover:underline"
                                        >
                                            Start shopping
                                        </Link>
                                    </td>
                                </tr>
                            ) : (
                                orders.slice(0, 5).map((order) => (
                                    <tr key={order._id}>
                                        <td>
                                            <span className="block max-w-[140px] break-all font-bold text-gray-800" title={order._id} >
                                                #{String(order._id).slice(-8).toUpperCase()}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap"> {formatDate(order.createdAt)} </td>

                                        <td className="whitespace-nowrap font-bold text-gray-800"> ৳{Number(order.totalPrice || 0).toFixed(2)} </td>

                                        <td>
                                            <span className={statusClass(order.status)}> {(order.status || "pending").replaceAll("_", " ")} </span>
                                        </td>

                                        <td>
                                            {order.status === "pending" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelOrder(order)}
                                                    title="Cancel order"
                                                    aria-label="Cancel order"
                                                    className="rounded-lg p-2 text-xl text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                                >
                                                    <MdCancel />
                                                </button>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </section>
    );
};

export default Userhome;