
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import {
    FaArrowRight,
    FaCheckCircle,
    FaHeadset,
    FaLeaf,
    FaShippingFast,
    FaShieldAlt,
    FaShoppingBag,
} from "react-icons/fa";

import { BsStars } from "react-icons/bs";

import Banner from "./Banner/Banner";
import Categories from "./Categories/Categories";
import PopularProducts from "./PopularProducts/PopularProducts";
import Promotional from "./Promotional/Promotional";
import HotDeal from "./HotDeals/HotDeal";
import Discount from "./Discount/Discount";
import News from "./News/News";
import Testimonial from "./Testimonial/Testimonial";
import Sponsor from "./Sponsor/Sponsor";
import Follow from "./Follow/Follow";

import "./Home.css";

const services = [
    {
        id: 1,
        icon: FaShippingFast,
        title: "Fast & Reliable Delivery",
        description: "Get your orders delivered safely and quickly.",
    },
    {
        id: 2,
        icon: FaLeaf,
        title: "Fresh & Quality Products",
        description: "Explore carefully selected products for everyday needs.",
    },
    {
        id: 3,
        icon: FaShieldAlt,
        title: "Secure Shopping",
        description: "Enjoy a convenient and protected shopping experience.",
    },
    {
        id: 4,
        icon: FaHeadset,
        title: "Dedicated Support",
        description: "Get assistance whenever you need help with your order.",
    },
];

const benefits = [
    {
        id: 1,
        title: "Easy Product Discovery",
        description:
            "Browse categories and discover products without unnecessary complexity.",
    },
    {
        id: 2,
        title: "Smart Shopping Experience",
        description:
            "Save your favorite products, manage your cart and track your orders.",
    },
    {
        id: 3,
        title: "Customer-Focused Experience",
        description:
            "Enjoy a shopping platform designed around simplicity and convenience.",
    },
];

const Home = () => {
    return (
        <main className="shopery-home">
            <Helmet>
                <title>
                    Shopery | Fresh Products & Smart Shopping
                </title>

                <meta
                    name="description"
                    content="Discover fresh products, exciting deals, popular categories and a convenient online shopping experience with Shopery."
                />
            </Helmet>

            {/* ================= HERO ================= */}

            <section
                className="home-hero-section"
                aria-label="Shopery featured products and offers"
            >
                <Banner />
            </section>

            {/* ================= SERVICES ================= */}

            <section
                className="home-trust-wrapper"
                aria-label="Shopping benefits"
            >
                <div className="home-container">
                    <div className="home-trust-grid">
                        {services.map((service) => {
                            const Icon = service.icon;

                            return (
                                <div
                                    className="home-trust-card"
                                    key={service.id}
                                >
                                    <div className="home-trust-icon">
                                        <Icon aria-hidden="true" />
                                    </div>

                                    <div className="home-trust-info">
                                        <h3>{service.title}</h3>
                                        <p>{service.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ================= CATEGORIES ================= */}

            <section
                className="home-content-section home-category-section"
                aria-label="Shop by category"
            >
                <Categories />
            </section>

            {/* ================= POPULAR PRODUCTS ================= */}

            <section
                className="home-content-section home-products-section"
                aria-label="Popular products"
            >
                <PopularProducts />
            </section>

            {/* ================= PROMOTIONAL ================= */}

            <section
                className="home-content-section home-promo-section"
                aria-label="Promotional offers"
            >
                <Promotional />
            </section>

            {/* ================= HOT DEALS ================= */}

            <section
                className="home-content-section home-hotdeal-section"
                aria-label="Hot deals"
            >
                <HotDeal />
            </section>

            {/* ================= DISCOUNT ================= */}

            <section
                className="home-content-section home-discount-wrapper"
                aria-label="Special discount"
            >
                <Discount />
            </section>

            {/* ================= WHY SHOPERY ================= */}

            <section className="home-why-section">
                <div className="home-container">
                    <div className="home-why-content">

                        <div className="home-why-text">
                            <span className="home-section-kicker">
                                <BsStars aria-hidden="true" />
                                WHY SHOPERY?
                            </span>

                            <h2>
                                Shopping Should Be
                                <span> Simple.</span>
                            </h2>

                            <p className="home-why-description">
                                Shopery is designed to make online shopping
                                easier, faster and more convenient. From
                                discovering products to managing your
                                orders, everything is organized around
                                a smooth shopping experience.
                            </p>

                            <div className="home-benefit-list">
                                {benefits.map((benefit) => (
                                    <div
                                        className="home-benefit-item"
                                        key={benefit.id}
                                    >
                                        <div className="home-benefit-icon">
                                            <FaCheckCircle
                                                aria-hidden="true"
                                            />
                                        </div>

                                        <div>
                                            <h3>{benefit.title}</h3>
                                            <p>{benefit.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/about"
                                className="home-primary-btn"
                            >
                                Discover Shopery
                                <FaArrowRight aria-hidden="true" />
                            </Link>
                        </div>

                        <div
                            className="home-why-visual"
                            aria-label="Shopery shopping experience"
                        >
                            <div className="home-visual-circle home-circle-one" />
                            <div className="home-visual-circle home-circle-two" />

                            <div className="home-visual-main-card">
                                <div className="home-visual-icon">
                                    <FaShoppingBag aria-hidden="true" />
                                </div>

                                <span>SHOPERY EXPERIENCE</span>

                                <h3>
                                    Everything You Need,
                                    <br />
                                    In One Place.
                                </h3>

                                <p>
                                    Discover products, explore exciting
                                    offers and enjoy a simpler way
                                    to shop online.
                                </p>

                                <div className="home-visual-card-footer">
                                    <span className="home-visual-status-dot" />
                                    Your Shopping Destination
                                </div>
                            </div>

                            <div className="home-floating-card home-floating-card-one">
                                <FaCheckCircle aria-hidden="true" />

                                <div>
                                    <strong>Quality First</strong>
                                    <span>Carefully selected</span>
                                </div>
                            </div>

                            <div className="home-floating-card home-floating-card-two">
                                <FaShippingFast aria-hidden="true" />

                                <div>
                                    <strong>Easy Shopping</strong>
                                    <span>Simple & convenient</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* ================= NEWS ================= */}

            <section
                className="home-content-section home-news-section"
                aria-label="Latest news and blog posts"
            >
                <News />
            </section>

            {/* ================= TESTIMONIAL ================= */}

            <section
                className="home-content-section home-testimonial-section"
                aria-label="Customer testimonials"
            >
                <Testimonial />
            </section>

            {/* ================= SPONSOR ================= */}

            <section
                className="home-content-section home-sponsor-section"
                aria-label="Featured brands"
            >
                <Sponsor />
            </section>

            {/* ================= FOLLOW ================= */}

            <section
                className="home-content-section home-follow-section"
                aria-label="Shopery Instagram gallery"
            >
                <Follow />
            </section>

            {/* ================= FINAL CTA ================= */}

            <section className="home-final-cta">
                <div className="home-container">
                    <div className="home-final-cta-inner">

                        <div className="home-final-cta-content">
                            <span className="home-final-eyebrow">
                                READY TO SHOP?
                            </span>

                            <h2>
                                Your Next Favorite Product
                                <br className="home-cta-desktop-break" />
                                Is Waiting for You.
                            </h2>

                            <p>
                                Explore our collection, discover exciting
                                products and find something you'll
                                love today.
                            </p>
                        </div>

                        <Link
                            to="/shop"
                            className="home-final-btn"
                        >
                            Start Shopping
                            <FaArrowRight aria-hidden="true" />
                        </Link>

                    </div>
                </div>
            </section>
        </main>
    );
};

export default Home;
