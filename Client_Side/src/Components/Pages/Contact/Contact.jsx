import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
    HiOutlineHome,
    HiOutlineArrowRight,
    HiOutlineSparkles,
    HiOutlineCheckCircle,
} from "react-icons/hi2";

import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiSend,
    FiClock,
    FiMessageCircle,
    FiArrowUpRight,
} from "react-icons/fi";

//import Newsletter from "../Shop/Products/Newsletter";

import "./contact.css";

// ========================================
// CONTACT INFORMATION
// ========================================

// Replace these details with Shopery's official contact information.

const contactInfo = {
    location: "Chattogram, Bangladesh",

    emails: [
        "azadcoxgmtl@gmail.com",
        "saiful6170@gmail.com",
    ],

    phones: [
        "+8801848396170",
    ],
};

// ========================================
// MAP CONFIGURATION
// ========================================

// Example location: Chattogram city center.
// Replace with your actual business coordinates.

const mapLocation = {
    lat: 22.3569,
    lng: 91.7832,
};

const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    mapLocation.lng - 0.025
}%2C${
    mapLocation.lat - 0.018
}%2C${
    mapLocation.lng + 0.025
}%2C${
    mapLocation.lat + 0.018
}&layer=mapnik&marker=${mapLocation.lat}%2C${mapLocation.lng}`;

const mapViewUrl = `https://www.openstreetmap.org/?mlat=${mapLocation.lat}&mlon=${mapLocation.lng}#map=15/${mapLocation.lat}/${mapLocation.lng}`;

// ========================================
// CONTACT CARDS
// ========================================

const contactCards = [
    {
        id: 1,
        icon: FiMapPin,
        title: "Our Location",
        description: "Find us here",
        content: contactInfo.location,
        type: "location",
    },
    {
        id: 2,
        icon: FiMail,
        title: "Email Address",
        description: "Drop us an email",
        content: contactInfo.emails,
        type: "email",
    },
    {
        id: 3,
        icon: FiPhone,
        title: "Phone Number",
        description: "Give us a call",
        content: contactInfo.phones,
        type: "phone",
    },
];

// ========================================
// CONTACT COMPONENT
// ========================================

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Please enter your name.";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Please enter your email.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Please enter a valid email.";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "Please enter a subject.";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Please enter your message.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Opens the visitor's default email application.
        // A backend contact-message API can replace this later.

        const recipient = contactInfo.emails[0];

        const subject = encodeURIComponent(
            `Shopery Contact: ${formData.subject}`
        );

        const body = encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        );

        window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
    };

    return (
        <main className="shopery-contact nunito_sans overflow-x-hidden bg-white">

            <Helmet>
                <title>Contact Us | Shopery</title>

                <meta
                    name="description"
                    content="Get in touch with Shopery. Contact us for questions, support, feedback, or general inquiries."
                />
            </Helmet>

            {/* =====================================
                HERO SECTION
            ===================================== */}

            <section className="contact-hero relative overflow-hidden">

                <div className="contact-hero-glow contact-hero-glow-one"></div>

                <div className="contact-hero-glow contact-hero-glow-two"></div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">

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
                            Contact Us
                        </span>

                    </nav>

                    {/* Hero Content */}

                    <div className="mx-auto max-w-3xl text-center">

                        <div className="contact-badge mb-6">

                            <HiOutlineSparkles size={17} />

                            <span>WE'D LOVE TO HEAR FROM YOU</span>

                        </div>

                        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-[#172B1B] sm:text-5xl lg:text-6xl">

                            Let's Start a

                            <span className="block contact-gradient-text">
                                Conversation.
                            </span>

                        </h1>

                        <p className="mx-auto mb-8 max-w-2xl text-base leading-8 text-gray-600 sm:text-lg">

                            Have a question, suggestion, or feedback?
                            We're here to listen.

                            Reach out to Shopery and let us know
                            how we can help make your shopping
                            experience even better.

                        </p>

                        <a
                            href="#contact-form"
                            className="contact-primary-btn"
                        >

                            Send Us a Message

                            <HiOutlineArrowRight size={20} />

                        </a>

                    </div>

                </div>

            </section>

            {/* =====================================
                CONTACT INFORMATION
            ===================================== */}

            <section className="py-16 sm:py-20 lg:py-24">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="mx-auto mb-12 max-w-2xl text-center">

                        <div className="contact-section-label mb-4">
                            GET IN TOUCH
                        </div>

                        <h2 className="contact-section-title mb-5">
                            We're Here to Help
                        </h2>

                        <p className="text-sm leading-8 text-gray-500 sm:text-base">

                            Choose the most convenient way to
                            connect with us.

                        </p>

                    </div>

                    <div className="grid gap-6 md:grid-cols-3">

                        {contactCards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div
                                    key={card.id}
                                    className="contact-info-card group"
                                >

                                    <div className="contact-info-icon">

                                        <Icon size={27} />

                                    </div>

                                    <h3 className="mb-2 text-xl font-bold text-[#172B1B]">

                                        {card.title}

                                    </h3>

                                    <p className="mb-5 text-sm text-gray-400">

                                        {card.description}

                                    </p>

                                    {card.type === "location" && (

                                        <p className="text-sm font-medium leading-7 text-gray-600">

                                            {card.content}

                                        </p>

                                    )}

                                    {card.type === "email" && (

                                        <div className="space-y-2">

                                            {card.content.map((email) => (

                                                <a
                                                    key={email}
                                                    href={`mailto:${email}`}
                                                    className="block break-all text-sm font-medium text-gray-600 transition-colors hover:text-[#00B207]"
                                                >

                                                    {email}

                                                </a>

                                            ))}

                                        </div>

                                    )}

                                    {card.type === "phone" && (

                                        <div className="space-y-2">

                                            {card.content.map((phone) => (

                                                <a
                                                    key={phone}
                                                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                                                    className="block text-sm font-medium text-gray-600 transition-colors hover:text-[#00B207]"
                                                >

                                                    {phone}

                                                </a>

                                            ))}

                                        </div>

                                    )}

                                </div>
                            );
                        })}

                    </div>

                </div>

            </section>

            {/* =====================================
                CONTACT FORM
            ===================================== */}

            <section
                id="contact-form"
                className="scroll-mt-20 bg-[#F8FBF8] py-16 sm:py-20 lg:py-24"
            >

                <div className="mx-auto grid max-w-7xl items-start gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:gap-16 lg:px-8">

                    {/* LEFT CONTENT */}

                    <div className="lg:col-span-2">

                        <div className="contact-section-label mb-5">
                            SEND A MESSAGE
                        </div>

                        <h2 className="contact-section-title mb-6">

                            Have Something

                            <span className="block text-[#00B207]">
                                On Your Mind?
                            </span>

                        </h2>

                        <p className="mb-8 text-sm leading-8 text-gray-600 sm:text-base">

                            Whether you have a question about our
                            products, need help with an order,
                            or simply want to share your thoughts,
                            we'd love to hear from you.

                        </p>

                        <div className="space-y-5">

                            <div className="flex items-start gap-4">

                                <div className="contact-benefit-icon">

                                    <FiMessageCircle size={21} />

                                </div>

                                <div>

                                    <h3 className="mb-1 font-bold text-[#172B1B]">
                                        Questions & Feedback
                                    </h3>

                                    <p className="text-sm leading-7 text-gray-500">

                                        Share your questions, ideas,
                                        and suggestions with us.

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-4">

                                <div className="contact-benefit-icon">

                                    <FiClock size={21} />

                                </div>

                                <div>

                                    <h3 className="mb-1 font-bold text-[#172B1B]">
                                        Contact Anytime
                                    </h3>

                                    <p className="text-sm leading-7 text-gray-500">

                                        Send your message whenever
                                        it's convenient for you.

                                    </p>

                                </div>

                            </div>

                            <div className="flex items-start gap-4">

                                <div className="contact-benefit-icon">

                                    <HiOutlineCheckCircle size={22} />

                                </div>

                                <div>

                                    <h3 className="mb-1 font-bold text-[#172B1B]">
                                        Easy Communication
                                    </h3>

                                    <p className="text-sm leading-7 text-gray-500">

                                        Get in touch using a simple
                                        and user-friendly contact form.

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT FORM */}

                    <div className="lg:col-span-3">

                        <div className="contact-form-card">

                            <div className="mb-8">

                                <h3 className="mb-2 text-2xl font-extrabold text-[#172B1B]">

                                    Just Say Hello!

                                </h3>

                                <p className="text-sm leading-7 text-gray-500">

                                    Fill out the form below to compose
                                    an email to Shopery.

                                </p>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="space-y-6"
                            >

                                {/* NAME + EMAIL */}

                                <div className="grid gap-5 sm:grid-cols-2">

                                    <div>

                                        <label
                                            htmlFor="contact-name"
                                            className="contact-label"
                                        >
                                            Full Name
                                        </label>

                                        <input
                                            id="contact-name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Enter your full name"
                                            autoComplete="name"
                                            className="contact-input"
                                        />

                                        {errors.name && (
                                            <p className="mt-2 text-xs text-red-500">
                                                {errors.name}
                                            </p>
                                        )}

                                    </div>

                                    <div>

                                        <label
                                            htmlFor="contact-email"
                                            className="contact-label"
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            id="contact-email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Enter your email"
                                            autoComplete="email"
                                            className="contact-input"
                                        />

                                        {errors.email && (
                                            <p className="mt-2 text-xs text-red-500">
                                                {errors.email}
                                            </p>
                                        )}

                                    </div>

                                </div>

                                {/* SUBJECT */}

                                <div>

                                    <label
                                        htmlFor="contact-subject"
                                        className="contact-label"
                                    >
                                        Subject
                                    </label>

                                    <input
                                        id="contact-subject"
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="What is this about?"
                                        className="contact-input"
                                    />

                                    {errors.subject && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {errors.subject}
                                        </p>
                                    )}

                                </div>

                                {/* MESSAGE */}

                                <div>

                                    <label
                                        htmlFor="contact-message"
                                        className="contact-label"
                                    >
                                        Your Message
                                    </label>

                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Write your message here..."
                                        rows={6}
                                        className="contact-input resize-none"
                                    ></textarea>

                                    {errors.message && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {errors.message}
                                        </p>
                                    )}

                                </div>

                                {/* SUBMIT */}

                                <button
                                    type="submit"
                                    className="contact-primary-btn w-full sm:w-auto"
                                >

                                    Compose Email

                                    <FiSend size={18} />

                                </button>

                                <p className="text-xs leading-6 text-gray-400">
                                    This opens your email application.
                                    Your message is not sent automatically.
                                </p>

                            </form>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================
                LOCATION & MAP
            ===================================== */}

            <section className="py-16 sm:py-20 lg:py-24">

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

                    <div className="mx-auto mb-12 max-w-2xl text-center">

                        <div className="contact-section-label mb-4">
                            FIND OUR LOCATION
                        </div>

                        <h2 className="contact-section-title mb-5">
                            Find Us on the Map
                        </h2>

                        <p className="text-sm leading-8 text-gray-500 sm:text-base">

                            Explore our location on the map below.

                        </p>

                    </div>

                    <div className="contact-map-wrapper">

                        <iframe
                            title="Shopery Location Map"
                            src={mapEmbedUrl}
                            width="100%"
                            height="450"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="contact-map-frame"
                        ></iframe>

                    </div>

                    <div className="mt-7 flex flex-col items-center justify-between gap-5 rounded-2xl border border-green-100 bg-[#F8FBF8] p-5 sm:flex-row sm:p-6">

                        <div className="flex items-center gap-4">

                            <div className="contact-benefit-icon">

                                <FiMapPin size={22} />

                            </div>

                            <div>

                                <h3 className="font-bold text-[#172B1B]">
                                    Chattogram, Bangladesh
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Map preview location
                                </p>

                            </div>

                        </div>

                        <a
                            href={mapViewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#00B207] transition-colors hover:text-[#008A05]"
                        >

                            View Larger Map

                            <FiArrowUpRight size={19} />

                        </a>

                    </div>

                </div>

            </section>

            {/* =====================================
                NEWSLETTER
            ===================================== */}

            

        </main>
    );
};

export default Contact;