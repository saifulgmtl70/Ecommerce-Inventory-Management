
import React from "react";
import {
    FaShoppingBag,
    FaBoxOpen,
    FaUsers,
    FaClock
} from "react-icons/fa";

const StatsCards = ({ stats }) => {
    const cards = [
        {
            title: "Total Orders",
            value: stats?.totalOrders ?? 0,
            icon: FaShoppingBag,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            borderColor: "border-blue-200",
        },
        {
            title: "Total Products",
            value: stats?.totalProducts ?? 0,
            icon: FaBoxOpen,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            borderColor: "border-purple-200",
        },
        {
            title: "Total Customers",
            value: stats?.totalCustomers ?? 0,
            icon: FaUsers,
            color: "text-green-600",
            bgColor: "bg-green-100",
            borderColor: "border-green-200",
        },
        {
            title: "Pending Orders",
            value: stats?.pendingOrders ?? 0,
            icon: FaClock,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            borderColor: "border-orange-200",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
                const Icon = card.icon;

                return (
                    <div
                        key={card.title}
                        className={`rounded-2xl border ${card.borderColor} bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    {card.title}
                                </p>

                                <h2 className="mt-3 text-3xl font-bold text-gray-800">
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${card.bgColor}`}
                            >
                                <Icon
                                    className={`text-2xl ${card.color}`}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatsCards;
