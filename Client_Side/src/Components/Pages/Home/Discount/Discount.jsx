import { Link } from "react-router-dom";
import {
    MdOutlineArrowRightAlt,
    MdLocalShipping,
    MdVerifiedUser,
    MdLocalOffer,
} from "react-icons/md";

import "./Discount.css";

const Discount = () => {
    return (
        <section className="discount-section">
            <div className="discount-banner">
                {/* Decorative Elements */}
                <div className="discount-decoration discount-decoration-one"></div>
                <div className="discount-decoration discount-decoration-two"></div>

                {/* Sale Content */}
                <div className="discount-content">
                    <div className="discount-badge">
                        <MdLocalOffer />
                        <span>LIMITED TIME OFFER</span>
                    </div>

                    <p className="discount-subtitle">
                        MAKE YOUR SUMMER SPECIAL
                    </p>

                    <h2 className="discount-title">
                        Summer
                        <br />
                        Sale <span>37%</span>
                        <br />
                        OFF
                    </h2>

                    <p className="discount-description">
                        Discover amazing deals on your favorite products.
                        <br className="discount-desktop-break" />
                        Shop now and enjoy more for less!
                    </p>

                    {/* Benefits */}
                    <div className="discount-benefits">
                        <div className="discount-benefit">
                            <MdLocalShipping />
                            <span>Free Shipping</span>
                        </div>

                        <div className="discount-benefit">
                            <MdVerifiedUser />
                            <span>30-Day Guarantee</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <Link to="/shop" className="discount-button">
                        <span>Shop Now</span>
                        <MdOutlineArrowRightAlt />
                    </Link>

                    <p className="discount-footer-text">
                        Great products. Better prices. Only at Shopery.
                    </p>
                </div>

                {/* Discount Highlight */}
                <div className="discount-highlight" aria-label="37 percent off">
                    <div className="discount-highlight-inner">
                        <span className="discount-highlight-up-to">
                            SAVE UP TO
                        </span>

                        <span className="discount-highlight-number">
                            37<span>%</span>
                        </span>

                        <span className="discount-highlight-label">
                            OFF
                        </span>

                        <div className="discount-highlight-line"></div>

                        <span className="discount-highlight-brand">
                            SHOPERY DEALS
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Discount;