
import { FaShoppingBag } from "react-icons/fa";
import "./Layout.css";

const Loader = () => {
    return (
        <div
            className="shopery-loader"
            role="status"
            aria-label="Loading Shopery"
        >
            <div className="shopery-loader-content">
                <div className="shopery-loader-visual">
                    <div className="shopery-loader-ring">
                        <div className="shopery-loader-ring-inner" />
                    </div>

                    <div className="shopery-loader-orbit shopery-orbit-one" />
                    <div className="shopery-loader-orbit shopery-orbit-two" />

                    <div className="shopery-loader-bag">
                        <div className="shopery-loader-bag-handle" />
                        <FaShoppingBag className="shopery-loader-bag-icon" />
                        <span className="shopery-loader-shine" />
                    </div>

                    <span className="shopery-loader-spark spark-one" />
                    <span className="shopery-loader-spark spark-two" />
                    <span className="shopery-loader-spark spark-three" />
                    <span className="shopery-loader-spark spark-four" />
                </div>

                <div className="shopery-loader-brand">
                    Shop<span>ery</span>
                </div>

                <p className="shopery-loader-tagline">
                    Better Products <span>•</span> Happier You
                </p>

                <p className="shopery-loader-message">
                    Loading your favorite products
                    <span className="shopery-loader-ellipsis">
                        <i>.</i>
                        <i>.</i>
                        <i>.</i>
                    </span>
                </p>

                <div
                    className="shopery-loader-dots"
                    aria-hidden="true"
                >
                    <span />
                    <span />
                    <span />
                    <span />
                </div>
            </div>
        </div>
    );
};

export default Loader;