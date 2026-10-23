import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { FaChartLine } from "react-icons/fa";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

const SalesChart = () => {
  const axiosSecure = useAxiosSecure();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosSecure.get("/allorders");

        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch sales data:", err);
        setError("Sales data load করা যায়নি। আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [axiosSecure]);

  // Calculate sales for the last six months
  const salesData = useMemo(() => {
    const today = new Date();

    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - i,
        1
      );

      months.push({
        month: date.toLocaleString("en-US", { month: "short" }),
        year: date.getFullYear(),
        sales: 0,
        orders: 0,
      });
    }

    orders.forEach((order) => {
      if (order.status?.toLowerCase() !== "delivered") {
        return;
      }

      const orderDate = new Date(order.createdAt);
      const amount = Number(order.totalPrice) || 0;

      if (Number.isNaN(orderDate.getTime())) {
        return;
      }

      const matchingMonth = months.find(
        (item) =>
          item.month ===
            orderDate.toLocaleString("en-US", { month: "short" }) &&
          item.year === orderDate.getFullYear()
      );

      if (matchingMonth) {
        matchingMonth.sales += amount;
        matchingMonth.orders += 1;
      }
    });

    return months;
  }, [orders]);

  // Calculate total delivered sales
  const totalSales = useMemo(() => {
    return orders.reduce((total, order) => {
      if (order.status?.toLowerCase() === "delivered") {
        return total + (Number(order.totalPrice) || 0);
      }

      return total;
    }, 0);
  }, [orders]);

  const totalDeliveredOrders = useMemo(() => {
    return orders.filter(
      (order) => order.status?.toLowerCase() === "delivered"
    ).length;
  }, [orders]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 font-semibold text-gray-800">{label}</p>

          <p className="text-sm text-emerald-600">
            Sales: ৳{Number(payload[0].value).toLocaleString("en-BD")}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Orders: {payload[0].payload.orders}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <div className="rounded-lg bg-emerald-100 p-2 text-emerald-600">
              <FaChartLine size={18} />
            </div>

            <h2 className="text-lg font-bold text-gray-800 md:text-xl">
              Sales Overview
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            Monthly sales performance for the last 6 months
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50 px-4 py-3">
          <p className="text-xs font-medium text-gray-500">
            Total Delivered Sales
          </p>

          <h3 className="mt-1 text-xl font-bold text-emerald-600">
            ৳{totalSales.toLocaleString("en-BD")}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {totalDeliveredOrders} delivered orders
          </p>
        </div>
      </div>

      {/* Chart */}
      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <span className="loading loading-spinner loading-lg text-emerald-600"></span>
        </div>
      ) : error ? (
        <div className="flex h-72 items-center justify-center">
          <p className="text-center text-sm text-red-500">{error}</p>
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesData}
              margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="#10b981"
                    stopOpacity={0.3}
                  />

                  <stop
                    offset="95%"
                    stopColor="#10b981"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              <XAxis
                dataKey="month"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tickFormatter={(value) => `৳${value}`}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={65}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="sales"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#salesGradient)"
                activeDot={{
                  r: 6,
                  stroke: "#ffffff",
                  strokeWidth: 2,
                  fill: "#10b981",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 border-t border-gray-100 pt-4">
        <p className="text-xs text-gray-500">
          * Only orders with Delivered status are included. Monthly figures
          are grouped by order creation date.
        </p>
      </div>
    </div>
  );
};

export default SalesChart;