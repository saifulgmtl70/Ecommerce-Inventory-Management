
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { FaExclamationCircle } from "react-icons/fa";

//import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAxiosSecure from '../../Hooks/useAxiosSecure';
import StatsCards from "./DashboardComponents/StatsCards";
import OrderStatusChart from "./DashboardComponents/OrderStatusChart";

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch dashboard statistics from the backend
    const {
        data: stats,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["admin-dashboard-stats"],

        queryFn: async () => {
            const response = await axiosSecure.get(
                "/admin/dashboard/stats"
            );

            return response.data;
        },
    });

    // Loading State
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-green-600"></span>

                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading dashboard statistics...
                    </p>
                </div>
            </div>
        );
    }

    // Error State
    if (isError) {
        console.error("Dashboard API Error:", error);

        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
                    <FaExclamationCircle className="mx-auto text-4xl text-red-500" />

                    <h2 className="mt-4 text-xl font-bold text-gray-800">
                        Failed to Load Dashboard
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        We couldn't load your dashboard statistics.
                        Please check your connection and try again.
                    </p>

                    <button
                        onClick={() => refetch()}
                        className="mt-6 rounded-lg bg-green-600 px-6 py-2.5 font-medium text-white transition hover:bg-green-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Dashboard UI
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <Helmet>
                <title>Shopery | Admin Dashboard</title>
            </Helmet>

            {/* Dashboard Heading */}
            
            {/* Premium Dashboard Welcome Section */}
            <div className="relative my-16 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">

                {/* Decorative Background Circles */}
                <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10"></div>

                <div className="pointer-events-none absolute -bottom-20 right-28 h-40 w-40 rounded-full bg-white/10"></div>

                <div className="pointer-events-none absolute right-1/3 top-0 h-24 w-24 rounded-full bg-white/5"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                        <div>
                            {/* Small Badge */}
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300"></span>

                                <span className="text-xs font-medium tracking-wide text-white/90">
                                    SHOPERY ADMIN PANEL
                                </span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                                Welcome Back, Admin!
                                <span className="ml-2 inline-block">👋</span>
                            </h1>

                            {/* Description */}
                            <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
                                Your store, your insights, your growth.
                                <br className="hidden sm:block" />
                                Manage your products, monitor orders, and keep your business moving forward.
                            </p>

                            {/* Bottom Label */}
                            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-white/80 sm:text-sm">
                                <span className="inline-flex items-center gap-2">
                                    <span className="text-base">📊</span>
                                    Store Overview
                                </span>

                                <span className="h-1 w-1 rounded-full bg-white/60"></span>

                                <span className="inline-flex items-center gap-2">
                                    <span className="text-base">🚀</span>
                                    Let's grow your business
                                </span>
                            </div>
                        </div>

                        {/* Right Side Decoration */}
                        <div className="hidden shrink-0 sm:flex sm:items-center sm:justify-center">
                            <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-inner backdrop-blur-sm lg:h-36 lg:w-36">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-5xl lg:h-28 lg:w-28 lg:text-6xl">
                                    🛍️
                                </div>
                            </div>
                        </div>

                    </div>
            </div>


            {/* Statistics Cards */}
            <section>
                <StatsCards stats={stats} />

                {/* Dashboard Charts */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    {/* Order Status Chart */}
                    <OrderStatusChart stats={stats} />

                </div>

            </section>
        </div>
    );
};

export default AdminHome;
