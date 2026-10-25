
import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

import "./follow.css";

const instagramPosts = [
    {
        id: 1,
        image: "https://i.ibb.co/80P8Mcp/01.png",
        alt: "Shopery Instagram gallery image 1",
    },
    {
        id: 2,
        image: "https://i.ibb.co/KbJ05Jy/02.png",
        alt: "Shopery Instagram gallery image 2",
    },
    {
        id: 3,
        image: "https://i.ibb.co/pPcwFZ8/03.png",
        alt: "Shopery Instagram gallery image 3",
    },
    {
        id: 4,
        image: "https://i.ibb.co/4JH2jwm/04.png",
        alt: "Shopery Instagram gallery image 4",
    },
    {
        id: 5,
        image: "https://i.ibb.co/1nQssFH/05.png",
        alt: "Shopery Instagram gallery image 5",
    },
];

const INSTAGRAM_URL = "https://www.instagram.com/";

const Follow = () => {
    return (
        <section className="shopery-follow-section">
            <div className="shopery-follow-container">

                {/* Section Heading */}

                <div className="shopery-follow-heading">
                    <span className="shopery-follow-subtitle">
                        JOIN OUR COMMUNITY
                    </span>

                    <h2>
                        Follow Us on <span>Instagram</span>
                    </h2>

                    <p>
                        Stay inspired with fresh finds, exciting
                        updates, and moments from Shopery.
                    </p>
                </div>

                {/* Instagram Gallery */}

                <div className="shopery-instagram-grid">
                    {instagramPosts.map((post, index) => (
                        <div
                            key={post.id}
                            className="shopery-instagram-card"
                            data-aos="zoom-in"
                            data-aos-delay={index * 70}
                            data-aos-duration="700"
                        >
                            <img
                                src={post.image}
                                alt={post.alt}
                                className="shopery-instagram-image"
                                loading="lazy"
                            />

                            <div className="shopery-instagram-overlay">
                                <a
                                    href={INSTAGRAM_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shopery-instagram-icon"
                                    aria-label="Visit Instagram"
                                >
                                    <FaInstagram />
                                </a>

                                <span className="shopery-instagram-overlay-text">
                                    Follow Shopery
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Follow Button */}

                <div className="shopery-follow-bottom">
                    <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shopery-follow-button"
                    >
                        <FaInstagram />

                        <span>Follow on Instagram</span>

                        <FaArrowRight className="shopery-follow-button-arrow" />
                    </a>
                </div>

            </div>
        </section>
    );
};

export default Follow;
