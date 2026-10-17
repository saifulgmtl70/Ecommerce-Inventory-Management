import { useEffect, useState } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { Link } from "react-router-dom";
import PopularProduct from "./PopularProduct";

const PopularProducts = () => {
    const [popularProducts, setPopularProducts] = useState([]);
    const [openModalId, setOpenModalId] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => setPopularProducts(data));
    }, []);

    const openModal = (id) => {
        setOpenModalId(id);
    };

    const closeModal = () => {
        setOpenModalId(null);
    };

    return (
        <div className="px-5 lg:px-12 py-10 nunito_sans">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-[21px] lg:text-[26px] text-[#111] font-bold">Popular Products</h2>
                <Link to="/shop" className="text-[#018427] text-[16px] lg:text-[18px] font-[600] tracking-wider flex items-center">
                    <p>View All</p>
                    <MdOutlineArrowRightAlt />
                </Link>
            </div>
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
        </div>
    );
};

export default PopularProducts;
