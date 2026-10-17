import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Sociallogin from '../Sociallogin/Sociallogin';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../Hooks/useAuth';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Newsletter from '../../Pages/Shop/Products/Newsletter';

import { Helmet } from 'react-helmet-async';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }


    const { signIn } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    console.log('state in the location login page', location.state)


    const handleLogin = (e) => {
        e.preventDefault();

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        const userInfo = {  email, password };
        console.log(userInfo);

        signIn(email, password)
            .then(() => {
                toast.success("Logged in Successfully", {
                    position: "top-center",
                    autoClose: 1000, // এক সেকেন্ডের মধ্যে বন্ধ হবে
                    onClose: () =>  navigate(from, { replace: true })  // টোস্ট বন্ধ হওয়ার পরে নেভিগেট করুন
                }); // টাইমআউট সেট করে অনুপ্রেরণা দেখানোর পরে নেভিগেট করুন
            })
            .catch(() => {
                toast.error("Something Went Wrong", {
                    position: "top-center"
                });
            });

    }



    return (
        <>
            <Helmet>
                <title>Shopery | Login </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <div className="flex justify-center items-center h-screen bg-[#fff] nunito_sans">
            <ToastContainer/>
            <div className="bg-white p-8 mx-3 lg:mx-auto shadow-lg rounded-lg border-2 w-full lg:w-4/12">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Sign in</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="form-group">
                        {/* <label htmlFor="email" className="block text-gray-600">Email</label> */}

                        <input type="email" id="email" placeholder='Email' name="email" className="w-full px-4 py-[14px] border focus:outline-none focus:border-[#00B307] rounded mt-1" required />
                    </div>
                    <div className="form-group relative mb-4">
                        {/* <label htmlFor="password" className="block text-gray-600">Password</label> */}

                        <input type={showPassword ? "text" : "password"} id="password" placeholder='Password' name="password" className="w-full px-4 py-[14px] border focus:outline-none focus:border-[#00B307] rounded mt-1" required />

                        <div className="absolute inset-y-0 right-0 top-0 pr-3 flex items-center text-sm leading-5 cursor-pointer" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

                    <div className=''>
                        <button type="submit" className="w-full bg-[#00B307] text-white py-[10px] text-[18px] rounded-[30px] ">Login</button>
                    </div>
                </form>
                <h3 className='text-center text-[17px] text-[#333] my-4'>Sign in With</h3>
                <Sociallogin />
                <p className="mt-4 text-gray-600 text-center">Don't have an account? <Link to="/signup" className="text-[#00B307] font-bold hover:underline">Sign Up</Link></p>
            </div>
            </div>

            <Newsletter/>

        </>
    );
};

export default Login;
