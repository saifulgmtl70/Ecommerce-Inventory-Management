import { CiSearch, CiUser } from "react-icons/ci";
import { FaFacebookF, FaInstagram, FaPinterestP, FaRegCommentAlt, FaTwitter } from "react-icons/fa";
import { GoTag } from "react-icons/go";
import { HiOutlineHome } from "react-icons/hi";
import { RiBloggerLine } from "react-icons/ri";
import { Link, useLoaderData, useParams } from "react-router-dom";

import './blog.css';
import { MdOutlineArrowRightAlt } from "react-icons/md";
import Coments from "./Coments/Coments";
import Newsletter from "../Shop/Products/Newsletter";



import { Helmet } from 'react-helmet-async';

const SeeBlog = () => {
    const { id } = useParams();  // Use useParams to get the blogId from the URL
    const blogs = useLoaderData();  // Get the list of blogs from the loader


    const blog = Array.isArray(blogs)
        ? blogs.find((blog) => blog._id === id)
        : null;

    if (!blog) {
        return (
            <section className="nunito_sans">
                <div className="specific_product_banner h-full lg:h-[30vh] mb-2">
                    <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">
                        <ul>
                            <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>
                            <li><Link to="/blog" className="flex items-center gap-1"><RiBloggerLine />Blog</Link></li>
                            <li className="text-[#00B207] font-bold"><p>Single Blog</p></li>
                        </ul>
                    </div>
                </div>
                <div className="px-14 py-10">
                    <h1 className="text-3xl font-bold">Blog not found</h1>
                    <p className="mt-4">We couldn't find the blog you're looking for.</p>
                </div>
            </section>
        );
    }

    

    return (
        <section className="nunito_sans">
            <Helmet>
                <title>Shopery | Blog Details </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <div className="specific_product_banner h-full lg:h-[30vh] mb-2">
                <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">
                    <ul>
                        <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>
                        <li><Link to="/blog" className="flex items-center gap-1"><RiBloggerLine />Blog</Link></li>
                        <li className="text-[#00B207] font-bold"><p>Single Blog</p></li>
                    </ul>
                </div>
            </div>

            <div className="container px-4 py-10">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
                    <div className="h-auto lg:col-span-2">
                        <div className="mb-4">
                            <img src={blog.main_image} className="w-full h-auto lg:h-[390px]" alt="" />
                        </div>
                        <div className="flex items-center gap-5 my-3">
                            <p className='text-[#00B207] text-[17px] flex items-center gap-1'><GoTag /> <span className="text-[#444]">{blog.category}</span> </p>
                            <p className='text-[#00B207] text-[17px] flex items-center gap-1'><CiUser /> <span className="text-[#444]">{blog.author}</span> </p>
                            <p className='text-[#00B207] text-[17px] flex items-center gap-1'><FaRegCommentAlt /> <span className="text-[#444]">{blog.comments} Comments</span></p>
                        </div>
                        <h2 className="text-[33px] text-[#222] font-bold my-5 leading-[43px]">{blog.title}</h2>

                        <div className="flex items-center justify-between px-5 border-b pb-5">
                            <div className="flex items-start gap-3">
                                <div>
                                    <img src="https://i.ibb.co/LdpRsQt/78ea8cd5-ab52-4533-b8d7-79347471fbea.png" className="w-[60px] h-[60px] rounded-full" alt="" />
                                </div>
                                <div>
                                    <h4 className="text-[#222] font-[600] text-[17px] mb-[3px]">{blog.author}</h4>
                                    <p className="text-[#555] text-[15px]">{blog.date} . <span className="ml-3">6 min read</span> </p>
                                </div>
                            </div>

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

                        <div className="mt-5">
                            <p className="mb-3 text-[#222] font-bold text-[20px] leading-[30px]">{blog.summary}</p>
                            <p className="mb-3 text-[#555] font-[500] text-[15px] leading-[30px]">{blog.content}</p>

                            <div className="flex flex-col lg:flex-row items-center gap-3 mb-3">
                                <div>
                                    <img src={blog.extra_images[0]} className="w-auto lg:w-[420px] h-auto lg:h-[320px] rounded-[5px]" alt="" />
                                </div>
                                <div>
                                    <img src={blog.extra_images[1]} className="w-auto lg:w-[420px] h-auto lg:h-[320px] rounded-[5px]" alt=""/>
                                </div>
                            </div>

                            <p className="mb-3 leading-[30px]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repellendus nobis saepe quibusdam blanditiis corporis quam ea natus atque dolorem necessitatibus cum reiciendis voluptatem quos ipsa rem, nesciunt hic nihil! Labore.</p>
                        </div>

                        <div className="bg_blog mb-8">
                            <div className="flex items-center gap-[10px] lg:gap-7 mb-4">
                                <div className="text-[#fff]">
                                    <span className="text-[16px] text-[#666]">SUMMER SALES</span>
                                    <h2 className="text-[35px] text-[#fff] font-bold">Fresh Fruit</h2>
                                    <button className='px-7 py-[10px] rounded-[25px] flex items-center gap-3 bg-[#00B307] text-[#FFF]'>
                                        Shop Now <MdOutlineArrowRightAlt className="text-[20px]" />
                                    </button>
                                </div>

                                <div className="bg-[#191919] text-white px-8 py-4 rounded-full">
                                    <span className="text-[#666]">UP TO</span>
                                    <h3 className="font-bold text-[#FF8A00] text-[22px]">56%</h3>
                                    <p>OFF</p>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <Coments blogId={id} />

                    </div>

                    <div className="h-auto lg:col-span-1">
                        <div className="relative mb-5 border-b pb-5">
                            <CiSearch className="text-[#333] text-[20px] cursor-pointer absolute mx-2 top-[12px]" />
                            <input type="Search" placeholder="Search" className="px-8 py-[10px] rounded-[5px] border focus:outline-none focus:border-[#00B207] w-full" />
                        </div>

                        <div className="border-b pb-5  mb-7">
                            <h3 className="text-[#222] font-[600] text-[20px] mb-5">Categories</h3>
                            <ul className="space-y-3">
                                <li className="text-[#555] flex items-center justify-between">
                                    <Link to="/blog" className="hover:text-[#00B307]">Organic Foods</Link>
                                    <span>(5)</span>
                                </li>
                                <li className="text-[#555] flex items-center justify-between">
                                    <Link to="/blog" className="hover:text-[#00B307]">Tips & Tricks</Link>
                                    <span>(6)</span>
                                </li>
                                <li className="text-[#555] flex items-center justify-between">
                                    <Link to="/blog" className="hover:text-[#00B307]">Gardening</Link>
                                    <span>(3)</span>
                                </li>
                                <li className="text-[#555] flex items-center justify-between">
                                    <Link to="/blog" className="hover:text-[#00B307]">Home Plants</Link>
                                    <span>(8)</span>
                                </li>
                            </ul>
                        </div>

                        <div className=" border-b pb-5  mb-7">
                            <h3 className="text-[#222] font-[600] text-[20px] mb-5">Our Gallery</h3>
                            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            
                                <div className="h-auto ">
                                    <img src="https://i.ibb.co/sRGTvnd/gallery-1.png" alt="" />
                                </div>

                                <div className="h-auto ">
                                    <img src="https://i.ibb.co/nn0MTCs/gallery-2.png" alt="" />
                                </div>
                                
                                <div className="h-auto ">
                                    <img src="https://i.ibb.co/y66wJWF/gallery-3.png" alt="" />
                                </div>
                                
                                <div className="h-auto ">
                                    <img src="https://i.ibb.co/hB3kpmD/gallery-4.png" alt="" />
                                </div>



                                 <div className="h-auto ">
                                    <img src="https://i.ibb.co/VBMy34Y/gallery-5.png" alt="" />
                                </div>

                                <div className="h-auto ">
                                    <img src="https://i.ibb.co/L9WTCSr/gallery-6.png" alt="" />
                                </div>
                                
                                <div className="h-auto ">
                                    <img src="https://i.ibb.co/XkzMHq2/gallery-7.png" alt="" />
                                </div>
                                
                                <div className="h-auto ">
                                    <img src="https://i.ibb.co/3Mz5hw3/gallery.png" alt="" />
                                </div>

                                
                            </div>
                        </div>

                        <div className="border-b pb-5  mb-7">
                            <h3 className="text-[#222] font-[600] text-[20px] mb-5">Tags</h3>
                            <div className="flex items-center flex-wrap gap-2">
                                <button className="py-1 px-5 rounded-[25px] transition-all delay-200 bg-[#E7E7E7] hover:bg-[#00B307]  hover:text-[#fff]">Organic</button>
                                <button className="py-1 px-5 rounded-[25px] transition-all delay-200  bg-[#E7E7E7]  hover:bg-[#00B307] hover:text-[#fff]">Agriculture</button>
                                <button className="py-1 px-5 rounded-[25px] transition-all delay-200 bg-[#E7E7E7] hover:bg-[#00B307]  hover:text-[#fff]">Farming</button>
                                <button className="py-1 px-5 rounded-[25px] transition-all delay-200 bg-[#E7E7E7] hover:bg-[#00B307]  hover:text-[#v]">Tips</button>
                                <button className="py-1 px-5 rounded-[25px] transition-all delay-200 bg-[#E7E7E7] hover:bg-[#00B307]  hover:text-[#fff]">Gardening</button>
                                <button className="py-1 px-5 rounded-[25px] transition-all delay-200 bg-[#E7E7E7] hover:bg-[#00B307]  hover:text-[#fff]">Home Plants</button>
                            </div>
                        </div>

                        <div className=" ">
                            <h3 className="text-[#222] font-[600] text-[20px] mb-5">Follow Us</h3>
                            <div className="flex items-center gap-4">
                                <button className="p-3 rounded-full transition-all delay-200 bg-[#E7E7E7] hover:bg-[#00B307]  hover:text-[#fff]"><FaFacebookF /></button>
                                <button className="p-3 rounded-full transition-all delay-200 bg-[#E7E7E7] hover:bg-[#00B307]  hover:text-[#fff]"><FaTwitter /></button>
                                <button className="p-3 rounded-full transition-all delay-200 bg-[#E7E7E7] hover:bg-[#00B307]  hover:text-[#fff]"><FaPinterestP /></button>
                                <button className="p-3 rounded-full transition-all delay-200 bg-[#E7E7E7] hover:bg-[#00B307]  hover:text-[#fff]"><FaInstagram /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="my-8 w-full border-t"></div> */}

                
            </div>


            <Newsletter/>



        </section>
    );
};

export default SeeBlog;
