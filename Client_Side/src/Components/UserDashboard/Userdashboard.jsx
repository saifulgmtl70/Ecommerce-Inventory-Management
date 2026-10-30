import { Link, Outlet } from "react-router-dom";
import { HiOutlineHome, HiOutlineChevronRight } from "react-icons/hi";
import { Helmet } from "react-helmet-async";

import Header from "../Header/Header";
import Sidebar from "./Sidebar/Sidebar";

import "./dashboard.css";

const UserDashboard = () => {
    return (
        <main className="nunito_sans shopery-dashboard">
            <Helmet>
                <title>Shopery | My Account</title>
            </Helmet>

            <Header />

            <section className="dashboard-banner">
                <div className="dashboard-banner-inner">
                    <div>
                        <span className="dashboard-eyebrow"> SHOPERY CUSTOMER ACCOUNT </span>
                        <h1>My Dashboard</h1>
                        <p> Manage your profile, orders and shopping preferences in one place. </p>
                    </div>

                    <nav aria-label="Breadcrumb" className="dashboard-breadcrumb">
                        <Link to="/">
                            <HiOutlineHome />
                            <span>Home</span>
                        </Link>

                        <HiOutlineChevronRight className="breadcrumb-chevron" />

                        <span className="breadcrumb-current">Dashboard</span>
                    </nav>
                </div>
            </section>

            <section className="dashboard-main">
                <div className="dashboard-layout">
                    <aside className="dashboard-sidebar">
                        <Sidebar />
                    </aside>

                    <div className="dashboard-content">
                        <Outlet />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default UserDashboard;