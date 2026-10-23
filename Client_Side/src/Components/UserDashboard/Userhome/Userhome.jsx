
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineHome } from 'react-icons/hi';
import { MdCancel } from 'react-icons/md';

import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';

import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import useAxiosSecure from '../../Hooks/useAxiosSecure';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Userhome = () => {
    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    // Fetch billing address
    const {
        data: billings = [],
        isLoading: billingLoading,
        isError: billingError,
    } = useQuery({
        queryKey: ['billings', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const response = await axiosPublic.get(
                `/billings?email=${encodeURIComponent(user.email)}`
            );

            return response.data;
        },
    });

    // Fetch order history
    const {
        data: orders = [],
        isLoading: ordersLoading,
        isError: ordersError,
        refetch,
    } = useQuery({
        queryKey: ['orders', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const response = await axiosSecure.get(
                `/orders?email=${encodeURIComponent(user.email)}`
            );

            return response.data;
        },
    });

    // Format order date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);

        if (Number.isNaN(date.getTime())) return 'N/A';

        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    // Cancel order
    const handleCancelOrder = async (orderId, status) => {
        if (status !== 'pending') {
            toast.info('Only pending orders can be cancelled.');
            return;
        }

        const confirmed = window.confirm(
            'Are you sure you want to cancel this order?'
        );

        if (!confirmed) return;

        try {
            // Uses the cancellation route from your existing backend.
            const response = await axiosSecure.patch(
                `/orders/${orderId}/cancel`
            );

            if (response.data?.success || response.status === 200) {
                toast.success('Your order has been cancelled successfully.');
                await refetch();
            } else {
                toast.error('Unable to cancel the order.');
            }
        } catch (error) {
            console.error(
                'Order cancellation error:',
                error.response?.data || error.message
            );

            toast.error(
                error.response?.data?.message ||
                'Failed to cancel the order. Please try again.'
            );
        }
    };

    // Loading state
    if (!user) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <p className="text-gray-600">Loading user information...</p>
            </div>
        );
    }

    return (
        <section className="nunito_sans">
            <Helmet>
                <title>Shopery | User Home</title>
            </Helmet>

            <ToastContainer
                position="top-center"
                autoClose={3000}
                newestOnTop
            />

            {/* User Profile and Billing Address */}
            <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">

                {/* User Profile */}
                <div className="h-auto rounded-lg border py-4">
                    <div className="mb-3">
                        <img
                            src={
                                user.photoURL ||
                                'https://placehold.co/130x130?text=User'
                            }
                            alt="User profile"
                            className="mx-auto h-[130px] w-[130px] rounded-full object-cover"
                        />
                    </div>

                    <div className="mb-2 text-center">
                        <h3 className="mb-1 text-[18px] font-[600] text-[#333]">
                            {user.displayName || 'Customer'}
                        </h3>

                        <p className="text-[15px] font-[500] text-[#666]">
                            Customer
                        </p>
                    </div>

                    <div className="text-center">
                        <Link to="/userdashboard/settings">
                            <button
                                type="button"
                                className="text-center text-[19px] font-bold text-[#00B307]"
                            >
                                Edit Profile
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Billing Address */}
                {billingLoading ? (
                    <div className="flex items-center justify-center rounded-lg border p-5">
                        <p className="text-gray-500">
                            Loading billing address...
                        </p>
                    </div>
                ) : billingError ? (
                    <div className="rounded-lg border p-5">
                        <h3 className="mb-2 text-lg font-semibold text-red-600">
                            Unable to load billing address
                        </h3>
                        <p className="text-sm text-gray-500">
                            Please check your connection and try again.
                        </p>
                    </div>
                ) : billings.length > 0 ? (
                    billings.map((billing) => (
                        <div
                            key={billing._id}
                            className="h-auto rounded-lg border p-5"
                        >
                            <span className="text-[14px] font-[600] text-[#666]">
                                BILLING ADDRESS
                            </span>

                            <h3 className="mb-2 mt-4 text-[20px] font-[600] text-[#333]">
                                {billing.fullname ||
                                    billing.fullName ||
                                    'Name not provided'}
                            </h3>

                            <p className="mb-3 text-[15px] font-[500] text-[#666]">
                                {billing.streetaddress ||
                                    billing.streetAddress ||
                                    'Address not provided'}
                            </p>

                            {billing.district && (
                                <p className="mb-2 text-[15px] text-[#333]">
                                    {billing.district}
                                </p>
                            )}

                            <p className="mb-2 text-[15px] font-[500] text-[#333]">
                                {billing.email || user.email}
                            </p>

                            <p className="mb-4 text-[15px] font-[500] text-[#333]">
                                {billing.phone || 'Phone not provided'}
                            </p>

                            <Link to="/userdashboard/settings">
                                <button
                                    type="button"
                                    className="mt-4 text-[19px] font-bold text-[#00B307]"
                                >
                                    Edit Address
                                </button>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="rounded-lg border p-5">
                        <span className="text-[14px] font-[600] text-[#666]">
                            BILLING ADDRESS
                        </span>

                        <p className="mb-4 mt-4 text-[15px] text-gray-500">
                            No billing address has been saved yet.
                        </p>

                        <Link to="/userdashboard/settings">
                            <button
                                type="button"
                                className="text-[17px] font-bold text-[#00B307]"
                            >
                                Add Billing Address
                            </button>
                        </Link>
                    </div>
                )}
            </div>

            {/* Recent Order History */}
            <div className="h-auto">
                <div className="mb-8 w-full overflow-x-auto rounded-[6px] border shadow-sm">
                    <div className="w-full min-w-[700px]">
                        <div className="flex items-center justify-between p-4">
                            <h2 className="text-[18px] font-bold text-[#222]">
                                Recent Order History
                            </h2>

                            <Link
                                to="/userdashboard/orderhistory"
                                className="text-[16px] font-bold text-[#00B307]"
                            >
                                View All
                            </Link>
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="rounded-t-md bg-[#F2F2F2] text-left text-[15px] font-semibold tracking-wide text-[#111]">
                                    <th className="px-4 py-3 uppercase">
                                        #Order ID
                                    </th>

                                    <th className="px-4 py-3 uppercase">
                                        Date
                                    </th>

                                    <th className="px-4 py-3 uppercase">
                                        Total
                                    </th>

                                    <th className="px-4 py-3 uppercase">
                                        Status
                                    </th>

                                    <th className="px-4 py-3 text-center uppercase">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="bg-white">
                                {ordersLoading ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            Loading orders...
                                        </td>
                                    </tr>
                                ) : ordersError ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-4 py-8 text-center text-red-500"
                                        >
                                            Failed to load orders. Please try again later.
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-4 py-8 text-center text-gray-500"
                                        >
                                            You have not placed any orders yet.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.slice(0, 5).map((order) => (
                                        <tr
                                            key={order._id}
                                            className="border-b text-gray-700"
                                        >
                                            <td className="px-4 py-3">
                                                <h3 className="break-all text-[14px] font-[600] text-[#191919]">
                                                    {order._id}
                                                </h3>
                                            </td>

                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold">
                                                {formatDate(order.createdAt)}
                                            </td>

                                            <td className="px-4 py-3 text-sm font-semibold">
                                                <div className="flex items-center justify-center">
                                                    <span>
                                                        ৳
                                                        {Number(
                                                            order.totalPrice || 0
                                                        ).toFixed(2)}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                                                        order.status === 'delivered'
                                                            ? 'bg-green-100 text-green-700'
                                                            : order.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                                >
                                                    {order.status || 'pending'}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 text-center">
                                                {order.status === 'pending' ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCancelOrder(
                                                                order._id,
                                                                order.status
                                                            )
                                                        }
                                                        title="Cancel Order"
                                                        aria-label="Cancel Order"
                                                        className="text-[22px] font-bold text-[#00B207] hover:text-red-600"
                                                    >
                                                        <MdCancel />
                                                    </button>
                                                ) : (
                                                    <span className="text-sm text-gray-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Userhome;
