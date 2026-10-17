import React from 'react';
import {  HiOutlineCog, HiOutlineHeart, HiOutlineLogout, HiOutlineShoppingCart} from 'react-icons/hi';
import { FaArrowsRotate } from "react-icons/fa6";
import { MdDashboard } from 'react-icons/md';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {

    const { logOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOut().then(() => {
          toast.success("Logged Out Successfully", {
            position: "top-center",
            autoClose: 1000, // এক সেকেন্ডের মধ্যে বন্ধ হবে
            // টোস্ট বন্ধ হওয়ার পরে নেভিগেট করুন
            onClose: () => navigate('/login')
          });
        });
        setDropdownOpen(false);
    };

    return (
        <nav className="bg-white shadow-sm border rounded-lg sticky top-0 p-5">
            <h2 className='text-[#222] font-bold tex-[40px] mb-4'>Navigation</h2>
            <ul className="sidemenu ">
                <li>
                    <NavLink to="userhome" className="flex items-center gap-2 hover:border-l-[3px] hover:border-l-[#00B307] hover:bg-[#EDF2EE] py-5 px-[10px]  transition-none text-[#7a7979] hover:text-[#122033] transition-all delay-100 font-[700]">
                        <MdDashboard className="text-xl" /> Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink to="orderhistory" className="flex items-center gap-2 hover:border-l-[3px] hover:border-l-[#00B307] hover:bg-[#EDF2EE] py-5 px-[10px]  transition-none text-[#7a7979] hover:text-[#122033] transition-all delay-100 font-[700]">
                        <FaArrowsRotate className="text-xl" /> Order History
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/wishlist" className="flex items-center gap-2 hover:border-l-[3px] hover:border-l-[#00B307] hover:bg-[#EDF2EE] py-5 px-[10px]  transition-none text-[#7a7979] hover:text-[#122033] transition-all delay-100 font-[700]">
                        <HiOutlineHeart className="text-xl" /> Wishlist
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/cart" className="flex items-center gap-2 hover:border-l-[3px] hover:border-l-[#00B307] hover:bg-[#EDF2EE] py-5 px-[10px]  transition-none text-[#7a7979] hover:text-[#122033] transition-all delay-100 font-[700]">
                        <HiOutlineShoppingCart className="text-xl" /> Shopping Cart
                    </NavLink>
                </li>
                <li>
                    <NavLink to="settings" className="flex items-center gap-2 hover:border-l-[3px] hover:border-l-[#00B307] hover:bg-[#EDF2EE] py-5 px-[10px]  transition-none text-[#7a7979] hover:text-[#122033] transition-all delay-100 font-[700]">
                        <HiOutlineCog className="text-xl" /> Settings
                    </NavLink>
                </li>
                <li>
                    <button onClick={handleLogout} className="flex items-center gap-2 hover:border-l-[3px] hover:border-l-[#00B307] hover:bg-[#EDF2EE] py-5 px-[10px]  transition-none text-[#7a7979] hover:text-[#122033] transition-all delay-100 font-[700]">
                        <HiOutlineLogout className="text-xl" /> Log-out
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;