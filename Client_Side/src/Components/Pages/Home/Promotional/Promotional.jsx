import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { FaRegClock, FaTag } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

import "./Promotional.css";

const SALE_DURATION = 3 * 24 * 60 * 60 * 1000;

const getSaleEndTime = () => {
    const savedEndTime = localStorage.getItem("shoperySaleEndTime");

    if (savedEndTime && Number(savedEndTime) > Date.now()) {
        return Number(savedEndTime);
    }

    const newEndTime = Date.now() + SALE_DURATION;
    localStorage.setItem("shoperySaleEndTime", String(newEndTime));

    return newEndTime;
};

const Promotional = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: "03",
        hours: "00",
        minutes: "00",
        seconds: "00",
    });

    useEffect(() => {
        const endTime = getSaleEndTime();

        const updateCountdown = () => {
            const remaining = Math.max(0, endTime - Date.now());

            const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
            const hours = Math.floor(
                (remaining / (1000 * 60 * 60)) % 24
            );
            const minutes = Math.floor(
                (remaining / (1000 * 60)) % 60
            );
            const seconds = Math.floor((remaining / 1000) % 60);

            setTimeLeft({
                days: String(days).padStart(2, "0"),
                hours: String(hours).padStart(2, "0"),
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0"),
            });
        };

        updateCountdown();

        const timer = setInterval(updateCountdown, 1000);

        return () => clearInterval(timer);
    }, []);

    const promotions = [
        {
            id: 1,
            className: "prom_2",
            label: "85% Fat Free",
            title: "Low-Fat Meat",
            description: (
                <>
                    Started at <span className="prom-price">$79.99</span>
                </>
            ),
            buttonText: "Shop Now",
            theme: "light",
        },
        {
            id: 2,
            className: "prom_3",
            label: "Summer Sale",
            title: "100% Fresh Fruit",
            description: (
                <>
                    Up to{" "}
                    <span className="prom-discount">64% OFF</span>
                </>
            ),
            buttonText: "Shop Now",
            theme: "dark",
        },
    ];

    return (
        <section
            className="promotional-section nunito_sans"
            data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom"
            aria-label="Shopery special offers"
        >
            <Helmet>
                <meta
                    name="description"
                    content="Explore Shopery special offers, fresh fruit discounts and low-fat meat deals."
                />
            </Helmet>

            <div className="promotional-container">
                {/* Sale of the Month */}
                <article className="promotional-card prom_1">
                    <div className="promotional-overlay" />

                    <div className="promotional-content promotional-content-light">
                        <span className="promotional-label">
                            <FaTag aria-hidden="true" />
                            Best Deals
                        </span>

                        <h2>Sale of the Month</h2>

                        <p className="promotional-description">
                            Don't miss our special offers!
                        </p>

                        <div
                            className="promotional-countdown"
                            aria-label={`Time remaining: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`}
                        >
                            {[
                                { label: "Days", value: timeLeft.days },
                                { label: "Hours", value: timeLeft.hours },
                                { label: "Mins", value: timeLeft.minutes },
                                { label: "Secs", value: timeLeft.seconds },
                            ].map((item, index) => (
                                <React.Fragment key={item.label}>
                                    {index > 0 && (
                                        <span
                                            className="countdown-separator"
                                            aria-hidden="true"
                                        >
                                            :
                                        </span>
                                    )}

                                    <div className="countdown-item">
                                        <span className="countdown-number">
                                            {item.value}
                                        </span>
                                        <span className="countdown-label">
                                            {item.label}
                                        </span>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>

                        <Link to="/shop" className="promotional-button">
                            Shop Now
                            <MdOutlineArrowRightAlt aria-hidden="true" />
                        </Link>
                    </div>
                </article>

                {/* Additional promotional offers */}
                {promotions.map((promotion) => (
                    <article
                        key={promotion.id}
                        className={`promotional-card ${promotion.className}`}
                    >
                        <div className="promotional-overlay" />

                        <div
                            className={`promotional-content ${
                                promotion.theme === "light"
                                    ? "promotional-content-light"
                                    : "promotional-content-dark"
                            }`}
                        >
                            <span className="promotional-label">
                                {promotion.label}
                            </span>

                            <h2>{promotion.title}</h2>

                            <p className="promotional-description">
                                {promotion.description}
                            </p>

                            <Link to="/shop" className="promotional-button">
                                {promotion.buttonText}
                                <MdOutlineArrowRightAlt aria-hidden="true" />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Promotional;