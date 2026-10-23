
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Sociallogin from "../Sociallogin/Sociallogin";

import { FaEye, FaEyeSlash } from "react-icons/fa";

import useAuth from "../../Hooks/useAuth";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import useAxiosPublic from "../../Hooks/useAxiosPublic";

import Newsletter from "../../Pages/Shop/Products/Newsletter";

import { Helmet } from "react-helmet-async";

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { createUser } = useAuth();

    const axiosPublic = useAxiosPublic();

    const navigate = useNavigate();

    // =====================================
    // TOGGLE PASSWORD VISIBILITY
    // =====================================

    const togglePasswordVisibility = () => {
        setShowPassword((previous) => !previous);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((previous) => !previous);
    };

    // =====================================
    // SIGNUP ERROR HANDLING
    // =====================================

    const getSignupErrorMessage = (error) => {
        switch (error.code) {
            case "auth/email-already-in-use":
                return "This email is already registered. Please log in.";

            case "auth/invalid-email":
                return "Please enter a valid email address.";

            case "auth/weak-password":
                return "Your password is too weak. Please choose a stronger password.";

            case "auth/operation-not-allowed":
                return "Email/Password signup is disabled in Firebase. Please enable it in Firebase Console.";

            case "auth/network-request-failed":
                return "Network error. Please check your internet connection.";

            case "auth/too-many-requests":
                return "Too many attempts. Please try again later.";

            case "auth/invalid-api-key":
                return "Firebase configuration error. Please contact the website administrator.";

            default:
                return "Account creation failed. Please try again.";
        }
    };

    // =====================================
    // HANDLE SIGNUP
    // =====================================

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        const form = e.target;

        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmPassword = form.confirmpassword.value;
        const acceptedTerms = form.terms.checked;

        // Email validation

        if (!email) {
            toast.warning("Email is required.", {
                position: "top-center"
            });

            return;
        }

        // Password validation

        if (!password) {
            toast.warning("Password is required.", {
                position: "top-center"
            });

            return;
        }

        // Confirm password validation

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.", {
                position: "top-center"
            });

            return;
        }

        // Minimum password length

        if (password.length < 8) {
            toast.error(
                "Password must be at least 8 characters long.",
                {
                    position: "top-center"
                }
            );

            return;
        }

        // Password complexity validation

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

        if (!passwordRegex.test(password)) {
            toast.error(
                "Password must contain uppercase, lowercase, a number, and a special character.",
                {
                    position: "top-center",
                    autoClose: 4000
                }
            );

            return;
        }

        // Terms and conditions validation

        if (!acceptedTerms) {
            toast.warning(
                "Please accept the Terms & Conditions.",
                {
                    position: "top-center"
                }
            );

            return;
        }

        setIsSubmitting(true);

        try {
            // =====================================
            // CREATE FIREBASE USER
            // =====================================

            console.log("Starting email signup...");

            const result = await createUser(email, password);

            console.log(
                "Firebase signup successful:",
                result.user.email
            );

            // =====================================
            // SAVE USER EMAIL TO MONGODB
            // =====================================

            const response = await axiosPublic.post("/users", {
                email: result.user.email
            });

            // =====================================
            // SUCCESS MESSAGE
            // =====================================

            if (response.data.insertedId) {
                toast.success("Account Created Successfully!", {
                    position: "top-center",
                    autoClose: 1500,
                    onClose: () => navigate("/")
                });
            } else {
                // Firebase account was created, but MongoDB
                // did not confirm a new user insertion.

                toast.info(
                    "Your Firebase account was created, but we could not confirm saving your user information. Please contact support if needed.",
                    {
                        position: "top-center",
                        autoClose: 5000
                    }
                );
            }
        } catch (error) {
            console.error("Signup error code:", error.code);
            console.error("Signup error message:", error.message);

            // Firebase Authentication error

            if (error.code?.startsWith("auth/")) {
                toast.error(getSignupErrorMessage(error), {
                    position: "top-center",
                    autoClose: 4000
                });
            } else {
                // MongoDB/API error or another unexpected error

                toast.error(
                    "Something went wrong while saving your account information. Please check your connection and try again.",
                    {
                        position: "top-center",
                        autoClose: 4000
                    }
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // =====================================
    // SIGNUP PAGE UI
    // =====================================

    return (
        <>
            <Helmet>
                <title>Shopery | Sign Up</title>
            </Helmet>

            <div className="flex min-h-screen items-center justify-center bg-[#fff] nunito_sans py-10">
                <ToastContainer />

                <div className="mx-3 w-full rounded-lg border-2 bg-white p-8 shadow-lg lg:mx-auto lg:w-4/12">

                    {/* PAGE TITLE */}

                    <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
                        Create Account
                    </h2>

                    {/* SIGNUP FORM */}

                    <form
                        onSubmit={handleSignUp}
                        className="space-y-4"
                    >
                        {/* EMAIL */}

                        <div className="form-group">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Email"
                                autoComplete="email"
                                className="mt-1 w-full rounded border px-4 py-[14px] focus:border-[#00B307] focus:outline-none"
                                required
                            />
                        </div>

                        {/* PASSWORD */}

                        <div className="form-group relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Password"
                                autoComplete="new-password"
                                className="w-full rounded border px-4 py-[14px] pr-12 focus:border-[#00B307] focus:outline-none"
                                required
                            />

                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                            >
                                {showPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </button>
                        </div>

                        {/* CONFIRM PASSWORD */}

                        <div className="form-group relative">
                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                id="confirmpassword"
                                name="confirmpassword"
                                placeholder="Confirm Password"
                                autoComplete="new-password"
                                className="mt-1 w-full rounded border px-4 py-[14px] pr-12 focus:border-[#00B307] focus:outline-none"
                                required
                            />

                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <FaEyeSlash />
                                ) : (
                                    <FaEye />
                                )}
                            </button>
                        </div>

                        {/* PASSWORD REQUIREMENTS */}

                        <p className="text-xs leading-5 text-gray-500">
                            Password must contain at least 8 characters,
                            including uppercase and lowercase letters,
                            a number, and a special character.
                        </p>

                        {/* TERMS AND CONDITIONS */}

                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                name="terms"
                                className="mt-1 accent-[#00B307]"
                            />

                            <label
                                htmlFor="terms"
                                className="text-sm text-gray-600"
                            >
                                I accept all{" "}
                                <Link
                                    to="/terms"
                                    className="font-semibold text-[#00B307] hover:underline"
                                >
                                    Terms & Conditions
                                </Link>
                            </label>
                        </div>

                        {/* CREATE ACCOUNT BUTTON */}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-[30px] bg-[#00B307] py-[10px] text-[18px] text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </form>

                    {/* SOCIAL LOGIN */}

                    <h3 className="my-4 text-center text-[17px] text-[#333]">
                        Sign in With
                    </h3>

                    <Sociallogin />

                    {/* LOGIN LINK */}

                    <p className="mt-4 text-center text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-bold text-[#00B307] hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>

            {/* NEWSLETTER */}

            <Newsletter />
        </>
    );
};

export default Signup;