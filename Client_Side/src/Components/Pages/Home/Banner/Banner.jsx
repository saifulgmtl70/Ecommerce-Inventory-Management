import { useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";

import {
    FaArrowRight,
    FaLeaf,
    FaShippingFast,
    FaShieldAlt,
} from "react-icons/fa";

import { BsStars } from "react-icons/bs";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import "./Banner.css";


const slides = [
    {
        id: 1,
        eyebrow: "WELCOME TO SHOPERY",
        title: "Fresh Choices.",
        highlight: "Better Living.",
        description:
            "Discover your everyday essentials, explore exciting products and enjoy a smoother shopping experience with Shopery.",
        image:
            "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=85",
        imageAlt: "Fresh vegetables and grocery products",
        label: "FRESH PICKS",
        number: "01",
    },
    {
        id: 2,
        eyebrow: "DISCOVER SOMETHING NEW",
        title: "Your Favorites.",
        highlight: "One Destination.",
        description:
            "Explore our collection, find products that match your needs and make every shopping decision with confidence.",
        image:
            "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1600&q=85",
        imageAlt: "Fashion products available for online shopping",
        label: "EXPLORE MORE",
        number: "02",
    },
    {
        id: 3,
        eyebrow: "SPECIAL OFFERS AWAIT",
        title: "Smart Shopping.",
        highlight: "Great Deals.",
        description:
            "Discover selected products, check out exciting offers and find more reasons to enjoy shopping with Shopery.",
        image:
            "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1600&q=85",
        imageAlt: "Shopping bags and online shopping products",
        label: "SHOP SMARTER",
        number: "03",
    },
];


const Banner = () => {
    const swiperRef = useRef(null);

    return (
        <section className="shopery-banner" aria-label="Shopery featured products">

            <Swiper
                modules={[Autoplay, EffectFade, Pagination]}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                }}
                effect="fade"
                fadeEffect={{
                    crossFade: true,
                }}
                loop
                speed={800}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                    el: ".shopery-banner-pagination",
                }}
                className="shopery-banner-swiper"
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="shopery-banner-slide">

                            {/* Background image */}
                            <div
                                className="shopery-banner-image"
                                style={{
                                    backgroundImage: `url("${slide.image}")`,
                                }}
                                role="img"
                                aria-label={slide.imageAlt}
                            />

                            <div className="shopery-banner-overlay" />

                            {/* Decorative elements */}
                            <div className="shopery-banner-decoration shopery-banner-decoration-one" />
                            <div className="shopery-banner-decoration shopery-banner-decoration-two" />

                            <div className="shopery-banner-container">

                                <div className="shopery-banner-content">

                                    <div className="shopery-banner-eyebrow">
                                        <BsStars />
                                        <span>{slide.eyebrow}</span>
                                    </div>

                                    <h1 className="shopery-banner-title">
                                        {slide.title}
                                        <span>{slide.highlight}</span>
                                    </h1>

                                    <p className="shopery-banner-description">
                                        {slide.description}
                                    </p>

                                    <div className="shopery-banner-actions">

                                        <Link
                                            to="/shop"
                                            className="shopery-banner-primary-btn"
                                        >
                                            Shop Now
                                            <FaArrowRight />
                                        </Link>

                                        <Link
                                            to="/about"
                                            className="shopery-banner-secondary-btn"
                                        >
                                            Discover Shopery
                                        </Link>

                                    </div>

                                    {/* Trust indicators */}
                                    <div className="shopery-banner-benefits">

                                        <div className="shopery-banner-benefit">
                                            <span>
                                                <FaLeaf />
                                            </span>
                                            <div>
                                                <strong>Quality Products</strong>
                                                <small>Selected with care</small>
                                            </div>
                                        </div>

                                        <div className="shopery-banner-benefit">
                                            <span>
                                                <FaShippingFast />
                                            </span>
                                            <div>
                                                <strong>Easy Shopping</strong>
                                                <small>Convenience first</small>
                                            </div>
                                        </div>

                                        <div className="shopery-banner-benefit">
                                            <span>
                                                <FaShieldAlt />
                                            </span>
                                            <div>
                                                <strong>Shop Confidently</strong>
                                                <small>Customer focused</small>
                                            </div>
                                        </div>

                                    </div>

                                </div>


                                {/* Right-side floating card */}
                                <div className="shopery-banner-side">

                                    <div className="shopery-banner-product-card">

                                        <div className="shopery-banner-product-image">
                                            <img
                                                src={slide.image}
                                                alt={slide.imageAlt}
                                                loading={slide.id === 1 ? "eager" : "lazy"}
                                            />

                                            <span className="shopery-banner-product-tag">
                                                <BsStars />
                                                {slide.label}
                                            </span>
                                        </div>

                                        <div className="shopery-banner-product-info">
                                            <span>THE SHOPERY EXPERIENCE</span>
                                            <h3>Discover more. Shop better.</h3>

                                            <Link to="/shop">
                                                Explore collection
                                                <FaArrowRight />
                                            </Link>
                                        </div>

                                    </div>

                                    <div className="shopery-banner-floating-note">
                                        <span className="shopery-banner-note-icon">
                                            <FaLeaf />
                                        </span>

                                        <div>
                                            <strong>Made for your needs</strong>
                                            <small>Explore our collection</small>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            {/* Slide number */}
                            <div className="shopery-banner-slide-number">
                                <span>{slide.number}</span>
                                <span className="shopery-banner-slide-line" />
                                <span>03</span>
                            </div>

                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>


            {/* Custom controls */}
            <div className="shopery-banner-controls">

                <button
                    type="button"
                    className="shopery-banner-control"
                    onClick={() => swiperRef.current?.slidePrev()}
                    aria-label="Previous slide"
                >
                    <FaArrowRight className="shopery-banner-prev-icon" />
                </button>

                <div className="shopery-banner-pagination" />

                <button
                    type="button"
                    className="shopery-banner-control"
                    onClick={() => swiperRef.current?.slideNext()}
                    aria-label="Next slide"
                >
                    <FaArrowRight />
                </button>

            </div>

        </section>
    );
};

export default Banner;