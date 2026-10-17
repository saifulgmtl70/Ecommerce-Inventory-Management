import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sociallogin from '../Sociallogin/Sociallogin';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import useAuth from '../../Hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import Newsletter from '../../Pages/Shop/Products/Newsletter';

import { Helmet } from 'react-helmet-async';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);





    const { createUser } = useAuth();

    const axiosPublic = useAxiosPublic();

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }


    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }


    const handleSignUp = (e) => {
        e.preventDefault();

        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        const confirmpassword = form.confirmpassword.value;

        const userInfo = { email, password };
        console.log(userInfo);



        if(email === "" ){
            toast.warning("Email is Required",{
                position: "top-center"
            });
            return;
        }

        else if(password === "" ){
            toast.warning("Password is Required",{
                position: "top-center"
            });
            return;
        }

        else if(password != confirmpassword ){
            toast.error("Password is not matched",{
                position: "top-center"
            });
            return;
        }

        else if(password.length < 6){
            toast.error("Password Should be at least 6 character or more logner than that",{
                position: "top-center"
            });
            return;
        }


        else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)){
            toast.error("Your password should contain with uppercae,lowercase,num and speical character.",{
                position: "top-center"
            })
            return;
        }
        






        createUser(email, password)


            .then(() =>{
                axiosPublic.post('/users', userInfo)
                .then((res) =>{
                    if(res.data.insertedId){
                        console.log("User Added to databse");
                        toast.success("Account Created Successfully", {
                            position: "top-center",
                            autoClose: 1000,
                            onclose: () => navigate('/')
                        })
                    }
                })
            })

    }

    





    return (
        <>
            <Helmet>
                <title>Shopery | Sign Up </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <div className="flex justify-center items-center h-screen bg-[#fff] nunito_sans">
                <ToastContainer/>

                <div className="bg-white p-8 mx-3 lg:mx-auto shadow-lg rounded-lg border-2 w-full lg:w-4/12 ">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Create Account</h2>
                    <form onSubmit={handleSignUp} className="space-y-4">

                        <div className="form-group">
                            {/* <label htmlFor="email" className="block text-gray-600">Email</label> */}
                            <input type="email" id="email" placeholder='Email' name="email" className="w-full px-4 py-[14px] border focus:outline-none focus:border-[#00B307] rounded mt-1" required />
                        </div>

                        <div className="form-group relative">
                            {/* <label htmlFor="password" className="block text-gray-600">Password</label> */}
                            <input type={showPassword ? "text" : "password"}  placeholder='Password' name="password" className="w-full px-4 py-[14px] border focus:outline-none focus:border-[#00B307] rounded" required />
                            <div className="absolute inset-y-0 right-0 pr-3 top-0 flex items-center text-sm leading-5 cursor-pointer" onClick={togglePasswordVisibility} >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>


                        <div className="form-group relative">
                            {/* <label htmlFor="password" className="block text-gray-600">Password</label> */}
                            <input type={showConfirmPassword ? "text" : "password"}  placeholder='Confirm Password' name="confirmpassword" className="w-full px-4 py-[14px] border focus:outline-none focus:border-[#00B307] rounded mt-1" required />
                            <div className="absolute inset-y-0 right-0 pr-3 top-0 flex items-center text-sm leading-5 cursor-pointer" onClick={toggleConfirmPasswordVisibility} >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>


                        <div className="flex items-center">
                            <input type="checkbox" className="mr-2"/>
                            <label htmlFor="shipToDifferentAddress">Accept all terms & Conditions</label>
                        </div>

                        <button type="submit" className="w-full bg-[#00B307] text-white py-[10px] text-[18px] rounded-[30px] ">Create Account</button>
                    </form>
                    <h3 className='text-center text-[17px] text-[#333] my-4'>Sign in With</h3>
                    <Sociallogin />
                    <p className="mt-4 text-gray-600 text-center">Already have an account? <Link to="/login" className="text-[#00B307] font-bold hover:underline">Login</Link></p>
                </div>


                

            </div>

            <Newsletter/>
        </>
    );
};

export default Signup;
