import { useEffect, useState } from "react";
import { Link, useLoaderData, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { FaShoppingBag, FaStar, FaStarHalfAlt, FaRegStar, FaFacebookF, FaTwitter, FaPinterestP, FaInstagram, FaRegEye } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { CiHeart } from "react-icons/ci";
import '../shop.css';
// import Description from "./Description";
import Newsletter from "../Products/Newsletter";
import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useCart from "../../../Hooks/useCart";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from 'react-helmet-async';

import { FaCircleCheck } from "react-icons/fa6";
import { IoPlay, IoPlayCircleSharp } from "react-icons/io5";
import CustomerReview from "./CustomerReview";
import useAdmin from "../../../Hooks/useAdmin";

const SeeProduct = () => {

    const [isAdmin] = useAdmin();


    const seeProduct = useLoaderData();
    const location = useLocation();
    const productId = location.state?.productId;
    const product = Array.isArray(seeProduct)
        ? seeProduct.find((product) => product._id === productId)
        : null;

    const [selectedImage, setSelectedImage] = useState(product?.images[0] || "");
    const [relatedProducts, setRelatedProducts] = useState([]);

    useEffect(() => {
        // Fetch related products from the server
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => {
                // Filter out the current product
                const filteredProducts = data.filter(p => p._id !== productId);
                setRelatedProducts(filteredProducts);
            });
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="flex">
                {Array.from({ length: fullStars }, (_, index) => (
                    <FaStar key={index} className="text-yellow-500" />
                ))}
                {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
                {Array.from({ length: emptyStars }, (_, index) => (
                    <FaRegStar key={index} className="text-yellow-500" />
                ))}
            </div>
        );
    };

    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (amount) => {
        setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));


    };



    const { user } = useAuth();

  const axiosPublic = useAxiosPublic();

  const navigate = useNavigate();

  const [ , refetch ] = useCart();



  const [activeTab, setActiveTab] = useState("Descriptions"); // Initial active tab

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };




  


    const handleAddToCart = () => {

        if(isAdmin) {
            toast.info("Admin users cannot add items to the wishlist", {
                position: "top-center",
                autoClose: 3000,
                // onClose: () =>  navigate('/userdashboard/myappointment')
            });
            return;
        }

        else if (user && user.email) {
        // Fetch the current cart items from the server
        axiosPublic.get('/carts', { params: { email: user.email } })
            .then((response) => {
            const cartItems = response.data;

            // Check if the item already exists in the cart
            const isItemInCart = cartItems.some((cartItem) => cartItem.cartId === product._id);

            if (isItemInCart) {
                toast.error(`${product.name} is already added to the cart`, {
                    position: "top-center",
                    autoClose: 3000,
                    // onClose: () =>  navigate('/userdashboard/myappointment')
                });
                return; // Exit the function if the item is already in the cart
            }

            // If the item is not in the cart, send cart item to the database
            const cartItem = {
                cartId: product._id,
                email: user.email,
                product: product.name,
                image: product.images[0],
                price: product.price,
                quantity: quantity
            };

            axiosPublic.post('/carts', cartItem)
                .then((res) => {
                console.log(res.data);
                if (res.data.insertedId) {
                    toast.success(`${product.name} is Added to the cart`, {
                        position: "top-center",
                        autoClose: 3000,
                        onClose: () =>  navigate('/cart')
                    });
                    // refetch cart to update the cart items count
                    refetch();
                }
                })
                
            })
            
        } 

        else {
            
            toast.warning("Please Login at first", {
                position: "top-center",
                autoClose: 3000,
                onClose: () =>  navigate("/login", { state: { from: location } })
            });
        
        }
        };



   


    
    return (
        <section className="nunito_sans">
            <Helmet>
                <title>Shopery | Product Details </title>
                {/* <link rel="canonical" href="https://www.tacobell.com/" /> */}
            </Helmet>
            <ToastContainer/>
            <div className="specific_product_banner h-full lg:h-[30vh] mb-2">
                <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">
                    <ul>
                        <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>
                        <li><Link to="/shop" className="flex items-center gap-1"><FaShoppingBag />Shop</Link></li>
                        <li className="text-[#00B207] font-bold"><p>{product.name}</p></li>
                    </ul>
                </div>
            </div>

            <div className="px-5 lg:px-12 py-10 mb-10">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                    {/* Thumbnail Gallery */}
                    <div className="flex flex-col lg:flex-row items-start lg:items-center">
                        <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 mx-auto mb-5">
                            {product.images?.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`${product.name} thumbnail ${index + 1}`}
                                    className="w-20 h-20 object-cover cursor-pointer border-2 border-transparent hover:border-gray-500"
                                    onClick={() => setSelectedImage(image)}
                                />
                            ))}
                        </div>
                        <div className="w-full mb-5">
                            <img src={selectedImage} alt={product.name} className=" lg:w-[300px]  lg:h-[240px] mx-auto rounded-lg shadow-xl" />
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="h-auto">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-[27px]">{product.name}</h3>
                                <p className=' rounded-[4px]'>
                                    {
                                        product.availability === "In Stock" ? <span className='bg-[#D2F0D4] text-[#2C742F] font-bold p-2 rounded-[4px]'>In Stock</span> : <span className='bg-[#FDEDED] text-[#EA4B48] font-bold p-2 rounded-[4px]'>Out of Stock</span>
                                    }
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {renderStars(product.rating)}
                                <span className="ml-[2px]"> 4 reviews</span>
                                <span className=""><strong>SKU</strong> 251994</span>
                            </div>
                            <p className="text-[#2C742F] font-bold text-[19px]">৳{product.price}</p>
                            <hr />

                            <div className="flex items-center justify-between mb-3">
                                <p><strong>Category: </strong>{product.category}</p>
                                <ul className="flex items-center">
                                    <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
                                        <FaFacebookF />
                                    </li>
                                    <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
                                        <FaTwitter />
                                    </li>
                                    <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
                                        <FaPinterestP />
                                    </li>
                                    <li className='text-[17px] text-[#222] rounded-full transition-all delay-200 p-3 hover:bg-green-700 hover:text-[#fff] cursor-pointer'>
                                        <FaInstagram />
                                    </li>
                                </ul>
                            </div>

                            <p className="">{product.description}</p>

                            <div className="flex items-center gap-2">
                                <div>
                                    <div className="flex items-center gap-1 border rounded-[30px] px-3 py-3">
                                        <button onClick={() => handleQuantityChange(-1)} type="button" className="text-gray-600 transition hover:opacity-75">
                                            -
                                        </button>
                                        <span className="px-4">{quantity}</span>

                                        <button onClick={() => handleQuantityChange(1)} type="button" className="transition hover:opacity-75">
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-3 my-4">
                                    {/* <button onClick={handleAddToCart} className='flex items-center gap-1 px-14 py-2 rounded-[30px] bg-[#00B307] text-[#fff]'>Add to Cart <FiShoppingCart /></button> */}

                                {
                                    product.availability === "In Stock" ?  <button onClick={handleAddToCart} className='flex items-center gap-1 px-14 py-3 rounded-[30px] bg-[#00B307] text-[#fff]'>Add to Cart <FiShoppingCart /></button>
                                    :
                                    <button disabled className='flex items-center gap-1 px-14 py-3 rounded-[30px] bg-[#eee] text-[#00B307]'>Add to Cart <FiShoppingCart /></button>
                                }

                                </div>
                                <div>
                                    <CiHeart />
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>





            {/* Description */}

            <div className="px-5 lg:px-12 py-10">

                {/* Tabs */}
                
                <div className="flex w-full lg:w-7/12 mx-auto gap-8 lg:justify-center overflow-x-auto overflow-y-hidden border-gray-200 whitespace-nowrap border-b ">
                    <button
                    onClick={() => handleTabClick("Descriptions")}
                    className={`inline-flex items-center  text-sm text-center ${
                        activeTab === "Descriptions"
                        ? "text-[#111] font-bold border-b border-b-[#00B207] "
                        : "text-[#878686] hover:text-[#00B207]"
                    }  rounded-tl-[5px] sm:text-base whitespace-nowrap focus:outline-none`}
                    >
                    Descriptions
                    </button>

                    <button
                    onClick={() => handleTabClick("Additional_Information")}
                    className={`inline-flex items-center  text-sm text-center ${
                        activeTab === "Additional_Information"
                        ? "text-[#111] font-bold border-b border-b-[#00B207]  "
                        : "text-[#878686] hover:text-[#00B207]"
                    }  rounded-tl-[5px] sm:text-base whitespace-nowrap focus:outline-none`}
                    >
                    Additional Information
                    </button>

                    <button
                    onClick={() => handleTabClick("Customer_Feedback")}
                    className={`inline-flex items-center  text-sm text-center ${
                        activeTab === "Customer_Feedback"
                        ? "text-[#111] font-bold border-b border-b-[#00B207]  "
                        : "text-[#878686] hover:text-[#00B207]"
                    }  rounded-tl-[5px] sm:text-base whitespace-nowrap focus:outline-none`}
                    >
                    Customer Feedback
                    </button>




                    
                </div>


                {/* Tab Contents */}
                {activeTab === "Descriptions" && (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-12 mt-16"
                    data-aos="zoom-in"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out">
                        <div className="h-auto ">
                            <p className="text-[16px] text-[#878686] leading-6  mb-[10px]">Sed commodo aliquam dui ac porta. Fusce ipsum felis, imperdiet at posuere ac, viverra at mauris. Maecenas tincidunt ligula a sem vestibulum pharetra. Maecenas auctor tortor lacus, nec laoreet nisi porttitor vel. Etiam tincidunt metus vel dui interdum sollicitudin. Mauris sem ante, vestibulum nec orci vitae, aliquam mollis lacus. Sed et condimentum arcu, id molestie tellus. Nulla facilisi. Nam scelerisque vitae justo a convallis. Morbi urna ipsum, placerat quis commodo quis, egestas elementum leo. Donec convallis mollis enim. Aliquam id mi quam. Phasellus nec fringilla elit.</p>

                            <p className="text-[16px] text-[#878686] leading-6  mb-5">Nulla mauris tellus, feugiat quis pharetra sed, gravida ac dui. Sed iaculis, metus faucibus elementum tincidunt, turpis mi viverra velit, pellentesque tristique neque mi eget nulla. Proin luctus elementum neque et pharetra. </p>

                            <ul className="mb-3 space-y-2">
                                <li className="flex items-center gap-2 text-[#878686]"><FaCircleCheck className="text-[#00B207]"/> 100 g of fresh leaves provides. </li>
                                <li className="flex items-center gap-2 text-[#878686]"><FaCircleCheck className="text-[#00B207]"/> Aliquam ac est at augue volutpat elementum. </li>
                                <li className="flex items-center gap-2 text-[#878686]"><FaCircleCheck className="text-[#00B207]"/> Quisque nec enim eget sapien molestie. </li>
                                <li className="flex items-center gap-2 text-[#878686]"><FaCircleCheck className="text-[#00B207]"/> Proin convallis odio volutpat finibus posuere. </li>
                                
                            </ul>

                            <p className="text-[16px] text-[#878686] leading-6 ">Cras et diam maximus, accumsan sapien et, sollicitudin velit. Nulla blandit eros non turpis lobortis iaculis at ut massa.  </p>

                        </div>

                        <div className="h-auto relative">
                            <img src="https://i.ibb.co/CzwyHXz/mann.png" className="w-full h-auto" alt="" />
                            <button className="absolute text-[#fff] bg-[#00B207] text-[20px] p-3 rounded-full left-[46%] top-[30%]">
                                <IoPlay  />
                            </button>

                            <div className="mt-6 w-auto border p-3 rounded-[5px] flex items-center justify-evenly gap-5">
                                <div className="flex items-center gap-2">
                                    <div>
                                        <img src="https://i.ibb.co/rMWH4HB/gggggg.png" className="w-auto h-auto" alt="" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#111] font-bold text-[18px]">64% Discount</h3>
                                        <p className="text-[#6e6c6c]">Save your 64% money with us</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div>
                                        <img src="https://i.ibb.co/8rnHz57/leaf-1.png" className="w-auto h-auto" alt="" />
                                    </div>
                                    <div>
                                        <h3 className="text-[#111] font-bold text-[18px]">100% Organic</h3>
                                        <p className="text-[#6e6c6c]">100% Organic Vegetables</p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                )}

                {activeTab === "Additional_Information" && (
                    <div className="mt-16"
                    data-aos="zoom-in"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out">
                        <h2 className="text-[24px] font-bold mb-4">Additional Information</h2>
                        <ul className="list-disc pl-5 space-y-2 text-[16px] text-[#878686] leading-6">
                            <li><strong>Weight:</strong> 1 kg</li>
                            <li><strong>Dimensions:</strong> 10 x 5 x 5 cm</li>
                            <li><strong>Country of Origin:</strong> USA</li>
                            <li><strong>Storage Instructions:</strong> Store in a cool, dry place.</li>
                            <li><strong>Nutritional Information (per 100g):</strong>
                                <ul className="list-disc pl-5">
                                    <li>Calories: 77</li>
                                    <li>Protein: 2g</li>
                                    <li>Fat: 0.1g</li>
                                    <li>Carbohydrates: 17g</li>
                                </ul>
                            </li>
                            <li><strong>Usage Tips:</strong> Perfect for baking, boiling, and frying.</li>
                        </ul>
                    </div>
                )}


                {activeTab === "Customer_Feedback" && (
                    <div className="mt-16 w-full lg:w-7/12"
                    data-aos="zoom-in"
                    data-aos-delay="50"
                    data-aos-duration="1000"
                    data-aos-easing="ease-in-out">
                        <CustomerReview reviewId={productId} productName={product.name} />
                    </div>
                )}




            </div>









            {/* Related Products */}
            <div className="px-5 lg:px-12 py-10 mb-10">
                <h2 className="text-2xl font-semibold mb-4">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.slice(0, 4).map((relatedProduct) => (
                        <div key={relatedProduct._id} className="h-auto p-4 border rounded-[3px] product_Card relative"
                        data-aos="zoom-in"
                        data-aos-delay="50"
                        data-aos-duration="1000"
                        data-aos-easing="ease-in-out">
                            <div>
                                <img src={relatedProduct.images[0]} alt={relatedProduct.name} className="w-auto lg:w-[260px] h-auto lg:h-[160px]  mx-auto" />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                   
                                    <h4 className="text-[#333] font-[600] text-[17px] hover-text-color">{relatedProduct.name}</h4>
                                    
                                    <p className="text-bold text-[#111]">{relatedProduct.price}</p>
                                    <div className="flex items-center">
                                        {renderStars(relatedProduct.rating)}
                                    </div>
                                </div>
                                <div className="p-2 cursor-pointer rounded-full bg-[#eee] text-[#111] cart">
                                    <FiShoppingCart />
                                </div>
                            </div>
                            <div className="absolute top-2 right-2 text-[17px] heart_eye">
                                <CiHeart />
                                <FaRegEye />
                            </div>
                            <p className='absolute rounded-[4px] top-3 left-2'>
                                {
                                    relatedProduct.availability === "In Stock" ? <span className='bg-[#D2F0D4] text-[#2C742F] font-bold p-2 rounded-[4px]'>In Stock</span> : <span className='bg-[#FDEDED] text-[#EA4B48] font-bold p-2 rounded-[4px]'>Out of Stock</span>
                                }
                            </p>
                        </div>
                    ))}
                </div>
            </div>


            <Newsletter/>



        </section>
    );
};

export default SeeProduct;
