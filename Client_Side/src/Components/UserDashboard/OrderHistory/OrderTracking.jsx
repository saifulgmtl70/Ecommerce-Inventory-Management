
import {
    FaCheckCircle,
    FaBox,
    FaTruck,
    FaHome,
    FaClipboardCheck
} from "react-icons/fa";

const steps = [
    {
        status: "pending",
        label: "Order Placed",
        description: "Your order has been received.",
        icon: FaClipboardCheck
    },
    {
        status: "confirmed",
        label: "Order Confirmed",
        description: "Your order has been confirmed by Shopery.",
        icon: FaCheckCircle
    },
    {
        status: "processing",
        label: "Processing",
        description: "Your order is being prepared.",
        icon: FaBox
    },
    {
        status: "packed",
        label: "Packed",
        description: "Your order has been packed.",
        icon: FaBox
    },
    {
        status: "shipped",
        label: "Shipped",
        description: "Your order has been handed over for delivery.",
        icon: FaTruck
    },
    {
        status: "out_for_delivery",
        label: "Out for Delivery",
        description: "Your order is on its way to you.",
        icon: FaTruck
    },
    {
        status: "delivered",
        label: "Delivered",
        description: "Your order has been delivered successfully.",
        icon: FaHome
    }
];

const OrderTracking = ({ status }) => {
    const currentStatus = (status || "pending").toLowerCase();

    // Cancelled order
    if (currentStatus === "cancelled") {
        return (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-5">
                <h3 className="text-lg font-bold text-red-600">
                    Order Cancelled
                </h3>

                <p className="mt-2 text-sm text-red-500">
                    This order has been cancelled and will not proceed
                    through the delivery process.
                </p>
            </div>
        );
    }

    const currentIndex = steps.findIndex(
        (step) => step.status === currentStatus
    );

    return (
        <div className="mt-4 rounded-lg border bg-white p-5 shadow-sm">
            <h3 className="mb-6 text-lg font-bold text-gray-800">
                Order Tracking
            </h3>

            {currentIndex === -1 && (
                <p className="mb-4 text-sm text-orange-600">
                    The current order status is not recognized:
                    {" "}{currentStatus.replaceAll("_", " ")}.
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
                            {/* Timeline icon and line */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                                        completed
                                            ? "bg-green-600 text-white"
                                            : "bg-gray-100 text-gray-400"
                                    }`}
                                >
                                    <Icon className="text-lg" />
                                </div>

                                {!isLast && (
                                    <div
                                        className={`my-1 min-h-8 w-1 grow rounded ${
                                            completed && index < currentIndex
                                                ? "bg-green-500"
                                                : "bg-gray-200"
                                        }`}
                                    />
                                )}
                            </div>

                            {/* Timeline information */}
                            <div className="pb-7">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h4
                                        className={`font-semibold ${
                                            completed
                                                ? "text-green-700"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {step.label}
                                    </h4>

                                    {isCurrent && (
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                                            Current Status
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-sm text-gray-500">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-2 rounded-md bg-gray-50 p-3">
                <p className="text-sm text-gray-600">
                    Current Status:
                    {" "}
                    <span className="font-bold capitalize text-gray-800">
                        {currentStatus.replaceAll("_", " ")}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default OrderTracking;