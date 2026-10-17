import { Link } from "react-router-dom";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { useEffect, useState } from "react";
import Category from "./Category/Category";
// import axios from "axios";

const Categories = () => {

    const [categories, setCategories] = useState([]);

    const axiosPublic = 

    useEffect(() => {
        fetch('http://localhost:5000/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
    }, []);

    return (
        <div className="px-5 lg:px-12 py-10 nunito_sans">
            <div className="flex items-center justify-between mb-10">
                <h2 className="text-[21px] lg:text-[26px] text-[#111] font-bold">Popular Categories</h2>

                <Link className="text-[#018427] text-[16px] lg:text-[18px] font-[600] tracking-wider flex items-center">
                    <p>View All</p>
                    <MdOutlineArrowRightAlt />
                </Link>

            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-8">
               

                {
                    categories.map((category) => <Category key={category.id} category={category}></Category> )
                }
                
            </div>

        </div>
    );
};

export default Categories;