
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
    FiArrowRight,
    FiHome,
    FiShield,
    FiTruck,
    FiRefreshCw,
} from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

import Products from "./Products/Products";
import "./shop.css";

const Shop = () => {
    return (
        <main className="shopery-shop-page nunito_sans">
            <Helmet>
                <title>Shop All Products | Shopery</title>
                <meta
                    name="description"
                    content="Explore quality products, find your favorites, and discover great value at Shopery."
                />
            </Helmet>

            <section className="shopery-shop-hero">
                <div className="shopery-shop-shell">
                    <nav
                        aria-label="Breadcrumb"
                        className="shopery-shop-breadcrumb"
                    >
                        <Link to="/">
                            <FiHome />
                            Home
                        </Link>

                        <span>/</span>
                        <span aria-current="page">Shop</span>
                    </nav>

                    <div className="shopery-shop-hero-grid">
                        <div className="shopery-shop-hero-copy">
                            <span className="shopery-shop-eyebrow">
                                <HiOutlineSparkles />
                                CURATED FOR EVERYDAY LIVING
                            </span>

                            <h1>
                                Discover your{" "}
                                <span>next favorite.</span>
                            </h1>

                            <p>
                                Explore thoughtfully selected essentials,
                                exciting finds, and everyday favorites—all
                                in one place.
                            </p>

                            <a
                                href="#shop-products"
                                className="shopery-shop-hero-cta"
                            >
                                Explore Products
                                <FiArrowRight />
                            </a>
                        </div>

                        <div
                            className="shopery-shop-hero-art"
                            aria-hidden="true"
                        >
                            <div className="shopery-shop-art-circle">
                                <span>SHOPERY</span>

                                <strong>
                                    Fresh finds.
                                    <br />
                                    Better days.
                                </strong>

                                <span className="shopery-shop-art-symbol">
                                    ✦
                                </span>
                            </div>

                            <div className="shopery-shop-art-pill">
                                Discover • Shop • Enjoy
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="shopery-shop-perks">
                <div className="shopery-shop-shell shopery-shop-perks-grid">
                    <span>
                        <FiShield />
                        Quality-focused selection
                    </span>

                    <span>
                        <FiTruck />
                        Convenient shopping
                    </span>

                    <span>
                        <FiRefreshCw />
                        Explore new favorites
                    </span>
                </div>
            </div>

            <Products />
        </main>
    );
};

export default Shop;
