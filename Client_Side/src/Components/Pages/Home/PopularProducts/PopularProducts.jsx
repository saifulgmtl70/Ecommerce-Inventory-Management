
import { useEffect, useState } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PopularProduct from "./PopularProduct";

const PopularProducts = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const [openModalId, setOpenModalId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularProducts = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/products"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                const data = await response.json();

                if (Array.isArray(data)) {
                    const validProducts = data.filter(
                        (product) =>
                            product &&
                            typeof product === "object" &&
                            product._id
                    );

                    setPopularProducts(validProducts);
                } else {
                    setPopularProducts([]);
                    console.error("Unexpected products API response:", data);
                }
            } catch (error) {
                console.error("Error fetching popular products:", error);

                toast.error("Could not load products. Please try again.", {
                    position: "top-center",
                    autoClose: 3000,
                });

                setPopularProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularProducts();
    }, []);

    const openModal = (id) => {
        if (id) {
            setOpenModalId(id);
        }
    };

    const closeModal = () => {
        setOpenModalId(null);
    };

    return (
        <div className="px-5 lg:px-12 py-10 nunito_sans">
            {/* Section Heading */}
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-[21px] lg:text-[26px] text-[#111] font-bold">
                    Popular Products
                </h2>

                <Link
                    to="/shop"
                    className="text-[#018427] text-[16px] lg:text-[18px] font-[600] tracking-wider flex items-center"
                >
                    <p>View All</p>
                    <MdOutlineArrowRightAlt />
                </Link>
            </div>

            {/* Loading */}
            {loading && (
                <div className="py-10 text-center text-gray-500">
                    Loading products...
                </div>
            )}

            {/* Product Grid */}
            {!loading && popularProducts.length > 0 && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-8">
                    {popularProducts.slice(0, 10).map((product) => (
                        <PopularProduct
                            key={product._id}
                            popularProduct={product}
                            isModalOpen={openModalId === product._id}
                            openModal={openModal}
                            closeModal={closeModal}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!loading && popularProducts.length === 0 && (
                <div className="py-10 text-center text-gray-500">
                    No products available right now.
                </div>
            )}
        </div>
    );
};

export default PopularProducts;
