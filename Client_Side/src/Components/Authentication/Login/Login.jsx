import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiArrowLeft,
    FiX,
    FiShoppingBag,
    FiShield,
    FiTruck,
    FiHeadphones,
    FiCheckCircle,
} from "react-icons/fi";

import useAuth from "../../Hooks/useAuth";
import Sociallogin from "../Sociallogin/Sociallogin";

import "../Auth/auth.css";

const Login = () => {
    const { signIn } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [isResetting, setIsResetting] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const getLoginError = (error) => {
        switch (error?.code) {
            case "auth/invalid-email":
                return "Please enter a valid email address.";

            case "auth/invalid-credential":
            case "auth/wrong-password":
            case "auth/user-not-found":
                return "Invalid email or password.";

            case "auth/user-disabled":
                return "This account has been disabled.";

            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";

            case "auth/network-request-failed":
                return "Network error. Please check your connection.";

            default:
                return "Unable to sign in. Please try again.";
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!email.trim() || !password) {
            toast.warning("Please enter your email and password.");
            return;
        }

        setIsSubmitting(true);

        try {
            await signIn(email.trim(), password);

            toast.success("Welcome back! Login successful.");

            navigate(from, { replace: true });
        } catch (error) {
            toast.error(getLoginError(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const openResetModal = () => {
        setResetEmail(email);
        setResetSent(false);
        setShowResetModal(true);
    };

    const closeResetModal = () => {
        if (isResetting) return;

        setShowResetModal(false);
        setResetSent(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (isResetting) return;

        const trimmedEmail = resetEmail.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
            toast.error("Please enter a valid email address.");
            return;
        }

        setIsResetting(true);

        try {
            const auth = getAuth();

            await sendPasswordResetEmail(auth, trimmedEmail);

            setResetSent(true);

            toast.success("Password reset request completed.");
        } catch (error) {
            if (error.code === "auth/invalid-email") {
                toast.error("Please enter a valid email address.");
            } else if (error.code === "auth/too-many-requests") {
                toast.error("Too many requests. Please try again later.");
            } else if (error.code === "auth/network-request-failed") {
                toast.error("Please check your internet connection.");
            } else {
                toast.error("Unable to process your request. Try again.");
            }
        } finally {
            setIsResetting(false);
        }
    };

    return (
        <main className="shopery-auth nunito_sans">
            <Helmet>
                <title>Login | Shopery</title>
                <meta
                    name="description"
                    content="Sign in to your Shopery account to manage orders, wishlist, cart and shopping preferences."
                />
            </Helmet>

            <ToastContainer position="top-center" autoClose={3000} />

            <div className="auth-container">

                {/* LEFT BRAND PANEL */}

                <aside className="auth-brand-panel">
                    <div className="auth-brand-glow auth-brand-glow-one" />
                    <div className="auth-brand-glow auth-brand-glow-two" />

                    <div className="auth-brand-content">

                        <Link to="/" className="auth-logo">
                            <span className="auth-logo-icon">
                                <FiShoppingBag size={25} />
                            </span>

                            <span>
                                Shopery<span className="auth-logo-dot">.</span>
                            </span>
                        </Link>

                        <div className="auth-brand-main">

                            <div className="auth-brand-badge">
                                <span className="auth-live-dot" />
                                YOUR SHOPPING COMPANION
                            </div>

                            <h1 className="auth-brand-heading">
                                Everything you love,
                                <span> all in one place.</span>
                            </h1>

                            <p className="auth-brand-description">
                                Discover great products, enjoy a seamless
                                shopping experience, and manage everything
                                from your personal Shopery account.
                            </p>

                            <div className="auth-feature-list">

                                <div className="auth-feature">
                                    <span className="auth-feature-icon">
                                        <FiShoppingBag />
                                    </span>

                                    <div>
                                        <h3>Effortless Shopping</h3>
                                        <p>Discover and shop your favorites.</p>
                                    </div>
                                </div>

                                <div className="auth-feature">
                                    <span className="auth-feature-icon">
                                        <FiTruck />
                                    </span>

                                    <div>
                                        <h3>Order Management</h3>
                                        <p>Keep track of your purchases.</p>
                                    </div>
                                </div>

                                <div className="auth-feature">
                                    <span className="auth-feature-icon">
                                        <FiShield />
                                    </span>

                                    <div>
                                        <h3>Secure Account</h3>
                                        <p>Authentication powered by Firebase.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="auth-brand-footer">
                            <FiHeadphones size={19} />
                            <span>Made for a better shopping experience.</span>
                        </div>

                    </div>
                </aside>

                {/* RIGHT FORM PANEL */}

                <section className="auth-form-panel">

                    <div className="auth-mobile-logo">
                        <Link to="/" className="auth-logo auth-logo-dark">
                            <span className="auth-logo-icon">
                                <FiShoppingBag size={23} />
                            </span>

                            <span>
                                Shopery<span className="auth-logo-dot">.</span>
                            </span>
                        </Link>
                    </div>

                    <div className="auth-form-content">

                        <Link to="/" className="auth-back-link">
                            <FiArrowLeft />
                            Back to shopping
                        </Link>

                        <div className="auth-form-heading">
                            <span className="auth-eyebrow">
                                WELCOME BACK
                            </span>

                            <h2>Sign in to Shopery</h2>

                            <p>
                                Enter your credentials to access your
                                account and continue shopping.
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="auth-form">

                            {/* EMAIL */}

                            <div className="auth-field">
                                <label htmlFor="login-email">
                                    Email Address
                                </label>

                                <div className="auth-input-wrapper">
                                    <FiMail className="auth-input-icon" />

                                    <input
                                        id="login-email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}

                            <div className="auth-field">
                                <div className="auth-label-row">
                                    <label htmlFor="login-password">
                                        Password
                                    </label>

                                    <button
                                        type="button"
                                        onClick={openResetModal}
                                        className="auth-forgot-link"
                                    >
                                        Forgot password?
                                    </button>
                                </div>

                                <div className="auth-input-wrapper">
                                    <FiLock className="auth-input-icon" />

                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="auth-submit-btn"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="auth-spinner" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <FiArrowRight size={19} />
                                    </>
                                )}
                            </button>

                        </form>

                        <div className="auth-divider">
                            <span>or continue with</span>
                        </div>

                        <Sociallogin redirectTo={from} />

                        <p className="auth-switch-text">
                            New to Shopery?{" "}
                            <Link to="/signup">
                                Create an account
                            </Link>
                        </p>

                        <div className="auth-security-note">
                            <FiShield size={16} />
                            <span>
                                Secure authentication for your Shopery account.
                            </span>
                        </div>

                    </div>

                    <div className="auth-form-footer">
                        © {new Date().getFullYear()} Shopery. All rights reserved.
                    </div>

                </section>

            </div>

            {/* PASSWORD RESET MODAL */}

            {showResetModal && (
                <div
                    className="auth-modal-overlay"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            closeResetModal();
                        }
                    }}
                >
                    <div
                        className="auth-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reset-modal-title"
                    >

                        <button
                            type="button"
                            onClick={closeResetModal}
                            className="auth-modal-close"
                            aria-label="Close"
                            disabled={isResetting}
                        >
                            <FiX size={21} />
                        </button>

                        {resetSent ? (
                            <div className="auth-reset-success">

                                <div className="auth-modal-icon success">
                                    <FiCheckCircle size={29} />
                                </div>

                                <h3 id="reset-modal-title">
                                    Check your inbox
                                </h3>

                                <p>
                                    If an account is eligible for password
                                    recovery, a reset link will be sent to
                                    <strong> {resetEmail}</strong>.
                                </p>

                                <p className="auth-reset-hint">
                                    Check your spam folder too. Follow the
                                    link in the email to set a new password.
                                </p>

                                <button
                                    type="button"
                                    onClick={closeResetModal}
                                    className="auth-submit-btn"
                                >
                                    Back to Login
                                    <FiArrowRight />
                                </button>

                            </div>
                        ) : (
                            <>

                                <div className="auth-modal-icon">
                                    <FiLock size={27} />
                                </div>

                                <h3 id="reset-modal-title">
                                    Forgot your password?
                                </h3>

                                <p className="auth-modal-description">
                                    No worries! Enter your registered email
                                    address and we'll help you reset your password.
                                </p>

                                <form onSubmit={handleResetPassword}>

                                    <div className="auth-field">
                                        <label htmlFor="reset-email">
                                            Email Address
                                        </label>

                                        <div className="auth-input-wrapper">
                                            <FiMail className="auth-input-icon" />

                                            <input
                                                id="reset-email"
                                                type="email"
                                                value={resetEmail}
                                                onChange={(e) =>
                                                    setResetEmail(e.target.value)
                                                }
                                                placeholder="Enter your email"
                                                autoComplete="email"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isResetting}
                                        className="auth-submit-btn"
                                    >
                                        {isResetting ? (
                                            <>
                                                <span className="auth-spinner" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                Send Reset Link
                                                <FiArrowRight />
                                            </>
                                        )}
                                    </button>

                                </form>

                                <button
                                    type="button"
                                    onClick={closeResetModal}
                                    className="auth-modal-back"
                                >
                                    <FiArrowLeft />
                                    Back to Login
                                </button>

                            </>
                        )}

                    </div>
                </div>
            )}

        </main>
    );
};

export default Login;