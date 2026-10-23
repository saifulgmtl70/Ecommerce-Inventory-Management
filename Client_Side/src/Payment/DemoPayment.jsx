import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaLock,
    FaMobileAlt,
    FaShieldAlt,
    FaCheckCircle,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "../Components/Hooks/useAuth";
import useCart from "../Components/Hooks/useCart";
import useAxiosSecure from "../Components/Hooks/useAxiosSecure";

const PAYMENT_METHODS = {
    bkash: {
        name: "bKash",
        color: "#D12053",
        background: "#FCE7EF",
        merchantNumber: "01700000000",
    },
    nagad: {
        name: "Nagad",
        color: "#F15A24",
        background: "#FFF0E8",
        merchantNumber: "01800000000",
    },
    rocket: {
        name: "Rocket",
        color: "#8B2F8F",
        background: "#F6E8F7",
        merchantNumber: "01900000000",
    },
    upay: {
        name: "Upay",
        color: "#009B70",
        background: "#E4F7F0",
        merchantNumber: "01600000000",
    },
};

const DEMO_OTP = "123456";
const DEMO_PIN = "1234";

const DemoPayment = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [, setCart, refetch] = useCart();

    const navigationData = location.state;
    const checkoutData = navigationData?.orderData;
    const method = navigationData?.paymentMethod;
    const payment = PAYMENT_METHODS[method];
    const amount = Number(navigationData?.totalPrice);

    const [phone, setPhone] = useState("");
    const [step, setStep] = useState("phone");
    const [otp, setOtp] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (
        !checkoutData ||
        !payment ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        return (
            <section className="flex min-h-screen flex-col items-center justify-center px-5">
                <h2 className="text-2xl font-bold text-gray-800">
                    Payment Session Not Found
                </h2>
                <p className="mt-3 text-center text-gray-600">
                    Return to checkout and start your payment again.
                </p>
                <Link
                    to="/checkout"
                    className="mt-6 rounded-lg bg-[#00B207] px-6 py-3 text-white"
                >
                    Back to Checkout
                </Link>
            </section>
        );
    }

    const handlePhoneSubmit = (event) => {
        event.preventDefault();
        setError("");

        const normalizedPhone = phone.replace(/[\s-]/g, "");

        if (!/^01[3-9]\d{8}$/.test(normalizedPhone)) {
            setError("Enter a valid 11-digit Bangladeshi mobile number.");
            return;
        }

        setPhone(normalizedPhone);
        setStep("verification");
    };

    const handleVerification = (event) => {
        event.preventDefault();
        setError("");

        if (otp !== DEMO_OTP) {
            setError("Incorrect demo OTP. Use the displayed test OTP.");
            return;
        }

        if (pin !== DEMO_PIN) {
            setError("Incorrect demo PIN. Use the displayed test PIN.");
            return;
        }

        setStep("result");
    };

    const finishDemoPayment = async (result) => {
        if (loading) return;

        setLoading(true);
        setError("");

        try {
            let savedOrderId = null;

            if (result === "success") {
                if (!user?.email || checkoutData.email !== user.email) {
                    throw new Error(
                        "Your login session does not match this order. Please log in again."
                    );
                }

                const orderPayload = {
                    ...checkoutData,
                    paymentMethod: method,
                    paymentStatus: "demo_success",
                    isDemoPayment: true,
                    demoPaymentPhone: phone,
                    status: "pending",
                };

                const response = await axiosSecure.post(
                    "/orders",
                    orderPayload
                );

                if (
                    response.status !== 201 ||
                    !response.data?.insertedId
                ) {
                    throw new Error(
                        "The demo payment result could not be saved as an order."
                    );
                }

                savedOrderId = response.data.insertedId;

                try {
                    await axiosSecure.delete(
                        `/carts?email=${encodeURIComponent(user.email)}`
                    );

                    setCart([]);
                    await refetch();
                } catch (cartError) {
                    console.error("Cart cleanup failed:", cartError);
                    toast.warning(
                        "Order saved, but your cart could not be cleared."
                    );
                }
            }

            navigate("/payment-result", {
                replace: true,
                state: {
                    result,
                    paymentMethod: method,
                    paymentName: payment.name,
                    phone,
                    amount,
                    checkoutData,
                    orderId: savedOrderId,
                    isDemoPayment: true,
                },
            });
        } catch (err) {
            console.error("Demo payment error:", err);

            setError(
                err?.response?.data?.message ||
                    err.message ||
                    "Unable to finish the demo payment."
            );

            toast.error("Unable to complete the demo payment.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-gray-50 px-4 py-10">
            <Helmet>
                <title>Shopery | Payment</title>
            </Helmet>

            <ToastContainer position="top-center" autoClose={2500} />

            <div className="mx-auto max-w-lg">
                <Link
                    to="/checkout"
                    className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-green-600"
                >
                    <FaArrowLeft />
                    Back to Checkout
                </Link>

                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                    <div
                        className="p-6 text-white"
                        style={{ backgroundColor: payment.color }}
                    >
                        
                        <h1 className="mt-2 text-3xl font-bold">
                            {payment.name}
                        </h1>
                        
                    </div>

                    <div className="border-b p-6">
                        <p className="text-sm text-gray-500">
                            Total amount to pay
                        </p>
                        <h2 className="mt-2 text-4xl font-bold text-gray-800">
                            ৳
                            {amount.toLocaleString("en-BD", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </h2>

                        
                        
                        
                    </div>

                    <div className="p-6">
                        {step === "phone" && (
                            <form onSubmit={handlePhoneSubmit}>
                                <div className="mb-5 flex items-center gap-3">
                                    <div
                                        className="rounded-full p-3"
                                        style={{
                                            backgroundColor: payment.background,
                                            color: payment.color,
                                        }}
                                    >
                                        <FaMobileAlt size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold">
                                            Mobile Number
                                        </h2>
                                        
                                    </div>
                                </div>

                                <label
                                    htmlFor="demo-phone"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    Mobile Number
                                </label>

                                <input
                                    id="demo-phone"
                                    type="tel"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    value={phone}
                                    onChange={(event) =>
                                        setPhone(event.target.value)
                                    }
                                    placeholder="01XXXXXXXXX"
                                    maxLength={14}
                                    required
                                    className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />

                                {error && (
                                    <p className="mt-3 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="mt-6 w-full rounded-lg py-3 font-semibold text-white"
                                    style={{
                                        backgroundColor: payment.color,
                                    }}
                                >
                                    Continue
                                </button>
                            </form>
                        )}

                        {step === "verification" && (
                            <form onSubmit={handleVerification}>
                                <h2 className="mb-2 text-xl font-bold">
                                     Verification
                                </h2>

                                <p className="mb-5 text-sm text-gray-500">
                                    Number: {phone}
                                </p>

                                <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    
                                    <p className="mt-2 text-sm text-amber-800">
                                        OTP: <strong>123456</strong>
                                    </p>
                                    <p className="mt-1 text-sm text-amber-800">
                                        PIN: <strong>1234</strong>
                                    </p>
                                    
                                </div>

                                <label
                                    htmlFor="demo-otp"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    OTP
                                </label>

                                <input
                                    id="demo-otp"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    value={otp}
                                    onChange={(event) =>
                                        setOtp(
                                            event.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6)
                                        )
                                    }
                                    placeholder="Enter 123456"
                                    maxLength={6}
                                    required
                                    className="mb-5 w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />

                                <label
                                    htmlFor="demo-pin"
                                    className="mb-2 block text-sm font-semibold"
                                >
                                    PIN
                                </label>

                                <input
                                    id="demo-pin"
                                    type="password"
                                    inputMode="numeric"
                                    autoComplete="off"
                                    value={pin}
                                    onChange={(event) =>
                                        setPin(
                                            event.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 4)
                                        )
                                    }
                                    placeholder="Enter 1234"
                                    maxLength={4}
                                    required
                                    className="w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />

                                {error && (
                                    <p className="mt-3 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-6 w-full rounded-lg py-3 font-semibold text-white disabled:opacity-50"
                                    style={{
                                        backgroundColor: payment.color,
                                    }}
                                >
                                    Verify Payment
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        finishDemoPayment("cancelled")
                                    }
                                    disabled={loading}
                                    className="mt-3 w-full rounded-lg border border-gray-300 py-3 text-gray-700 disabled:opacity-50"
                                >
                                    Cancel Payment
                                </button>
                            </form>
                        )}

                        {step === "result" && (
                            <div>
                                <div className="mb-6 text-center">
                                    <div
                                        className="mb-4 inline-flex rounded-full p-4"
                                        style={{
                                            backgroundColor: payment.background,
                                            color: payment.color,
                                        }}
                                    >
                                        <FaCheckCircle size={34} />
                                    </div>

                                    <h2 className="text-xl font-bold">
                                        Verification Complete
                                    </h2>
                                    
                                </div>

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() =>
                                        finishDemoPayment("success")
                                    }
                                    className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                                >
                                    {loading
                                        ? "Processing..."
                                        : "Simulate Successful Payment"}
                                </button>

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() =>
                                        finishDemoPayment(
                                            "insufficient_balance"
                                        )
                                    }
                                    className="mt-3 w-full rounded-lg bg-amber-500 py-3 font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
                                >
                                    Simulate Insufficient Balance
                                </button>

                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={() =>
                                        finishDemoPayment("failed")
                                    }
                                    className="mt-3 w-full rounded-lg bg-red-600 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                                >
                                    Simulate Failed Payment
                                </button>

                                {error && (
                                    <p className="mt-3 text-sm text-red-600">
                                        {error}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    
                </div>
            </div>
        </section>
    );
};

export default DemoPayment;