import { useEffect, useMemo, useState } from "react";
import { FaSearch, FaRegNewspaper, FaArrowDown } from "react-icons/fa";
import Blog from "./Blog";
import "./blog.css";

const API_URL = "http://localhost:5000";

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOrder, setSortOrder] = useState("latest");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchBlogs = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(`${API_URL}/blogs`, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error(
                        `Blog load failed. Server returned ${response.status}.`
                    );
                }

                const data = await response.json();

                const blogList = Array.isArray(data)
                    ? data
                    : Array.isArray(data.blogs)
                        ? data.blogs
                        : [];

                setBlogs(blogList);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(
                        "Blog load করা যাচ্ছে না। Backend চালু আছে কি না এবং /blogs API ঠিক আছে কি না পরীক্ষা করো।"
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchBlogs();

        return () => controller.abort();
    }, []);

    const categories = useMemo(() => {
        const categoryNames = blogs
            .map((blog) => blog.category?.trim())
            .filter(Boolean);

        return ["All", ...new Set(categoryNames)];
    }, [blogs]);

    const filteredBlogs = useMemo(() => {
        const search = searchText.trim().toLowerCase();

        const result = blogs.filter((blog) => {
            const title = String(blog.title || "").toLowerCase();
            const category = String(blog.category || "").toLowerCase();
            const author = String(blog.author || "").toLowerCase();
            const description = String(
                blog.short_description || blog.description || blog.content || ""
            ).toLowerCase();

            const matchesSearch =
                !search ||
                title.includes(search) ||
                category.includes(search) ||
                author.includes(search) ||
                description.includes(search);

            const matchesCategory =
                selectedCategory === "All" ||
                blog.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        result.sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt || 0).getTime();
            const dateB = new Date(b.date || b.createdAt || 0).getTime();

            if (sortOrder === "oldest") {
                return dateA - dateB;
            }

            return dateB - dateA;
        });

        return result;
    }, [blogs, searchText, selectedCategory, sortOrder]);

    return (
        <main className="shopery-blog-page">
            <section className="blog-hero">
                <div className="blog-hero-decoration blog-hero-decoration-one" />
                <div className="blog-hero-decoration blog-hero-decoration-two" />

                <div className="blog-container blog-hero-content">
                    <span className="blog-eyebrow">
                        <FaRegNewspaper />
                        SHOPERY JOURNAL
                    </span>

                    <h1>
                        Ideas that inspire.
                        <br />
                        <span>Stories that matter.</span>
                    </h1>

                    <p>
                        Discover helpful guides, fresh ideas, and practical
                        insights for smarter shopping and everyday living.
                    </p>

                    <a href="#blog-articles" className="blog-hero-button">
                        Explore articles
                        <FaArrowDown />
                    </a>
                </div>
            </section>

            <section
                id="blog-articles"
                className="blog-container blog-listing-section"
            >
                <div className="blog-section-heading">
                    <div>
                        <span className="blog-section-kicker">
                            THE LATEST STORIES
                        </span>
                        <h2>Explore our journal</h2>
                        <p>
                            Useful reads, thoughtful ideas, and inspiration for
                            your next discovery.
                        </p>
                    </div>

                    <div className="blog-result-count">
                        <strong>{filteredBlogs.length}</strong>
                        <span>
                            {filteredBlogs.length === 1 ? " article" : " articles"}
                        </span>
                    </div>
                </div>

                <div className="blog-toolbar">
                    <div className="blog-search-box">
                        <FaSearch aria-hidden="true" />
                        <input
                            type="search"
                            placeholder="Search articles, topics, authors..."
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                            aria-label="Search blog articles"
                        />

                        {searchText && (
                            <button
                                type="button"
                                onClick={() => setSearchText("")}
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}
                    </div>

                    <label className="blog-sort-control">
                        <span>Sort by</span>
                        <select
                            value={sortOrder}
                            onChange={(event) => setSortOrder(event.target.value)}
                        >
                            <option value="latest">Latest first</option>
                            <option value="oldest">Oldest first</option>
                        </select>
                    </label>
                </div>

                <div className="blog-category-list" aria-label="Blog categories">
                    {categories.map((category) => (
                        <button
                            type="button"
                            key={category}
                            className={
                                selectedCategory === category
                                    ? "blog-category-button active"
                                    : "blog-category-button"
                            }
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading && (
                    <div className="blog-status-box">
                        <span className="blog-spinner" />
                        <p>Loading articles...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="blog-status-box blog-error-box">
                        <h3>Unable to load articles</h3>
                        <p>{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="blog-retry-button"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {!loading && !error && filteredBlogs.length === 0 && (
                    <div className="blog-status-box blog-empty-box">
                        <FaRegNewspaper />
                        <h3>No articles found</h3>
                        <p>Try another search term or select a different category.</p>
                        <button
                            type="button"
                            className="blog-retry-button"
                            onClick={() => {
                                setSearchText("");
                                setSelectedCategory("All");
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                )}

                {!loading && !error && filteredBlogs.length > 0 && (
                    <div className="blog-grid">
                        {filteredBlogs.map((blog) => (
                            <Blog key={blog._id} blog={blog} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
};

export default Blogs;