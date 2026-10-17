import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

import { Helmet } from 'react-helmet-async';

const ManageProduct = () => {

    const axiosSecure = useAxiosSecure();
    

    const { data: products = [], refetch} = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const res = await axiosSecure.get('/products', {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('access-token')}`
                }
            });
            return res.data;
        }
    })


    const handleDeleteProduct = product => {
        axiosSecure.delete(`/products/${product._id}`)
        .then(res => {
            if (res.data.deletedCount > 0) {
                
                toast.success("One product is Deleted Successfully", {
                    position: "top-center",
                    autoClose: 1000, // এক সেকেন্ডের মধ্যে বন্ধ হবে

                });
                refetch();
            }
        })
    }




    return (
        <section className="px-12 my-20 py-12">
            <Helmet>
                <title>Shopery | Manage Product </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <ToastContainer/>
            <div className="text-center font_Inter mb-6">
                <h2 className="text-[27px] leading-relaxed uppercase text-[#333] font-bold"> manage product</h2>

            </div>
            <div className="mb-7">
                <h2 className="text-[20px] text-[#333] font-bold">
                    Products Length <span>{products.length}</span>
                </h2>
            </div>



            <div className="w-full mb-8 overflow-x-scroll border rounded-[6px] bg-[#fff] lg:overflow-x-hidden shadow-sm">
                <div className="w-full">
                    <table className="w-full">
                        <thead>
                            <tr className="text-[15px] font-semibold tracking-wide text-left text-[#111] bg-[#eee] uppercase rounded-t-md border-b px-12 py-12 mb-10 font_Inter">
                                <th className="px-4 py-3 uppercase">#ID</th>
                                <th className="px-4 py-3 uppercase">Product Image</th>
                                <th className="px-4 py-3 uppercase">Product Name</th>
                                <th className="px-4 py-3 uppercase">Price</th>
                                <th className="px-4 py-3 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product._id} className="text-gray-700 border-b last:border-none">
                                    <td className="px-4 py-3 text-ms font-semibold">{index + 1}</td>
                                    <td className="px-4 py-3 text-ms font-semibold">
                                        <div className="relative w-20 h-20 mr-3 rounded-full md:block">
                                            <img className="object-cover w-full h-full rounded-[2px]" src={product.images[0]} alt="" />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-ms font-semibold">{product.name}</td>
                                    <td className="px-4 py-3 text-ms font-semibold">৳{product.price}</td>
                                    
                                    <td className="px-4 ">
                                        <div className="flex items-center  my-auto gap-5">
                                            <Link to={`/admindashboard/updateProduct/${product._id}`}>
                                                <button  className="text-[#00B207] font-bold text-[21px]">
                                                    <FaRegEdit />
                                                </button>
                                            </Link>
                                            <button onClick={() => handleDeleteProduct(product)} className="text-red-500 font-bold text-[21px]">
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>




            



        </section>
    );
};

export default ManageProduct;