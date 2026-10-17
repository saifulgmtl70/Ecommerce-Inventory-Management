import { HiOutlineHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import Newsletter from "../Shop/Products/Newsletter";
import { BsStars } from "react-icons/bs";
import { LuLeaf } from "react-icons/lu";
import { LiaShippingFastSolid } from "react-icons/lia";
import { RiCustomerService2Line } from "react-icons/ri";
import { IoBagCheckOutline } from "react-icons/io5";
import { GrCube } from "react-icons/gr";
import { FaCheck } from "react-icons/fa6";
import { MdArrowRightAlt } from "react-icons/md";
import './about.css'
import OurTeam from "./OurTeam";
import Testimonial from "../Home/Testimonial/Testimonial";
import Sponsor from "../Home/Sponsor/Sponsor";

import { Helmet } from 'react-helmet-async';

const About = () => {
    return (
        <section className="nunito_sans">
            <Helmet>
                <title>Shopery | About Us </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <div className="specific_product_banner h-full lg:h-[30vh] mb-2">
                <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">
                    <ul>
                        <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>
                        <li className="text-[#00B207] font-bold">About Us</li>
                    </ul>
                </div>
            </div>

            <div className="px-7 lg:px-14 py-10 mb-5">
                <div className="flex flex-col lg:flex-row items-center justify-around gap-5 ">
                    <div className="h-auto w-full lg:w-6/12 "
                    data-aos="fade-right"
                    data-aos-offset="300"
                    data-aos-easing="ease-in-sine">
                        <h2 className="text-[#111] font-bold text-[40px] lg:text-[60px]">100% Trusted Organic Food Store</h2>
                        <p className="text-[#444] font-[600] leading-normal tracking-wide">Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi, laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit. Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec a eros non massa vulputate ornare. Vivamus ornare commodo ante, at commodo felis congue vitae.
                        </p>
                    </div>
                    <div className="h-auto w-full lg:w-6/12"
                    data-aos="fade-left"
                    data-aos-anchor="#example-anchor"
                    data-aos-offset="500"
                    data-aos-duration="500">
                        <img src="https://i.ibb.co/NNYjsj0/about.png" alt="" />
                    </div>
                </div>

            

            </div>

            <div className="about_bg my-7">
                <div className="flex flex-col lg:flex-row items-center justify-around gap-5">
                    <div className="h-auto w-full lg:w-6/12 ">
                        <img src="https://i.ibb.co/wg9Byqj/about-1.png" alt="" />
                    </div>

                    <div className="h-auto bg-[#fff] lg:bg-transparent m-4  w-full lg:w-6/12">
                        <h2 className="text-[#111] font-bold text-[40px] lg:text-[60px] leading-[65px] mb-5">100% Trusted Organic Food Store</h2>
                        <p className="text-[#444] font-[600] leading-normal tracking-wide">Morbi porttitor ligula in nunc varius sagittis. Proin dui nisi, laoreet ut tempor ac, cursus vitae eros. Cras quis ultricies elit. Proin ac lectus arcu. Maecenas aliquet vel tellus at accumsan. Donec a eros non massa vulputate ornare. Vivamus ornare commodo ante, at commodo felis congue vitae.
                        </p>

                        <div className="flex flex-col lg:flex-row items-center gap-4 ">

                            <ul className="space-y-5">
                                <li className="flex items-center gap-2 mb-3">
                                    <div className="p-3 rounded-full bg-[#E5F7E6] text-[#00B207] ">
                                        <LuLeaf className=" text-[25px]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#222] font-bold text-[19px]">100% Organic food</h3>
                                        <p className="text-[#555]">100% healthy & Fresh food.</p>
                                    </div>
                                </li>

                                <li className="flex items-center gap-2 mb-3">
                                    <div className="p-2 rounded-full bg-[#E5F7E6] text-[#00B207] ">
                                        <BsStars className=" text-[25px]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#222] font-bold text-[19px]">Customer Feedback</h3>
                                        <p className="text-[#555]">Our happy customer</p>
                                    </div>
                                </li>

                                <li className="flex items-center gap-2 ">
                                    <div className="p-2 rounded-full bg-[#E5F7E6] text-[#00B207] ">
                                        <LiaShippingFastSolid className=" text-[25px]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#222] font-bold text-[19px]">Free Shipping</h3>
                                        <p className="text-[#555]">Free shipping with discount</p>
                                    </div>
                                </li>

                            </ul>

                            <ul className="space-y-5">
                                <li className="flex items-center gap-2 mb-3">
                                    <div className="p-3 rounded-full bg-[#E5F7E6] text-[#00B207] ">
                                        <RiCustomerService2Line className=" text-[25px]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#222] font-bold text-[19px]">Great Support 24/7</h3>
                                        <p className="text-[#555]">Instant access to Contact</p>
                                    </div>
                                </li>

                                <li className="flex items-center gap-2 mb-3">
                                    <div className="p-3 rounded-full bg-[#E5F7E6] text-[#00B207] ">
                                        <IoBagCheckOutline className=" text-[25px]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#222] font-bold text-[19px]">100% Sucure Payment</h3>
                                        <p className="text-[#555]">We ensure your money is save</p>
                                    </div>
                                </li>

                                <li className="flex items-center gap-2 ">
                                    <div className="p-3 rounded-full bg-[#E5F7E6] text-[#00B207] ">
                                        <LiaShippingFastSolid className=" text-[30px]" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#222] font-bold text-[19px]">100% Organic Food</h3>
                                        <p className="text-[#555]">100% healthy & Fresh food.</p>
                                    </div>
                                </li>

                            </ul>

                        </div>

                        

                    </div>
                </div>
            </div>


            <div className="px-7 lg:px-14 py-10 mb-5 bg-[#fff]">
                <div className="flex flex-col lg:flex-row items-center justify-around gap-5 ">
                    
                    <div className="h-auto w-full lg:w-6/12">
                        <h2 className="text-[#111] font-bold text-[40px] leading-[65px] mb-3 lg:text-[55px]">We Delivered, You Enjoy Your Order.</h2>
                        <p className="text-[#444] font-[600] leading-normal tracking-wide">Ut suscipit egestas suscipit. Sed posuere pellentesque nunc, ultrices consectetur velit dapibus eu. Mauris sollicitudin dignissim diam, ac mattis eros accumsan rhoncus. Curabitur auctor bibendum nunc eget elementum.
                        </p>

                        <ul className="mb-4">
                            <li className="flex items-center gap-2 mb-3 ">
                                <div className="p-2 rounded-full bg-[#E5F7E6] text-[#00B207] ">
                                    <FaCheck className="text-[18px]"/>
                                </div>
                                <div>
                                    <p className="text-[#444]">Sed in metus pellentesque.</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-2 mb-3">
                                <div className="p-2 rounded-full bg-[#E5F7E6] text-[#00B207] ">
                                    <FaCheck className="text-[18px]"/>
                                </div>
                                <div>
                                    <p className="text-[#444]">Fusce et ex commodo, aliquam nulla efficitur, tempus lorem.</p>
                                </div>
                            </li>
                            <li className="flex items-center gap-2 ">
                                <div className="p-2 rounded-full bg-[#E5F7E6] text-[#00B207] ">
                                    <FaCheck className="text-[18px]"/>
                                </div>
                                <div>
                                    <p className="text-[#444]">Maecenas ut nunc fringilla erat varius.</p>
                                </div>
                            </li>
                        </ul>

                        <button className="px-14 py-3 mt-6 rounded-[35px] bg-[#00B307] text-[#fff] flex items-center gap-2">Shop now <MdArrowRightAlt className="text-[30px]"/></button>


                    </div>

                    <div className="h-auto w-full lg:w-6/12">
                        <img src="https://i.ibb.co/Rb2wbzX/mann.png " className="" alt="" />
                    </div>

                </div>
            </div>


            <OurTeam/>


            <Testimonial/>

            <Sponsor/>


            <Newsletter/>

        </section>
    );
};

export default About;