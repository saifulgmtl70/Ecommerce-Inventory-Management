import { Link, useNavigate  } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import Newsletter from "../Shop/Products/Newsletter";
import useCart from "../../Hooks/useCart";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './cart.css';

import { Helmet } from 'react-helmet-async';

const Cart = () => {
    const [cart, refetch] = useCart();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    // Initialize quantity state for each product in the cart
    const [quantities, setQuantities] = useState(() => {
        const initialQuantities = {};
        cart.forEach(item => {
            initialQuantities[item._id] = 1;
        });
        return initialQuantities;
    });

    const handleQuantityChange = (id, amount) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [id]: Math.max(1, (prevQuantities[id] || 1) + amount)
        }));
    };


    const handleDeleteItem = (id) =>{
        axiosPublic.delete(`/carts/${id}`)
        .then(res =>{
            if(res.data.deletedCount > 0){
                refetch();
                toast.success(`Item is deleted Successfully`, {
                    position: "top-center",
                    autoClose: 3000,
                    
                    });
                    
            }
        })
            
    }

    const totalPrice = cart.reduce((total, item) => total + item.price * quantities[item._id], 0);



    const handleCheckout = () => {
        navigate('/checkout', { state: { cart, quantities, totalPrice } });
    };




    return (
        <section className="nunito_sans">
            <Helmet>
                <title>Shopery | Cart </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <ToastContainer />
            <div className="specific_product_banner h-full lg:h-[30vh] mb-2">
                <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">
                    <ul>
                        <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>
                        <li className="text-[#00B207] font-bold">Shopping Cart</li>
                    </ul>
                </div>
            </div>

            <div className="px-5 lg:px-14 py-10">
                <div className="text-center mb-10">
                    <h2 className="text-[#222] font-bold text-[34px]">My Shopping Cart</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                    <div className="h-auto lg:col-span-2">
                        <div className="w-full mb-8 overflow-x-scroll border rounded-[6px] lg:overflow-x-hidden shadow-sm">
                            <div className="w-full ">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-[15px] font-semibold tracking-wide text-left text-[#111] uppercase rounded-t-md border-b px-12 py-12 mb-10 font_Inter">
                                            <th className="px-4 py-3 uppercase">Product</th>
                                            <th className="px-4 py-3 uppercase">Price</th>
                                            <th className="px-4 py-3 uppercase">Quantity</th>
                                            <th className="px-4 py-3 uppercase">Subtotal</th>
                                            <th className="px-4 py-3 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white">
                                        {cart.map((item) => (
                                            <tr key={item._id} className="text-gray-700 border-b last:border-none">
                                                <td className="px-4 py-3 ">
                                                    <div className='flex items-center gap-2'>
                                                        <div>
                                                            <img src={item.image} alt="" className='w-full lg:w-[80px] h-full lg:h-[80px]' />
                                                        </div>
                                                        <div>
                                                            <h3 className='text-[18px] text-[#191919] font-[600] mb-1'>{item.product}</h3>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-ms font-semibold ">৳{item.price}</td>
                                                <td className="px-1 py-3 text-ms font-semibold">
                                                    <div className="flex items-center gap-1 border w-auto lg:w-8/12 p-2 rounded-[5px]">
                                                        <button onClick={() => handleQuantityChange(item._id, -1)} type="button" className="text-gray-600 transition hover:opacity-75">
                                                            -
                                                        </button>
                                                        <span className="px-4">{quantities[item._id]}</span>
                                                        <button onClick={() => handleQuantityChange(item._id, 1)} type="button" className="transition hover:opacity-75 ">
                                                            +
                                                        </button>
                                                    </div>
                                                    </td>
                                                <td className="px-4 py-3 text-ms font-semibold ">
                                                    ৳{item.price * quantities[item._id]}
                                                </td>
                                                <td className="px-4">
                                                    <button onClick={() => handleDeleteItem(item._id)} className='text-[#6d5656] text-[23px] p-[6px] border rounded-full'>
                                                        <IoCloseOutline />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="h-auto  shadow-sm rounded-lg border px-7 py-5">
                        <h2 className="text-[#222] font-bold text-[28px] mb-4">Cart Total</h2>

                        <ul className="space-y-3">
                            <li className="flex items-center justify-between border-b pb-[14px] px-3 py-2">
                                <h2 className="text-[19px] text-[#555]">Subtotal</h2>
                                <h2 className="text-[19px] text-[#333] font-bold">৳{totalPrice.toFixed(2)}</h2>
                            </li>
                            <li className="flex items-center justify-between border-b pb-[14px] px-3 py-2">
                                <h2 className="text-[19px] text-[#555]">Shipping</h2>
                                <h2 className="text-[19px] text-[#333] font-bold">Free</h2>
                            </li>
                            <li className="flex items-center justify-between border-b pb-[14px] px-3 py-2">
                                <h2 className="text-[19px] text-[#555]">Total</h2>
                                <h2 className="text-[19px] text-[#333] font-bold">৳{(totalPrice).toFixed(2)}</h2>
                            </li>
                        </ul>

                        <div className=" my-8 bg-white">
                            <div className="flex flex-col gap-3 justify-around">
                                <button onClick={handleCheckout} className='px-12 py-3 mb-4 text-center rounded-[24px] bg-[#00B207] text-[#fff]'>Checkout</button>

                                <Link to="/shop" className='px-12 py-3 text-center rounded-[24px] bg-[#EEF7EE] text-[#00B207] font-bold'><button >Continue to Shop</button></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <Newsletter />
        </section>
    );
};

export default Cart;
