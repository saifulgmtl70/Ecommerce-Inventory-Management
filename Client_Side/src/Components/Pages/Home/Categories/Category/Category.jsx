import React from 'react';
import './Category.css';

const Category = ({ category }) => {
    const { image, name } = category;

    return (
        <div className="h-auto rounded-[3px] border border-[#efeeee] hover:border-[#01842766] shadow-sm transition-all delay-200 p-4 custom-shadow-hover"
        data-aos="zoom-in"
        data-aos-delay="50"
        data-aos-duration="500"
        data-aos-easing="ease-in-out"
        >
            <img src={image} alt="" className="mx-auto" />
            <h4 className="text-center text-[17px] text-[#111] my-2 font-[600] hover-text-color">{name}</h4>
        </div>
    );
};

export default Category;

