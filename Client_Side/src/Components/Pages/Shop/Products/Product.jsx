import React, { useState } from 'react';
import { FiShoppingCart } from "react-icons/fi";
import { FaRegEye } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import './products.css';

import { FaFacebookF } from "react-icons/fa6";
import { FaTwitter, FaPinterestP, FaInstagram,  } from "react-icons/fa";
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../../Hooks/useAuth';
import useAxiosPublic from '../../../Hooks/useAxiosPublic';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useWishlist from '../../../Hooks/useWishlist';
import useAdmin from '../../../Hooks/useAdmin';

const Product = ({product, isModalOpen, openModal, closeModal}) => {

    const { _id, name, category, price, images,  rating, availability, description } = product;


    const { user } = useAuth();

    const [isAdmin] = useAdmin();

    const navigate = useNavigate();

    const axiosPublic = useAxiosPublic();


    const [ , refetch ] = useWishlist();


    const [selectedImage, setSelectedImage] = useState(images[0]);

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

    const getAvailabilityClass = (availability) => {
        return availability === "In Stock" ? "bg-[#D2F0D4] text-[#2C742F] font-bold px-2 py-1 rounded " : "bg-[#FDEDED] text-[#EA4B48] font-bold px-2 py-1 rounded ";
    };


    const handleWishList = () =>{
        
        if (isAdmin) {
            toast.info("Admin users cannot add items to the wishlist", {
                position: "top-center",
                autoClose: 3000,
                // onClose: () =>  navigate('/userdashboard/myappointment')
            });
            return;
        }

        axiosPublic.get('/wishlist', { params: { email: user.email } })
        .then((response) => {
          const cartItems = response.data;

          // Check if the item already exists in the cart
          const isItemInCart = cartItems.some((cartItem) => cartItem.cartId === _id);

          if (isItemInCart) {
            toast.error(`${product.name} is already added to the Wishlist`, {
                position: "top-center",
                autoClose: 3000,
                // onClose: () =>  navigate('/userdashboard/myappointment')
            });
            return; // Exit the function if the item is already in the cart
          }

          // If the item is not in the cart, send cart item to the database
          const wishlist = {
            cartId: _id,
            email: user.email,
            product: name,
            image: images[0],
            price: price,
            availability: availability
          };

          axiosPublic.post('/wishlist', wishlist)
            .then((res) => {
              console.log(res.data);
              if (res.data.insertedId) {
                toast.success(`${name} is Added to the Wishlist`, {
                    position: "top-center",
                    autoClose: 3000,
                    onClose: () =>  navigate('/wishlist')
                });
                // refetch cart to update the cart items count
                refetch();
              }
            })
            
        })

       




    }




    return (
        <div>
            <ToastContainer/>
            <div className="h-auto p-4 border rounded-[3px] product_Card relative"
            data-aos="zoom-in"
            data-aos-delay="50"
            data-aos-duration="1000"
            data-aos-easing="ease-in-out">
            
            <div>
                <img src={images[0]} alt={name} className="w-auto lg:w-[260px] h-auto lg:h-[160px] mx-auto" />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <Link to={`/product/${_id}`} state={{ productId: _id }}><h4 className="text-[#333] font-[600] text-[17px] hover-text-color">{name}</h4></Link>
                    <p className="text-bold text-[#111]">৳{price}</p>
                    <div className="flex items-center">
                        {renderStars(rating)}
                    </div>
                </div>
                <div className="p-2 cursor-pointer rounded-full bg-[#eee] text-[#111] cart">
                    <FiShoppingCart />
                </div>
            </div>

            <div className="absolute top-2 right-2 text-[17px] heart_eye">
                <CiHeart onClick={handleWishList}/>
                <FaRegEye onClick={() => openModal(_id)} />
            </div>

            <p className='absolute rounded-[4px] top-3 left-2'>
                {
                    availability === "In Stock" ? <span className='bg-[#D2F0D4] text-[#2C742F] font-bold p-2 rounded-[4px]'>In Stock</span> : <span className='bg-[#FDEDED] text-[#EA4B48] font-bold p-2 rounded-[4px]'>Out of Stock</span>
                }
            </p>

            {isModalOpen && (
                <dialog id={`modal_${_id}`} className="modal" open>
                    <div className="modal-box w-full">
                        <form method="dialog">
                            <button className="p-2 rounded-full hover:bg-[#D2F0D4] text-[20px] text-[#111] font-bold absolute right-2 top-2" onClick={closeModal}><IoClose /></button>
                        </form>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">

                            <div className="h-auto flex items-center">
                                <div className="flex flex-col  items-center ">
                                    {images.map((img, index) => (
                                        <img
                                            key={index}
                                            src={img}
                                            alt={`thumbnail ${index}`}
                                            className="w-16 h-16 mb-2 cursor-pointer"
                                            onClick={() => setSelectedImage(img)}
                                        />
                                    ))}
                                </div>
                                <div>
                                    <img src={selectedImage} alt={name} className="modal-image my-4" />
                                </div>
                            </div>

                            <div className="h-auto ">
                                <div className="space-y-3">
                                        <div className="flex items-center gap-2"> 
                                            <h3 className="font-bold text-[27px]">{name}</h3>  
                                            <p className={getAvailabilityClass(availability)}>{availability}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {renderStars(rating)}
                                            <span className="ml-[2px]"> 4 reviews</span>
                                            <span className=""><strong>SKU</strong> 251994</span>
                                        </div>
                                    
                                        <p className="text-[#2C742F] font-bold text-[19px]">৳{price}</p>
                                        <hr/>

                                        <div className="flex items-center justify-between mb-3">
                                            <p><strong>Category: </strong>{category}</p>
                                            <ul className="flex items-center">
                                                <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
                                                    <FaFacebookF />
                                                </li>
                                                <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
                                                    <FaTwitter />
                                                </li>
                                                <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
                                                    <FaPinterestP  />
                                                </li>
                                                <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
                                                    <FaInstagram  />
                                                </li>
                                            </ul>
                                        </div>

                                        <p className="">{description} </p>

                                        <div className="flex items-center gap-2">
                                        
                                            <div>

                                                <div className="flex items-center gap-1 border px-3">
                                                    <button type="button" className=" text-gray-600 transition hover:opacity-75">
                                                        -
                                                    </button>

                                                    <input
                                                        type="number"
                                                        id="Quantity"
                                                        value="1"
                                                        className="h-10 w-16 rounded border-gray-200 text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                                    />

                                                    <button type="button" className="transition hover:opacity-75">
                                                        +
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center gap-3 my-4">
                                                
                                                <button className='flex items-center gap-1 px-14 py-2 rounded-[30px] bg-[#00B307] text-[#fff]'>Add to Cart <FiShoppingCart /> </button>
                                                
                                            </div>

                                            <div>
                                                <CiHeart />
                                            </div>

                                        </div>

                                        <p><strong>Category: </strong>{category}</p>
                                        
                                        
                                        
                                    
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </dialog>
            )}
            </div>
        </div>
    );
};

export default Product;