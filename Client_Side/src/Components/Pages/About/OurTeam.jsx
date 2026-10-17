import React from 'react';
import { Link } from 'react-router-dom';
import { TiSocialFacebook } from "react-icons/ti";
import { FaTwitter } from "react-icons/fa";
import { FaPinterestP,FaInstagram  } from "react-icons/fa";
import './about.css'
const OurTeam = () => {
    return (
        <div className="px-5 lg:px-14 py-10 my-5 ">
            <div className="text-center mb-10">
                <h2 className="text-[#222] font-bold text-[40px] mb-2">Our Awesome Team</h2>
                <p className="text-[#444] text-[16px]">Pellentesque a ante vulputate leo porttitor luctus sed eget eros. Nulla et rhoncus neque. Duis non diam eget est luctus tincidunt a a mi.</p>
            </div>


            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
                

                <div className="h-auto w-auto border hover:shadow-lg rounded-[4px] "
                 data-aos="zoom-in"
                 data-aos-delay="50"
                 data-aos-duration="1000"
                 data-aos-easing="ease-in-out">
                    <div className="container">
                        <img src="https://i.ibb.co/gvgcLWP/team-1.png" alt="Avatar" className="image" />
                        <div className="overlay">
                            <div className="social_icon flex items-center justify-center">
                                <div className='text-[20px] text-[#fff] font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <TiSocialFacebook />
                                </div>
                                <div className='text-[20px] text-[#fff] font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaTwitter  />
                                </div>
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaPinterestP />
                                </div>
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaInstagram  />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 py-2 ">
                        <h3 className='text-[#222] font-[600] text-[18px]'>Jenny Wilson</h3>
                        <p className='text-[16px] text-[#444]'>Ceo & Founder</p>
                    </div>
                </div>

                <div className="h-auto w-auto border hover:shadow-lg rounded-[4px] "
                 data-aos="zoom-in"
                 data-aos-delay="50"
                 data-aos-duration="1000"
                 data-aos-easing="ease-in-out">
                    <div className="container">
                        <img src="https://i.ibb.co/dfsk5Hc/team-2.png" alt="Avatar" className="image" />
                        <div className="overlay">
                            <div className="social_icon flex items-center justify-center">
                                <div className='text-[20px] text-[#fff] font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <TiSocialFacebook />
                                </div>
                                <div className='text-[20px] text-[#fff] font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaTwitter  />
                                </div>
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaPinterestP />
                                </div>
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaInstagram  />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 py-2 ">
                        <h3 className='text-[#222] font-[600] text-[18px]'>Jane Cooper</h3>
                        <p className='text-[16px] text-[#444]'>Worker</p>
                    </div>
                </div>

                
                <div className="h-auto w-auto border hover:shadow-lg rounded-[4px] "
                 data-aos="zoom-in"
                 data-aos-delay="50"
                 data-aos-duration="1000"
                 data-aos-easing="ease-in-out">
                    <div className="container">
                        <img src="https://i.ibb.co/2MF87xK/team-3.png" alt="Avatar" className="image" />
                        <div className="overlay">
                            <div className="social_icon flex items-center justify-center">
                                <div className='text-[20px] text-[#fff] font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <TiSocialFacebook />
                                </div>
                                <div className='text-[20px] text-[#fff] font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaTwitter  />
                                </div>
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaPinterestP />
                                </div>
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaInstagram  />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 py-2 ">
                        <h3 className='text-[#222] font-[600] text-[18px]'>Robert Fox</h3>
                        <p className='text-[16px] text-[#444]'>Senior Farmer Manager</p>
                    </div>
                </div>

                
                <div className="h-auto w-auto border hover:shadow-lg rounded-[4px] "
                 data-aos="zoom-in"
                 data-aos-delay="50"
                 data-aos-duration="1000"
                 data-aos-easing="ease-in-out">
                    <div className="container">
                        <img src="https://i.ibb.co/FWDFmft/Image-4.png" alt="Avatar" className="image" />
                        <div className="overlay">
                            <div className="social_icon flex items-center justify-center">
                                <div className='text-[20px] text-[#fff] font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <TiSocialFacebook />
                                </div>
                                <div className='text-[20px] text-[#fff] font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaTwitter  />
                                </div>
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaPinterestP />
                                </div>
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaInstagram  />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-3 py-2 ">
                        <h3 className='text-[#222] font-[600] text-[18px]'>Cody Fisher</h3>
                        <p className='text-[16px] text-[#444]'>Security Guard</p>
                    </div>
                </div>
                
            </div>

            
        </div>
    );
};



export default OurTeam;
