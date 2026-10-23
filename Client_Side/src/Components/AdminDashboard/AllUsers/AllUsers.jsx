
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";

import { FaUsers, FaUserShield,FaUser, FaSearch, FaSyncAlt, FaTrashAlt, FaCheckCircle, FaTimes, FaExclamationTriangle,
FaCopy, FaUserPlus } from "react-icons/fa";

import { RiAdminFill } from "react-icons/ri";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [selectedAction, setSelectedAction] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Fetch all users
    const {
        data: users = [],
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");

            if (!Array.isArray(res.data)) {
                throw new Error("Invalid users response from server.");
            }

            return res.data;
        },
        staleTime: 30_000,
    });

    // Get display name
    const getUserName = (user) => {
        if (user.displayName?.trim()) return user.displayName.trim();
        if (user.name?.trim()) return user.name.trim();

        if (user.email) {
            return user.email.split("@")[0];
        }

        return "Unknown User";
    };

    // Get profile image URL
    const getProfileImage = (user) => {
        return (
            user.photoURL ||
            user.photoUrl ||
            user.photo ||
            user.avatar ||
            user.profilePicture ||
            user.profilePic ||
            user.image ||
            ""
        );
    };

    // Get avatar initials
    const getInitials = (user) => {
        const name = getUserName(user);

        return (
            name
                .split(/[\s._-]+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part.charAt(0).toUpperCase())
                .join("") || "U"
        );
    };

    // Calculate statistics
    const stats = useMemo(() => {
        const totalUsers = users.length;

        const administrators = users.filter(
            (user) => user.role === "admin"
        ).length;

        const customers = totalUsers - administrators;

        const sevenDaysAgo =
            Date.now() - 7 * 24 * 60 * 60 * 1000;

        const newUsers = users.filter((user) => {
            if (!user.createdAt) return false;

            const createdAt = new Date(user.createdAt).getTime();

            return (
                !Number.isNaN(createdAt) &&
                createdAt >= sevenDaysAgo &&
                createdAt <= Date.now()
            );
        }).length;

        return {
            totalUsers,
            administrators,
            customers,
            newUsers,
        };
    }, [users]);

    // Search and filter users
    const filteredUsers = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();

        return users.filter((user) => {
            const name = getUserName(user).toLowerCase();
            const email = (user.email || "").toLowerCase();
            const id = (user._id || "").toLowerCase();

            const matchesSearch =
                name.includes(normalizedSearch) ||
                email.includes(normalizedSearch) ||
                id.includes(normalizedSearch);

            const matchesRole =
                roleFilter === "all" ||
                (roleFilter === "admin" && user.role === "admin") ||
                (roleFilter === "customer" && user.role !== "admin");

            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, roleFilter]);

    // Copy user ID
    const handleCopyId = async (id) => {
        try {
            await navigator.clipboard.writeText(id);
            toast.success("User ID copied!");
        } catch {
            toast.error("Could not copy User ID.");
        }
    };

    // Open confirmation modal
    const askForConfirmation = (action, user) => {
        setSelectedAction({ action, user });
    };

    // Perform admin or delete action
    const handleConfirmedAction = async () => {
        if (!selectedAction || isProcessing) return;

        const { action, user } = selectedAction;

        setIsProcessing(true);

        try {
            if (action === "admin") {
                const response = await axiosSecure.patch(
                    `/users/admin/${user._id}`
                );

                const updated =
                    response.data?.modifiedCount > 0 ||
                    response.data?.matchedCount > 0;

                if (updated) {
                    toast.success(
                        `${getUserName(user)} is now an administrator.`
                    );
                } else {
                    toast.info(
                        response.data?.message ||
                            "No changes reported. Please check the user's role."
                    );
                }
            }

            if (action === "delete") {
                const response = await axiosSecure.delete(
                    `/users/${user._id}`
                );

                if (response.data?.deletedCount > 0) {
                    toast.success("User deleted successfully.");
                } else {
                    toast.info(
                        response.data?.message ||
                            "User was not deleted. Please check the server response."
                    );
                }
            }

            await queryClient.invalidateQueries({
                queryKey: ["users"],
            });

            await refetch();
        } catch (err) {
            console.error("User management error:", err);

            toast.error(
                err.response?.data?.message ||
                    "Action failed. Please try again."
            );
        } finally {
            setIsProcessing(false);
            setSelectedAction(null);
        }
    };

    // Statistics cards
    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            description: "Registered accounts",
            icon: FaUsers,
            iconBg: "bg-indigo-100",
            iconColor: "text-indigo-600",
            accent: "border-indigo-500",
        },
        {
            title: "Administrators",
            value: stats.administrators,
            description: "Admin accounts",
            icon: FaUserShield,
            iconBg: "bg-emerald-100",
            iconColor: "text-emerald-600",
            accent: "border-emerald-500",
        },
        {
            title: "Customers",
            value: stats.customers,
            description: "Non-admin accounts",
            icon: FaUser,
            iconBg: "bg-sky-100",
            iconColor: "text-sky-600",
            accent: "border-sky-500",
        },
        {
            title: "New Users",
            value: stats.newUsers,
            description: "Joined in the last 7 days",
            icon: FaUserPlus,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            accent: "border-amber-500",
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <Helmet>
                <title>Shopery | User Management</title>
                <meta
                    name="description"
                    content="Manage Shopery customers and administrators."
                />
            </Helmet>

            {/* Page Header */}
            <div className="my-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-1 w-8 rounded-full bg-indigo-600" />

                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                            Shopery Admin
                        </span>
                    </div>

                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                        User Management
                    </h1>

                    <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                        Manage customers, monitor accounts, and control
                        administrator access from one place.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                >
                    <FaSyncAlt
                        className={isFetching ? "animate-spin" : ""}
                    />
                    Refresh Users
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {statCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className={`rounded-2xl border border-slate-200 border-l-4 ${card.accent} bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6`}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">
                                        {card.title}
                                    </p>

                                    <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                                        {isLoading ? "—" : card.value}
                                    </h2>
                                </div>

                                <div
                                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
                                >
                                    <Icon className="text-xl" />
                                </div>
                            </div>

                            <p className="mt-4 text-xs text-slate-400">
                                {card.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Users Management Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Search and Filter Header */}
                <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                All Users
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                {isLoading
                                    ? "Loading accounts..."
                                    : `Showing ${filteredUsers.length} of ${users.length} users`}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <div className="relative min-w-0 sm:w-72">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-400" />

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
                                    placeholder="Search name, email, ID..."
                                    aria-label="Search users"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                />
                            </div>

                            <select
                                value={roleFilter}
                                onChange={(event) =>
                                    setRoleFilter(event.target.value)
                                }
                                aria-label="Filter users by role"
                                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Administrators</option>
                                <option value="customer">Customers</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="space-y-4 p-6">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="flex animate-pulse items-center gap-4"
                            >
                                <div className="h-11 w-11 rounded-full bg-slate-200" />

                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-1/3 rounded bg-slate-200" />
                                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                                </div>

                                <div className="h-7 w-20 rounded-lg bg-slate-100" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {!isLoading && isError && (
                    <div className="px-5 py-16 text-center sm:px-6">
                        <FaExclamationTriangle className="mx-auto text-3xl text-amber-500" />

                        <h3 className="mt-4 text-lg font-bold text-slate-800">
                            Could not load users
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                            {error?.response?.data?.message ||
                                error?.message ||
                                "Something went wrong while fetching users."}
                        </p>

                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Users Table */}
                {!isLoading && !isError && (
                    <>
                        {filteredUsers.length > 0 ? (
                            <div className="w-full overflow-x-auto">
                                <table className="w-full min-w-[850px] text-left">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50">
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                User
                                            </th>

                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Email Address
                                            </th>

                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Role
                                            </th>

                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Account ID
                                            </th>

                                            <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredUsers.map((user) => {
                                            const isAdmin =
                                                user.role === "admin";

                                            const profileImage =
                                                getProfileImage(user);

                                            return (
                                                <tr
                                                    key={user._id}
                                                    className="transition hover:bg-indigo-50/40"
                                                >
                                                    {/* Profile Picture and Name */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className={`flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full text-sm font-extrabold ring-2 ring-white ${
                                                                    isAdmin
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-indigo-100 text-indigo-700"
                                                                }`}
                                                            >
                                                                {profileImage ? (
                                                                    <img
                                                                        src={profileImage}
                                                                        alt={getUserName(
                                                                            user
                                                                        )}
                                                                        className="h-full w-full rounded-full object-cover"
                                                                        referrerPolicy="no-referrer"
                                                                        onError={(
                                                                            event
                                                                        ) => {
                                                                            event.currentTarget.style.display =
                                                                                "none";

                                                                            event.currentTarget.parentElement.textContent =
                                                                                getInitials(
                                                                                    user
                                                                                );
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    getInitials(
                                                                        user
                                                                    )
                                                                )}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="max-w-[200px] truncate text-sm font-bold text-slate-800">
                                                                    {getUserName(
                                                                        user
                                                                    )}
                                                                </p>

                                                                <p className="mt-1 text-xs text-slate-400">
                                                                    {isAdmin
                                                                        ? "Administrator"
                                                                        : "Shopery Customer"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Email */}
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-600">
                                                            {user.email ||
                                                                "No email"}
                                                        </span>
                                                    </td>

                                                    {/* Role Badge */}
                                                    <td className="px-6 py-4">
                                                        {isAdmin ? (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                                                                <RiAdminFill />
                                                                Admin
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 ring-1 ring-inset ring-sky-200">
                                                                <FaUser className="text-[10px]" />
                                                                Customer
                                                            </span>
                                                        )}
                                                    </td>

                                                    {/* User ID */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                title={user._id}
                                                                className="font-mono text-xs text-slate-500"
                                                            >
                                                                {user._id
                                                                    ? `${user._id.slice(0, 6)}...${user._id.slice(-4)}`
                                                                    : "N/A"}
                                                            </span>

                                                            {user._id && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleCopyId(
                                                                            user._id
                                                                        )
                                                                    }
                                                                    title="Copy full ID"
                                                                    aria-label="Copy user ID"
                                                                    className="rounded-md p-1.5 text-slate-400 transition hover:bg-indigo-100 hover:text-indigo-600"
                                                                >
                                                                    <FaCopy />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center gap-2">
                                                            {!isAdmin && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        askForConfirmation(
                                                                            "admin",
                                                                            user
                                                                        )
                                                                    }
                                                                    title="Make administrator"
                                                                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-bold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                                                                >
                                                                    <RiAdminFill />
                                                                    Make Admin
                                                                </button>
                                                            )}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    askForConfirmation(
                                                                        "delete",
                                                                        user
                                                                    )
                                                                }
                                                                title="Delete user"
                                                                aria-label={`Delete ${getUserName(user)}`}
                                                                className="inline-flex h-9 items-center justify-center rounded-lg border border-red-100 bg-red-50 px-3 text-red-600 transition hover:border-red-200 hover:bg-red-100"
                                                            >
                                                                <FaTrashAlt />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="px-5 py-16 text-center sm:px-6">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                                    <FaSearch className="text-2xl" />
                                </div>

                                <h3 className="mt-4 text-lg font-bold text-slate-800">
                                    No users found
                                </h3>

                                <p className="mt-2 text-sm text-slate-500">
                                    Try changing your search term or role
                                    filter.
                                </p>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setRoleFilter("all");
                                    }}
                                    className="mt-4 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                                >
                                    Clear filters
                                </button>
                            </div>
                        )}

                        {/* Table Footer */}
                        <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <p>
                                Showing{" "}
                                <span className="font-bold text-slate-700">
                                    {filteredUsers.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-bold text-slate-700">
                                    {users.length}
                                </span>{" "}
                                accounts
                            </p>

                            <p className="flex items-center gap-1.5">
                                <FaCheckCircle className="text-emerald-500" />
                                User management dashboard
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Confirmation Modal */}
            {selectedAction && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (
                            event.target === event.currentTarget &&
                            !isProcessing
                        ) {
                            setSelectedAction(null);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="user-action-title"
                        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div
                                className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                    selectedAction.action === "delete"
                                        ? "bg-red-100 text-red-600"
                                        : "bg-emerald-100 text-emerald-600"
                                }`}
                            >
                                {selectedAction.action === "delete" ? (
                                    <FaTrashAlt className="text-xl" />
                                ) : (
                                    <RiAdminFill className="text-2xl" />
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedAction(null)}
                                disabled={isProcessing}
                                aria-label="Close confirmation dialog"
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <h3
                            id="user-action-title"
                            className="mt-5 text-xl font-extrabold text-slate-900"
                        >
                            {selectedAction.action === "delete"
                                ? "Delete this user?"
                                : "Make this user an admin?"}
                        </h3>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            {selectedAction.action === "delete" ? (
                                <>
                                    You are about to delete{" "}
                                    <span className="font-bold text-slate-800">
                                        {getUserName(selectedAction.user)}
                                    </span>
                                    . This action may be irreversible.
                                </>
                            ) : (
                                <>
                                    You are about to grant administrator
                                    privileges to{" "}
                                    <span className="font-bold text-slate-800">
                                        {getUserName(selectedAction.user)}
                                    </span>
                                    . They may gain access to administrative
                                    features.
                                </>
                            )}
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedAction(null)}
                                disabled={isProcessing}
                                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleConfirmedAction}
                                disabled={isProcessing}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                                    selectedAction.action === "delete"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                }`}
                            >
                                {isProcessing ? (
                                    <>
                                        <FaSyncAlt className="animate-spin" />
                                        Processing...
                                    </>
                                ) : selectedAction.action === "delete" ? (
                                    <>
                                        <FaTrashAlt />
                                        Yes, Delete
                                    </>
                                ) : (
                                    <>
                                        <RiAdminFill />
                                        Confirm Admin
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllUsers;
