
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    MdArrowRightAlt,
    MdOutlineArticle,
    MdOutlineRefresh,
} from "react-icons/md";

import { GoTag } from "react-icons/go";
import { CiUser } from "react-icons/ci";
import { FaRegCommentAlt } from "react-icons/fa";
import { FiCalendar, FiArrowUpRight } from "react-icons/fi";

import "./News.css";

const API_URL = "http://localhost:5000/blogs";

const News = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchBlogs = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error("Invalid blog data received.");
            }

            setBlogs(data.filter(Boolean));
        } catch (err) {
            console.error("Error fetching blogs:", err);

            setError(
                "এই মুহূর্তে ব্লগগুলো লোড করা যাচ্ছে না। সার্ভার সংযোগ পরীক্ষা করে আবার চেষ্টা করো।"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const getCommentsCount = (comments) => {
        const count = Number(comments);

        return Number.isFinite(count) && count >= 0 ? count : 0;
    };

    const renderSkeletons = () => {
        return Array.from({ length: 3 }, (_, index) => (
            <div
                className="news-card news-skeleton"
                key={`news-skeleton-${index}`}
                aria-hidden="true"
            >
                <div className="news-skeleton-image" />

                <div className="news-skeleton-content">
                    <div className="news-skeleton-line short" />
                    <div className="news-skeleton-line" />
                    <div className="news-skeleton-line medium" />
                    <div className="news-skeleton-button" />
                </div>
            </div>
        ));
    };

    return (
        <section className="shopery-news-section">
            <div className="shopery-news-container">

                {/* Section Heading */}
                <div className="news-section-heading">
                    <div className="news-heading-content">
                        <span className="news-eyebrow">
                            <MdOutlineArticle />
                            SHOPERY JOURNAL
                        </span>

                        <h2>
                            Latest <span>News</span>
                        </h2>

                        <p>
                            Explore helpful tips, fresh ideas, shopping
                            guides and the latest updates from Shopery.
                        </p>
                    </div>

                    <Link to="/blog" className="news-view-all">
                        Explore All Articles
                        <MdArrowRightAlt />
                    </Link>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="news-grid">
                        {renderSkeletons()}
                    </div>
                )}

                {/* Error State */}
                {!loading && error && (
                    <div className="news-message">
                        <div className="news-message-icon">
                            <MdOutlineArticle />
                        </div>

                        <h3>Unable to load articles</h3>

                        <p>{error}</p>

                        <button
                            type="button"
                            className="news-retry-button"
                            onClick={fetchBlogs}
                        >
                            <MdOutlineRefresh />
                            Try Again
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && blogs.length === 0 && (
                    <div className="news-message">
                        <div className="news-message-icon">
                            <MdOutlineArticle />
                        </div>

                        <h3>No articles available</h3>

                        <p>
                            নতুন ব্লগ প্রকাশিত হলে এখানে দেখা যাবে।
                            ততক্ষণ Shopery-এর পণ্যগুলো দেখে নিতে পারো।
                        </p>

                        <Link
                            to="/shop"
                            className="news-retry-button"
                        >
                            Explore Products
                            <MdArrowRightAlt />
                        </Link>
                    </div>
                )}

                {/* Blog Cards */}
                {!loading && !error && blogs.length > 0 && (
                    <div className="news-grid">
                        {blogs.slice(0, 3).map((blog, index) => {
                            const blogId = blog._id;
                            const blogLink = blogId
                                ? `/seeblog/${blogId}`
                                : "/blog";

                            const commentsCount = getCommentsCount(
                                blog.comments
                            );

                            return (
                                <article
                                    key={blogId || `blog-${index}`}
                                    className="news-card"
                                >
                                    {/* Blog Image */}
                                    <Link
                                        to={blogLink}
                                        className="news-image-link"
                                        aria-label={`Read ${
                                            blog.title || "blog article"
                                        }`}
                                    >
                                        <div className="news-image-wrapper">
                                            {blog.main_image ? (
                                                <img
                                                    src={blog.main_image}
                                                    alt={
                                                        blog.title ||
                                                        "Shopery blog article"
                                                    }
                                                    className="news-image"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="news-image-placeholder">
                                                    <MdOutlineArticle />
                                                    <span>Shopery Journal</span>
                                                </div>
                                            )}

                                            {blog.date && (
                                                <div className="news-date-badge">
                                                    <FiCalendar />
                                                    <span>{blog.date}</span>
                                                </div>
                                            )}

                                            <div className="news-image-overlay">
                                                <span>
                                                    Read Article
                                                    <FiArrowUpRight />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    {/* Blog Content */}
                                    <div className="news-card-content">

                                        <div className="news-meta">
                                            {blog.category && (
                                                <span className="news-meta-item news-category">
                                                    <GoTag />
                                                    {blog.category}
                                                </span>
                                            )}

                                            {blog.author && (
                                                <span className="news-meta-item">
                                                    <CiUser />
                                                    {blog.author}
                                                </span>
                                            )}

                                            <span className="news-meta-item">
                                                <FaRegCommentAlt />
                                                {commentsCount} Comments
                                            </span>
                                        </div>

                                        <h3 className="news-card-title">
                                            <Link to={blogLink}>
                                                {blog.title ||
                                                    "Discover More from Shopery"}
                                            </Link>
                                        </h3>

                                        <div className="news-card-footer">
                                            <Link
                                                to={blogLink}
                                                className="news-read-more"
                                            >
                                                Read More
                                                <MdArrowRightAlt />
                                            </Link>

                                            <span className="news-article-label">
                                                Article
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Bottom CTA */}
                {!loading && !error && blogs.length > 0 && (
                    <div className="news-bottom-cta">
                        <p>
                            Want more tips, insights and updates?
                        </p>

                        <Link to="/blog">
                            Discover More Articles
                            <MdArrowRightAlt />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default News;
