import React, { useState, useEffect } from 'react';
import { MdOutlineArrowRightAlt } from 'react-icons/md';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './hotdeals.css';
import { CiHeart } from 'react-icons/ci';
import { FiShoppingCart } from 'react-icons/fi';
import { FaRegEye } from 'react-icons/fa6';

const HotDeal = () => {
    const [hotDeals, setHotDeals] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/hotdeals')
            .then(res => res.json())
            .then(data => setHotDeals(data));
    }, []);

    return (
        <div className="px-5 lg:px-12 py-10 nunito_sans bg-[#F7F7F7]">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-[21px] lg:text-[26px] text-[#111] font-bold">Hot Deals</h2>

                <Link className="text-[#018427] text-[16px] lg:text-[18px] font-[600] tracking-wider flex items-center">
                    <p>View All</p>
                    <MdOutlineArrowRightAlt />
                </Link>
            </div>

            <div className="hot-deals-container grid grid-cols-1 lg:grid-cols-4 gap-[20px]">
                {hotDeals.map((deal) => (
                    <div className="hot-deal-card" key={deal.id}
                    data-aos="zoom-in"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out">
                        {deal.sale && <div className="hot-deal-sale">{deal.sale}</div>}
                        <img src={deal.image} alt={deal.name} />
                        <div className="hot-deal-info flex items-center justify-between">
                            <div>
                                <h4>{deal.name}</h4>
                                <p>৳{deal.price} <span style={{ textDecoration: 'line-through', color: '#999' }}>{deal.original_price}</span></p>
                                <div className="flex">
                                    {[...Array(5)].map((star, i) => (
                                        <FaStar
                                            key={i}
                                            color={i < Math.round(deal.rating) ? "#FFD700" : "#E4E5E9"}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="p-2 cursor-pointer rounded-full bg-[#eee] text-[#111] cart">
                                <FiShoppingCart />
                            </div>
                        </div>
                        <div className="hot-deal-details text-center">
                            <div className="flex items-center justify-center gap-3 my-4">
                                <CiHeart />
                                <button className='flex items-center gap-1 px-14 py-2 rounded-[30px] bg-[#00B307] text-[#fff]'>Add to Cart <FiShoppingCart /> </button>
                                <FaRegEye />
                            </div>
                            <p className='text-[16px] text-[#666]'>Hurry up! Offer ends In:</p>
                            <p className='text-[#333] font-[600]'> {deal.deal_end_time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotDeal;
