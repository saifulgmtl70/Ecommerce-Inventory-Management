import { Helmet } from "react-helmet-async";
import {
    Link,
    useLocation,
    Navigate,
} from "react-router-dom";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaExclamationTriangle,
    FaHome,
    FaClipboardList,
    FaRedo,
} from "react-icons/fa";

const RESULT_DETAILS = {
    success: {
        title: "Payment Successful",
        message: "Your payment was completed and the order was submitted.",
        color: "text-green-600",
        background: "bg-green-50",
        icon: FaCheckCircle,
    },
    insufficient_balance: {
        title: "Insufficient  Balance",
        message: "The simulated payment could not be completed because the demo balance is insufficient.",
        color: "text-amber-600",
        background: "bg-amber-50",
        icon: FaExclamationTriangle,
    },
    failed: {
        title: "Payment Failed",
        message: "The simulated payment failed. No real money was transferred.",
        color: "text-red-600",
        background: "bg-red-50",
        icon: FaTimesCircle,
    },
    cancelled: {
        title: "Payment Cancelled",
        message: "You cancelled the payment. No order was created by this demo payment flow.",
        color: "text-gray-600",
        background: "bg-gray-100",
        icon: FaTimesCircle,
    },
};

const PaymentResult = () => {
    const location = useLocation();
    const data = location.state;

    if (!data?.result || !RESULT_DETAILS[data.result]) {
        return <Navigate to="/checkout" replace />;
    }

    const {
        result,
        paymentMethod,
        paymentName,
        phone,
        amount,
        orderId,
        checkoutData,
    } = data;

    const details = RESULT_DETAILS[result];
    const ResultIcon = details.icon;
    const succeeded = result === "success";

    const formattedAmount = Number(amount || 0).toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <section className="min-h-screen bg-gray-50 px-4 py-12">
            <Helmet>
                <title>Shopery | Payment Result</title>
            </Helmet>

            <div className="mx-auto max-w-xl overflow-hidden rounded-2xl border bg-white shadow-lg">
                <div className={`${details.background} px-6 py-10 text-center`}>
                    <ResultIcon className={`mx-auto mb-4 text-6xl ${details.color}`} />

                    <h1 className="text-2xl font-bold text-gray-800">
                        {details.title}
                    </h1>

                    <p className="mx-auto mt-3 max-w-md text-sm text-gray-600">
                        {details.message}
                    </p>
                </div>

                <div className="p-6 md:p-8">
                    <div className="mb-6 rounded-xl border p-5">
                        <p className="text-sm text-gray-500">
                             Transaction amount
                        </p>

                        <p className="mt-1 text-3xl font-bold text-gray-800">
                            ৳{formattedAmount}
                        </p>

                        <div className="mt-5 space-y-3 text-sm">
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500">
                                    Payment Method
                                </span>
                                <span className="font-semibold">
                                    {paymentName || paymentMethod || "Demo"}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500">
                                    Mobile Number
                                </span>
                                <span className="font-semibold">
                                    {phone || "Not provided"}
                                </span>
                            </div>

                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500">
                                    Payment Type
                                </span>
                                <span className="font-semibold">
                                    Simulation only
                                </span>
                            </div>

                            {orderId && (
                                <div className="flex justify-between gap-4">
                                    <span className="text-gray-500">
                                        Order ID
                                    </span>
                                    <span className="break-all text-right font-semibold">
                                        {orderId}
                                    </span>
                                </div>
                            )}

                            {succeeded && (
                                <div className="flex justify-between gap-4">
                                    <span className="text-gray-500">
                                        Order Status
                                    </span>
                                    <span className="font-semibold text-amber-600">
                                        Pending
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    
                    <div className="flex flex-col gap-3">
                        {succeeded ? (
                            <Link
                                to="/userdashboard/orderhistory"
                                replace
                                className="flex items-center justify-center gap-2 rounded-lg bg-[#00B207] px-5 py-3 font-semibold text-white hover:bg-green-700"
                            >
                                <FaClipboardList />
                                View Order History
                            </Link>
                        ) : (
                            <Link
                                to="/checkout"
                                state={{
                                    quantities: {},
                                    totalPrice: Number(checkoutData?.totalPrice || amount || 0),
                                }}
                                className="flex items-center justify-center gap-2 rounded-lg bg-[#00B207] px-5 py-3 font-semibold text-white hover:bg-green-700"
                            >
                                <FaRedo />
                                Return to Checkout
                            </Link>
                        )}

                        <Link
                            to="/"
                            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                        >
                            <FaHome />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PaymentResult;