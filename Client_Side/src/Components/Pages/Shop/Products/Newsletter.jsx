import React from 'react';
import { FaFacebookF, FaInstagram, FaPinterestP, FaTwitter } from 'react-icons/fa';

const Newsletter = () => {
    return (
        <div className='bg-[#F7F7F7] px-5 lg:px-16 py-10 nunito_sans'>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                <div className="h-auto rounded-lg ">
                    <h2 className='text-[25px] text-[#111] font-bold mb-2'>Subcribe our Newsletter</h2>
                    <p className='text-[#999]'>Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna.</p>
                </div>
                <div className="h-auto rounded-lg my-5 relative">
                    <input type="text" placeholder='Your email address ' className='w-full border px-4 py-3 rounded-[23px] focus:outline-none border-[#dfdbdb]' />
                    <butto className="px-3 lg:px-12 py-3 rounded-[23px] bg-[#00B207] text-white text-[17px] absolute right-0 cursor-pointer">Subscribe</butto>
                </div>
                <div className="h-auto rounded-lg ">
                    <ul className="flex items-center lg:justify-end mt-5">
                        <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                            <FaFacebookF />
                        </li>
                        <li className='text-[17px] text-[#222 ] rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                            <FaTwitter />
                        </li>
                        <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                            <FaPinterestP  />
                        </li>
                        <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-[#00B307] hover:text-[#fff] cursor-pointer'>
                            <FaInstagram  />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Newsletter;