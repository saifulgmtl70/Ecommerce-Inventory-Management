import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaRegEye } from 'react-icons/fa';
import { CiHeart } from 'react-icons/ci';
import { FiShoppingCart } from 'react-icons/fi';

const RelatedProduct = ({ product }) => {
    const { id, name, price, images, rating } = product;

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="flex">
                {Array.from({ length: fullStars }, (_, index) => (
                    <FaStar key={index} className="text-yellow-500" />
                ))}
                {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
                {Array.from({ length: emptyStars }, (_, index) => (
                    <FaRegStar key={index} className="text-yellow-500" />
                ))}
            </div>
        );
    };

    return (
        // <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
        //     <div className="border p-4 rounded-lg">
        //         <Link to={`/product/${id}`}>
        //             <img src={images[0]} alt={name} className="w-full mb-4" />
        //             <h3 className="text-lg font-semibold mb-2">{name}</h3>
        //             <p className="text-lg font-semibold mb-2">${price}</p>
        //             {renderStars(rating)}
        //         </Link>
        //     </div>
        // </div>


        <div className="h-auto p-4 border rounded-[3px] product_Card relative">
            <div>
                <img src={images[0]} alt={name} className=" mx-auto" />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <Link to={`/product/${_id}`} state={{ productId: _id }}><h4 className="text-[#333] font-[600] text-[17px] hover-text-color">{name}</h4></Link>
                    <p className="text-bold text-[#111]">{price}</p>
                    <div className="flex items-center">
                        {renderStars(rating)}
                    </div>
                </div>
                <div className="p-2 cursor-pointer rounded-full bg-[#eee] text-[#111] cart">
                    <FiShoppingCart />
                </div>
            </div>

            <div className="absolute top-2 right-2 text-[17px] heart_eye">
                <CiHeart />
                <FaRegEye  />
            </div>

            <p className='absolute rounded-[4px] top-3 left-2'>
                {
                    availability === "In Stock" ? <span className='bg-[#D2F0D4] text-[#2C742F] font-bold p-2 rounded-[4px]'>In Stock</span> : <span className='bg-[#FDEDED] text-[#EA4B48] font-bold p-2 rounded-[4px]'>Out of Stock</span>
                }
            </p>

            
        </div>



    );
};

export default RelatedProduct;
