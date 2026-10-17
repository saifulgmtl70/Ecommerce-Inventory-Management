import React, { useEffect, useState } from 'react';
import { MdArrowRightAlt } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { GoTag } from "react-icons/go";
import { CiUser } from 'react-icons/ci';
import { FaRegCommentAlt } from 'react-icons/fa';

const News = () => {

    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(error => console.error('Error fetching blogs:', error));
    }, []);


    return (
        <div className="px-5 lg:px-12 py-10 nunito_sans">
            <div className="text-center mb-10">
                <h2 className='text-[#222] font-bold text-[30px]'>Latest News</h2>
            </div>


            

                


                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {blogs.slice(0, 3).map((blog) => (
                        blog && <article key={blog._id}  className="h-auto relative rounded-sm bg-[#fff] shadow-md hover:shadow-xl border hover:border-0 overflow-hidden transition cursor-pointer w-full"
                        data-aos="zoom-in"
                        data-aos-delay="50"
                        data-aos-duration="1000"
                        data-aos-easing="ease-in-out">
                                    <div className="hover:relative overflow-hidden duration-1000">
                                        <img alt="" src={blog.main_image} className="overflow-hidden w-full hover:scale-105 duration-1000 ease-in-out object-cover" />
                                        <div className='bg-[#fff] px-8 py-2 rounded-[5px] absolute left-2 top-3'>
                                            <h4>{blog.date}</h4>
                                        </div>
                                    </div>
            
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center gap-3">
                                <p className='text-[#7c7a7a] text-[15px] flex items-center gap-1'><GoTag /> {blog.category}</p>
                                <p className='text-[#7c7a7a] text-[15px] flex items-center gap-1'><CiUser /> By {blog.author}</p>
                                <p className='text-[#7c7a7a] text-[15px] flex items-center gap-1'><FaRegCommentAlt /> {blog.comments} Comments</p>
                            </div>
                            <Link to={`/seeblog/${blog._id}`}>
                                <h3 className="mt-4 text-lg text-[#1A1A1A] hover:text-[#00B307]">{blog.title}</h3>
                            </Link>
                            <Link to={`/seeblog/${blog._id}`}>
                                <button className="text-[#00B307] my-4 flex items-center gap-2">Read more <MdArrowRightAlt className="text-[20px]" /></button>
                            </Link>
                        </div>
                    </article>
                    ))}
                </div>



              



                





               

          




        </div>
    );
};

export default News;