
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
    baseURL: "http://localhost:5000",
});

const useAxiosSecure = () => {
    const navigate = useNavigate();
    const { logOut } = useAuth();

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("access-token");

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                } else {
                    delete config.headers.Authorization;
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = axiosSecure.interceptors.response.use(
            (response) => response,
            async (error) => {
                const status = error.response?.status;

                console.log(
                    "Secure API error:",
                    status,
                    error.response?.data
                );

                if (status === 401) {
                    console.error(
                        "Unauthorized: token missing, invalid, or expired."
                    );
                }

                return Promise.reject(error);
            }
        );

        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [logOut, navigate]);

    return axiosSecure;
};

export default useAxiosSecure;
