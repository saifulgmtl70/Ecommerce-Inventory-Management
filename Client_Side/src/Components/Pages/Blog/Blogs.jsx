import { HiOutlineHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import Newsletter from "../Shop/Products/Newsletter";
import { useEffect, useState } from "react";
import Blog from "./Blog";

import { Helmet } from 'react-helmet-async';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [filter, setFilter] = useState({ category: '', search: '' });
    const [sort, setSort] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/blogs')
            .then(res => res.json())
            .then(data => setBlogs(data))
            .catch(error => console.error('Error fetching blogs:', error));
    }, []);

    const handleFilterChange = (e) => {
        setFilter({ ...filter, [e.target.name]: e.target.value });
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const filteredBlogs = blogs.filter(blog => {
        return (
            (filter.category ? blog.category === filter.category : true) &&
            (filter.search ? blog.title.toLowerCase().includes(filter.search.toLowerCase()) : true)
        );
    });

    const sortedBlogs = filteredBlogs.sort((a, b) => {
        if (sort === 'newest') {
            return new Date(b.date) - new Date(a.date);
        } else if (sort === 'oldest') {
            return new Date(a.date) - new Date(b.date);
        }
        return 0;
    });

    return (
        <section className="nunito_sans">
            <Helmet>
                <title>Shopery | Blog </title>
            </Helmet>
            <div className="specific_product_banner h-full lg:h-[30vh] mb-2">
                <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">
                    <ul>
                        <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>
                        <li className="text-[#00B207] font-bold">Blog </li>
                    </ul>
                </div>
            </div>

            <div className="px-7 lg:px-14 py-10">
                {/* Filter Section */}

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 mb-10">
                    <div className="">
                        <input
                            type="text"
                            name="search"
                            placeholder="Search by title"
                            value={filter.search}
                            onChange={handleFilterChange}
                            className="p-2 border focus:outline-none w-full rounded"
                        />
                    </div>
                    <div className="">
                        <select name="category" value={filter.category} onChange={handleFilterChange} className="p-2 border focus:outline-none w-full rounded">
                            <option value="">All Categories</option>
                            <option value="Health">Health</option>
                            <option value="Cooking">Cooking</option>
                            <option value="Gardening">Gardening</option>
                            <option value="Sustainability">Sustainability</option>
                            <option value="Tips">Tips</option>
                            <option value="Recipes">Recipes</option>
                        </select>
                    </div>
                    <div className="">
                        <select name="sort" value={sort} onChange={handleSortChange} className="p-2 border focus:outline-none w-full rounded">
                            <option value="">Sort by Date</option>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>


                {/* Blogs Section */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {sortedBlogs.map((blog) => (
                        blog && <Blog key={blog._id} blog={blog} />
                    ))}
                </div>
            </div>

            <Newsletter />
        </section>
    );
};

export default Blogs;
