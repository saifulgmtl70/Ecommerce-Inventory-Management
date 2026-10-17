import React from 'react';
import { HiOutlineHome } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { MdCancel } from 'react-icons/md';
import useAxiosPublic from '../../Hooks/useAxiosPublic';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Helmet } from 'react-helmet-async';

const Userhome = () => {
    const { user } = useAuth();


    const { data: billings = [] } = useQuery({
        queryKey: ['billings', user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/billings?email=${user.email}`);
            return res.data;
        }
    });



    if (!user) {
        return <div>Loading...</div>; // or any loading indicator you prefer
    }



    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const { data: orders = [], refetch } = useQuery({
        queryKey: ['orders', user?.email],
        queryFn: async () => {
            const res = await axiosPublic.get(`/orders?email=${user.email}`);
            return res.data;
        }
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };



    const handleCancelOrder = (id) =>{
        axiosPublic.delete(`/orders/${id}`)
        .then(res =>{
            if(res.data.deletedCount > 0){
                refetch();
                toast.success(`Your Order has caneled Successfully`, {
                    position: "top-center",
                    autoClose: 3000,
                    // onClose: () =>  navigate('/')
                });
            }
        });
    };


    return (
        <section className="nunito_sans">
            <Helmet>
                <title>Shopery | User Home </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <ToastContainer/>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 mb-5">
                <div className="h-auto rounded-lg border py-4">
                    <div className="mb-3">
                        <img src={user.photoURL} alt="user" className="w-[130px] h-[130px] mx-auto rounded-full" />
                    </div>
                    <div className="text-center mb-2">
                        <h3 className="text-[#333] font-[600] text-[18px] mb">{user.displayName}</h3>
                        <p className="text-[#666] font-[500] text-[15px] mb">Customer</p>
                    </div>
                    <div className="text-center">
                        <Link to="/userdashboard/settings"> <button className="text-[#00B307] text-[19px] font-bold text-center">Edit Profile</button> </Link>
                    </div>
                </div>

               


                {
                    billings.map((billing) => {
                        return (
                        <div  key={billing._id} className="h-auto rounded-lg border p-5">
                            <span className="text-[#666] font-[600] text-[14px]">BILLING ADDRESS</span>
                            <h3 className="text-[#333] font-[600] text-[20px] mb-2 mt-4">{billing.fullname}</h3>
                            <p className="text-[#666] font-[500] text-[15px] mb-3">{billing.streetaddress}</p>
                            <p className="text-[#333] font-[500] text-[15px] mb-2">{billing.email}</p>
                            <p className="text-[#333] font-[500] text-[15px] mb-4">{billing.phone}</p>
        
                            <Link > <button className="text-[#00B307] text-[19px] font-bold mt-4">Edit Address</button> </Link>
        
                        </div>
                        );
                    })
                }



                
            </div>


            <div className="h-auto ">
                <div className="w-full mb-8 overflow-x-scroll border rounded-[6px] lg:overflow-x-hidden shadow-sm">
                    <div className="w-full ">
                        <div className="p-4 flex items-center justify-between">
                            <h2 className="text-[#222] font-bold text-[18px]">Recent Order History</h2>
                            <h2 className="text-[#00B307] font-bold text-[18px]">View All</h2>
                        </div>
                        <table className="w-full ">
                            <thead>
                                <tr className="text-[15px] font-semibold tracking-wide text-left text-[#111] uppercase rounded-t-md px-12 py-12 mb-10 bg-[#F2F2F2]">
                                    <th className="px-4 py-3 uppercase">#Order Id</th>
                                    <th className="px-4 py-3 uppercase">Date</th>
                                    <th className="px-4 py-3 uppercase">Total</th>
                                    <th className="px-4 py-3 uppercase">Status</th>
                                    <th className="px-4 py-3 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {
                                    orders.map((order) => {
                                        return (
                                            <tr key={order._id} className="text-gray-700 ">
                                                <td className="px-4 py-3 ">
                                                    <div className='flex items-center gap-2'>
                                                        <div>
                                                            <h3 className='text-[16px] text-[#191919] font-[600] mb-1'>{order._id}</h3>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-ms font-semibold ">{formatDate(order.createdAt)}</td>
                                                <td className="text-ms font-semibold ">
                                                    <div className=" flex items-center justify-center" >
                                                        <h2>{order.totalPrice}</h2>
                                                    </div>
                                                </td>
                                                <td className="px-4">
                                                    <div className="flex items-center gap-3">
                                                        <h2 className="text-[#222] font-[600]">
                                                            {order.status}
                                                        </h2>
                                                    </div>
                                                </td>
                                                <td className="">
                                                    <div className="tooltip flex items-center justify-center" data-tip="Cancel Order">
                                                        <button onClick={() => handleCancelOrder(order._id)} className="text-[#00B207] text-[20px] lg:text-[25px] font-bold"> <MdCancel /> </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>



        </section>
    );
};

export default Userhome;
