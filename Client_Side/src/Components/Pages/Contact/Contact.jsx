import React, { useEffect, useState } from 'react';
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { HiOutlineHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Newsletter from "../Shop/Products/Newsletter";

import { Helmet } from 'react-helmet-async';

const mapContainerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: 37.7749, // Default coordinates (San Francisco)
    lng: -122.4194
};

const Contact = () => {
    const [currentLocation, setCurrentLocation] = useState(defaultCenter);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                () => {
                    console.error("Error fetching the location");
                }
            );
        }
    }, []);

    return (
        <section className="nunito_sans">
            <Helmet>
                <title>Shopery | Contact Us </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <div className="specific_product_banner h-full lg:h-[30vh] mb-2">
                <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">
                    <ul>
                        <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>
                        <li className="text-[#00B207] font-bold">Contact Us</li>
                    </ul>
                </div>
            </div>

            <div className="px-5 lg:px-14 py-10">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                    <div className="h-auto p-4">
                        <ul className="space-y-3">
                            <li className="flex flex-col items-center justify-center border-b pb-4">
                                <div className="mb-3">
                                    <FaLocationDot className="text-[45px] text-[#479551d5] font-bold" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[18px] font-[500] text-[#666]">2715 Ash Dr. San Jose, South Dakota 83475</p>
                                </div>
                            </li>
                            <li className="flex flex-col items-center justify-center border-b pb-4">
                                <div className="mb-3">
                                    <FaEnvelope className="text-[45px] text-[#479551d5] font-bold" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[18px] mb-2 font-[500] text-[#666]">azadcoxgmtl@gmail.com</p>
                                    <p className="text-[18px] font-[500] text-[#666]">saiful6170@gmail.com</p>
                                </div>
                            </li>
                            <li className="flex flex-col items-center justify-center">
                                <div className="mb-3">
                                    <FaPhoneAlt className="text-[45px] text-[#479551d5] font-bold" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[18px] mb-2 font-[500] text-[#666]">(219) 555-0114</p>
                                    <p className="text-[18px] font-[500] text-[#666]">+8801848396170</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    
                    <div className="h-auto p-4 lg:col-span-2">
                        <div className="mb-4">
                            <h3 className="text-[#333] font-bold text-[24px] mb-[10px]">Just Say Hello!</h3>
                            <p className="text-[16px] text-[#777] w-full lg:w-6/12">Do you fancy saying hi to me or you want to get started with your project and you need my help? Feel free to contact me.</p>
                        </div>
                        <form action="" className="space-y-5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                <div>
                                    <input type="text" placeholder="Template Cookie" className="w-full border focus:outline-none focus:border-[#479551d5] px-4 py-3 rounded-[6px]" />
                                </div>
                                <div>
                                    <input type="text" placeholder="zakirsoft@gmail.com" className="w-full border focus:outline-none focus:border-[#479551d5] px-4 py-3 rounded-[6px]" />
                                </div>
                            </div>
                            <div>
                                <input type="text" placeholder="Message" className="w-full border focus:outline-none focus:border-[#479551d5] px-4 py-3 rounded-[6px]" />
                            </div>
                            <div>
                                <textarea placeholder="Subjects" className="w-full border focus:outline-none px-4 py-3 rounded-[6px] h-32 resize-none focus:border-[#479551d5]"></textarea>
                            </div>
                            <div>
                                <button className="px-12 py-3 rounded-[25px] bg-[#00B207] text-[#fff]">Send Message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Google Map */}
            <div className=" py-10">
                <LoadScript googleMapsApiKey="AIzaSyA1feqoy_cXiiotBUE09HX_L0tGIHMQYBY">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={currentLocation}
                        zoom={10}
                    >
                        <Marker position={currentLocation} />
                    </GoogleMap>
                </LoadScript>
            </div>

            <Newsletter />
        </section>
    );
};

export default Contact;
