import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { updateProfile } from "firebase/auth";
import "../Auth/auth.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
    FiUser,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiArrowLeft,
    FiShoppingBag,
    FiCheck,
    FiCheckCircle,
    FiShield,
    FiGift,
    FiHeart,
    FiStar,
} from "react-icons/fi";

import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import Sociallogin from "../Sociallogin/Sociallogin";



const Signup = () => {
    const { createUser } = useAuth();

    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const passwordRules = [
        {
            label: "At least 8 characters",
            valid: formData.password.length >= 8,
        },
        {
            label: "One uppercase letter",
            valid: /[A-Z]/.test(formData.password),
        },
        {
            label: "One lowercase letter",
            valid: /[a-z]/.test(formData.password),
        },
        {
            label: "One number",
            valid: /\d/.test(formData.password),
        },
        {
            label: "One special character",
            valid: /[^A-Za-z0-9]/.test(formData.password),
        },
    ];

    const strengthScore = passwordRules.filter(
        (rule) => rule.valid
    ).length;

    const passwordStrength =
        strengthScore <= 2
            ? "Weak"
            : strengthScore <= 4
                ? "Medium"
                : "Strong";

    const getSignupErrorMessage = (error) => {
        switch (error?.code) {
            case "auth/email-already-in-use":
                return "This email is already registered. Please log in.";

            case "auth/invalid-email":
                return "Please enter a valid email address.";

            case "auth/weak-password":
                return "Please choose a stronger password.";

            case "auth/operation-not-allowed":
                return "Email/Password registration is currently unavailable.";

            case "auth/network-request-failed":
                return "Network error. Please check your connection.";

            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";

            default:
                return "Account creation failed. Please try again.";
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        const name = formData.name.trim();
        const email = formData.email.trim();
        const password = formData.password;

        if (name.length < 2) {
            toast.warning("Please enter your full name.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            toast.warning("Please enter a valid email address.");
            return;
        }

        if (strengthScore !== 5) {
            toast.error("Please meet all password requirements.");
            return;
        }

        if (password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (!formData.terms) {
            toast.warning("Please accept the Terms & Conditions.");
            return;
        }

        setIsSubmitting(true);

        let firebaseUserCreated = false;

        try {
            const result = await createUser(email, password);

            firebaseUserCreated = true;

            const user = result.user;

            // Update Firebase display name.
            try {
                await updateProfile(user, {
                    displayName: name,
                });
            } catch (profileError) {
                console.error(
                    "Firebase profile update failed:",
                    profileError
                );
            }

            // Preserve existing MongoDB user registration.
            const response = await axiosPublic.post("/users", {
                email: user.email,
                name,
            });

            if (response.data?.insertedId) {
                toast.success("Your Shopery account is ready!");

                navigate("/", { replace: true });
            } else {
                toast.info(
                    "Your account was created, but we could not confirm saving your profile. Please contact support if needed."
                );
            }
        } catch (error) {
            console.error("Signup error:", error);

            if (firebaseUserCreated) {
                toast.error(
                    "Your Firebase account was created, but saving your profile failed. Please contact support before trying to register again."
                );
            } else if (error.code?.startsWith("auth/")) {
                toast.error(getSignupErrorMessage(error));
            } else {
                toast.error(
                    "Something went wrong. Please check your connection and try again."
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="shopery-auth nunito_sans">

            <Helmet>
                <title>Create Account | Shopery</title>

                <meta
                    name="description"
                    content="Create your Shopery account to discover products, save favorites and manage your shopping experience."
                />
            </Helmet>

            <ToastContainer position="top-center" autoClose={3500} />

            <div className="auth-container">

                {/* LEFT BRAND PANEL */}

                <aside className="auth-brand-panel auth-signup-brand">

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
                                <FiStar />
                                A BETTER WAY TO SHOP
                            </div>

                            <h1 className="auth-brand-heading">
                                Your next favorite
                                <span> find starts here.</span>
                            </h1>

                            <p className="auth-brand-description">
                                Create your Shopery account and enjoy
                                a more personal, convenient, and
                                connected shopping experience.
                            </p>

                            <div className="auth-feature-list">

                                <div className="auth-feature">
                                    <span className="auth-feature-icon">
                                        <FiHeart />
                                    </span>

                                    <div>
                                        <h3>Save Your Favorites</h3>
                                        <p>Keep the products you love close.</p>
                                    </div>
                                </div>

                                <div className="auth-feature">
                                    <span className="auth-feature-icon">
                                        <FiGift />
                                    </span>

                                    <div>
                                        <h3>Discover Great Products</h3>
                                        <p>Explore products for every occasion.</p>
                                    </div>
                                </div>

                                <div className="auth-feature">
                                    <span className="auth-feature-icon">
                                        <FiShield />
                                    </span>

                                    <div>
                                        <h3>Manage with Confidence</h3>
                                        <p>Access your shopping account securely.</p>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="auth-brand-footer">
                            <FiCheckCircle size={19} />
                            <span>Your shopping journey starts with Shopery.</span>
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

                    <div className="auth-form-content auth-signup-content">

                        <Link to="/" className="auth-back-link">
                            <FiArrowLeft />
                            Back to shopping
                        </Link>

                        <div className="auth-form-heading">

                            <span className="auth-eyebrow">
                                JOIN THE SHOPERY COMMUNITY
                            </span>

                            <h2>Create your account</h2>

                            <p>
                                Just a few details and you're ready
                                to start your shopping journey.
                            </p>

                        </div>

                        <form
                            onSubmit={handleSignUp}
                            className="auth-form"
                        >

                            {/* FULL NAME */}

                            <div className="auth-field">
                                <label htmlFor="signup-name">
                                    Full Name
                                </label>

                                <div className="auth-input-wrapper">
                                    <FiUser className="auth-input-icon" />

                                    <input
                                        id="signup-name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                        maxLength={100}
                                        required
                                    />
                                </div>
                            </div>

                            {/* EMAIL */}

                            <div className="auth-field">
                                <label htmlFor="signup-email">
                                    Email Address
                                </label>

                                <div className="auth-input-wrapper">
                                    <FiMail className="auth-input-icon" />

                                    <input
                                        id="signup-email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}

                            <div className="auth-field">
                                <label htmlFor="signup-password">
                                    Create Password
                                </label>

                                <div className="auth-input-wrapper">
                                    <FiLock className="auth-input-icon" />

                                    <input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        onFocus={() => setPasswordFocused(true)}
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>

                                {/* PASSWORD STRENGTH */}

                                {formData.password && (
                                    <div className="auth-password-strength">

                                        <div className="auth-strength-header">
                                            <span>Password strength</span>

                                            <span
                                                className={`auth-strength-${passwordStrength.toLowerCase()}`}
                                            >
                                                {passwordStrength}
                                            </span>
                                        </div>

                                        <div className="auth-strength-bars">
                                            {[1, 2, 3, 4, 5].map((item) => (
                                                <span
                                                    key={item}
                                                    className={
                                                        item <= strengthScore
                                                            ? `active ${passwordStrength.toLowerCase()}`
                                                            : ""
                                                    }
                                                />
                                            ))}
                                        </div>

                                    </div>
                                )}

                                {(passwordFocused || formData.password) && (
                                    <div className="auth-password-rules">

                                        {passwordRules.map((rule) => (
                                            <div
                                                key={rule.label}
                                                className={
                                                    rule.valid
                                                        ? "auth-rule valid"
                                                        : "auth-rule"
                                                }
                                            >
                                                <FiCheck size={13} />
                                                <span>{rule.label}</span>
                                            </div>
                                        ))}

                                    </div>
                                )}
                            </div>

                            {/* CONFIRM PASSWORD */}

                            <div className="auth-field">
                                <label htmlFor="signup-confirm-password">
                                    Confirm Password
                                </label>

                                <div className="auth-input-wrapper">
                                    <FiLock className="auth-input-icon" />

                                    <input
                                        id="signup-confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="confirmPassword"
                                        placeholder="Re-enter your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="auth-password-toggle"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide confirm password"
                                                : "Show confirm password"
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <FiEyeOff />
                                        ) : (
                                            <FiEye />
                                        )}
                                    </button>
                                </div>

                                {formData.confirmPassword && (
                                    <p
                                        className={
                                            formData.password ===
                                            formData.confirmPassword
                                                ? "auth-match-message success"
                                                : "auth-match-message error"
                                        }
                                    >
                                        {formData.password ===
                                        formData.confirmPassword
                                            ? "Passwords match"
                                            : "Passwords do not match"}
                                    </p>
                                )}
                            </div>

                            {/* TERMS */}

                            <div className="auth-terms">
                                <input
                                    id="signup-terms"
                                    type="checkbox"
                                    name="terms"
                                    checked={formData.terms}
                                    onChange={handleChange}
                                    required
                                />

                                <label htmlFor="signup-terms">
                                    I agree to the{" "}
                                    <Link to="/terms">
                                        Terms & Conditions
                                    </Link>
                                    {" "}of Shopery.
                                </label>
                            </div>

                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="auth-submit-btn"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="auth-spinner" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <FiArrowRight size={19} />
                                    </>
                                )}
                            </button>

                        </form>

                        <div className="auth-divider">
                            <span>or sign up with</span>
                        </div>

                        <Sociallogin />

                        <p className="auth-switch-text">
                            Already have an account?{" "}
                            <Link to="/login">
                                Sign In
                            </Link>
                        </p>

                        <div className="auth-security-note">
                            <FiShield size={16} />
                            <span>
                                Your account is protected with Firebase Authentication.
                            </span>
                        </div>

                    </div>

                    <div className="auth-form-footer">
                        © {new Date().getFullYear()} Shopery. All rights reserved.
                    </div>

                </section>

            </div>

        </main>
    );
};

export default Signup;