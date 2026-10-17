import { Link, Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { HiOutlineHome } from "react-icons/hi";
import Sidebar from "./Sidebar/Sidebar";

import './dashboard.css';


import { Helmet } from 'react-helmet-async';


const UserDashboard = () => {
    return (
        <main className="nunito_sans">
            <Helmet>
                <title>Shopery | User Dashboard </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <Header />
            <div className="specific_product_banner h-full lg:h-[30vh] mb-2">
                <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">
                    <ul>
                        <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>
                        <li className="text-[#00B207] font-bold">Dashboard</li>
                    </ul>
                </div>
            </div>

            <div className="px-12 py-10">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                    <div className="h-auto ">
                        <Sidebar />
                    </div>
                    <div className="h-auto lg:col-span-2 ">
                        <Outlet />
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </main>
    );
};



export default UserDashboard;
