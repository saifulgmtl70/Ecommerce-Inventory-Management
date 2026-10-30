import {
    FaCheckCircle,
    FaBox,
    FaTruck,
    FaHome,
    FaClipboardCheck,
} from "react-icons/fa";

const steps = [
    {
        status: "pending",
        label: "Order Placed",
        description: "Your order has been received.",
        icon: FaClipboardCheck,
    },
    {
        status: "confirmed",
        label: "Order Confirmed",
        description: "Your order has been confirmed by Shopery.",
        icon: FaCheckCircle,
    },
    {
        status: "processing",
        label: "Processing",
        description: "Your order is being prepared.",
        icon: FaBox,
    },
    {
        status: "packed",
        label: "Packed",
        description: "Your order has been packed.",
        icon: FaBox,
    },
    {
        status: "shipped",
        label: "Shipped",
        description: "Your order has been handed over for delivery.",
        icon: FaTruck,
    },
    {
        status: "out_for_delivery",
        label: "Out for Delivery",
        description: "Your order is on its way to you.",
        icon: FaTruck,
    },
    {
        status: "delivered",
        label: "Delivered",
        description: "Your order has been delivered successfully.",
        icon: FaHome,
    },
];

const OrderTracking = ({ status }) => {
    const currentStatus = (status || "pending")
        .toLowerCase()
        .replaceAll(" ", "_");

    if (currentStatus === "cancelled") {
        return (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-5">
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg text-red-600">
                        <FaClipboardCheck />
                    </div>

                    <div>
                        <h3 className="font-extrabold text-red-700">
                            Order Cancelled
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-red-600">
                            This order has been cancelled and will not proceed
                            through the delivery process.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const currentIndex = steps.findIndex(
        (step) => step.status === currentStatus
    );

    return (
        <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="text-lg font-extrabold text-gray-800">
                        Order Tracking
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                        Follow your order's progress.
                    </p>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-extrabold capitalize text-green-700">
                    {currentStatus.replaceAll("_", " ")}
                </span>
            </div>

            {currentIndex === -1 && (
                <p className="mb-4 rounded-lg bg-orange-50 p-3 text-sm text-orange-700">
                    The current order status is not recognized:{" "}
                    {currentStatus.replaceAll("_", " ")}.
                </p>
            )}

            <div>
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const completed =
                        currentIndex !== -1 && index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={step.status} className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
                                        completed
                                            ? "bg-green-600 text-white shadow-sm"
                                            : "border border-gray-200 bg-gray-50 text-gray-400"
                                    }`}
                                >
                                    <Icon className="text-base" />
                                </div>

                                {!isLast && (
                                    <div
                                        className={`my-1 min-h-8 w-[3px] grow rounded-full ${
                                            completed && index < currentIndex
                                                ? "bg-green-500"
                                                : "bg-gray-200"
                                        }`}
                                    />
                                )}
                            </div>

                            <div className={isLast ? "pb-0" : "pb-7"}>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h4
                                        className={`font-extrabold ${
                                            completed
                                                ? "text-green-700"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {step.label}
                                    </h4>

                                    {isCurrent && (
                                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-green-700">
                                            Current
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OrderTracking;