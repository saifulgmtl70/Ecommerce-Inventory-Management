import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import './testimonials.css';
import { RiDoubleQuotesR } from "react-icons/ri";
import { FaStar, FaArrowRight, FaArrowLeft } from "react-icons/fa6";

const testimonials = [
    {
        name: "Robert Fox",
        role: "Customer",
        message: "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
        image: "https://i.ibb.co/4p5Nb9B/customer-1.png",
        rating: 5
    },
    {
        name: "Dianne Russell",
        role: "Customer",
        message: "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
        image: "https://i.ibb.co/HtG1Yh5/customr-2.png",
        rating: 5
    },
    {
        name: "Eleanor Pena",
        role: "Customer",
        message: "Pellentesque eu nibh eget mauris congue mattis mattis nec tellus. Phasellus imperdiet elit eu magna dictum, bibendum cursus velit sodales. Donec sed neque eget",
        image: "https://i.ibb.co/HtG1Yh5/customr-2.png",
        rating: 5
    }
];

const NextArrow = (props) => {
    const { onClick } = props;
    return (
        <div
            className="custom-arrow top-[45%] custom-arrow-right absolute -right-10"
            style={{ background: '#00B307' }}
            onClick={onClick}
        >
            <FaArrowRight style={{ color: '#fff' }} />
        </div>
    );
};

const PrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div
            className="custom-arrow custom-arrow-left absolute top-[45%] -left-10"
            style={{ background: '#00B307' }}
            onClick={onClick}
        >
            <FaArrowLeft style={{ color: '#fff' }} />
        </div>
    );
};

const Testimonial = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="px-12 py-10 nunito_sans bg-[#F2F2F2] relative">
            <h2 className="text-2xl font-bold mb-6">Client Testimonials</h2>
            <Slider {...settings}>
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="p-4">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <div className="text-[#a6e5aa] text-[30px] mb-4">
                                <RiDoubleQuotesR />
                            </div>
                            <p className="text-gray-700 mb-4">"{testimonial.message}"</p>
                            <div className="flex items-center">
                                <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <h4 className="font-bold">{testimonial.name}</h4>
                                    <p className="text-gray-500">{testimonial.role}</p>
                                </div>
                                <div className="ml-auto flex items-center">
                                    {[...Array(testimonial.rating)].map((star, i) => (
                                        <FaStar key={i} className="text-[#f9e611ea]" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Testimonial;
