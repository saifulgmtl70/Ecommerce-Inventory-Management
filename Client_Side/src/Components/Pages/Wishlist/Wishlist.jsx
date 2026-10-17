import { HiOutlineHome } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import Newsletter from "../Shop/Products/Newsletter";
import useWishlist from "../../Hooks/useWishlist";
import { IoCloseOutline } from "react-icons/io5";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { Helmet } from 'react-helmet-async';

const Wishlist = () => {
    const [wishlist, refetch] = useWishlist();
    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();

    const handleDeleteItem = (id) =>{
        axiosPublic.delete(`/wishlist/${id}`)
        .then(res =>{
            if(res.data.deletedCount > 0){
                refetch();
                toast.success(`Wishlist item is deleted Successfully`, {
                    position: "top-center",
                    autoClose: 3000,
                    onClose: () =>  navigate('/wishlist')
                });
            }
        });
    };

    const handleAddToCart = async (item) => {
        try {
            const cartItem = {
                email: item.email,
                productId: item.productId,
                product: item.product,
                price: item.price,
                image: item.image,
                quantity: 1 // Default quantity to 1, you can adjust as needed
            };

            const res = await axiosPublic.post('/carts', cartItem);
            if (res.data.insertedId) {
                // Successfully added to cart, now delete from wishlist
                await axiosPublic.delete(`/wishlist/${item._id}`);
                refetch();
                toast.success(`Item added to cart and removed from wishlist`, {
                    position: "top-center",
                    autoClose: 3000,
                    onClose: () => navigate('/cart')
                });
            }
        } catch (error) {
            console.error("Error adding item to cart", error);
            toast.error(`Failed to add item to cart`, {
                position: "top-center",
                autoClose: 3000
            });
        }
    };

    return (
        <section className="nunito_sans">
            <Helmet>
                <title>Shopery | Wishlist </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <ToastContainer/>
            <div className="specific_product_banner h-full lg:h-[30vh] mb-2">
                <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">
                    <ul>
                        <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>
                        <li className="text-[#00B207] font-bold">Wishlist</li>
                    </ul>
                </div>
            </div>

            <div className="px-7 lg:px-20 py-10">
                <div className="text-center mb-10">
                    <h2 className="text-[#222] font-bold text-[34px]">My Wishlist</h2>
                </div>

                <div className="h-auto ">
                    <div className="w-full mb-8 overflow-x-scroll border rounded-[6px] lg:overflow-x-hidden shadow-sm">
                        <div className="w-full ">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[15px] font-semibold tracking-wide text-left text-[#111] uppercase rounded-t-md border-b px-12 py-12 mb-10 font_Inter">
                                        <th className="px-4 py-3 uppercase">Product</th>
                                        <th className="px-4 py-3 uppercase">Price</th>
                                        <th className="px-4 py-3 uppercase">Stock Status</th>
                                        <th className="px-4 py-3 uppercase">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="bg-white">
                                    {wishlist.map((item) => (
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
                                            
                                            <td className="px-4 py-3 text-ms font-semibold ">
                                                <p className=' rounded-[4px]'>
                                                    {
                                                        item.availability === "In Stock" ? <span className='bg-[#D2F0D4] text-[#2C742F] font-bold p-2 rounded-[4px]'>In Stock</span> : <span className='bg-[#FDEDED] text-[#EA4B48] font-bold p-2 rounded-[4px]'>Out of Stock</span>
                                                    }
                                                </p>
                                            </td>
                                            <td className="px-4">
                                                <div className="flex items-center gap-3">

                                                    <div>
                                                       {
                                                        item.availability === "In Stock" ?  <button onClick={() => handleAddToCart(item)} className='flex items-center gap-1 px-6 py-3 rounded-[30px] bg-[#00B307] text-[#fff]'>Add to Cart </button>
                                                        :
                                                        <button disabled className='flex items-center gap-1 px-6 py-3 rounded-[30px] bg-[#eee] text-[#00B307]'>Add to Cart </button>
                                                       }
                                                    </div>

                                                    <div>
                                                        <button onClick={() => handleDeleteItem(item._id)} className='text-[#483232] text-[23px] p-[4px] border rounded-full'>
                                                            <IoCloseOutline />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
            
            <Newsletter />
        </section>
    );
};

export default Wishlist;
