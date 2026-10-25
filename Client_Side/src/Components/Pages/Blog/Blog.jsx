import { Link } from "react-router-dom";
import {
    FaArrowRight,
    FaCalendarAlt,
    FaUser,
} from "react-icons/fa";

const Blog = ({ blog }) => {
    const {
        _id,
        title,
        main_image,
        date,
        author,
        category,
        short_description,
        description,
        content,
    } = blog;

    const image =
        main_image ||
        blog.image ||
        "https://placehold.co/800x550/f0fdf4/166534?text=Shopery+Journal";

    const formattedDate = date || blog.createdAt
        ? new Date(date || blog.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        })
        : "Date unavailable";

    const summary = short_description || description || content || "";

    const excerpt =
        typeof summary === "string"
            ? summary.replace(/<[^>]*>/g, "").slice(0, 145)
            : "";

    return (
        <article className="blog-card">
            <Link
                to={`/seeblog/${_id}`}
                className="blog-card-image-link"
                aria-label={`Read ${title || "blog article"}`}
            >
                <img
                    src={image}
                    alt={title || "Shopery blog article"}
                    className="blog-card-image"
                    loading="lazy"
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src =
                            "https://placehold.co/800x550/f0fdf4/166534?text=Shopery+Journal";
                    }}
                />

                {category && (
                    <span className="blog-card-category">{category}</span>
                )}
            </Link>

            <div className="blog-card-content">
                <div className="blog-card-meta">
                    <span>
                        <FaCalendarAlt />
                        {formattedDate}
                    </span>

                    {author && (
                        <span>
                            <FaUser />
                            {author}
                        </span>
                    )}
                </div>

                <h3 className="blog-card-title">
                    <Link to={`/seeblog/${_id}`}>
                        {title || "Untitled article"}
                    </Link>
                </h3>

                {excerpt && (
                    <p className="blog-card-description">
                        {excerpt}
                        {summary.length > 145 ? "..." : ""}
                    </p>
                )}

                <Link to={`/seeblog/${_id}`} className="blog-card-read-more">
                    Read article
                    <FaArrowRight />
                </Link>
            </div>
        </article>
    );
};

export default Blog;