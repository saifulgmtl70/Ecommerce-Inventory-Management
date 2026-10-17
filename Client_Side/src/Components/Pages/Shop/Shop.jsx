import { useEffect, useState } from "react";
import { HiOutlineHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import './shop.css';
import Products from "./Products/Products";

import { Helmet } from 'react-helmet-async';

const Shop = () => {
    // Function to calculate the time left until the specified date
    const calculateTimeLeft = () => {
        const difference = +new Date("2025-07-01") - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        }

        return timeLeft;
    };

    // State for the countdown timer
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());


    // Update the countdown timer every second
    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft]);

    return (
        <section className="nunito_sans">
             <Helmet>
                <title>Shopery | Shop </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <div className="shop_banner h-auto mb-2">
                <div className="text-[17px] text-white breadcrumbs mb-5">
                    <ul>
                        <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>
                        <li className="text-[#00B207] font-bold">Shop</li>
                    </ul>
                </div>

                <div className="flex items-center gap-[10px] lg:gap-7 mb-4">
                    <div className="text-[#fff]">
                        <span className="text-[16px]">Best Deals</span>
                        <h2 className="text-[35px] font-bold">Sale of the Month</h2>
                    </div>

                    <div className="bg-[#FF8A00] text-white px-6 py-5 rounded-full">
                        <h3 className="font-bold text-[22px]">56%</h3>
                        <p>OFF</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-3">
                    <div>
                        <h4 className='text-[23px] text-[#00B207] font-[700]'>{timeLeft.days || '00'}</h4>
                        <p className='text-[18px] text-[#949695]'>Days</p>
                    </div>
                    :
                    <div>
                        <h4 className='text-[23px] text-[#00B207] font-[700]'>{timeLeft.hours || '00'}</h4>
                        <p className='text-[18px] text-[#949695]'>Hours</p>
                    </div>
                    :
                    <div>
                        <h4 className='text-[23px] text-[#00B207] font-[700]'>{timeLeft.minutes || '00'}</h4>
                        <p className='text-[18px] text-[#949695]'>Mins</p>
                    </div>
                    :
                    <div>
                        <h4 className='text-[23px] text-[#00B207] font-[700]'>{timeLeft.seconds || '00'}</h4>
                        <p className='text-[18px] text-[#949695]'>Secs</p>
                    </div>
                </div>

                <div>
                    <button className='px-12 py-3 rounded-[25px] flex items-center gap-3 bg-[#00B307] text-[#FFF]'>
                        Shop Now <MdOutlineArrowRightAlt />
                    </button>
                </div>
            </div>

            

            <Products/>
        </section>
    );
};

export default Shop;
