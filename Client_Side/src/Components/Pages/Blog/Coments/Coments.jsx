import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../../Hooks/useAuth';

const Comments = ({ blogId }) => {
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);

    const {user} = useAuth();

    const email = user.email;
    const photo = user.photoURL;
    const name = user.displayName

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:5000/blogs/${blogId}/comments`);
            if (response.ok) {
                const data = await response.json();
                setComments(data);
            }
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const handlePostingComment = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch(`http://localhost:5000/blogs/${blogId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ commentText, name, email, photo }),
            });
    
            if (response.ok) {
                const newComment = await response.json();
                setComments([...comments, newComment]);
                setCommentText('');
                name;
                email;
                photo;
                toast.success(`Posted your Comment`, {
                    position: "top-center",
                    autoClose: 3000,
                });
            } else {
                toast.error("Failed to post comment", {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            toast.error("Error posting comment", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };
    

    return (
        <section className='py-4 mt-4'>
            <ToastContainer />
            <h2 className='text-[#222] font-bold text-[20px] mb-4'>Leave a Comment</h2>

            <form onSubmit={handlePostingComment} className='space-y-3 my-4 mb-8'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div>
                        <h4 className='text-[#333] text-[16px] mb-2'>Full Name</h4>
                        <input
                            type="text"
                            placeholder='example'
                            className="w-full border focus:outline-none focus:border-[#479551d5] px-4 py-3 rounded-[6px]"
                            defaultValue={user.displayName}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <h4 className='text-[#333] text-[16px] mb-2'>Email</h4>
                        <input
                            type="email"
                            placeholder='example@gmail.com'
                            className="w-full border focus:outline-none focus:border-[#479551d5] px-4 py-3 rounded-[6px]"
                            defaultValue={user.email}
                            
                            required
                        />
                    </div>
                </div>

                <div>
                    <h4 className='text-[#333] text-[16px] mb-2'>Message</h4>
                    <textarea
                        className="w-full border focus:outline-none px-4 py-3 rounded-[6px] h-32 resize-none focus:border-[#479551d5]"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <button className='px-7 py-[10px] rounded-[25px] flex items-center gap-3 bg-[#00B307] text-[#FFF]'>
                        Post Comments
                    </button>
                </div>
            </form>

            {/* Render Comments */}
            <h3 className='text-[#222] font-[600] text-[17px] mb-5'>Comments</h3>

            <ul className='space-y-4'>
                {comments.map((comment, index) => (
                    <li key={index} className='flex items-start gap-2 border-b pb-4 mb-7'>
                        <div>
                            <img src={comment.photo} className="w-[60px] h-[60px] rounded-full" alt="" />
                        </div>
                        <div>
                            <h4 className='text-[#222] flex items-center text-[17px] mb-1'>{comment.name} 
                                <p className='text-[#777] text-[12px]'>
                                    . {new Date(comment.createdAt).toLocaleString()}
                                </p> 
                            </h4>
                            <p className='text-[#555] text-[15px] mb-2'>{comment.commentText}</p>
                            
                        </div>
                    </li>
                ))}

            </ul>
        </section>
    );
};

export default Comments;
