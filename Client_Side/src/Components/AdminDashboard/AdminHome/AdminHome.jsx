
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import {
    FaExclamationCircle,
    FaShoppingBag,
    FaChartLine,
} from "react-icons/fa";

import useAxiosSecure from "../../Hooks/useAxiosSecure";

import StatsCards from "./DashboardComponents/StatsCards";
import OrderStatusChart from "./DashboardComponents/OrderStatusChart";
import SalesAnalytics from "./DashboardComponents/SalesAnalytics";
import RecentOrders from "./DashboardComponents/RecentOrders";

const AdminHome = () => {
    const axiosSecure = useAxiosSecure();

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
            <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-green-600" />

                    <p className="mt-4 text-sm font-medium text-gray-500">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // Error State
    if (isError) {
        console.error("Dashboard API Error:", error);

        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                    <FaExclamationCircle className="mx-auto text-4xl text-red-500" />

                    <h2 className="mt-4 text-xl font-bold text-gray-800">
                        Failed to Load Dashboard
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        We couldn't load your dashboard statistics.
                        Please check your connection and try again.
                    </p>

                    <button
                        onClick={() => refetch()}
                        className="mt-6 rounded-lg bg-green-600 px-6 py-2.5 font-semibold text-white transition hover:bg-green-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">

            <Helmet>
                <title>Shopery | Admin Dashboard</title>
            </Helmet>

            {/* Welcome Banner */}
            <section className="relative my-14 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 via-green-600 to-teal-500 p-6 text-white shadow-lg sm:p-8">

                {/* Decorative circles */}
                <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />

                <div className="pointer-events-none absolute -bottom-20 right-28 h-40 w-40 rounded-full bg-white/10" />

                <div className="pointer-events-none absolute right-1/3 top-0 h-24 w-24 rounded-full bg-white/5" />

                <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">

                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-lime-300" />

                            <span className="text-xs font-semibold tracking-wider text-white/90">
                                SHOPERY ADMIN PANEL
                            </span>
                        </div>

                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                            Welcome Back, Admin!
                            <span className="ml-2 inline-block">👋</span>
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
                            Your store, your insights, your growth.
                            <br className="hidden sm:block" />
                            Manage products, monitor orders, and track your store's performance.
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-white/85 sm:text-sm">

                            <span className="inline-flex items-center gap-2">
                                <FaChartLine />
                                Store Overview
                            </span>

                            <span className="hidden h-1 w-1 rounded-full bg-white/60 sm:block" />

                            <span className="inline-flex items-center gap-2">
                                <FaShoppingBag />
                                Manage Your Store
                            </span>

                        </div>
                    </div>

                    <div className="hidden shrink-0 sm:flex sm:items-center sm:justify-center">
                        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-inner backdrop-blur-sm lg:h-36 lg:w-36">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 text-5xl lg:h-28 lg:w-28 lg:text-6xl">
                                🛍️
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Statistics Cards */}
            <section>
                <StatsCards stats={stats} />
            </section>

            {/* Order Status */}
            <section className="mt-8">
                <OrderStatusChart stats={stats} />
            </section>

            {/* Sales Analytics */}
            <section className="mt-8">
                <SalesAnalytics />
            </section>

            {/* Recent Orders */}
            <section className="mt-8">
                <RecentOrders />
            </section>

            {/* Footer */}
            <footer className="pb-4 pt-10 text-center text-xs text-gray-400">
                © {new Date().getFullYear()} Shopery Admin Dashboard.
                All rights reserved.
            </footer>

        </div>
    );
};

export default AdminHome;
