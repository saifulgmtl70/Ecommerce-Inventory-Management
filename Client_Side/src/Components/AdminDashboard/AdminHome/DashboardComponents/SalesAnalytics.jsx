
import React from "react";
import { useQuery } from "@tanstack/react-query";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

import {
    FaShoppingBag,
    FaMoneyBillWave,
    FaCheckCircle,
    FaChartLine,
} from "react-icons/fa";

import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const formatCurrency = (amount) =>
    `৳${(Number(amount) || 0).toLocaleString("en-BD", {
        maximumFractionDigits: 2,
    })}`;

const getStatus = (order) =>
    String(order?.status || "pending").trim().toLowerCase();

const getOrderValue = (order) =>
    Number(order?.totalPrice) || 0;

const SalesAnalytics = () => {
    const axiosSecure = useAxiosSecure();

    const {
        data: orders = [],
        isLoading,
        isError,
        refetch,
    } = useQuery({
        queryKey: ["admin-sales-analytics"],
        queryFn: async () => {
            const response = await axiosSecure.get("/allorders");

            return Array.isArray(response.data)
                ? response.data
                : [];
        },
    });

    const totalOrders = orders.length;

    const totalOrderValue = orders.reduce(
        (sum, order) => sum + getOrderValue(order),
        0
    );

    const confirmedOrders = orders.filter(
        (order) => getStatus(order) === "confirmed"
    );

    const confirmedOrderValue = confirmedOrders.reduce(
        (sum, order) => sum + getOrderValue(order),
        0
    );

    const deliveredOrders = orders.filter(
        (order) => getStatus(order) === "delivered"
    );

    const deliveredSales = deliveredOrders.reduce(
        (sum, order) => sum + getOrderValue(order),
        0
    );

    const monthlyData = React.useMemo(() => {
        const now = new Date();

        const months = Array.from({ length: 6 }, (_, index) => {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - 5 + index,
                1
            );

            return {
                key: `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}`,

                month: date.toLocaleDateString("en-US", {
                    month: "short",
                    year: "2-digit",
                }),

                orderValue: 0,
            };
        });

        const monthMap = new Map(
            months.map((month) => [month.key, month])
        );

        orders.forEach((order) => {
            if (!order.createdAt) return;

            const date = new Date(order.createdAt);

            if (Number.isNaN(date.getTime())) return;

            const key = `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;

            const month = monthMap.get(key);

            if (month) {
                month.orderValue += getOrderValue(order);
            }
        });

        return months;
    }, [orders]);

    const cards = [
        {
            title: "Total Order Value",
            value: formatCurrency(totalOrderValue),
            description: "Includes all order statuses",
            icon: FaShoppingBag,
            iconClass: "bg-violet-100 text-violet-600",
            borderClass: "from-violet-500 to-indigo-500",
        },
        {
            title: "Confirmed Order Value",
            value: formatCurrency(confirmedOrderValue),
            description: `${confirmedOrders.length} confirmed orders`,
            icon: FaCheckCircle,
            iconClass: "bg-blue-100 text-blue-600",
            borderClass: "from-blue-500 to-cyan-500",
        },
        {
            title: "Delivered Sales",
            value: formatCurrency(deliveredSales),
            description: `${deliveredOrders.length} delivered orders`,
            icon: FaMoneyBillWave,
            iconClass: "bg-emerald-100 text-emerald-600",
            borderClass: "from-emerald-500 to-teal-500",
        },
        {
            title: "Total Orders",
            value: totalOrders.toLocaleString("en-BD"),
            description: "Across all statuses",
            icon: FaChartLine,
            iconClass: "bg-orange-100 text-orange-600",
            borderClass: "from-orange-500 to-amber-500",
        },
    ];

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6 h-6 w-48 animate-pulse rounded bg-gray-200" />

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-32 animate-pulse rounded-xl bg-gray-100"
                        />
                    ))}
                </div>

                <div className="mt-6 h-72 animate-pulse rounded-xl bg-gray-100" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
                <p className="font-semibold text-red-600">
                    Unable to load sales analytics.
                </p>

                <button
                    onClick={() => refetch()}
                    className="mt-4 rounded-lg bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Section Heading */}
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                        Sales Analytics
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Understand your order value and store performance.
                    </p>
                </div>

                <span className="w-fit rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                    SALES OVERVIEW
                </span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div
                                className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${card.borderClass}`}
                            />

                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-500">
                                        {card.title}
                                    </p>

                                    <h3 className="mt-3 break-words text-2xl font-bold tracking-tight text-gray-800">
                                        {card.value}
                                    </h3>

                                    <p className="mt-2 text-xs text-gray-500">
                                        {card.description}
                                    </p>
                                </div>

                                <div className={`rounded-xl p-3 ${card.iconClass}`}>
                                    <Icon className="text-xl" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Monthly Order Value Chart */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">
                            Monthly Order Value
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                            Total value of orders created in the last six calendar months.
                        </p>
                    </div>

                    <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        6-Month Trend
                    </span>
                </div>

                <div className="mt-6 h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={monthlyData}
                            margin={{
                                top: 10,
                                right: 12,
                                left: 5,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient
                                    id="salesAnalyticsGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="0%"
                                        stopColor="#10B981"
                                        stopOpacity={0.35}
                                    />

                                    <stop
                                        offset="95%"
                                        stopColor="#10B981"
                                        stopOpacity={0.02}
                                    />
                                </linearGradient>
                            </defs>

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#E5E7EB"
                            />

                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6B7280", fontSize: 12 }}
                                dy={10}
                            />

                            <YAxis
                                tickFormatter={(value) => `৳${value}`}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6B7280", fontSize: 11 }}
                                width={70}
                            />

                            <Tooltip
                                formatter={(value) => [
                                    formatCurrency(value),
                                    "Order Value",
                                ]}
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "1px solid #E5E7EB",
                                    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                                }}
                            />

                            <Area
                                type="monotone"
                                dataKey="orderValue"
                                name="Order Value"
                                stroke="#10B981"
                                strokeWidth={3}
                                fill="url(#salesAnalyticsGradient)"
                                activeDot={{
                                    r: 6,
                                    strokeWidth: 0,
                                }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <p className="mt-3 text-xs leading-5 text-gray-400">
                    This chart includes cancelled orders and groups orders by
                    creation date. It does not represent verified payments or
                    actual collected revenue.
                </p>
            </div>

            {/* Revenue Accuracy Note */}
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                <p className="text-xs leading-5 text-amber-800">
                    <strong>Note:</strong> Delivered Sales counts orders
                    marked as delivered. To calculate actual collected revenue,
                    track payment status separately from payment method.
                </p>
            </div>

        </div>
    );
};

export default SalesAnalytics;
