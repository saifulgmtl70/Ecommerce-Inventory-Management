
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
} from "recharts";

import {
    FaClock,
    FaCheckCircle,
    FaBoxOpen,
    FaTimesCircle,
} from "react-icons/fa";

const STATUS_CONFIG = [
    {
        key: "pending",
        name: "Pending",
        color: "#F59E0B",
        icon: FaClock,
    },
    {
        key: "confirmed",
        name: "Confirmed",
        color: "#3B82F6",
        icon: FaCheckCircle,
    },
    {
        key: "delivered",
        name: "Delivered",
        color: "#10B981",
        icon: FaBoxOpen,
    },
    {
        key: "cancelled",
        name: "Cancelled",
        color: "#EF4444",
        icon: FaTimesCircle,
    },
];

const OrderStatusChart = ({ stats = {} }) => {
    const pending = Number(stats.pendingOrders) || 0;
    const confirmed = Number(stats.confirmedOrders) || 0;
    const delivered = Number(stats.deliveredOrders) || 0;
    const cancelled = Number(stats.cancelledOrders) || 0;

    const statusValues = {
        pending,
        confirmed,
        delivered,
        cancelled,
    };

    const totalOrders =
        Number(stats.totalOrders) ||
        pending + confirmed + delivered + cancelled;

    const chartData = STATUS_CONFIG.map((item) => ({
        ...item,
        value: statusValues[item.key],
    }));

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">

            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-lg font-bold text-gray-800">
                        Order Status Overview
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Track the current status of your orders.
                    </p>
                </div>

                <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {totalOrders} Total Orders
                </span>
            </div>

            <div className="mt-4 grid grid-cols-1 items-center gap-5 md:grid-cols-2">

                {/* Doughnut Chart */}
                <div className="relative h-64">
                    {totalOrders > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData.filter(
                                            (item) => item.value > 0
                                        )}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={95}
                                        paddingAngle={4}
                                        stroke="none"
                                    >
                                        {chartData
                                            .filter(
                                                (item) => item.value > 0
                                            )
                                            .map((item) => (
                                                <Cell
                                                    key={item.key}
                                                    fill={item.color}
                                                />
                                            ))}
                                    </Pie>

                                    <Tooltip
                                        formatter={(value, name) => [
                                            `${value} orders`,
                                            name,
                                        ]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-gray-800">
                                    {totalOrders}
                                </span>

                                <span className="text-xs text-gray-500">
                                    Total Orders
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                            No orders available
                        </div>
                    )}
                </div>

                {/* Status Legend */}
                <div className="space-y-5">
                    {chartData.map((item) => {
                        const Icon = item.icon;

                        const percentage =
                            totalOrders > 0
                                ? (item.value / totalOrders) * 100
                                : 0;

                        return (
                            <div key={item.key}>
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="rounded-lg p-2"
                                            style={{
                                                backgroundColor: `${item.color}18`,
                                                color: item.color,
                                            }}
                                        >
                                            <Icon />
                                        </span>

                                        <span className="text-sm font-medium text-gray-600">
                                            {item.name}
                                        </span>
                                    </div>

                                    <span className="font-bold text-gray-800">
                                        {item.value}
                                    </span>
                                </div>

                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: item.color,
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default OrderStatusChart;
