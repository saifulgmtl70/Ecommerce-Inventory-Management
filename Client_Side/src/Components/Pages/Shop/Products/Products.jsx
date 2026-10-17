import { useEffect, useState } from "react";
import Product from "./Product";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [openModalId, setOpenModalId] = useState(null);
    
    // Filtering states
    const [category, setCategory] = useState("");
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [availability, setAvailability] = useState("");
    const [rating, setRating] = useState(0);

    useEffect(() => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setFilteredProducts(data);
            });
    }, []);

    const openModal = (id) => {
        setOpenModalId(id);
    };

    const closeModal = () => {
        setOpenModalId(null);
    };

    // Filtering logic
    const handleFilterChange = () => {
        let filtered = products;

        if (category) {
            filtered = filtered.filter(product => product.category === category);
        }

        if (priceRange) {
            filtered = filtered.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
        }

        if (availability) {
            filtered = filtered.filter(product => product.availability === availability);
        }

        if (rating) {
            filtered = filtered.filter(product => product.rating >= rating);
        }

        setFilteredProducts(filtered);
    };

    // Call handleFilterChange whenever filter states change
    useEffect(() => {
        handleFilterChange();
    }, [category, priceRange, availability, rating]);

    return (
        <div className="px-5 lg:px-12 py-10 nunito_sans">
            {/* Filtering UI */}
            <div className="mb-10">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
                    <div>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border focus:outline-none w-full rounded">
                            <option value="">All </option>
                            <option value="Fruits">Fruits</option>
                            <option value="Vegetables">Vegetables</option>
                            <option value="Oil">Oil</option>
                            <option value="Beverages">Beverages</option>
                            <option value="BreadandBakery">BreadandBakery</option>
                            {/* Add more categories as needed */}
                        </select>
                    </div>
                    
                    <div>
                        <input 
                            type="range" 
                            min="0" 
                            max="1000" 
                            value={priceRange[1]} 
                            onChange={(e) => setPriceRange([0, e.target.value])} 
                            className="p-2 border w-full rounded" 
                        />
                    </div>
                    
                    <div>
                        <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="p-2 border focus:outline-none w-full rounded">
                            <option value="">All</option>
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                        </select>
                    </div>
                    
                    <div>
                        <select value={rating} onChange={(e) => setRating(e.target.value)} className="p-2 border focus:outline-none w-full rounded">
                            <option value="0">All Ratings</option>
                            <option value="1">1 Star & Up</option>
                            <option value="2">2 Stars & Up</option>
                            <option value="3">3 Stars & Up</option>
                            <option value="4">4 Stars & Up</option>
                        </select>
                    </div>

                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
                {filteredProducts.map((product) => (
                    <Product
                        key={product._id}
                        product={product}
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

export default Products;
