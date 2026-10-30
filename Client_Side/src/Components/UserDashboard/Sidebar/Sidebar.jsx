import { NavLink, useNavigate } from "react-router-dom";
import {
    HiOutlineCog,
    HiOutlineHeart,
    HiOutlineLogout,
    HiOutlineShoppingCart,
    HiOutlineClipboardList,
} from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { toast } from "react-toastify";

import useAuth from "../../Hooks/useAuth";

const Sidebar = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();

   // const [unused] = [];

    const navigationItems = [
        {
            label: "Dashboard",
            to: "/userdashboard/userhome",
            icon: MdDashboard,
            end: true,
        },
        {
            label: "Order History",
            to: "/userdashboard/orderhistory",
            icon: HiOutlineClipboardList,
        },
        {
            label: "Wishlist",
            to: "/wishlist",
            icon: HiOutlineHeart,
        },
        {
            label: "Shopping Cart",
            to: "/cart",
            icon: HiOutlineShoppingCart,
        },
        {
            label: "Settings",
            to: "/userdashboard/settings",
            icon: HiOutlineCog,
        },
    ];

    const handleLogout = async () => {
        try {
            await logOut();
            toast.success("Logged out successfully.");
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Unable to log out. Please try again.");
        }
    };

    return (
        <nav
            className="dashboard-navigation"
            aria-label="Customer dashboard navigation"
        >
            <div className="dashboard-navigation-header">
                <h2>My Account</h2>
                <p>Manage your Shopery account</p>
            </div>

            <ul className="dashboard-navigation-list">
                {navigationItems.map(({ label, to, icon: Icon, end }) => (
                    <li key={label}>
                        <NavLink
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                isActive ? "active" : ""
                            }
                        >
                            <Icon aria-hidden="true" />
                            <span>{label}</span>
                        </NavLink>
                    </li>
                ))}

                <li className="dashboard-navigation-divider" aria-hidden="true" />

                <li>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="dashboard-logout-button"
                    >
                        <HiOutlineLogout aria-hidden="true" />
                        <span>Log out</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;