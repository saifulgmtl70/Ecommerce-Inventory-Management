import { useEffect, useState } from "react";
import { FaPaperPlane, FaRegCommentDots, FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/useAuth";

const API_URL = "http://localhost:5000";

const Comments = ({ blogId }) => {
    const { user } = useAuth();

    const [comments, setComments] = useState([]);
    const [name, setName] = useState(user?.displayName || "");
    const [email, setEmail] = useState(user?.email || "");
    const [commentText, setCommentText] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setName(user?.displayName || "");
        setEmail(user?.email || "");
    }, [user]);

    useEffect(() => {
        if (!blogId) {
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        const fetchComments = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/blogs/${blogId}/comments`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("Comments load করা যায়নি।");
                }

                const data = await response.json();

                setComments(
                    Array.isArray(data)
                        ? data
                        : Array.isArray(data.comments)
                            ? data.comments
                            : []
                );
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Comments load করতে সমস্যা হয়েছে।");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchComments();

        return () => controller.abort();
    }, [blogId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanComment = commentText.trim();

        if (!cleanName || !cleanEmail || !cleanComment) {
            toast.error("নাম, ইমেইল ও comment পূরণ করো।");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(cleanEmail)) {
            toast.error("সঠিক ইমেইল ঠিকানা দাও।");
            return;
        }

        if (cleanComment.length > 2000) {
            toast.error("Comment সর্বোচ্চ ২০০০ অক্ষরের হতে পারবে।");
            return;
        }

        try {
            setSubmitting(true);

            const newComment = {
                name: cleanName,
                email: user?.email || cleanEmail,
                photo:
                    user?.photoURL ||
                    user?.photoURL ||
                    "",
                commentText: cleanComment,
            };

            const response = await fetch(
                `${API_URL}/blogs/${blogId}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newComment),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Comment submit করা যায়নি।"
                );
            }

            const savedComment = data.comment || data;

            if (
                savedComment &&
                typeof savedComment === "object" &&
                (savedComment.commentText || savedComment._id)
            ) {
                setComments((previousComments) => [
                    savedComment,
                    ...previousComments,
                ]);
            } else {
                const refreshResponse = await fetch(
                    `${API_URL}/blogs/${blogId}/comments`
                );

                if (refreshResponse.ok) {
                    const refreshedData = await refreshResponse.json();

                    setComments(
                        Array.isArray(refreshedData)
                            ? refreshedData
                            : Array.isArray(refreshedData.comments)
                                ? refreshedData.comments
                                : []
                    );
                }
            }

            setCommentText("");
            toast.success("তোমার comment সফলভাবে জমা হয়েছে।");
        } catch (err) {
            toast.error(err.message || "Comment submit করতে সমস্যা হয়েছে।");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="blog-comments">
            <form className="blog-comment-form" onSubmit={handleSubmit}>
                <div className="blog-comment-form-heading">
                    <FaRegCommentDots />
                    <h3>Leave a comment</h3>
                </div>

                <p className="blog-comment-form-subtitle">
                    তোমার মতামত জানাও। Comment করার আগে তথ্যগুলো দেখে নাও।
                </p>

                <div className="blog-comment-fields">
                    <div className="blog-comment-field">
                        <label htmlFor="comment-name">Your name</label>
                        <input
                            id="comment-name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your name"
                            maxLength={100}
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="blog-comment-field">
                        <label htmlFor="comment-email">Email address</label>
                        <input
                            id="comment-email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            maxLength={254}
                            autoComplete="email"
                            required
                            readOnly={Boolean(user?.email)}
                        />
                    </div>
                </div>

                <div className="blog-comment-field">
                    <label htmlFor="comment-text">Your comment</label>
                    <textarea
                        id="comment-text"
                        value={commentText}
                        onChange={(event) => setCommentText(event.target.value)}
                        placeholder="Share your thoughts..."
                        rows={5}
                        maxLength={2000}
                        required
                    />

                    <span className="blog-comment-character-count">
                        {commentText.length}/2000
                    </span>
                </div>

                <button
                    type="submit"
                    className="blog-comment-submit"
                    disabled={submitting}
                >
                    {submitting ? "Submitting..." : "Post comment"}
                    <FaPaperPlane />
                </button>
            </form>

            <div className="blog-comments-list-section">
                <div className="blog-comments-list-heading">
                    <h3>Readers' comments</h3>
                    <span>{comments.length}</span>
                </div>

                {loading && (
                    <div className="blog-comments-message">
                        Loading comments...
                    </div>
                )}

                {!loading && error && (
                    <div className="blog-comments-message blog-comments-error">
                        {error}
                    </div>
                )}

                {!loading && !error && comments.length === 0 && (
                    <div className="blog-comments-empty">
                        <FaRegCommentDots />
                        <p>No comments yet. Be the first to comment!</p>
                    </div>
                )}

                {!loading && !error && comments.length > 0 && (
                    <div className="blog-comments-list">
                        {comments.map((comment, index) => {
                            const commentId =
                                comment._id ||
                                `${comment.email || "reader"}-${index}`;

                            const commentName = comment.name || "Reader";
                            const photo = comment.photo || comment.photoURL;
                            const commentDate =
                                comment.createdAt || comment.date;

                            return (
                                <article
                                    className="blog-comment-item"
                                    key={commentId}
                                >
                                    <div className="blog-comment-avatar">
                                        {photo ? (
                                            <img
                                                src={photo}
                                                alt={commentName}
                                                onError={(event) => {
                                                    event.currentTarget.style.display =
                                                        "none";
                                                }}
                                            />
                                        ) : (
                                            <FaUserCircle />
                                        )}
                                    </div>

                                    <div className="blog-comment-body">
                                        <div className="blog-comment-author-row">
                                            <h4>{commentName}</h4>

                                            {commentDate && (
                                                <time>
                                                    {new Date(
                                                        commentDate
                                                    ).toLocaleDateString(
                                                        "en-GB",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </time>
                                            )}
                                        </div>

                                        <p>
                                            {comment.commentText ||
                                                comment.text ||
                                                ""}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comments;