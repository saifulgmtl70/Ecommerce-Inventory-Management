import { Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import './follow.css';
const Follow = () => {
    return (
        <div className="px-4 lg:px-10 py-10 nunito_sans">
            <div className="text-center mb-10">
                <h2 className="text-[#111] text-[30px] font-bold">Follow us on Instagram</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-8">
                

                <div className="h-auto w-auto border hover:shadow-lg rounded-[4px] "
                 data-aos="zoom-in"
                 data-aos-delay="50"
                 data-aos-duration="1000"
                 data-aos-easing="ease-in-out">
                    <div className="container">
                        <img src="https://i.ibb.co/80P8Mcp/01.png" alt="Avatar" className="image" />
                        <div className="overlay">
                            <div className="social_icon flex items-center justify-center">
                                
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaInstagram  />
                                </div>

                            </div>
                        </div>
                    </div>
                    
                </div>

                <div className="h-auto w-auto border hover:shadow-lg rounded-[4px] "
                 data-aos="zoom-in"
                 data-aos-delay="50"
                 data-aos-duration="1000"
                 data-aos-easing="ease-in-out">
                    <div className="container">
                        <img src="https://i.ibb.co/KbJ05Jy/02.png" alt="Avatar" className="image" />
                        <div className="overlay">
                            <div className="social_icon flex items-center justify-center">
                                
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaInstagram  />
                                </div>
                            </div>
                        </div>
                    </div>
                  
                </div>

                
                <div className="h-auto w-auto border hover:shadow-lg rounded-[4px] "
                 data-aos="zoom-in"
                 data-aos-delay="50"
                 data-aos-duration="1000"
                 data-aos-easing="ease-in-out">
                    <div className="container">
                        <img src="https://i.ibb.co/pPcwFZ8/03.png" alt="Avatar" className="image" />
                        <div className="overlay">
                            <div className="social_icon flex items-center justify-center">
                                
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaInstagram  />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>

                
                <div className="h-auto w-auto border hover:shadow-lg rounded-[4px] "
                 data-aos="zoom-in"
                 data-aos-delay="50"
                 data-aos-duration="1000"
                 data-aos-easing="ease-in-out">
                    <div className="container">
                        <img src="https://i.ibb.co/4JH2jwm/04.png" alt="Avatar" className="image" />
                        <div className="overlay">
                            <div className="social_icon flex items-center justify-center">
                                
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaInstagram  />
                                </div>
                            </div>
                        </div>
                    </div>
                   
                </div>
                

                
                <div className="h-auto w-auto border hover:shadow-lg rounded-[4px] "
                 data-aos="zoom-in"
                 data-aos-delay="50"
                 data-aos-duration="1000"
                 data-aos-easing="ease-in-out">
                    <div className="container">
                        <img src="https://i.ibb.co/1nQssFH/05.png" alt="Avatar" className="image" />
                        <div className="overlay">
                            <div className="social_icon flex items-center justify-center">
                                
                                <div className='text-[20px] text-[#fff]  font-bold rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                                    <FaInstagram  />
                                </div>
                            </div>
                        </div>
                    </div>
                   
                </div>
                
            </div>


        </div>
    );
};

export default Follow;