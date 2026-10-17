
import React from "react";
import { FaChartPie, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
//import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

//import { FaClock, FaCheckCircle, FaTimesCircle, FaChartPie } from "react-icons/fa";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const OrderStatusChart = ({ stats }) => {
    const orderData = [
        {
            name: "Pending",
            value: stats?.pendingOrders ?? 0,
            color: "#F59E0B",
            icon: FaClock,
            description: "Waiting for processing"
        },
        {
            name: "Delivered",
            value: stats?.deliveredOrders ?? 0,
            color: "#10B981",
            icon: FaCheckCircle,
            description: "Successfully delivered"
        },
        {
            name: "Cancelled",
            value: stats?.cancelledOrders ?? 0,
            color: "#EF4444",
            icon: FaTimesCircle,
            description: "Cancelled orders"
        }
    ];

    const totalOrders = orderData.reduce(
        (total, item) => total + item.value,
        0
    );

    const hasOrders = totalOrders > 0;

    const chartData = hasOrders
        ? orderData.filter((item) => item.value > 0)
        : [{ name: "No Orders", value: 1, color: "#E5E7EB" }];

    return (
        <div className="h-full rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">

            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                        Order Status
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Track your order performance
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                    <FaChartPie className="text-xl text-emerald-600" />
                </div>
            </div>

            {/* Chart */}
            <div className="relative h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={95}
                            paddingAngle={hasOrders ? 4 : 0}
                            startAngle={90}
                            endAngle={-270}
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>

                        {hasOrders && (
                            <Tooltip
                                formatter={(value, name) => [
                                    `${value} ${Number(value) === 1 ? "order" : "orders"}`,
                                    name
                                ]}
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "1px solid #E5E7EB",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                                }}
                            />
                        )}
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Text */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-gray-800">
                        {totalOrders}
                    </span>

                    <span className="mt-1 text-xs font-medium text-gray-500">
                        Total Orders
                    </span>
                </div>
            </div>

            {/* Order Status Details */}
            <div className="mt-5 space-y-4">
                {orderData.map((item) => {
                    const Icon = item.icon;

                    const percentage = totalOrders > 0
                        ? ((item.value / totalOrders) * 100).toFixed(1)
                        : "0.0";

                    return (
                        <div
                            key={item.name}
                            className="flex items-center justify-between gap-3"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                    style={{
                                        backgroundColor: `${item.color}15`
                                    }}
                                >
                                    <Icon
                                        style={{ color: item.color }}
                                        className="text-lg"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-700">
                                        {item.name}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="text-sm font-bold text-gray-800">
                                    {item.value}
                                </p>

                                <p className="text-xs text-gray-400">
                                    {percentage}%
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="mt-6 rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-center text-xs text-gray-500">
                    {hasOrders
                        ? `Showing status breakdown for ${totalOrders} ${totalOrders === 1 ? "order" : "orders"}`
                        : "No orders available yet"}
                </p>
            </div>
        </div>
    );
};

export default OrderStatusChart;
