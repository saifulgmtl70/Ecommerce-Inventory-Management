
import { Link } from 'react-router-dom';
import './Footer.css'
import { IoLeaf } from 'react-icons/io5';

import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter, FaPinterestP, FaInstagram, FaApple, FaGooglePlay, FaAmazonPay     } from "react-icons/fa";
import { RiVisaLine } from 'react-icons/ri';
import { SiMastercard } from "react-icons/si";
import TopButton from './TopButon';

const Footer = () => {
    return (
       

<footer className="footer bg-[#002603] nunito_sans text-[#fff]">
  <div className="mx-auto max-w-screen-xl px-4 pb-6 pt-16 sm:px-6 lg:px-8 lg:pt-24 ">
    
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 border-b pb-10">
      <div>
        <div className="flex justify-start  text-teal-600 sm:justify-start">
            <Link to="/" className="text-[30px] poetsen_one tracking-wide flex items-center font-bold text-[#fff]">
                <IoLeaf />
                Ecobazaar
            </Link>
        </div>

        <p className="mt-6 max-w-md text-start  leading-relaxed text-[#ccc] text-[16px] sm:max-w-xs sm:text-left">
        Morbi cursus porttitor enim lobortis molestie. Duis gravida turpis dui, eget bibendum magna congue nec.
        </p>

        <ul className="flex items-center mt-5">
          <li className='text-[17px] text-[#fff] rounded-full transition-all delay-200 p-4 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
            <FaFacebookF />
          </li>
          <li className='text-[17px] text-[#fff] rounded-full transition-all delay-200 p-4 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
            <FaTwitter />
          </li>
          <li className='text-[17px] text-[#fff] rounded-full transition-all delay-200 p-4 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
            <FaPinterestP  />
          </li>
          <li className='text-[17px] text-[#fff] rounded-full transition-all delay-200 p-4 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
            <FaInstagram  />
          </li>
        </ul>

        
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:col-span-2">

        <div className="text-start  text-[#fff] sm:text-left">
          <p className="text-[21px] font-medium text-[#fff]">My Account</p>

          <ul className="mt-8 space-y-4 text-sm text-[#fff]">
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              My Account
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Order History
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Shoping Cart
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Wishlist
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Settings
              </a>
            </li>

            
          </ul>

        </div>

        <div className="text-start text-[#fff] sm:text-left">
          <p className="text-[21px] font-medium ">Helps</p>

          <ul className="mt-8 space-y-4 text-sm text-[#fff]">
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Contact
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Faqs
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Terms & Condition
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Privacy Policy
              </a>
            </li>
            

            
          </ul>
          

        </div>

        <div className="text-start  text-[#fff] sm:text-left">
          <p className="text-[21px] font-medium ">Proxy</p>

          <ul className="mt-8 space-y-4 text-sm text-[#fff]">
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              About
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Shop
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Product
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Products Details
              </a>
            </li>
            <li>
              <a className=" text-[#ddd] text-[16px] hover:text-[#fff] transition-all delay-200" href="#">
              Track Order
              </a>
            </li>
            

            
          </ul>
          

        </div>

        <div className="text-start text-[#fff] sm:text-left">
          <p className="text-[21px] font-medium ">Download Mobile App</p>

          <div className="flex items-center gap-2 mt-8 ">
            
            <button className='flex items-center gap-2 p-5 rounded-[5px] bg-[#103813] text-[#eee] text-[20px]'>
                <FaApple />
                Store
            </button>
            <button className='flex items-center gap-2 p-5 rounded-[5px] bg-[#103813] text-[#eee] text-[20px]'>
                <FaGooglePlay  />
                 Play
            </button>
          </div>
         
          

        </div>

        


      </div>
    </div>


    <div className="text-center mx-auto bottom-0 mt-6">
    Ecobazar eCommerce © 2021. All Rights Reserved
    </div>

    
  </div>

  <TopButton/>
</footer>
    );
};

export default Footer;