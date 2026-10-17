import React from 'react';
import { MdArrowRightAlt } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { GoTag } from 'react-icons/go';
import { CiUser } from 'react-icons/ci';
import { FaRegCommentAlt } from 'react-icons/fa';

const Blog = ({ blog }) => {
    if (!blog) return null;

    const {_id, title, main_image, date, author, category, comments } = blog;

    return (
        <article className="h-auto relative rounded-sm bg-[#fff] shadow-md hover:shadow-xl hover:border-0 overflow-hidden transition cursor-pointer w-full"
        data-aos="zoom-in"
        data-aos-delay="50"
        data-aos-duration="1000"
        data-aos-easing="ease-in-out">
            <div className="hover:relative overflow-hidden duration-1000">
                <img alt="" src={main_image} className="overflow-hidden w-full hover:scale-105 duration-1000 ease-in-out object-cover" />
                <div className='bg-[#fff] px-8 py-2 rounded-[5px] absolute left-2 top-3'>
                    <h4>{date}</h4>
                </div>
            </div>

            <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3">
                    <p className='text-[#7c7a7a] text-[15px] flex items-center gap-1'><GoTag /> {category}</p>
                    <p className='text-[#7c7a7a] text-[15px] flex items-center gap-1'><CiUser /> By {author}</p>
                    <p className='text-[#7c7a7a] text-[15px] flex items-center gap-1'><FaRegCommentAlt /> {comments} Comments</p>
                </div>
                <Link to={`/seeblog/${_id}`}>
                    <h3 className="mt-4 text-lg text-[#1A1A1A] hover:text-[#00B307]">{title}</h3>
                </Link>
                <Link to={`/seeblog/${_id}`}>
                    <button className="text-[#00B307] my-4 flex items-center gap-2">Read more <MdArrowRightAlt className="text-[20px]" /></button>
                </Link>
            </div>
        </article>
    );
};

export default Blog;
