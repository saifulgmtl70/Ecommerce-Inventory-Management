import React, { useEffect, useState } from "react";
import {
    FaBars,
    FaRegHeart,
    FaRegUser,
    FaShoppingBag,
    FaTimes,
} from "react-icons/fa";
import {
    IoCloseOutline,
    IoLogOutOutline,
    IoLeafOutline,
} from "react-icons/io5";
import {
    MdManageAccounts,
    MdOutlineLocalShipping,
} from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "../Hooks/useAuth";
import useCart from "../Hooks/useCart";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import useWishlist from "../Hooks/useWishlist";
import useAdmin from "../Hooks/useAdmin";

import ProductSearch from "../Header/ProductSearch";
import "./Header.css";

const navigationLinks = [
    { label: "Home", to: "/" },
    { label: "Shop", to: "/shop" },
    { label: "Blog", to: "/blog" },
    { label: "About Us", to: "/about" },
    { label: "Contact", to: "/contact" },
];

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartOpen, setCartOpen] = useState(false);
    const [wishListOpen, setWishListOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [deletingCartId, setDeletingCartId] = useState(null);
    const [deletingWishlistId, setDeletingWishlistId] = useState(null);

    const [cart, setCart] = useCart();
    const [wishlist, refetch] = useWishlist();

    const { user, logOut } = useAuth();
    const [isAdmin] = useAdmin();

    const navigate = useNavigate();
    const axiosPublic = useAxiosPublic();

    const userPhoto =
        user?.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user?.displayName || "Shopery User"
        )}&background=16A34A&color=fff`;

    const cartItems = Array.isArray(cart) ? cart : [];
    const wishlistItems = Array.isArray(wishlist) ? wishlist : [];

    const totalPrice = cartItems.reduce((total, item) => {
        const price = Number(item.price);
        const quantity = Number(item.quantity || 1);

        return total + (Number.isFinite(price) ? price * quantity : 0);
    }, 0);

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(price);

    const closeAllPanels = () => {
        setMenuOpen(false);
        setDropdownOpen(false);
        setCartOpen(false);
        setWishListOpen(false);
    };

    const handleOpenSearch = () => {
        closeAllPanels();
        setSearchOpen(true);
    };

    const handleLogout = async () => {
        try {
            await logOut();
            setDropdownOpen(false);
            setMenuOpen(false);
            toast.success("Logged out successfully.", {
                position: "top-center",
                autoClose: 1000,
                onClose: () => navigate("/login"),
            });
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed. Please try again.");
        }
    };

    const handleDeleteCartItem = async (id) => {
        if (deletingCartId) return;

        setDeletingCartId(id);

        try {
            const response = await axiosPublic.delete(`/carts/${id}`);

            if (
                response.data?.deletedCount > 0 ||
                response.status === 200
            ) {
                setCart((previousCart) =>
                    (Array.isArray(previousCart) ? previousCart : []).filter(
                        (item) => item._id !== id
                    )
                );

                toast.success("Product removed from cart.", {
                    position: "top-center",
                    autoClose: 1800,
                });
            } else {
                toast.error("The cart item could not be removed.");
            }
        } catch (error) {
            console.error("Delete cart item error:", error);
            toast.error("Failed to remove cart item.");
        } finally {
            setDeletingCartId(null);
        }
    };

    const handleDeleteWishlistItem = async (id) => {
        if (deletingWishlistId) return;

        setDeletingWishlistId(id);

        try {
            const response = await axiosPublic.delete(`/wishlist/${id}`);

            if (
                response.data?.deletedCount > 0 ||
                response.status === 200
            ) {
                await refetch();

                toast.success("Removed from wishlist.", {
                    position: "top-center",
                    autoClose: 1800,
                    onClose: () => navigate("/"),
                });
            } else {
                toast.error("The wishlist item could not be removed.");
            }
        } catch (error) {
            console.error("Delete wishlist item error:", error);
            toast.error("Failed to remove wishlist item.");
        } finally {
            setDeletingWishlistId(null);
        }
    };

    useEffect(() => {
        if (!menuOpen && !cartOpen && !wishListOpen && !searchOpen) {
            document.body.style.overflow = "";
            return;
        }

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen, cartOpen, wishListOpen, searchOpen]);

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeAllPanels();
                setSearchOpen(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    const navLinkClass = ({ isActive }) =>
        `shopery-nav-link ${isActive ? "active" : ""}`;

    const renderNavigationLinks = (mobile = false) =>
        navigationLinks.map((item) => (
            <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={navLinkClass}
                onClick={() => {
                    if (mobile) setMenuOpen(false);
                }}
            >
                {item.label}
            </NavLink>
        ));

    const UserDropdown = ({ mobile = false }) => (
        <div className="shopery-user-dropdown">
            <div className="shopery-user-summary">
                <img src={userPhoto} alt="User profile" />

                <div className="min-w-0">
                    <p className="shopery-user-name">
                        {user?.displayName || "Shopery User"}
                    </p>
                    <p className="shopery-user-email">{user?.email}</p>
                </div>
            </div>

            {isAdmin ? (
                <Link
                    to="/admindashboard/adminhome"
                    className="shopery-dropdown-link"
                    onClick={() => {
                        setDropdownOpen(false);
                        if (mobile) setMenuOpen(false);
                    }}
                >
                    <MdManageAccounts />
                    <span>Admin Dashboard</span>
                </Link>
            ) : (
                <Link
                    to="/userdashboard/userhome"
                    className="shopery-dropdown-link"
                    onClick={() => {
                        setDropdownOpen(false);
                        if (mobile) setMenuOpen(false);
                    }}
                >
                    <MdManageAccounts />
                    <span>Your Profile</span>
                </Link>
            )}

            <button
                type="button"
                className="shopery-dropdown-link shopery-logout-button"
                onClick={handleLogout}
            >
                <IoLogOutOutline />
                <span>Logout</span>
            </button>
        </div>
    );

    const IconButton = ({
        label,
        icon,
        count,
        onClick,
        className = "",
    }) => (
        <button
            type="button"
            className={`shopery-icon-button ${className}`}
            onClick={onClick}
            aria-label={label}
            title={label}
        >
            {icon}
            {count > 0 && (
                <span className="shopery-icon-badge">
                    {count > 99 ? "99+" : count}
                </span>
            )}
        </button>
    );

    return (
        <header className="shopery-header">
            <ToastContainer />

            {/* Announcement bar */}
            <div className="shopery-announcement">
                <div className="shopery-container shopery-announcement-inner">
                    <p>
                        <MdOutlineLocalShipping />
                        <span>Fresh finds, delivered across Bangladesh</span>
                    </p>

                    <span className="shopery-announcement-note">
                        A better way to shop every day
                    </span>
                </div>
            </div>

            {/* Main header */}
            <div className="shopery-main-header">
                <div className="shopery-container shopery-header-main-inner">
                    <Link
                        to="/"
                        className="shopery-brand"
                        aria-label="Shopery home"
                        onClick={() => setMenuOpen(false)}
                    >
                        <span className="shopery-brand-mark">
                            <IoLeafOutline />
                        </span>

                        <span className="shopery-brand-text">
                            Shopery
                            <span className="shopery-brand-dot">.</span>
                        </span>
                    </Link>

                    <nav
                        className="shopery-desktop-nav"
                        aria-label="Main navigation"
                    >
                        {renderNavigationLinks()}
                    </nav>

                    <div className="shopery-header-actions">
                        <IconButton
                            label="Search products"
                            icon={<span className="shopery-search-symbol">⌕</span>}
                            onClick={handleOpenSearch}
                        />

                        <IconButton
                            label="Open wishlist"
                            icon={<FaRegHeart />}
                            count={wishlistItems.length}
                            onClick={() => {
                                closeAllPanels();
                                setWishListOpen(true);
                            }}
                        />

                        <IconButton
                            label="Open shopping cart"
                            icon={<FaShoppingBag />}
                            count={cartItems.length}
                            onClick={() => {
                                closeAllPanels();
                                setCartOpen(true);
                            }}
                        />

                        <div className="shopery-account-area">
                            {user ? (
                                <button
                                    type="button"
                                    className={`shopery-account-button ${
                                        dropdownOpen ? "is-open" : ""
                                    }`}
                                    onClick={() =>
                                        setDropdownOpen((previous) => !previous)
                                    }
                                    aria-expanded={dropdownOpen}
                                    aria-label="Open account menu"
                                >
                                    <img src={userPhoto} alt="" />
                                    <span className="shopery-account-label">
                                        {user.displayName?.split(" ")[0] ||
                                            "Account"}
                                    </span>
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="shopery-login-button"
                                >
                                    <FaRegUser />
                                    <span>Sign in</span>
                                </Link>
                            )}

                            {user && dropdownOpen && (
                                <UserDropdown />
                            )}
                        </div>

                        <button
                            type="button"
                            className="shopery-mobile-menu-button"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                            onClick={() =>
                                setMenuOpen((previous) => !previous)
                            }
                        >
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <button
                    type="button"
                    aria-label="Close navigation menu"
                    className="shopery-screen-backdrop shopery-menu-backdrop"
                    onClick={() => setMenuOpen(false)}
                />
            )}

            <aside
                className={`shopery-mobile-drawer ${
                    menuOpen ? "is-open" : ""
                }`}
                aria-hidden={!menuOpen}
            >
                <div className="shopery-mobile-drawer-heading">
                    <Link
                        to="/"
                        className="shopery-brand"
                        onClick={() => setMenuOpen(false)}
                    >
                        <span className="shopery-brand-mark">
                            <IoLeafOutline />
                        </span>
                        <span className="shopery-brand-text">
                            Shopery<span className="shopery-brand-dot">.</span>
                        </span>
                    </Link>

                    <button
                        type="button"
                        className="shopery-close-button"
                        onClick={() => setMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <FaTimes />
                    </button>
                </div>

                {user && (
                    <div className="shopery-mobile-user">
                        <img src={userPhoto} alt="User profile" />
                        <div className="min-w-0">
                            <p>{user.displayName || "Shopery User"}</p>
                            <span>{user.email}</span>
                        </div>
                    </div>
                )}

                <nav
                    className="shopery-mobile-nav"
                    aria-label="Mobile navigation"
                >
                    {renderNavigationLinks(true)}
                </nav>

                <div className="shopery-mobile-shortcuts">
                    <button
                        type="button"
                        onClick={handleOpenSearch}
                    >
                        <span><span className="shopery-search-symbol">⌕</span></span>
                        Search products
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setMenuOpen(false);
                            setWishListOpen(true);
                        }}
                    >
                        <span><FaRegHeart /></span>
                        Wishlist
                        <span className="shopery-shortcut-count">
                            {wishlistItems.length}
                        </span>
                    </button>

                    {user ? (
                        <>
                            <Link
                                to={
                                    isAdmin
                                        ? "/admindashboard/adminhome"
                                        : "/userdashboard/userhome"
                                }
                                onClick={() => setMenuOpen(false)}
                            >
                                <span><MdManageAccounts /></span>
                                {isAdmin ? "Admin Dashboard" : "Your Profile"}
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                            >
                                <span><IoLogOutOutline /></span>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            onClick={() => setMenuOpen(false)}
                        >
                            <span><FaRegUser /></span>
                            Sign in / Register
                        </Link>
                    )}
                </div>

                <div className="shopery-mobile-drawer-footer">
                    Thoughtful shopping. Everyday value.
                </div>
            </aside>

            {/* Shared backdrop for shopping drawers */}
            {(cartOpen || wishListOpen) && (
                <button
                    type="button"
                    className="shopery-screen-backdrop shopery-drawer-backdrop"
                    aria-label="Close shopping panel"
                    onClick={closeAllPanels}
                />
            )}

            {/* Shopping cart drawer */}
            <aside
                className={`shopery-side-drawer ${
                    cartOpen ? "is-open" : ""
                }`}
                aria-hidden={!cartOpen}
            >
                <div className="shopery-drawer-header">
                    <div>
                        <span className="shopery-drawer-eyebrow">
                            YOUR SELECTION
                        </span>
                        <h2>
                            Shopping cart
                            <span className="shopery-drawer-count">
                                {cartItems.length}
                            </span>
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="shopery-close-button"
                        onClick={() => setCartOpen(false)}
                        aria-label="Close shopping cart"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="shopery-drawer-content">
                    {cartItems.length === 0 ? (
                        <div className="shopery-empty-state">
                            <span className="shopery-empty-icon">
                                <FaShoppingBag />
                            </span>
                            <h3>Your cart is taking a break</h3>
                            <p>
                                Explore the shop and find something you love.
                            </p>
                            <Link
                                to="/shop"
                                className="shopery-primary-button"
                                onClick={() => setCartOpen(false)}
                            >
                                Explore products
                            </Link>
                        </div>
                    ) : (
                        <div className="shopery-drawer-items">
                            {cartItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="shopery-drawer-item"
                                >
                                    <div className="shopery-item-image">
                                        <img
                                            src={
                                                item.image ||
                                                item.images?.[0] ||
                                                ""
                                            }
                                            alt={item.product || item.name || "Product"}
                                        />
                                    </div>

                                    <div className="shopery-item-info">
                                        <h3>
                                            {item.product ||
                                                item.name ||
                                                "Product"}
                                        </h3>
                                        <p>
                                            {Number(item.quantity || 1) > 1
                                                ? `${item.quantity} × `
                                                : ""}
                                            ৳{formatPrice(Number(item.price) || 0)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="shopery-remove-button"
                                        onClick={() =>
                                            handleDeleteCartItem(item._id)
                                        }
                                        disabled={deletingCartId === item._id}
                                        aria-label="Remove product from cart"
                                        title="Remove item"
                                    >
                                        {deletingCartId === item._id ? (
                                            <span className="shopery-mini-spinner" />
                                        ) : (
                                            <IoCloseOutline />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="shopery-drawer-footer">
                        <div className="shopery-subtotal-row">
                            <span>Subtotal</span>
                            <strong>৳{formatPrice(totalPrice)}</strong>
                        </div>

                        <p className="shopery-shipping-note">
                            Shipping and any applicable charges are calculated
                            at checkout.
                        </p>

                        <Link
                            to="/checkout"
                            className="shopery-primary-button"
                            onClick={() => setCartOpen(false)}
                        >
                            Proceed to checkout
                        </Link>

                        <Link
                            to="/cart"
                            className="shopery-secondary-button"
                            onClick={() => setCartOpen(false)}
                        >
                            View full cart
                        </Link>
                    </div>
                )}
            </aside>

            {/* Wishlist drawer */}
            <aside
                className={`shopery-side-drawer ${
                    wishListOpen ? "is-open" : ""
                }`}
                aria-hidden={!wishListOpen}
            >
                <div className="shopery-drawer-header">
                    <div>
                        <span className="shopery-drawer-eyebrow">
                            SAVED FOR LATER
                        </span>
                        <h2>
                            Your wishlist
                            <span className="shopery-drawer-count">
                                {wishlistItems.length}
                            </span>
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="shopery-close-button"
                        onClick={() => setWishListOpen(false)}
                        aria-label="Close wishlist"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="shopery-drawer-content">
                    {wishlistItems.length === 0 ? (
                        <div className="shopery-empty-state">
                            <span className="shopery-empty-icon">
                                <FaRegHeart />
                            </span>
                            <h3>Your wishlist is waiting</h3>
                            <p>
                                Save your favourite products here for later.
                            </p>
                            <Link
                                to="/shop"
                                className="shopery-primary-button"
                                onClick={() => setWishListOpen(false)}
                            >
                                Discover products
                            </Link>
                        </div>
                    ) : (
                        <div className="shopery-drawer-items">
                            {wishlistItems.map((item) => (
                                <div
                                    key={item._id}
                                    className="shopery-drawer-item"
                                >
                                    <div className="shopery-item-image">
                                        <img
                                            src={
                                                item.image ||
                                                item.images?.[0] ||
                                                ""
                                            }
                                            alt={item.product || item.name || "Product"}
                                        />
                                    </div>

                                    <div className="shopery-item-info">
                                        <h3>
                                            {item.product ||
                                                item.name ||
                                                "Product"}
                                        </h3>
                                        <p>
                                            ৳{formatPrice(Number(item.price) || 0)}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        className="shopery-remove-button"
                                        onClick={() =>
                                            handleDeleteWishlistItem(item._id)
                                        }
                                        disabled={
                                            deletingWishlistId === item._id
                                        }
                                        aria-label="Remove product from wishlist"
                                        title="Remove item"
                                    >
                                        {deletingWishlistId === item._id ? (
                                            <span className="shopery-mini-spinner" />
                                        ) : (
                                            <IoCloseOutline />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {wishlistItems.length > 0 && (
                    <div className="shopery-drawer-footer">
                        <Link
                            to="/wishlist"
                            className="shopery-primary-button"
                            onClick={() => setWishListOpen(false)}
                        >
                            View full wishlist
                        </Link>

                        <Link
                            to="/shop"
                            className="shopery-secondary-button"
                            onClick={() => setWishListOpen(false)}
                        >
                            Continue shopping
                        </Link>
                    </div>
                )}
            </aside>

            {/* Product search */}
            <ProductSearch
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
            />
        </header>
    );
}

export default Header;