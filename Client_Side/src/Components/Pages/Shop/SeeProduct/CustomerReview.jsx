import useAuth from "../../../Hooks/useAuth";
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaStar } from 'react-icons/fa';

const CustomerReview = ({ reviewId, productName }) => {
    const { user } = useAuth();
    const [reviewText, setReviewText] = useState('');
    const [review, setReview] = useState('');
    const [reviews, setReviews] = useState([]);
    const name = user?.displayName || ''; // Handle null user case
    const photo = user?.photoURL || ''; // Handle null user case

    useEffect(() => {
        // Fetch existing reviews for the product
        const fetchReviews = async () => {
            try {
                const response = await fetch(`http://localhost:5000/products/${reviewId}/reviews`);
                const data = await response.json();
                setReviews(data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };

        fetchReviews();
    }, [reviewId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:5000/products/${reviewId}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviewText, review, name, photo }),
            });

            if (response.ok) {
                const newReview = await response.json();
                setReviews([...reviews, newReview]);
                setReviewText('');
                setReview('');
                toast.success(`Review submitted`, {
                    position: "top-center",
                    autoClose: 3000,
                });
            } else {
                toast.error("Failed to submit review", {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error("Error submitting review", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={i < rating ? "text-yellow-500" : "text-gray-300"}
                />
            );
        }
        return stars;
    };

    return (
        <section className='py-4 mt-4'>
            <ToastContainer />
            <h2 className='text-[#222] font-bold text-[20px] mb-4'>Give review for <span className='text-[#00B207]'>{productName}</span> </h2>

            <form onSubmit={handleSubmitReview} className='space-y-3 my-4 mb-8'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div>
                        <h4 className='text-[#333] text-[16px] mb-2'>Name</h4>
                        <input
                            type="text"
                            placeholder='example'
                            className="w-full border focus:outline-none focus:border-[#479551d5] px-4 py-3 rounded-[6px]"
                            value={name}
                            readOnly
                            required
                        />
                    </div>

                    <div>
                        <h4 className='text-[#333] text-[16px] mb-2'>Review</h4>
                        <input
                            type="text"
                            placeholder='Enter your review'
                            className="w-full border focus:outline-none focus:border-[#479551d5] px-4 py-3 rounded-[6px]"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <div>
                    <h4 className='text-[#333] text-[16px] mb-2'>Message</h4>
                    <textarea
                        className="w-full border focus:outline-none px-4 py-3 rounded-[6px] h-32 resize-none focus:border-[#479551d5]"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <button className='px-7 py-[10px] rounded-[25px] flex items-center gap-3 bg-[#00B307] text-[#FFF]'>
                        Submit Review
                    </button>
                </div>
            </form>

            {/* Render Reviews */}
            <h3 className='text-[#222] font-[600] text-[17px] mb-5'>Customer Reviews</h3>
            <ul className='space-y-4'>
                {reviews.map((review, index) => (
                    <li key={index} className="border-b pb-3 last:border-b-0 rounded-md">
                        <div className="flex gap-4 mb-2">
                            <div>
                                <img src={review.photo} alt={review.name} className="w-8 h-8 rounded-full" />
                            </div>
                            <div>
                                <span className="font-bold">{review.name}</span>
                                <p className="text-[#878686]">{review.reviewText}</p>
                                <div className="text-yellow-500 flex items-center gap-1 mt-1">{renderStars(review.review)}</div>
                            </div>
                        </div>
                        
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default CustomerReview;
