import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
    HiOutlineHome,
    HiOutlineArrowRight,
    HiOutlineCheckCircle,
    HiOutlineSparkles,
} from "react-icons/hi2";

import {
    FiTruck,
    FiShield,
    FiHeadphones,
    FiShoppingBag,
    FiHeart,
    FiPackage,
    FiArrowUpRight,
    FiArrowRight,
} from "react-icons/fi";

import {
    LuLeaf,
    LuBadgeCheck,
    LuShoppingBasket,
} from "react-icons/lu";

import OurTeam from "./OurTeam";
import Testimonial from "../Home/Testimonial/Testimonial";
import Sponsor from "../Home/Sponsor/Sponsor";
//import Newsletter from "../Shop/Products/Newsletter";

import "./about.css";

// ========================================
// SHOPERY FEATURES
// ========================================

const features = [
    {
        id: 1,
        icon: LuLeaf,
        title: "Fresh & Quality Products",
        description:
            "Explore a thoughtfully organized collection of fresh groceries and everyday essentials.",
    },
    {
        id: 2,
        icon: FiTruck,
        title: "Convenient Shopping",
        description:
            "Enjoy a simple shopping journey designed to make ordering products easier.",
    },
    {
        id: 3,
        icon: FiShield,
        title: "Reliable Experience",
        description:
            "Browse products with clear information and manage your shopping experience confidently.",
    },
    {
        id: 4,
        icon: FiHeadphones,
        title: "Customer Focused",
        description:
            "We believe every customer deserves a smooth and enjoyable online shopping experience.",
    },
    {
        id: 5,
        icon: FiShoppingBag,
        title: "Easy Online Ordering",
        description:
            "Discover products, add your favorites to the cart, and place orders conveniently.",
    },
    {
        id: 6,
        icon: FiHeart,
        title: "Made With Care",
        description:
            "Every part of Shopery is designed with simplicity, accessibility, and usability in mind.",
    },
];

// ========================================
// SHOPPING BENEFITS
// ========================================

const benefits = [
    "Browse products across different categories.",
    "Enjoy a clean and user-friendly shopping experience.",
    "Manage your cart, wishlist, and orders easily.",
    "Access Shopery from mobile, tablet, or desktop.",
];

// ========================================
// ABOUT COMPONENT
// ========================================

const About = () => {
    return (
        <main className="shopery-about nunito_sans overflow-x-hidden bg-white">

            <Helmet>
                <title>About Us | Shopery</title>

                <meta
                    name="description"
                    content="Discover Shopery, our story, values, and commitment to making online shopping simple, convenient, and enjoyable."
                />
            </Helmet>

            {/* ========================================
                SECTION 1: HERO
            ======================================== */}

            <section className="about-hero relative overflow-hidden">

                <div className="about-hero-glow about-hero-glow-one"></div>
                <div className="about-hero-glow about-hero-glow-two"></div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-7 sm:px-6 lg:px-8 lg:pb-28">

                    {/* Breadcrumb */}

                    <nav
                        aria-label="Breadcrumb"
                        className="mb-12 flex flex-wrap items-center gap-2 text-sm lg:mb-16"
                    >

                        <Link
                            to="/"
                            className="flex items-center gap-2 text-gray-500 transition-colors hover:text-[#00B207]"
                        >
                            <HiOutlineHome size={18} />
                            Home
                        </Link>

                        <span className="text-gray-300">/</span>

                        <span className="font-semibold text-[#00B207]">
                            About Us
                        </span>

                    </nav>

                    <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">

                        {/* LEFT CONTENT */}

                        <div className="order-2 lg:order-1">

                            <div className="about-badge mb-6">

                                <HiOutlineSparkles size={17} />

                                <span>WELCOME TO SHOPERY</span>

                            </div>

                            <h1 className="mb-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-[#172B1B] sm:text-5xl lg:text-[58px] xl:text-[66px]">

                                A Better Way

                                <span className="block">
                                    To <span className="about-gradient-text">Shop Online.</span>
                                </span>

                            </h1>

                            <p className="mb-8 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">

                                Welcome to Shopery — where convenience meets
                                a smarter shopping experience.

                                We bring together everyday essentials,
                                fresh choices, and modern technology to make
                                online shopping simpler and more enjoyable.

                            </p>

                            {/* Buttons */}

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                                <Link
                                    to="/shop"
                                    className="about-primary-btn"
                                >
                                    Explore Our Shop
                                    <HiOutlineArrowRight size={21} />
                                </Link>

                                <a
                                    href="#our-story"
                                    className="about-secondary-btn"
                                >
                                    Discover Our Story
                                    <FiArrowUpRight size={19} />
                                </a>

                            </div>

                            {/* Small Highlights */}

                            <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-green-100 pt-7">

                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">

                                    <LuBadgeCheck className="text-xl text-[#00B207]" />

                                    Easy Shopping

                                </div>

                                <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">

                                    <FiHeart className="text-xl text-[#00B207]" />

                                    Customer First

                                </div>

                            </div>

                        </div>

                        {/* RIGHT IMAGE */}

                        <div className="relative order-1 mx-auto w-full max-w-xl lg:order-2">

                            <div className="about-image-glow"></div>

                            <div className="about-hero-image-card">

                                <div className="overflow-hidden rounded-[24px] bg-[#F1F8F0]">

                                    <img
                                        src="https://i.ibb.co/NNYjsj0/about.png"
                                        alt="Shopery online grocery shopping"
                                        className="about-floating-image w-full object-contain"
                                    />

                                </div>

                            </div>

                            {/* Floating Badge */}

                            <div className="about-floating-card absolute -bottom-5 left-2 flex items-center gap-3 rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-xl sm:-left-5 sm:px-5 sm:py-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-[#00B207]">

                                    <LuLeaf size={24} />

                                </div>

                                <div>

                                    <h3 className="text-sm font-bold text-[#183B1D]">
                                        Fresh & Simple
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        Shopping made better
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ========================================
                SECTION 2: OUR STORY
            ======================================== */}

            <section
                id="our-story"
                className="scroll-mt-20 py-20 sm:py-24 lg:py-28"
            >

                <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">

                    {/* IMAGE */}

                    <div className="relative">

                        <div className="about-story-image relative overflow-hidden rounded-[30px] bg-[#F3F9F2] p-6 sm:p-10">

                            <img
                                src="https://i.ibb.co/wg9Byqj/about-1.png"
                                alt="Shopery fresh and quality products"
                                loading="lazy"
                                className="mx-auto w-full max-w-lg object-contain"
                            />

                        </div>

                        <div className="absolute -bottom-5 right-4 rounded-2xl border border-green-100 bg-white p-4 shadow-xl sm:right-8 sm:p-5">

                            <div className="flex items-center gap-3">

                                <div className="rounded-xl bg-green-100 p-3 text-[#00B207]">

                                    <LuShoppingBasket size={24} />

                                </div>

                                <div>

                                    <p className="text-sm font-bold text-gray-800">
                                        Shop With Ease
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Anytime, Anywhere
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* CONTENT */}

                    <div>

                        <div className="about-section-label mb-5">
                            OUR STORY
                        </div>

                        <h2 className="about-section-title mb-6">

                            More Than Just

                            <span className="block text-[#00B207]">
                                An Online Store.
                            </span>

                        </h2>

                        <p className="mb-5 text-sm leading-8 text-gray-600 sm:text-base">

                            Shopery started with a simple vision:
                            to make online shopping more accessible,
                            convenient, and enjoyable.

                            We believe that finding the right products
                            should be easy, whether you're shopping
                            for everyday essentials or exploring
                            something new.

                        </p>

                        <p className="mb-9 text-sm leading-8 text-gray-600 sm:text-base">

                            Our platform combines thoughtful design
                            with practical technology to create a
                            seamless shopping experience.

                            From product discovery to order management,
                            every feature is built with shoppers in mind.

                        </p>

                        {/* MISSION & VISION */}

                        <div className="grid gap-5 sm:grid-cols-2">

                            <div className="about-mission-card">

                                <div className="about-small-icon">

                                    <HiOutlineCheckCircle size={25} />

                                </div>

                                <h3 className="mb-2 text-lg font-bold text-[#172B1B]">
                                    Our Mission
                                </h3>

                                <p className="text-sm leading-7 text-gray-500">

                                    To simplify everyday shopping
                                    through modern and accessible
                                    technology.

                                </p>

                            </div>

                            <div className="about-mission-card">

                                <div className="about-small-icon">

                                    <HiOutlineSparkles size={25} />

                                </div>

                                <h3 className="mb-2 text-lg font-bold text-[#172B1B]">
                                    Our Vision
                                </h3>

                                <p className="text-sm leading-7 text-gray-500">

                                    To create a digital shopping
                                    experience that customers
                                    genuinely enjoy.

                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ========================================
                SECTION 3: WHY CHOOSE SHOPERY
            ======================================== */}

            <section className="bg-[#F8FBF8] py-20 sm:py-24 lg:py-28">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    {/* HEADING */}

                    <div className="mx-auto mb-14 max-w-2xl text-center">

                        <div className="about-section-label mb-5">
                            WHY CHOOSE SHOPERY
                        </div>

                        <h2 className="about-section-title mb-5">
                            Shopping That Feels Better
                        </h2>

                        <p className="text-sm leading-8 text-gray-500 sm:text-base">

                            Everything we do is focused on creating
                            a simple, convenient, and enjoyable
                            shopping experience.

                        </p>

                    </div>

                    {/* FEATURE GRID */}

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                        {features.map((feature) => {

                            const Icon = feature.icon;

                            return (

                                <div
                                    key={feature.id}
                                    className="about-feature-card group"
                                >

                                    <div className="about-feature-icon">

                                        <Icon size={27} />

                                    </div>

                                    <h3 className="mb-3 text-lg font-bold text-[#172B1B] sm:text-xl">

                                        {feature.title}

                                    </h3>

                                    <p className="text-sm leading-7 text-gray-500">

                                        {feature.description}

                                    </p>

                                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#00B207]">

                                        Built for You

                                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </div>

            </section>

            {/* ========================================
                SECTION 4: SHOPPING EXPERIENCE
            ======================================== */}

            <section className="py-20 sm:py-24 lg:py-28">

                <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">

                    {/* CONTENT */}

                    <div>

                        <div className="about-section-label mb-5">
                            YOUR SHOPPING EXPERIENCE
                        </div>

                        <h2 className="about-section-title mb-6">

                            You Shop.

                            <span className="block text-[#00B207]">
                                We Make It Simple.
                            </span>

                        </h2>

                        <p className="mb-8 text-sm leading-8 text-gray-600 sm:text-base">

                            Online shopping should save your time,
                            not make things complicated.

                            At Shopery, we focus on bringing
                            everything together in one
                            easy-to-use shopping platform.

                        </p>

                        {/* BENEFITS */}

                        <div className="mb-10 space-y-5">

                            {benefits.map((benefit, index) => (

                                <div
                                    key={index}
                                    className="flex items-start gap-4"
                                >

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100 text-[#00B207]">

                                        <HiOutlineCheckCircle size={21} />

                                    </div>

                                    <p className="pt-1 text-sm leading-7 text-gray-600 sm:text-base">

                                        {benefit}

                                    </p>

                                </div>

                            ))}

                        </div>

                        <Link
                            to="/shop"
                            className="about-primary-btn"
                        >

                            Start Shopping

                            <HiOutlineArrowRight size={21} />

                        </Link>

                    </div>

                    {/* IMAGE */}

                    <div className="relative">

                        <div className="about-delivery-image relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#F1FAF1] to-[#E5F5E5] p-7 sm:p-12">

                            <img
                                src="https://i.ibb.co/Rb2wbzX/mann.png"
                                alt="Shopery convenient shopping experience"
                                loading="lazy"
                                className="mx-auto w-full max-w-lg object-contain"
                            />

                        </div>

                        <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-lg sm:bottom-8 sm:left-8">

                            <div className="rounded-xl bg-green-100 p-3 text-[#00B207]">

                                <FiPackage size={23} />

                            </div>

                            <div>

                                <h3 className="text-sm font-bold text-gray-800">
                                    Simple Ordering
                                </h3>

                                <p className="text-xs text-gray-500">
                                    Browse. Order. Enjoy.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ========================================
                SECTION 5: BRAND CTA
            ======================================== */}

            <section className="px-4 py-8 sm:px-6 lg:px-8">

                <div className="about-cta relative mx-auto max-w-7xl overflow-hidden rounded-[28px] px-6 py-14 text-center sm:rounded-[36px] sm:px-12 sm:py-20">

                    <div className="about-cta-circle about-cta-circle-one"></div>
                    <div className="about-cta-circle about-cta-circle-two"></div>

                    <div className="relative z-10 mx-auto max-w-2xl">

                        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-green-100">

                            <HiOutlineSparkles size={16} />

                            Discover Shopery

                        </div>

                        <h2 className="mb-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">

                            Ready for a Better

                            <span className="block text-[#B8FFBD]">
                                Shopping Experience?
                            </span>

                        </h2>

                        <p className="mx-auto mb-9 max-w-xl text-sm leading-8 text-green-50/90 sm:text-base">

                            Discover products, explore new favorites,
                            and experience online shopping designed
                            around your convenience.

                        </p>

                        <Link
                            to="/shop"
                            className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-bold text-[#08750D] transition-all duration-300 hover:-translate-y-1 hover:bg-green-50"
                        >

                            Explore Products

                            <HiOutlineArrowRight size={21} />

                        </Link>

                    </div>

                </div>

            </section>

            {/* ========================================
                SECTION 6: OUR TEAM
            ======================================== */}

            <OurTeam />

            {/* ========================================
                SECTION 7: TESTIMONIALS
            ======================================== */}

            <Testimonial />

            {/* ========================================
                SECTION 8: SPONSORS
            ======================================== */}

            <Sponsor />

            {/* ========================================
                SECTION 9: NEWSLETTER
            ======================================== */}

            

        </main>
    );
};

export default About;