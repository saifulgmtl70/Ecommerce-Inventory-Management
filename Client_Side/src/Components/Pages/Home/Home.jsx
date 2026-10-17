import Banner from "./Banner/Banner";

import { LiaShippingFastSolid } from "react-icons/lia";
import { RiCustomerService2Fill } from "react-icons/ri";
import { IoBagCheckSharp } from "react-icons/io5";
import { IoCubeOutline } from "react-icons/io5";
import Categories from "./Categories/Categories";
import PopularProducts from "./PopularProducts/PopularProducts";
import Promotional from "./Promotional/Promotional";
import HotDeal from "./HotDeals/HotDeal";
import Discount from "./Discount/Discount";
import News from "./News/News";
import Testimonial from "./Testimonial/Testimonial";
import Sponsor from "./Sponsor/Sponsor";
import Follow from "./Follow/Follow";

import { Helmet } from 'react-helmet-async';


import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";





const Home = () => {

    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <section>
            <Helmet>
                <title>Shopery | Home </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <Banner/>

            <div className="px-4 lg:px-6 py-10 nunito_sans"
            data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom"
            >
                <div className="grid grid-cols-1 gap-10 lg:gap-4 lg:grid-cols-4 rounded-lg  bg-[#fff] shadow-lg p-5 lg:p-6">

                    <div className=" flex flex-col lg:flex-row items-center justify-center gap-5">
                        <div>
                            <LiaShippingFastSolid className="text-[50px] text-[#018427] font-bold" />
                        </div>
                        <div>
                            <h4 className="text-[22px] text-[#1A1A1A] font-bold">Free Shipping</h4>
                            <p className="text-[16px] text-[#A6A6A6]">Free shipping on all your order</p>
                        </div>
                    </div>

                    <div className=" flex flex-col lg:flex-row items-center justify-center gap-5">
                        <div>
                            <RiCustomerService2Fill className="text-[50px] text-[#018427] font-bold" />
                        </div>
                        <div>
                            <h4 className="text-[22px] text-[#1A1A1A] font-bold">Customer Support 24/7</h4>
                            <p className="text-[16px] text-[#A6A6A6]">Instant access to Support</p>
                        </div>
                    </div>

                    
                    <div className=" flex flex-col lg:flex-row items-center justify-center gap-5">
                        <div>
                            <IoBagCheckSharp className="text-[50px] text-[#018427] font-bold" />
                        </div>
                        <div>
                            <h4 className="text-[22px] text-[#1A1A1A] font-bold">100% Secure Payment</h4>
                            <p className="text-[16px] text-[#A6A6A6]">We ensure your money is save</p>
                        </div>
                    </div>

                     
                    <div className=" flex flex-col lg:flex-row items-center justify-center gap-5">
                        <div>
                            <IoCubeOutline className="text-[50px] text-[#018427] font-bold" />
                        </div>
                        <div>
                            <h4 className="text-[22px] text-[#1A1A1A] font-bold">Money-Back Guarantee</h4>
                            <p className="text-[16px] text-[#A6A6A6]">30 Days Money-Back Guarantee</p>
                        </div>
                    </div>
                   
                    
                </div>
            </div>

            <Categories/>

            <PopularProducts/>

            <Promotional/>

            <HotDeal/>

            <Discount/>

            <News/>

            <Testimonial/>

            <Sponsor/>

            <Follow/>


        </section>
    );
};

export default Home;