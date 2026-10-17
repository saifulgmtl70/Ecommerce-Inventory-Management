import React from 'react';

import { FaGithub, FaGoogle } from 'react-icons/fa';
import { FaFacebookF } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/useAxiosPublic';

const Sociallogin = () => {

    const {signInWithGoogle} = useAuth();
    const axiosPublic = useAxiosPublic();
    const navigate =  useNavigate();

    const handleGoogleLogin = () =>{
        signInWithGoogle()

        .then(result =>{
            console.log(result.user);
            const userInfo = {
                email: result.user?.email,
                name: result.user?.displayName
            }
            axiosPublic.post('/users', userInfo)
            .then(res =>{
                console.log(res.data);
                toast.success("Successfully Logged in", {
                    position: "top-center",
                    autoClose: 1000, // এক সেকেন্ডের মধ্যে বন্ধ হবে
                    onClose: () => navigate('/')
                });
            })
        })

    }


    return (
        <div className="flex justify-center gap-2 mt-4">
            <ToastContainer/>
            <button className="flex items-center justify-center bg-blue-600 text-white p-[10px] rounded-full hover:bg-[#00B307]">
                <FaFacebookF className="" /> 
            </button>
            <button className="flex items-center justify-center bg-gray-800 text-white p-[10px] rounded-full  hover:bg-[#00B307]">
                <FaGithub className="" /> 
            </button>
            <button onClick={handleGoogleLogin} className="flex items-center justify-center bg-red-500 text-white p-[10px] rounded-full  hover:bg-[#00B307]">
                <FaGoogle  className="" />
            </button>
        </div>
    );
};

export default Sociallogin;