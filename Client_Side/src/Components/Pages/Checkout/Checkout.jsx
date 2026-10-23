
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { HiOutlineHome } from "react-icons/hi";
import {
    FaArrowRight,
    FaMobileAlt,
    FaMoneyBillWave,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "../../Hooks/useAuth";
import useCart from "../../Hooks/useCart";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const ONLINE_PAYMENT_METHODS = [
    {
        value: "bkash",
        label: "bKash",
        color: "#D12053",
        background: "#FCE7EF",
    },
    {
        value: "nagad",
        label: "Nagad",
        color: "#F15A24",
        background: "#FFF0E8",
    },
    {
        value: "rocket",
        label: "Rocket",
        color: "#8B2F8F",
        background: "#F6E8F7",
    },
    {
        value: "upay",
        label: "Upay",
        color: "#009B70",
        background: "#E4F7F0",
    },
];

const EMPTY_BILLING_INFO = {
    firstname: "",
    lastname: "",
    companyname: "",
    streetaddress: "",
    division: "",
    district: "",
    zipcode: "",
    phonenumber: "",
};

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const axiosSecure = useAxiosSecure();
    const [cart, setCart, refetch] = useCart();
    const { user } = useAuth();

    const email = user?.email;
    const quantities = location.state?.quantities || {};

    const [billingInfo, setBillingInfo] = useState({
        ...EMPTY_BILLING_INFO,
    });
    const [isBillingLoading, setIsBillingLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Calculate the cart total using the selected quantities.
    const cartTotal = (cart || []).reduce((sum, item) => {
        const quantity = Number(quantities[item._id] ?? 1);
        const price = Number(item.price);

        if (
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            !Number.isFinite(price) ||
            price < 0
        ) {
            return sum;
        }

        return sum + price * quantity;
    }, 0);

    const totalPrice =
        Number(location.state?.totalPrice) > 0
            ? Number(location.state.totalPrice)
            : cartTotal;

    const formatMoney = (value) =>
        Number(value || 0).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    // Fetch the logged-in user's saved billing address.
    useEffect(() => {
        if (!email) {
            setBillingInfo({ ...EMPTY_BILLING_INFO });
            setIsBillingLoading(false);
            return;
        }

        let isMounted = true;

        const fetchBillingAddress = async () => {
            setIsBillingLoading(true);

            try {
                const response = await axiosSecure.get(
                    `/billings?email=${encodeURIComponent(email)}`
                );

                if (!isMounted) return;

                const billingRecords = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.billings)
                      ? response.data.billings
                      : response.data &&
                          typeof response.data === "object"
                        ? [response.data]
                        : [];

                if (billingRecords.length === 0) {
                    setBillingInfo({ ...EMPTY_BILLING_INFO });
                    return;
                }

                // The backend should return the newest record first.
                const savedBilling = billingRecords[0];

                const nameParts = String(
                    savedBilling.fullname || ""
                )
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean);

                const firstname = nameParts.shift() || "";
                const lastname = nameParts.join(" ");

                setBillingInfo({
                    firstname,
                    lastname,
                    companyname: savedBilling.companyname || "",
                    streetaddress: savedBilling.streetaddress || "",
                    division: savedBilling.division || "",
                    district: savedBilling.district || "",
                    zipcode: savedBilling.zipcode || "",
                    phonenumber: savedBilling.phone || "",
                });
            } catch (error) {
                console.error(
                    "Failed to fetch billing address:",
                    error
                );

                if (isMounted) {
                    toast.error(
                        "Could not load your saved billing address. Please enter it manually."
                    );
                }
            } finally {
                if (isMounted) {
                    setIsBillingLoading(false);
                }
            }
        };

        fetchBillingAddress();

        return () => {
            isMounted = false;
        };
    }, [email, axiosSecure]);

    const handleBillingChange = (event) => {
        const { name, value } = event.target;

        setBillingInfo((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handlePlaceOrder = async (event) => {
        event.preventDefault();

        if (isSubmitting) return;

        if (!email) {
            toast.error("Please log in before placing your order.");
            return;
        }

        if (!Array.isArray(cart) || cart.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        const form = event.currentTarget;

        const firstname = billingInfo.firstname.trim();
        const lastname = billingInfo.lastname.trim();
        const streetaddress = billingInfo.streetaddress.trim();
        const division = billingInfo.division;
        const district = billingInfo.district.trim();
        const phonenumber = billingInfo.phonenumber.trim();

        if (
            !firstname ||
            !lastname ||
            !streetaddress ||
            !division ||
            !district ||
            !phonenumber
        ) {
            toast.error(
                "Please complete all required billing fields."
            );
            return;
        }

        /*
         * IMPORTANT:
         * item._id is the cart document ID.
         * item.cartId stores the original product ID in SeeProduct.jsx.
         * The backend needs the actual product ID to find the product.
         */
        const products = cart.map((item) => {
            const quantity = Number(quantities[item._id] ?? 1);
            const price = Number(item.price);

            return {
                productId: item.cartId,
                productName: item.product,
                quantity,
                price,
                image: item.image || "",
                total: price * quantity,
            };
        });

        // Validate the product IDs and order quantities.
        const invalidProduct = products.some(
            (item) =>
                typeof item.productId !== "string" ||
                !/^[a-fA-F0-9]{24}$/.test(item.productId) ||
                !Number.isFinite(item.price) ||
                item.price < 0 ||
                !Number.isInteger(item.quantity) ||
                item.quantity < 1 ||
                !Number.isFinite(item.total)
        );

        if (invalidProduct) {
            console.error(
                "Invalid checkout products:",
                products
            );

            toast.error(
                "Some cart items contain invalid product information. Please refresh your cart and try again."
            );
            return;
        }

        // Always calculate the order total from the cart items.
        const calculatedTotal = products.reduce(
            (sum, item) => sum + item.total,
            0
        );

        if (!Number.isFinite(calculatedTotal) || calculatedTotal <= 0) {
            toast.error(
                "Your order total must be greater than zero."
            );
            return;
        }

        if (
            !["cash", ...ONLINE_PAYMENT_METHODS.map(
                (method) => method.value
            )].includes(paymentMethod)
        ) {
            toast.error("Please select a valid payment method.");
            return;
        }

        const orderNotes = form.elements.ordernotes?.value?.trim() || "";

        const orderData = {
            email,
            name: `${firstname} ${lastname}`,
            companyname: billingInfo.companyname.trim(),
            streetaddress,
            division,
            district,
            zipcode: billingInfo.zipcode.trim(),
            phonenumber,
            ordernotes: orderNotes,
            paymentMethod,
            cart: products,
            totalPrice: calculatedTotal,
            status: "pending",
        };

        setIsSubmitting(true);

        try {
            if (paymentMethod === "cash") {
                const response = await axiosSecure.post(
                    "/orders",
                    orderData
                );

                if (
                    response.status !== 201 ||
                    !response.data?.insertedId
                ) {
                    throw new Error(
                        "The order could not be confirmed."
                    );
                }

                // The order is saved, so attempt to clear the user's cart.
                try {
                    await axiosSecure.delete(
                        `/carts?email=${encodeURIComponent(email)}`
                    );

                    setCart([]);
                    await refetch();
                } catch (error) {
                    console.error(
                        "Cart cleanup failed:",
                        error
                    );

                    toast.warning(
                        "Your order was saved, but your cart could not be cleared."
                    );
                }

                toast.success(
                    "Cash on Delivery order placed successfully!"
                );

                setTimeout(() => {
                    navigate("/userdashboard/orderhistory");
                }, 1000);

                return;
            }

            const selectedMethod = ONLINE_PAYMENT_METHODS.find(
                (method) => method.value === paymentMethod
            );

            if (!selectedMethod) {
                throw new Error(
                    "Please select a valid payment method."
                );
            }

            // Continue to the existing demo-payment page.
            navigate("/demo-payment", {
                state: {
                    paymentMethod,
                    totalPrice: calculatedTotal,
                    orderData,
                },
            });
        } catch (error) {
            console.error("Checkout error:", error);

            toast.error(
                error?.response?.data?.message ||
                    error.message ||
                    "Unable to process your order."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="nunito_sans min-h-screen bg-gray-50">
            <Helmet>
                <title>Shopery | Checkout</title>
            </Helmet>

            <ToastContainer
                position="top-center"
                autoClose={2500}
            />

            <div className="specific_product_banner mb-2 h-full lg:h-[30vh]">
                <div className="breadcrumbs mb-5 px-5 py-10 text-[17px] text-white lg:px-12">
                    <ul>
                        <li>
                            <Link
                                to="/"
                                className="flex items-center gap-1"
                            >
                                <HiOutlineHome />
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link to="/cart">
                                Shopping Cart
                            </Link>
                        </li>

                        <li className="font-bold text-[#00B207]">
                            Checkout
                        </li>
                    </ul>
                </div>
            </div>

            <div className="px-4 py-10 lg:px-14">
                <form
                    onSubmit={handlePlaceOrder}
                    className="grid grid-cols-1 gap-6 lg:grid-cols-3"
                >
                    {/* Billing Information */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border bg-white p-5 shadow-sm md:p-8">
                            <h2 className="mb-3 text-2xl font-bold">
                                Billing Information
                            </h2>

                            {isBillingLoading && (
                                <p className="mb-5 text-sm text-gray-500">
                                    Loading your saved billing address...
                                </p>
                            )}

                            {!isBillingLoading && email && (
                                <p className="mb-5 text-sm text-gray-500">
                                    Your saved billing information is
                                    loaded automatically when available.
                                </p>
                            )}

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* First Name */}
                                <div>
                                    <label
                                        htmlFor="firstname"
                                        className="mb-2 block font-semibold"
                                    >
                                        First Name *
                                    </label>

                                    <input
                                        id="firstname"
                                        name="firstname"
                                        autoComplete="given-name"
                                        required
                                        value={billingInfo.firstname}
                                        onChange={handleBillingChange}
                                        className="w-full rounded-lg border px-4 py-3"
                                        placeholder="First name"
                                    />
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label
                                        htmlFor="lastname"
                                        className="mb-2 block font-semibold"
                                    >
                                        Last Name *
                                    </label>

                                    <input
                                        id="lastname"
                                        name="lastname"
                                        autoComplete="family-name"
                                        required
                                        value={billingInfo.lastname}
                                        onChange={handleBillingChange}
                                        className="w-full rounded-lg border px-4 py-3"
                                        placeholder="Last name"
                                    />
                                </div>

                                {/* Company Name */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="companyname"
                                        className="mb-2 block font-semibold"
                                    >
                                        Company Name
                                    </label>

                                    <input
                                        id="companyname"
                                        name="companyname"
                                        autoComplete="organization"
                                        value={billingInfo.companyname}
                                        onChange={handleBillingChange}
                                        className="w-full rounded-lg border px-4 py-3"
                                        placeholder="Optional"
                                    />
                                </div>

                                {/* Street Address */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="streetaddress"
                                        className="mb-2 block font-semibold"
                                    >
                                        Street Address *
                                    </label>

                                    <input
                                        id="streetaddress"
                                        name="streetaddress"
                                        autoComplete="street-address"
                                        required
                                        value={billingInfo.streetaddress}
                                        onChange={handleBillingChange}
                                        className="w-full rounded-lg border px-4 py-3"
                                        placeholder="House, road, village or street"
                                    />
                                </div>

                                {/* Division */}
                                <div>
                                    <label
                                        htmlFor="division"
                                        className="mb-2 block font-semibold"
                                    >
                                        Division *
                                    </label>

                                    <select
                                        id="division"
                                        name="division"
                                        value={billingInfo.division}
                                        onChange={handleBillingChange}
                                        required
                                        className="w-full rounded-lg border bg-white px-4 py-3"
                                    >
                                        <option value="" disabled>
                                            Select Division
                                        </option>
                                        <option value="Barishal">Barishal</option>
                                        <option value="Chattogram">Chattogram</option>
                                        <option value="Dhaka">Dhaka</option>
                                        <option value="Khulna">Khulna</option>
                                        <option value="Mymensingh">Mymensingh</option>
                                        <option value="Rajshahi">Rajshahi</option>
                                        <option value="Rangpur">Rangpur</option>
                                        <option value="Sylhet">Sylhet</option>
                                    </select>
                                </div>

                                {/* District */}
                                <div>
                                    <label
                                        htmlFor="district"
                                        className="mb-2 block font-semibold"
                                    >
                                        District *
                                    </label>

                                    <input
                                        id="district"
                                        name="district"
                                        autoComplete="address-level2"
                                        required
                                        value={billingInfo.district}
                                        onChange={handleBillingChange}
                                        className="w-full rounded-lg border px-4 py-3"
                                        placeholder="District"
                                    />
                                </div>

                                {/* ZIP Code */}
                                <div>
                                    <label
                                        htmlFor="zipcode"
                                        className="mb-2 block font-semibold"
                                    >
                                        ZIP Code
                                    </label>

                                    <input
                                        id="zipcode"
                                        name="zipcode"
                                        autoComplete="postal-code"
                                        value={billingInfo.zipcode}
                                        onChange={handleBillingChange}
                                        className="w-full rounded-lg border px-4 py-3"
                                        placeholder="ZIP code"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="checkout-email"
                                        className="mb-2 block font-semibold"
                                    >
                                        Email Address
                                    </label>

                                    <input
                                        id="checkout-email"
                                        type="email"
                                        value={email || ""}
                                        readOnly
                                        className="w-full rounded-lg border bg-gray-100 px-4 py-3 text-gray-600"
                                    />
                                </div>

                                {/* Phone Number */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="phonenumber"
                                        className="mb-2 block font-semibold"
                                    >
                                        Phone Number *
                                    </label>

                                    <input
                                        id="phonenumber"
                                        name="phonenumber"
                                        type="tel"
                                        autoComplete="tel"
                                        required
                                        value={billingInfo.phonenumber}
                                        onChange={handleBillingChange}
                                        className="w-full rounded-lg border px-4 py-3"
                                        placeholder="01XXXXXXXXX"
                                    />
                                </div>

                                {/* Order Notes */}
                                <div className="md:col-span-2">
                                    <label
                                        htmlFor="ordernotes"
                                        className="mb-2 block font-semibold"
                                    >
                                        Order Notes
                                    </label>

                                    <textarea
                                        id="ordernotes"
                                        name="ordernotes"
                                        rows="4"
                                        className="w-full resize-none rounded-lg border px-4 py-3"
                                        placeholder="Optional notes about your order"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary and Payment */}
                    <div className="lg:col-span-1">
                        <div className="rounded-xl border bg-white p-5 shadow-sm md:p-8">
                            <h2 className="mb-6 text-2xl font-bold">
                                Your Order
                            </h2>

                            {!cart?.length ? (
                                <p className="py-8 text-center text-gray-500">
                                    Your cart is empty.
                                </p>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {cart.map((item) => {
                                            const quantity = Math.max(
                                                1,
                                                Number(
                                                    quantities[item._id] ?? 1
                                                )
                                            );

                                            return (
                                                <div
                                                    key={item._id}
                                                    className="flex items-center gap-3 border-b pb-4"
                                                >
                                                    <img
                                                        src={item.image}
                                                        alt={
                                                            item.product ||
                                                            "Product"
                                                        }
                                                        className="h-14 w-14 rounded object-cover"
                                                    />

                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-sm font-semibold">
                                                            {item.product}
                                                        </p>

                                                        <p className="text-sm text-gray-500">
                                                            Quantity: {quantity}
                                                        </p>
                                                    </div>

                                                    <p className="text-sm font-semibold">
                                                        ৳
                                                        {formatMoney(
                                                            Number(item.price) *
                                                                quantity
                                                        )}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-between border-b py-4">
                                        <span className="text-gray-600">
                                            Subtotal
                                        </span>

                                        <span className="font-semibold">
                                            ৳{formatMoney(cartTotal)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between py-4 text-lg">
                                        <span className="font-bold">
                                            Total
                                        </span>

                                        <span className="font-bold text-green-700">
                                            ৳{formatMoney(cartTotal)}
                                        </span>
                                    </div>
                                </>
                            )}

                            {/* Payment Methods */}
                            <div className="mt-4">
                                <h3 className="mb-4 text-lg font-bold">
                                    Select Payment Method
                                </h3>

                                {/* Cash on Delivery */}
                                <label
                                    className={`mb-3 flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                                        paymentMethod === "cash"
                                            ? "border-green-600 bg-green-50"
                                            : "border-gray-200"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={paymentMethod === "cash"}
                                        onChange={() =>
                                            setPaymentMethod("cash")
                                        }
                                        className="accent-green-600"
                                    />

                                    <FaMoneyBillWave className="text-xl text-green-600" />

                                    <div>
                                        <span className="block font-semibold">
                                            Cash on Delivery
                                        </span>

                                        <span className="text-xs text-gray-500">
                                            Pay when your order arrives
                                        </span>
                                    </div>
                                </label>

                                {/* Online Payment */}
                                <p className="mb-3 mt-5 text-sm font-semibold text-gray-700">
                                    Online Payment
                                </p>

                                {ONLINE_PAYMENT_METHODS.map((method) => (
                                    <label
                                        key={method.value}
                                        className={`mb-3 flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
                                            paymentMethod === method.value
                                                ? "border-green-600 bg-green-50"
                                                : "border-gray-200"
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.value}
                                            checked={
                                                paymentMethod === method.value
                                            }
                                            onChange={() =>
                                                setPaymentMethod(method.value)
                                            }
                                            className="accent-green-600"
                                        />

                                        <div
                                            className="flex h-10 w-10 items-center justify-center rounded-lg"
                                            style={{
                                                color: method.color,
                                                backgroundColor:
                                                    method.background,
                                            }}
                                        >
                                            <FaMobileAlt size={20} />
                                        </div>

                                        <div>
                                            <span className="block font-semibold">
                                                {method.label}
                                            </span>

                                            <span className="text-xs text-gray-500">
                                                Simulated payment
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !cart?.length}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#00B207] px-5 py-3 font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                {isSubmitting
                                    ? "Please wait..."
                                    : paymentMethod === "cash"
                                      ? "Place Order"
                                      : "Proceed to Payment"}

                                {!isSubmitting && <FaArrowRight />}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Checkout;
