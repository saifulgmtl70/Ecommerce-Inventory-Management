import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
import { toast } from "react-toastify";

import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";

const Sociallogin = ({ redirectTo = "/" }) => {
    const { signInWithGoogle } = useAuth();

    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const loginInProgress = useRef(false);

    const handleGoogleLogin = async () => {
        if (loginInProgress.current) return;

        loginInProgress.current = true;
        setIsLoading(true);

        let firebaseUser;

        // Step 1: Firebase Google Authentication
        try {
            console.log("Starting Google authentication...");

            const result = await signInWithGoogle();

            firebaseUser = result.user;

            if (!firebaseUser?.email) {
                throw new Error(
                    "Google account email is unavailable."
                );
            }

            console.log(
                "Firebase Google authentication successful."
            );
        } catch (error) {
            console.error(
                "Firebase Google authentication error:",
                error.code,
                error.message
            );

            if (error.code === "auth/popup-closed-by-user") {
                toast.info(
                    "Google sign-in was cancelled or the popup closed unexpectedly."
                );
            } else if (error.code === "auth/popup-blocked") {
                toast.error(
                    "Google sign-in popup was blocked. Please allow popups."
                );
            } else if (
                error.code === "auth/unauthorized-domain"
            ) {
                toast.error(
                    "This domain is not authorized in Firebase."
                );
            } else if (
                error.code === "auth/network-request-failed"
            ) {
                toast.error(
                    "Network error during Google authentication."
                );
            } else if (
                error.code === "auth/cancelled-popup-request"
            ) {
                toast.info(
                    "Another Google sign-in request was started."
                );
            } else {
                toast.error(
                    "Google authentication failed. Please try again."
                );
            }

            loginInProgress.current = false;
            setIsLoading(false);
            return;
        }

        // Step 2: Save User in MongoDB
        try {
            const userInfo = {
                email: firebaseUser.email,
                name: firebaseUser.displayName || "",
            };

            const response = await axiosPublic.post(
                "/users",
                userInfo
            );

            console.log(
                "MongoDB user registration response:",
                response.data
            );
        } catch (error) {
            console.error(
                "MongoDB user registration error:",
                error.response?.data || error.message
            );

            toast.error(
                "Google authentication succeeded, but your account could not be synchronized. Please try again."
            );

            loginInProgress.current = false;
            setIsLoading(false);
            return;
        }

        // Step 3: Navigate
        toast.success(
            "Successfully signed in with Google!"
        );

        navigate(redirectTo, {
            replace: true,
        });

        loginInProgress.current = false;
        setIsLoading(false);
    };

    return (
        <div className="auth-social-login">
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="auth-google-btn"
            >
                {isLoading ? (
                    <span className="auth-spinner auth-spinner-dark" />
                ) : (
                    <FaGoogle
                        size={19}
                        className="text-[#4285F4]"
                    />
                )}

                <span>
                    {isLoading
                        ? "Connecting to Google..."
                        : "Continue with Google"}
                </span>
            </button>
        </div>
    );
};

export default Sociallogin;