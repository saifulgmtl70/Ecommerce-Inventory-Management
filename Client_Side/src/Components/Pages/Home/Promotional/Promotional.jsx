import React from 'react';

import './Promotional.css';
import { MdOutlineArrowRightAlt } from 'react-icons/md';


const Promotional = () => {
    return (
        <div className="px-5 lg:px-12 py-10 nunito_sans" 
        data-aos="fade-up"
            data-aos-anchor-placement="bottom-bottom">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                <div className="h-full rounded-[5px] prom_1 w-full lg:w-[#425px] lg:h-[510px]"
               >
                    <div className="text-center p-5 text-white space-y-7">
                        <span className='text-[16px] mb-3'>Best Deals</span>
                        <h2 className='text-[32px] font-bold mb-3'>Sale of the Month</h2>
                        <div className="flex items-center justify-center gap-7">
                            <div >
                                <h4 className='text-[20px] font-[600]'>00</h4>
                                <p className='text-[18px]'>Days</p>
                            </div>
                            :
                            <div>
                                <h4 className='text-[20px] font-[600]'>02</h4>
                                <p className='text-[18px]'>Hours</p>
                            </div>
                            :
                            <div>
                                <h4 className='text-[20px] font-[600]'>18</h4>
                                <p className='text-[18px]'>Mins</p>
                            </div>
                            :
                            <div>
                                <h4 className='text-[20px] font-[600]'>46</h4>
                                <p className='text-[18px]'>Secs</p>
                            </div>
                            
                        </div>

                        <button className='flex items-center mx-auto my-4 gap-2 bg-[#ffff] px-14 py-3 rounded-[20px] text-[#018427]'>Shop Now <MdOutlineArrowRightAlt /></button>

                    </div>
                </div>
                <div className="h-full rounded-[5px] prom_2 w-full lg:w-[#425px] lg:h-[510px]"
              >
                    <div className="text-center p-5 text-white space-y-7">
                            <span className='text-[16px] mb-3'>85% Fat Free</span>
                            <h2 className='text-[32px] font-bold mb-3'>Low-Fat Meat</h2>
                            <p className='text-[16px]'>Started at <span className='text-[#face54]'>$79.99</span></p>

                            <button className='flex items-center mx-auto my-4 gap-2 bg-[#ffff] px-14 py-3 rounded-[20px] text-[#018427]'>Shop Now <MdOutlineArrowRightAlt /></button>

                        </div>
                    </div>
                <div className="h-full rounded-[5px] prom_3 w-full lg:w-[#425px] lg:h-[510px]"
             >
                    <div className="text-center p-5 text-[#111] space-y-7">
                            <span className='text-[16px] mb-3'>Summer Sale</span>
                            <h2 className='text-[32px] font-bold mb-3'>100% Fresh Fruit</h2>
                            <p className='text-[16px]'>Up to <span className='bg-[#333] text-[#face54] p-2 rounded-[5px]'>64% OFF</span></p>

                            <button className='flex items-center mx-auto my-4 gap-2 bg-[#ffff] px-14 py-3 rounded-[20px] text-[#018427]'>Shop Now <MdOutlineArrowRightAlt /></button>

                        </div>
                    </div>
            </div>

        </div>
    );
};

export default Promotional;