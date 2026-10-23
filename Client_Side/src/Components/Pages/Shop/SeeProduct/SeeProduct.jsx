
import { useEffect, useRef, useState } from "react";
import {
    Link,
    useLoaderData,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import { HiOutlineHome } from "react-icons/hi";
import {
    FaShoppingBag,
    FaStar,
    FaStarHalfAlt,
    FaRegStar,
    FaFacebookF,
    FaTwitter,
    FaPinterestP,
    FaInstagram,
    FaRegEye,
} from "react-icons/fa";

import { FiShoppingCart } from "react-icons/fi";
import { CiHeart } from "react-icons/ci";
import { FaCircleCheck } from "react-icons/fa6";
import { IoPlay } from "react-icons/io5";

import "../shop.css";

import Newsletter from "../Products/Newsletter";
import CustomerReview from "./CustomerReview";

import useAuth from "../../../Hooks/useAuth";
import useAxiosPublic from "../../../Hooks/useAxiosPublic";
import useCart from "../../../Hooks/useCart";
import useAdmin from "../../../Hooks/useAdmin";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Helmet } from "react-helmet-async";

const SeeProduct = () => {
    const [isAdmin] = useAdmin();

    const loadedProducts = useLoaderData();

    const location = useLocation();
    const navigate = useNavigate();

    const { id: productId } = useParams();

    const product = Array.isArray(loadedProducts)
        ? loadedProducts.find(
              (item) => String(item._id) === String(productId)
          )
        : null;

    const [selectedImage, setSelectedImage] = useState("");
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("Descriptions");
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Prevent simultaneous Add to Cart requests.
    const addToCartLock = useRef(false);

    const { user } = useAuth();
    const axiosPublic = useAxiosPublic();
    const [, refetch] = useCart();

    // Stock information
    const hasStockTracking =
        product?.stockQuantity !== undefined &&
        product?.stockQuantity !== null &&
        product?.stockQuantity !== "";

    const stock = hasStockTracking
        ? Math.max(0, Number(product.stockQuantity) || 0)
        : null;

    const hasLowStockThreshold =
        product?.lowStockThreshold !== undefined &&
        product?.lowStockThreshold !== null &&
        product?.lowStockThreshold !== "";

    const lowStockThreshold = hasLowStockThreshold
        ? Math.max(0, Number(product.lowStockThreshold) || 0)
        : null;

    const isOutOfStock = product
        ? hasStockTracking
            ? stock <= 0
            : product.availability !== "In Stock"
        : false;

    const isLowStock =
        !isOutOfStock &&
        hasStockTracking &&
        lowStockThreshold !== null &&
        lowStockThreshold > 0 &&
        stock <= lowStockThreshold;

    const stockStatus = isOutOfStock
        ? "Out of Stock"
        : isLowStock
        ? `Only ${stock} left!`
        : "In Stock";

    const stockStatusClass = isOutOfStock
        ? "bg-[#FDEDED] text-[#EA4B48]"
        : isLowStock
        ? "bg-orange-100 text-orange-700"
        : "bg-[#D2F0D4] text-[#2C742F]";

    // Update selected image when product changes
    useEffect(() => {
        if (product?.images?.length > 0) {
            setSelectedImage(product.images[0]);
        } else {
            setSelectedImage("");
        }

        setQuantity(1);
        setActiveTab("Descriptions");
    }, [product]);

    // Fetch related products
    useEffect(() => {
        const controller = new AbortController();

        const fetchRelatedProducts = async () => {
            setRelatedLoading(true);

            try {
                const response = await fetch(
                    "http://localhost:5000/products",
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                const filteredProducts = Array.isArray(data)
                    ? data.filter(
                          (item) =>
                              String(item._id) !== String(productId)
                      )
                    : [];

                setRelatedProducts(filteredProducts);
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error(
                        "Related products error:",
                        error
                    );

                    setRelatedProducts([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setRelatedLoading(false);
                }
            }
        };

        fetchRelatedProducts();

        return () => {
            controller.abort();
        };
    }, [productId]);

    // Render product rating stars
    const renderStars = (rating) => {
        const numericRating = Number(rating) || 0;
        const safeRating = Math.max(0, Math.min(5, numericRating));

        const fullStars = Math.floor(safeRating);

        const halfStar =
            safeRating - fullStars >= 0.5 && fullStars < 5;

        const emptyStars =
            5 - fullStars - (halfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                {Array.from({ length: fullStars }, (_, index) => (
                    <FaStar
                        key={`full-${index}`}
                        className="text-yellow-500"
                    />
                ))}

                {halfStar && (
                    <FaStarHalfAlt className="text-yellow-500" />
                )}

                {Array.from({ length: emptyStars }, (_, index) => (
                    <FaRegStar
                        key={`empty-${index}`}
                        className="text-yellow-500"
                    />
                ))}
            </div>
        );
    };

    // Change quantity without exceeding available stock
    const handleQuantityChange = (amount) => {
        if (isOutOfStock) {
            return;
        }

        setQuantity((previousQuantity) => {
            const nextQuantity = Math.max(
                1,
                previousQuantity + amount
            );

            if (hasStockTracking && nextQuantity > stock) {
                toast.info(
                    `Only ${stock} item(s) available in stock.`,
                    {
                        position: "top-center",
                        autoClose: 2500,
                    }
                );

                return previousQuantity;
            }

            return nextQuantity;
        });
    };

    // Change active tab
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    // Add product to cart
    const handleAddToCart = async () => {
        // A ref prevents a second request before React rerenders.
        if (addToCartLock.current) {
            return;
        }

        if (isAdmin) {
            toast.info(
                "Admin users cannot add items to the cart.",
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );

            return;
        }

        if (!user?.email) {
            toast.warning("Please login first.", {
                position: "top-center",
                autoClose: 2000,
                onClose: () =>
                    navigate("/login", {
                        state: { from: location },
                    }),
            });

            return;
        }

        if (isOutOfStock) {
            toast.error("This product is currently out of stock.", {
                position: "top-center",
                autoClose: 3000,
            });

            return;
        }

        if (
            hasStockTracking &&
            (quantity < 1 || quantity > stock)
        ) {
            toast.error(
                `Only ${stock} item(s) available in stock.`,
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );

            return;
        }

        if (!product?._id) {
            toast.error("Product information is unavailable.");
            return;
        }

        addToCartLock.current = true;
        setIsAddingToCart(true);

        try {
            // Fetch current cart items for the logged-in user.
            const response = await axiosPublic.get("/carts", {
                params: { email: user.email },
            });

            const cartItems = Array.isArray(response.data)
                ? response.data
                : [];

            // Find all rows matching this product.
            const matchingItems = cartItems.filter(
                (item) =>
                    String(item.cartId) === String(product._id)
            );

            const existingCartItem = matchingItems[0];

            if (existingCartItem) {
                // Include quantities from any existing duplicate rows.
                const existingQuantity = matchingItems.reduce(
                    (total, item) =>
                        total + (Number(item.quantity) || 1),
                    0
                );

                const updatedQuantity =
                    existingQuantity + quantity;

                if (
                    hasStockTracking &&
                    updatedQuantity > stock
                ) {
                    toast.error(
                        `Your cart already has ${existingQuantity} item(s). Only ${stock} item(s) are available in total.`,
                        {
                            position: "top-center",
                            autoClose: 3500,
                        }
                    );

                    return;
                }

                // Update the first matching row.
                await axiosPublic.patch(
                    `/carts/${existingCartItem._id}`,
                    { quantity: updatedQuantity }
                );

                // Delete extra duplicate rows, if any.
                if (matchingItems.length > 1) {
                    await Promise.all(
                        matchingItems.slice(1).map((item) =>
                            axiosPublic.delete(`/carts/${item._id}`)
                        )
                    );
                }

                await refetch();

                toast.success(
                    `${product.name} quantity updated in your cart.`,
                    {
                        position: "top-center",
                        autoClose: 2500,
                    }
                );

                return;
            }

            // Add a new cart row only when no matching product exists.
            const cartItem = {
                cartId: product._id,
                email: user.email,
                product: product.name,
                image: product.images?.[0] || "",
                price: Number(product.price),
                quantity,
            };

            const result = await axiosPublic.post(
                "/carts",
                cartItem
            );

            if (result.data?.insertedId) {
                await refetch();

                toast.success(
                    `${product.name} added to your cart.`,
                    {
                        position: "top-center",
                        autoClose: 2000,
                        onClose: () => navigate("/cart"),
                    }
                );
            } else {
                toast.error(
                    "Could not add this product to your cart.",
                    {
                        position: "top-center",
                        autoClose: 3000,
                    }
                );
            }
        } catch (error) {
            console.error("Add to cart error:", error);

            toast.error(
                error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Something went wrong while adding the product to your cart.",
                {
                    position: "top-center",
                    autoClose: 3000,
                }
            );
        } finally {
            addToCartLock.current = false;
            setIsAddingToCart(false);
        }
    };

    // Product loader error
    if (!Array.isArray(loadedProducts)) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    Unable to load products
                </h2>

                <p className="mt-2 text-gray-500">
                    Please check your connection and try again.
                </p>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-5 rounded-full bg-[#00B207] px-6 py-3 font-semibold text-white hover:bg-green-700"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800">
                    Product not found
                </h2>

                <p className="mt-2 text-gray-500">
                    The requested product could not be found.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/shop")}
                    className="mt-5 rounded-full bg-[#00B207] px-6 py-3 font-semibold text-white hover:bg-green-700"
                >
                    Back to Shop
                </button>
            </div>
        );
    }

    return (
        <section className="nunito_sans">
            <Helmet>
                <title>{`Shopery | ${product.name}`}</title>
            </Helmet>

            <ToastContainer />

            {/* Product Details Banner */}
            <div className="specific_product_banner mb-2 h-full lg:h-[30vh]">
                <div className="breadcrumbs mb-5 px-12 py-10 text-[17px] text-white">
                    <ul>
                        <li>
                            <Link
                                to="/"
                                className="flex items-center gap-1"
                            >
                                <HiOutlineHome />
                                Home
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/shop"
                                className="flex items-center gap-1"
                            >
                                <FaShoppingBag />
                                Shop
                            </Link>
                        </li>

                        <li className="font-bold text-[#00B207]">
                            <span>{product.name}</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Main Product Information */}
            <div className="mb-10 px-5 py-10 lg:px-12">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
                    {/* Product Images */}
                    <div className="flex flex-col items-start lg:flex-row lg:items-center">
                        <div className="mx-auto mb-5 flex space-x-2 lg:mx-0 lg:flex-col lg:space-x-0 lg:space-y-2">
                            {product.images?.map((image, index) => (
                                <button
                                    type="button"
                                    key={`${image}-${index}`}
                                    onClick={() =>
                                        setSelectedImage(image)
                                    }
                                    className={`h-20 w-20 overflow-hidden rounded border-2 ${
                                        selectedImage === image
                                            ? "border-[#00B207]"
                                            : "border-transparent"
                                    }`}
                                    aria-label={`View image ${index + 1}`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} thumbnail ${index + 1}`}
                                        className="h-full w-full cursor-pointer object-cover"
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="mb-5 w-full">
                            {selectedImage ? (
                                <img
                                    src={selectedImage}
                                    alt={product.name}
                                    className="mx-auto h-[240px] w-full rounded-lg object-contain shadow-xl lg:w-[300px]"
                                />
                            ) : (
                                <div className="flex h-[240px] items-center justify-center text-gray-400">
                                    No image available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="h-auto">
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-[27px] font-bold">
                                    {product.name}
                                </h1>

                                <span
                                    className={`rounded-[4px] p-2 font-bold ${stockStatusClass}`}
                                >
                                    {stockStatus}
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {renderStars(product.rating)}

                                <span className="text-sm text-gray-600">
                                    {product.rating ?? 0} / 5
                                </span>
                            </div>

                            <p className="text-[19px] font-bold text-[#2C742F]">
                                ৳{product.price}
                            </p>

                            <hr />

                            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                                <p>
                                    <strong>Category: </strong>
                                    {product.category}
                                </p>

                                <ul className="flex items-center">
                                    <li className="cursor-pointer rounded-full p-3 text-[17px] text-[#222] transition-all hover:bg-green-700 hover:text-white">
                                        <FaFacebookF />
                                    </li>

                                    <li className="cursor-pointer rounded-full p-3 text-[17px] text-[#222] transition-all hover:bg-green-700 hover:text-white">
                                        <FaTwitter />
                                    </li>

                                    <li className="cursor-pointer rounded-full p-3 text-[17px] text-[#222] transition-all hover:bg-green-700 hover:text-white">
                                        <FaPinterestP />
                                    </li>

                                    <li className="cursor-pointer rounded-full p-3 text-[17px] text-[#222] transition-all hover:bg-green-700 hover:text-white">
                                        <FaInstagram />
                                    </li>
                                </ul>
                            </div>

                            <p className="leading-7 text-gray-600">
                                {product.description ||
                                    "No description available for this product."}
                            </p>

                            {/* Quantity and Add to Cart */}
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-4 rounded-[30px] border px-3 py-3">
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(-1)
                                        }
                                        type="button"
                                        disabled={
                                            isOutOfStock || quantity <= 1
                                        }
                                        className="text-gray-600 transition hover:text-[#00B207] disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Decrease quantity"
                                    >
                                        -
                                    </button>

                                    <span className="min-w-5 text-center">
                                        {isOutOfStock ? 0 : quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            handleQuantityChange(1)
                                        }
                                        type="button"
                                        disabled={
                                            isOutOfStock ||
                                            (hasStockTracking &&
                                                quantity >= stock)
                                        }
                                        className="transition hover:text-[#00B207] disabled:cursor-not-allowed disabled:opacity-40"
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    type="button"
                                    disabled={
                                        isOutOfStock || isAddingToCart
                                    }
                                    className={`my-4 flex items-center justify-center gap-2 rounded-[30px] px-8 py-3 text-white transition sm:px-14 ${
                                        isOutOfStock || isAddingToCart
                                            ? "cursor-not-allowed bg-gray-300 text-gray-500"
                                            : "bg-[#00B307] hover:bg-green-700"
                                    }`}
                                >
                                    {isOutOfStock
                                        ? "Out of Stock"
                                        : isAddingToCart
                                        ? "Adding..."
                                        : "Add to Cart"}

                                    <FiShoppingCart />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        toast.info(
                                            "Wishlist functionality is available from the product listing."
                                        )
                                    }
                                    className="rounded-full border p-3 text-xl hover:bg-gray-100"
                                    aria-label="Wishlist information"
                                >
                                    <CiHeart />
                                </button>
                            </div>

                            {isLowStock && (
                                <p className="text-sm font-semibold text-orange-600">
                                    Hurry! Only {stock} item(s) left.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Description Tabs */}
            <div className="px-5 py-10 lg:px-12">
                <div className="mx-auto flex w-full gap-8 overflow-x-auto whitespace-nowrap border-b border-gray-200 lg:w-7/12 lg:justify-center">
                    <button
                        onClick={() => handleTabClick("Descriptions")}
                        className={`inline-flex items-center whitespace-nowrap rounded-tl-[5px] text-sm focus:outline-none sm:text-base ${
                            activeTab === "Descriptions"
                                ? "border-b border-b-[#00B207] font-bold text-[#111]"
                                : "text-[#878686] hover:text-[#00B207]"
                        }`}
                    >
                        Descriptions
                    </button>

                    <button
                        onClick={() =>
                            handleTabClick("Additional_Information")
                        }
                        className={`inline-flex items-center whitespace-nowrap rounded-tl-[5px] text-sm focus:outline-none sm:text-base ${
                            activeTab === "Additional_Information"
                                ? "border-b border-b-[#00B207] font-bold text-[#111]"
                                : "text-[#878686] hover:text-[#00B207]"
                        }`}
                    >
                        Additional Information
                    </button>

                    <button
                        onClick={() =>
                            handleTabClick("Customer_Feedback")
                        }
                        className={`inline-flex items-center whitespace-nowrap rounded-tl-[5px] text-sm focus:outline-none sm:text-base ${
                            activeTab === "Customer_Feedback"
                                ? "border-b border-b-[#00B207] font-bold text-[#111]"
                                : "text-[#878686] hover:text-[#00B207]"
                        }`}
                    >
                        Customer Feedback
                    </button>
                </div>

                {/* Description Tab */}
                {activeTab === "Descriptions" && (
                    <div
                        className="mt-16 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-12"
                        data-aos="zoom-in"
                        data-aos-delay="50"
                        data-aos-duration="1000"
                        data-aos-easing="ease-in-out"
                    >
                        <div>
                            <h2 className="mb-4 text-xl font-bold">
                                Product Description
                            </h2>

                            <p className="mb-[10px] text-[16px] leading-6 text-[#878686]">
                                {product.description ||
                                    "No additional description is available for this product."}
                            </p>

                            <ul className="mb-3 space-y-2">
                                <li className="flex items-center gap-2 text-[#878686]">
                                    <FaCircleCheck className="shrink-0 text-[#00B207]" />
                                    Quality product from Shopery.
                                </li>

                                <li className="flex items-center gap-2 text-[#878686]">
                                    <FaCircleCheck className="shrink-0 text-[#00B207]" />
                                    Product information is based on the
                                    available listing.
                                </li>

                                <li className="flex items-center gap-2 text-[#878686]">
                                    <FaCircleCheck className="shrink-0 text-[#00B207]" />
                                    Check availability before ordering.
                                </li>
                            </ul>
                        </div>

                        <div className="relative h-auto">
                            <img
                                src="https://i.ibb.co/CzwyHXz/mann.png"
                                className="h-auto w-full"
                                alt="Shopery product information"
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    toast.info(
                                        "Product video is not available."
                                    )
                                }
                                className="absolute left-[46%] top-[30%] rounded-full bg-[#00B207] p-3 text-[20px] text-white"
                                aria-label="Play product video"
                            >
                                <IoPlay />
                            </button>

                            <div className="mt-6 flex w-auto items-center justify-evenly gap-5 rounded-[5px] border p-3">
                                <div className="flex items-center gap-2">
                                    <div>
                                        <img
                                            src="https://i.ibb.co/rMWH4HB/gggggg.png"
                                            className="h-auto w-auto"
                                            alt=""
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-[18px] font-bold text-[#111]">
                                            Quality Products
                                        </h3>

                                        <p className="text-[#6e6c6c]">
                                            Shopery product selection
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div>
                                        <img
                                            src="https://i.ibb.co/8rnHz57/leaf-1.png"
                                            className="h-auto w-auto"
                                            alt=""
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-[18px] font-bold text-[#111]">
                                            Fresh Choices
                                        </h3>

                                        <p className="text-[#6e6c6c]">
                                            Explore our products
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Additional Information Tab */}
                {activeTab === "Additional_Information" && (
                    <div className="mt-16">
                        <h2 className="mb-4 text-[24px] font-bold">
                            Additional Information
                        </h2>

                        <ul className="list-disc space-y-2 pl-5 text-[16px] leading-6 text-[#878686]">
                            <li>
                                <strong>Product:</strong> {product.name}
                            </li>

                            <li>
                                <strong>Category:</strong> {product.category}
                            </li>

                            <li>
                                <strong>Price:</strong> ৳{product.price}
                            </li>

                            <li>
                                <strong>Availability:</strong> {stockStatus}
                            </li>

                            {hasStockTracking && (
                                <li>
                                    <strong>Available Quantity:</strong>{" "}
                                    {stock}
                                </li>
                            )}

                            <li>
                                <strong>Rating:</strong>{" "}
                                {product.rating ?? 0} / 5
                            </li>
                        </ul>
                    </div>
                )}

                {/* Customer Feedback Tab */}
                {activeTab === "Customer_Feedback" && (
                    <div
                        className="mt-16 w-full lg:w-7/12"
                        data-aos="zoom-in"
                        data-aos-delay="50"
                        data-aos-duration="1000"
                        data-aos-easing="ease-in-out"
                    >
                        <CustomerReview
                            reviewId={product._id}
                            productName={product.name}
                        />
                    </div>
                )}
            </div>

            {/* Related Products */}
            <div className="mb-10 px-5 py-10 lg:px-12">
                <h2 className="mb-4 text-2xl font-semibold">
                    Related Products
                </h2>

                {relatedLoading ? (
                    <p className="py-6 text-gray-500">
                        Loading related products...
                    </p>
                ) : relatedProducts.length === 0 ? (
                    <p className="py-6 text-gray-500">
                        No related products available.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {relatedProducts.slice(0, 4).map(
                            (relatedProduct) => {
                                const relatedHasStock =
                                    relatedProduct.stockQuantity !==
                                        undefined &&
                                    relatedProduct.stockQuantity !== null &&
                                    relatedProduct.stockQuantity !== "";

                                const relatedStock = relatedHasStock
                                    ? Math.max(
                                          0,
                                          Number(
                                              relatedProduct.stockQuantity
                                          ) || 0
                                      )
                                    : null;

                                const relatedThreshold =
                                    relatedProduct.lowStockThreshold !==
                                        undefined &&
                                    relatedProduct.lowStockThreshold !==
                                        null &&
                                    relatedProduct.lowStockThreshold !== ""
                                        ? Math.max(
                                              0,
                                              Number(
                                                  relatedProduct.lowStockThreshold
                                              ) || 0
                                          )
                                        : null;

                                const relatedOutOfStock = relatedHasStock
                                    ? relatedStock <= 0
                                    : relatedProduct.availability !==
                                      "In Stock";

                                const relatedLowStock =
                                    !relatedOutOfStock &&
                                    relatedHasStock &&
                                    relatedThreshold !== null &&
                                    relatedThreshold > 0 &&
                                    relatedStock <= relatedThreshold;

                                const relatedStockStatus =
                                    relatedOutOfStock
                                        ? "Out of Stock"
                                        : relatedLowStock
                                        ? `Only ${relatedStock} left!`
                                        : "In Stock";

                                const relatedStockClass =
                                    relatedOutOfStock
                                        ? "bg-[#FDEDED] text-[#EA4B48]"
                                        : relatedLowStock
                                        ? "bg-orange-100 text-orange-700"
                                        : "bg-[#D2F0D4] text-[#2C742F]";

                                return (
                                    <div
                                        key={relatedProduct._id}
                                        className="product_Card relative h-auto rounded-[3px] border p-4"
                                        data-aos="zoom-in"
                                        data-aos-delay="50"
                                        data-aos-duration="1000"
                                        data-aos-easing="ease-in-out"
                                    >
                                        <Link
                                            to={`/product/${relatedProduct._id}`}
                                            className="block"
                                        >
                                            <div>
                                                <img
                                                    src={
                                                        relatedProduct.images?.[0] ||
                                                        ""
                                                    }
                                                    alt={relatedProduct.name}
                                                    className="mx-auto h-auto w-auto lg:h-[160px] lg:w-[260px]"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="hover-text-color text-[17px] font-[600] text-[#333]">
                                                        {relatedProduct.name}
                                                    </h3>

                                                    <p className="text-bold text-[#111]">
                                                        ৳{relatedProduct.price}
                                                    </p>

                                                    {renderStars(
                                                        relatedProduct.rating
                                                    )}
                                                </div>

                                                <span className="rounded-full bg-[#eee] p-2 text-[#111]">
                                                    <FaRegEye />
                                                </span>
                                            </div>
                                        </Link>

                                        <p className="absolute left-2 top-3 rounded-[4px]">
                                            <span
                                                className={`rounded-[4px] p-2 font-bold ${relatedStockClass}`}
                                            >
                                                {relatedStockStatus}
                                            </span>
                                        </p>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}
            </div>

            <Newsletter />
        </section>
    );
};

export default SeeProduct;
