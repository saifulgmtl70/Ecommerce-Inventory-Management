import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaArrowRight,
    FaCalendarAlt,
    FaFacebookF,
    FaLink,
    FaRegNewspaper,
    FaShareAlt,
    FaUser,
} from "react-icons/fa";
import Comments from "./Coments/Coments";
import "./blog.css";

const API_URL = "http://localhost:5000";

const SeeBlog = () => {
    const { id } = useParams();

    const [blog, setBlog] = useState(null);
    const [allBlogs, setAllBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [shareMessage, setShareMessage] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        const fetchBlogData = async () => {
            try {
                setLoading(true);
                setError("");

                const [blogResponse, blogsResponse] = await Promise.all([
                    fetch(`${API_URL}/blogs/${id}`, {
                        signal: controller.signal,
                    }),
                    fetch(`${API_URL}/blogs`, {
                        signal: controller.signal,
                    }),
                ]);

                if (!blogResponse.ok) {
                    if (blogResponse.status === 404) {
                        throw new Error("এই blog-টি পাওয়া যায়নি।");
                    }

                    throw new Error(
                        `Blog load failed. Server returned ${blogResponse.status}.`
                    );
                }

                if (!blogsResponse.ok) {
                    throw new Error("Related blogs load করা যাচ্ছে না।");
                }

                const blogData = await blogResponse.json();
                const blogsData = await blogsResponse.json();

                const selectedBlog = blogData.blog || blogData;

                setBlog(selectedBlog);
                setAllBlogs(
                    Array.isArray(blogsData)
                        ? blogsData
                        : Array.isArray(blogsData.blogs)
                            ? blogsData.blogs
                            : []
                );
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Blog load করার সময় সমস্যা হয়েছে।");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchBlogData();
        } else {
            setError("Blog ID পাওয়া যায়নি।");
            setLoading(false);
        }

        return () => controller.abort();
    }, [id]);

    const formattedDate =
        blog?.date || blog?.createdAt
            ? new Date(blog.date || blog.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            : "Date unavailable";

    const relatedBlogs = allBlogs
        .filter(
            (item) =>
                item._id !== id &&
                item._id !== blog?._id &&
                (
                    !blog?.category ||
                    item.category === blog.category
                )
        )
        .slice(0, 3);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setShareMessage("Article link copied!");
        } catch {
            setShareMessage("Link copy করা যায়নি। Browser permission পরীক্ষা করো।");
        }

        window.setTimeout(() => setShareMessage(""), 2500);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: blog?.title || "Shopery Journal",
                    text: blog?.short_description || blog?.title || "",
                    url: window.location.href,
                });
            } catch (err) {
                if (err.name !== "AbortError") {
                    handleCopyLink();
                }
            }
        } else {
            handleCopyLink();
        }
    };

    if (loading) {
        return (
            <main className="shopery-blog-page">
                <div className="blog-container blog-status-box">
                    <span className="blog-spinner" />
                    <p>Loading article...</p>
                </div>
            </main>
        );
    }

    if (error || !blog) {
        return (
            <main className="shopery-blog-page">
                <div className="blog-container blog-status-box blog-error-box">
                    <h2>Article unavailable</h2>
                    <p>{error || "এই article পাওয়া যায়নি।"}</p>
                    <Link to="/blogs" className="blog-back-button">
                        <FaArrowLeft />
                        Back to blogs
                    </Link>
                </div>
            </main>
        );
    }

    const mainImage =
        blog.main_image ||
        blog.image ||
        "https://placehold.co/1200x650/f0fdf4/166534?text=Shopery+Journal";

    const articleContent =
        blog.content ||
        blog.full_description ||
        blog.description ||
        blog.short_description ||
        "";

    return (
        <main className="shopery-blog-page blog-detail-page">
            <div className="blog-detail-topbar">
                <div className="blog-container">
                    <Link to="/blogs" className="blog-back-link">
                        <FaArrowLeft />
                        All articles
                    </Link>

                    <span className="blog-detail-brand">
                        <FaRegNewspaper />
                        SHOPERY JOURNAL
                    </span>
                </div>
            </div>

            <div className="blog-container blog-detail-layout">
                <article className="blog-detail-main">
                    <header className="blog-detail-header">
                        {blog.category && (
                            <span className="blog-detail-category">
                                {blog.category}
                            </span>
                        )}

                        <h1>{blog.title || "Untitled article"}</h1>

                        <div className="blog-detail-meta">
                            <span>
                                <FaCalendarAlt />
                                {formattedDate}
                            </span>

                            {blog.author && (
                                <span>
                                    <FaUser />
                                    {blog.author}
                                </span>
                            )}
                        </div>
                    </header>

                    <div className="blog-detail-cover">
                        <img
                            src={mainImage}
                            alt={blog.title || "Blog cover"}
                            onError={(event) => {
                                event.currentTarget.onerror = null;
                                event.currentTarget.src =
                                    "https://placehold.co/1200x650/f0fdf4/166534?text=Shopery+Journal";
                            }}
                        />
                    </div>

                    {blog.short_description && (
                        <p className="blog-detail-intro">
                            {blog.short_description}
                        </p>
                    )}

                    <div className="blog-detail-content">
                        {typeof articleContent === "string" &&
                        /<[a-z][\s\S]*>/i.test(articleContent) ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: articleContent,
                                }}
                            />
                        ) : (
                            String(articleContent)
                                .split(/\n{2,}/)
                                .filter(Boolean)
                                .map((paragraph, index) => (
                                    <p key={`${index}-${paragraph.slice(0, 12)}`}>
                                        {paragraph}
                                    </p>
                                ))
                        )}
                    </div>

                    {Array.isArray(blog.extra_images) &&
                        blog.extra_images.length > 0 && (
                            <div className="blog-extra-images">
                                {blog.extra_images.map((image, index) => {
                                    const imageUrl =
                                        typeof image === "string"
                                            ? image
                                            : image?.url || image?.image;

                                    if (!imageUrl) return null;

                                    return (
                                        <img
                                            key={`${imageUrl}-${index}`}
                                            src={imageUrl}
                                            alt={`${blog.title || "Article"} ${index + 1}`}
                                            loading="lazy"
                                        />
                                    );
                                })}
                            </div>
                        )}

                    <div className="blog-detail-share">
                        <div>
                            <h3>Enjoyed this article?</h3>
                            <p>Share it with someone who might find it useful.</p>
                        </div>

                        <div className="blog-share-actions">
                            <button
                                type="button"
                                onClick={handleShare}
                                aria-label="Share article"
                                title="Share article"
                            >
                                <FaShareAlt />
                            </button>

                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                    typeof window !== "undefined"
                                        ? window.location.href
                                        : ""
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Share on Facebook"
                                title="Share on Facebook"
                            >
                                <FaFacebookF />
                            </a>

                            <button
                                type="button"
                                onClick={handleCopyLink}
                                aria-label="Copy article link"
                                title="Copy article link"
                            >
                                <FaLink />
                            </button>
                        </div>
                    </div>

                    {shareMessage && (
                        <p className="blog-share-message" role="status">
                            {shareMessage}
                        </p>
                    )}

                    <section className="blog-comments-section" id="comments">
                        <div className="blog-comments-heading">
                            <span>JOIN THE CONVERSATION</span>
                            <h2>Comments</h2>
                            <p>
                                Share your thoughts and join the discussion.
                            </p>
                        </div>

                        <Comments blogId={blog._id || id} />
                    </section>
                </article>

                <aside className="blog-detail-sidebar">
                    <div className="blog-sidebar-card blog-sidebar-about">
                        <span className="blog-sidebar-icon">
                            <FaRegNewspaper />
                        </span>
                        <h3>About Shopery Journal</h3>
                        <p>
                            A place for helpful ideas, practical guides, and
                            interesting stories to make everyday decisions easier.
                        </p>
                        <Link to="/blogs" className="blog-sidebar-link">
                            Explore all articles
                            <FaArrowRight />
                        </Link>
                    </div>

                    <div className="blog-sidebar-card">
                        <div className="blog-sidebar-title">
                            <h3>Related articles</h3>
                            <span>{relatedBlogs.length}</span>
                        </div>

                        {relatedBlogs.length > 0 ? (
                            <div className="blog-related-list">
                                {relatedBlogs.map((item) => (
                                    <Link
                                        to={`/seeblog/${item._id}`}
                                        key={item._id}
                                        className="blog-related-item"
                                    >
                                        <img
                                            src={
                                                item.main_image ||
                                                item.image ||
                                                "https://placehold.co/160x120/f0fdf4/166534?text=Blog"
                                            }
                                            alt={item.title || "Related article"}
                                            loading="lazy"
                                        />

                                        <div>
                                            <span>
                                                {item.category || "Article"}
                                            </span>
                                            <h4>{item.title || "Untitled article"}</h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="blog-related-empty">
                                No related articles available right now.
                            </p>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default SeeBlog;