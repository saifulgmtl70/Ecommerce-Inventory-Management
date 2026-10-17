import { FaTrashAlt } from "react-icons/fa";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { RiAdminFill } from "react-icons/ri";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { Helmet } from 'react-helmet-async';

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            console.log("API Response:", res.data); // Debugging log
            return res.data;
        }
    });



    const handleMakeAdmin = user =>{
        axiosSecure.patch(`/users/admin/${user._id}`)
        .then(res =>{
            console.log(res.data);
            if(res.data.modifiedCount > 0){
                refetch();
                toast.success(`${user.name} is admin now`, {
                    position: "top-center",
                    autoClose: 1000, // এক সেকেন্ডের মধ্যে বন্ধ হবে

                });
                
            }
        })
    }



    const handleDeleteUser = user => {
        axiosSecure.delete(`/users/${user._id}`)
        .then(res => {
            if (res.data.deletedCount > 0) {
                refetch();
                toast.success("User Deleted Successfully", {
                    position: "top-center",
                    autoClose: 1000, // এক সেকেন্ডের মধ্যে বন্ধ হবে
                });
            }
        })
    }


    return (
        <div className="px-12 my-20 py-12">
            <Helmet>
                <title>Shopery | ALl Users </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <ToastContainer/>
            <div className="mb-7">
                <h2 className="text-[20px] text-[#333] font-bold">
                    Users Length <span>{users.length}</span>
                </h2>
            </div>

            <div className="w-full mb-8 overflow-x-scroll border rounded-[6px] bg-[#fff] lg:overflow-x-hidden shadow-sm">
                <div className="w-full">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[15px] font-semibold tracking-wide text-left text-[#111] bg-[#eee] uppercase rounded-t-md border-b px-12 py-12 mb-10 font_Inter">
                                <th className="px-4 py-3 uppercase">#ID</th>
                                <th className="px-4 py-3 uppercase">User Name</th>
                                <th className="px-4 py-3 uppercase">Email</th>
                                <th className="px-4 py-3 uppercase">User Type</th>
                                <th className="px-4 py-3 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="text-gray-700 border-b last:border-none">
                                    <td className="px-4 py-3 text-ms font-semibold">{user._id}</td>
                                    <td className="px-4 py-3 text-ms font-semibold">
                                        <h2 className="text-[#333] px-4 py-2 text-[16px] font-[700]">
                                            {user.displayName || user.name}
                                        </h2>
                                    </td>
                                    <td className="px-4 py-3 text-ms font-semibold">{user.email}</td>
                                    <td className="px-4">
                                        {/* <button onClick={() => handleMakeAdmin(user)} className="text-[#02B308] font-bold text-[24px]">
                                            <RiAdminFill />
                                        </button> */}

                                        {
                                            user.role === 'admin' ?  <p className="text-[18px] text-[#02B308] font-bold">Admin</p> :  <button onClick={() => handleMakeAdmin(user)} className="text-[#02B308] font-bold text-[24px]">
                                            <RiAdminFill />
                                        </button> 
                                        }

                                    </td>
                                    <td className="px-4">
                                        <button onClick={() => handleDeleteUser(user)} className="text-red-500 font-bold text-[21px]">
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AllUsers;
