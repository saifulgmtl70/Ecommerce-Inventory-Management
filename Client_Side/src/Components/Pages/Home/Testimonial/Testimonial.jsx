
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "./testimonials.css";
import { RiDoubleQuotesR } from "react-icons/ri";
import { FaStar, FaArrowRight, FaArrowLeft } from "react-icons/fa6";

const testimonials = [
    {
        name: "Robert Fox",
        role: "Customer",
        message:
            "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget.",
        image: "https://i.ibb.co/4p5Nb9B/customer-1.png",
        rating: 5,
    },
    {
        name: "Dianne Russell",
        role: "Customer",
        message:
            "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget.",
        image: "https://i.ibb.co/HtG1Yh5/customr-2.png",
        rating: 5,
    },
    {
        name: "Eleanor Pena",
        role: "Customer",
        message:
            "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget.",
        image: "https://i.ibb.co/HtG1Yh5/customr-2.png",
        rating: 5,
    },
];

const NextArrow = ({ onClick }) => (
    <button
        type="button"
        className="testimonial-arrow testimonial-arrow-next"
        onClick={onClick}
        aria-label="Next testimonial"
    >
        <FaArrowRight />
    </button>
);

const PrevArrow = ({ onClick }) => (
    <button
        type="button"
        className="testimonial-arrow testimonial-arrow-prev"
        onClick={onClick}
        aria-label="Previous testimonial"
    >
        <FaArrowLeft />
    </button>
);

const Testimonial = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    return (
        <section className="shopery-testimonial-section">
            <div className="testimonial-container">
                <div className="testimonial-heading">
                    <span className="testimonial-eyebrow">
                        CUSTOMER FEEDBACK
                    </span>

                    <h2>
                        What Our <span>Customers Say</span>
                    </h2>

                    <p>
                        Discover what our customers think about their
                        shopping experience with Shopery.
                    </p>
                </div>

                <div className="testimonial-slider-wrapper">
                    <Slider {...settings}>
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={`${testimonial.name}-${index}`}
                                className="testimonial-slide"
                            >
                                <article className="testimonial-card">
                                    <div className="testimonial-card-top">
                                        <div className="testimonial-quote-icon">
                                            <RiDoubleQuotesR />
                                        </div>

                                        <div
                                            className="testimonial-stars"
                                            aria-label={`${testimonial.rating} out of 5 stars`}
                                        >
                                            {[...Array(testimonial.rating)].map(
                                                (_, i) => (
                                                    <FaStar key={i} />
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <p className="testimonial-message">
                                        “{testimonial.message}”
                                    </p>

                                    <div className="testimonial-divider" />

                                    <div className="testimonial-customer">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            className="testimonial-avatar"
                                            loading="lazy"
                                        />

                                        <div className="testimonial-customer-info">
                                            <h3>{testimonial.name}</h3>
                                            <span>{testimonial.role}</span>
                                        </div>

                                        <div className="testimonial-verified">
                                            <span className="testimonial-verified-dot" />
                                            Customer
                                        </div>
                                    </div>
                                </article>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default Testimonial;
