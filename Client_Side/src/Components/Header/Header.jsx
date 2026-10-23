import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import {
  CiSearch,
  CiUser,
  CiHeart,
  CiShoppingCart,
} from "react-icons/ci";
import { IoCloseOutline, IoLeaf, IoLogOutOutline } from "react-icons/io5";
import { AiOutlineClose } from "react-icons/ai";
import { RiMenuFold2Fill } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAuth from "../Hooks/useAuth";
import useCart from "../Hooks/useCart";
import useAxiosPublic from "../Hooks/useAxiosPublic";
import useWishlist from "../Hooks/useWishlist";
import useAdmin from "../Hooks/useAdmin";

import ProductSearch from "../Header/ProductSearch";

import "./Header.css";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishListOpen, setWishListOpen] = useState(false);

  // New Search State
  const [searchOpen, setSearchOpen] = useState(false);

  const [cart, setCart] = useCart();
  const [wishlist, refetch] = useWishlist();

  const { user, logOut } = useAuth();
  const [isAdmin] = useAdmin();

  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  // Close Mobile Menu
  const handleMenuItemClick = () => {
    setMenuOpen(false);
  };

  // Close Cart
  const handleCloseCart = () => {
    setCartOpen(false);
  };

  // Close Wishlist
  const handleCloseWishList = () => {
    setWishListOpen(false);
  };

  // Open Search
  const handleOpenSearch = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
    setCartOpen(false);
    setWishListOpen(false);
    setSearchOpen(true);
  };

  // Close Search
  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  // Logout
  const handleLogout = () => {
    logOut()
      .then(() => {
        toast.success("Logged Out Successfully", {
          position: "top-center",
          autoClose: 1000,
          onClose: () => navigate("/login"),
        });
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Logout failed. Please try again.");
      });

    setDropdownOpen(false);
  };

  // Calculate Cart Total
  const calculateTotalPrice = () => {
    return cart
      .reduce((total, item) => {
        const itemPrice = Number(item.price);

        return !isNaN(itemPrice)
          ? total + itemPrice
          : total;
      }, 0)
      .toFixed(2);
  };

  const totalPrice = calculateTotalPrice();

  // Delete Cart Item
  const handleDeleteItem = async (id) => {
    try {
      const res = await axiosPublic.delete(`/carts/${id}`);

      if (res.data.deletedCount > 0) {
        setCart(cart.filter((item) => item._id !== id));

        toast.success("Deleted Successfully", {
          position: "top-center",
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Delete cart item error:", error);
      toast.error("Failed to delete cart item.");
    }
  };

  // Delete Wishlist Item
  const handleDeleteWishlistItem = async (id) => {
    try {
      const res = await axiosPublic.delete(`/wishlist/${id}`);

      if (res.data.deletedCount > 0) {
        toast.success("Wishlist item deleted successfully", {
          position: "top-center",
          autoClose: 2000,
        });

        refetch();
      }
    } catch (error) {
      console.error("Delete wishlist item error:", error);
      toast.error("Failed to delete wishlist item.");
    }
  };

  // User Profile Image
  const userPhoto =
    user?.photoURL ||
    "https://ui-avatars.com/api/?name=User&background=00B207&color=fff";

  return (
    <div className="bg-white z-50 shadow-sm top-0 sticky nunito_sans">
      <ToastContainer />

      {/* ================= TOP BAR ================= */}
      <div>
        <div className="lg:flex justify-between hidden items-center px-4 md:px-12 py-2 bg-[#EDF2EE]">
          <div className="text-sm text-[#84D187]">
            <span>
              🚚 Delivery Available Across Bangladesh
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button className="text-[#84D187]">
                Eng
              </button>

              <button className="text-[#84D187]">
                USD
              </button>
            </div>
          </div>
        </div>

        {/* ================= MAIN HEADER ================= */}
        <div className="flex justify-between items-center navmenu px-4 md:px-12 py-4">

          {/* Logo */}
          <Link
            to="/"
            className="text-[30px] poetsen_one tracking-wide flex items-center font-bold text-[#00B207]"
          >
            <IoLeaf />
            Ecobazaar
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <NavLink
              to="/"
              className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]"
            >
              Home
            </NavLink>

            <NavLink
              to="/shop"
              className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]"
            >
              Shop
            </NavLink>

            <NavLink
              to="/blog"
              className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]"
            >
              Blog
            </NavLink>

            <NavLink
              to="/about"
              className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]"
            >
              About Us
            </NavLink>

            <NavLink
              to="/contact"
              className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]"
            >
              Contact Us
            </NavLink>
          </nav>

          {/* ================= DESKTOP ICONS ================= */}
          <div className="hidden md:flex items-center space-x-4">

            {/* Functional Search Button */}
            <button
              type="button"
              onClick={handleOpenSearch}
              aria-label="Search products"
              className="flex items-center justify-center -mt-1"
            >
              <CiSearch className="text-[#222] text-[23px] cursor-pointer hover:text-[#00B207] transition" />
            </button>

            {/* Wishlist Icon */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setWishListOpen(true)}
                aria-label="Open wishlist"
              >
                <CiHeart className="text-[#222] text-[23px] cursor-pointer" />
              </button>

              {wishlist.length > 0 && (
                <span className="text-[#00B307] absolute font-bold -top-3 -right-1 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </div>

            {/* Cart Icon */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label="Open shopping cart"
              >
                <CiShoppingCart className="text-[#222] text-[23px] cursor-pointer" />
              </button>

              {cart.length > 0 && (
                <span className="text-[#00B307] absolute font-bold -top-3 -right-1 rounded-full">
                  {cart.length}
                </span>
              )}
            </div>

            {/* ================= USER DROPDOWN ================= */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={userPhoto}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <span className="ml-2 text-[#444]">
                    {user.displayName || "User"}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 h-auto w-72 bg-white border rounded shadow-lg z-50">

                    <div className="flex items-center justify-center pt-3">
                      <img
                        src={userPhoto}
                        alt="User"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>

                    <div className="p-3 text-center">
                      <p className="font-bold text-[23px]">
                        {user.displayName || "User"}
                      </p>

                      <p className="text-[16px] text-gray-600 break-all">
                        {user.email}
                      </p>
                    </div>

                    {isAdmin ? (
                      <Link
                        to="/admindashboard/adminhome"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full text-[18px] bg-gray-100 px-3 py-3 flex items-center gap-2 hover:bg-gray-200"
                      >
                        <MdManageAccounts />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/userdashboard/userhome"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full text-[18px] bg-gray-100 px-3 py-3 flex items-center gap-2 hover:bg-gray-200"
                      >
                        <MdManageAccounts />
                        Your Profile
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="border-t w-full text-[18px] cursor-pointer bg-gray-100 px-3 py-3 flex items-center gap-2 hover:bg-gray-200"
                    >
                      <IoLogOutOutline />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <CiUser className="text-[#222] text-[23px] cursor-pointer" />
              </Link>
            )}
          </div>

          {/* ================= MOBILE HEADER ================= */}
          <div className="md:hidden flex items-center gap-3">

            {/* Mobile Search */}
            <button
              type="button"
              onClick={handleOpenSearch}
              aria-label="Search products"
            >
              <CiSearch className="text-[#222] text-[23px] -mt-1" />
            </button>

            {/* Mobile Cart */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                aria-label="Open shopping cart"
              >
                <CiShoppingCart className="text-[#222] text-[23px]" />
              </button>

              {cart.length > 0 && (
                <span className="text-[#00B307] absolute font-bold -top-3 -right-1">
                  {cart.length}
                </span>
              )}
            </div>

            {/* Mobile User */}
            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img
                    src={userPhoto}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">

                    <div className="flex items-center justify-center pt-3">
                      <img
                        src={userPhoto}
                        alt="User"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>

                    <div className="p-3 text-center">
                      <p className="font-bold text-[18px]">
                        {user.displayName || "User"}
                      </p>

                      <p className="text-[15px] text-gray-600 break-all">
                        {user.email}
                      </p>
                    </div>

                    {isAdmin ? (
                      <Link
                        to="/admindashboard/adminhome"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full bg-gray-100 px-3 py-3 flex items-center gap-2"
                      >
                        <MdManageAccounts />
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/userdashboard/userhome"
                        onClick={() => setDropdownOpen(false)}
                        className="w-full bg-gray-100 px-3 py-3 flex items-center gap-2"
                      >
                        <MdManageAccounts />
                        Your Profile
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="border-t w-full bg-gray-100 px-3 py-3 flex items-center gap-2"
                    >
                      <IoLogOutOutline />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <CiUser className="text-[#444] text-[23px]" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <AiOutlineClose className="text-[#444] text-[23px]" />
              ) : (
                <RiMenuFold2Fill className="text-[#444] text-[23px]" />
              )}
            </button>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <div
          className={`md:hidden bg-[#EDF2EE] navmenu fixed top-0 right-0 h-full w-full max-w-xs transition-transform duration-300 ease-in-out transform ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          } z-50`}
        >
          <button
            type="button"
            className="absolute top-4 right-4 cursor-pointer text-[#444] text-[20px]"
            onClick={() => setMenuOpen(false)}
          >
            <AiOutlineClose />
          </button>

          <nav className="flex flex-col items-center space-y-4 py-4 mt-16">
            <NavLink
              onClick={handleMenuItemClick}
              to="/"
              className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]"
            >
              Home
            </NavLink>

            <NavLink
              onClick={handleMenuItemClick}
              to="/shop"
              className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]"
            >
              Shop
            </NavLink>

            <NavLink
              onClick={handleMenuItemClick}
              to="/blog"
              className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]"
            >
              Blog
            </NavLink>

            <NavLink
              onClick={handleMenuItemClick}
              to="/about"
              className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]"
            >
              About Us
            </NavLink>

            <NavLink
              onClick={handleMenuItemClick}
              to="/contact"
              className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]"
            >
              Contact Us
            </NavLink>
          </nav>

          <div className="flex justify-center space-x-6 pb-4">

            {/* Mobile Menu Search */}
            <button
              type="button"
              onClick={handleOpenSearch}
              aria-label="Search products"
            >
              <CiSearch className="text-[#222] text-[23px]" />
            </button>

            {/* Mobile Wishlist */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setWishListOpen(true);
                }}
                aria-label="Open wishlist"
              >
                <CiHeart className="text-[#222] text-[23px]" />
              </button>

              {wishlist.length > 0 && (
                <span className="text-[#00B307] absolute font-bold -top-3 -right-1">
                  {wishlist.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= CART SIDEBAR ================= */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white transition-transform duration-300 ease-in-out transform ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        } z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center px-4 py-4 bg-[#f9f8f8]">
          <h2 className="text-lg text-[#00B307] font-bold">
            Your Shopping Cart ({cart.length})
          </h2>

          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="text-[#00B307]"
          >
            <FaTimes />
          </button>
        </div>

        <div className="scrollable-container p-4">
          <ul className="mb-36">
            {cart.map((item) => (
              <li
                key={item._id}
                className="border-b pb-3 flex items-center justify-between px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    alt={item.product}
                    className="w-[80px] h-[80px] object-contain"
                  />

                  <div>
                    <h3 className="text-[18px] text-[#191919] font-[600] mb-1">
                      {item.product}
                    </h3>

                    <p className="text-[15px] text-[#999]">
                      1kg ={" "}
                      <span className="text-[#222] font-bold">
                        ৳{item.price}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-[#6d5656] text-[23px] p-[6px] border rounded-full"
                >
                  <IoCloseOutline />
                </button>
              </li>
            ))}
          </ul>

          {/* Cart Footer */}
          <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t">
            <div className="flex items-center justify-between px-2 my-2">
              <h2 className="text-[#444] font-[500]">
                {cart.length} Product
              </h2>

              <h1 className="text-[#191919] font-bold">
                ৳{totalPrice}
              </h1>
            </div>

            <div className="flex flex-col gap-3 justify-around">
              <Link
                onClick={handleCloseCart}
                to="/checkout"
                className="px-12 py-3 text-center rounded-[24px] bg-[#00B207] text-white"
              >
                Checkout
              </Link>

              <Link
                onClick={handleCloseCart}
                to="/cart"
                className="px-12 py-3 text-center rounded-[24px] bg-[#d2e7d2] text-[#00B207] font-bold"
              >
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= WISHLIST SIDEBAR ================= */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white transition-transform duration-300 ease-in-out transform ${
          wishListOpen ? "translate-x-0" : "translate-x-full"
        } z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center px-4 py-4 bg-[#f9f8f8]">
          <h2 className="text-lg text-[#00B307] font-bold">
            Your Wishlist ({wishlist.length})
          </h2>

          <button
            type="button"
            onClick={() => setWishListOpen(false)}
            className="text-[#00B307]"
          >
            <FaTimes />
          </button>
        </div>

        <div className="scrollable-container p-4">
          <ul className="mb-36">
            {wishlist.map((item) => (
              <li
                key={item._id}
                className="border-b pb-3 flex items-center justify-between px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    alt={item.product}
                    className="w-[80px] h-[80px] object-contain"
                  />

                  <div>
                    <h3 className="text-[18px] text-[#191919] font-[600] mb-1">
                      {item.product}
                    </h3>

                    <p className="text-[15px] text-[#999]">
                      1kg ={" "}
                      <span className="text-[#222] font-bold">
                        ৳{item.price}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteWishlistItem(item._id)}
                  className="text-[#6d5656] text-[23px] p-[6px] border rounded-full"
                >
                  <IoCloseOutline />
                </button>
              </li>
            ))}
          </ul>

          {/* Wishlist Footer */}
          <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t">
            <div className="flex flex-col gap-3">
              <Link
                onClick={handleCloseWishList}
                to="/cart"
                className="px-12 py-3 text-center rounded-[24px] bg-[#00B207] text-white"
              >
                Go to Cart
              </Link>

              <Link
                onClick={handleCloseWishList}
                to="/wishlist"
                className="px-12 py-3 text-center rounded-[24px] bg-[#d2e7d2] text-[#00B207] font-bold"
              >
                Go to Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= PRODUCT SEARCH POPUP ================= */}
      <ProductSearch
        isOpen={searchOpen}
        onClose={handleCloseSearch}
      />
    </div>
  );
}

export default Header;