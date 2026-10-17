import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa";
import { MdArrowRightAlt } from "react-icons/md";
import './Banner.css';

const Banner = () => {
    useEffect(() => {
        const swiperInstance = document.querySelector('.mySwiper').swiper;
        document.querySelector('.custom-swiper-button-prev').addEventListener('click', () => swiperInstance.slidePrev());
        document.querySelector('.custom-swiper-button-next').addEventListener('click', () => swiperInstance.slideNext());
    }, []);

    return (
        <div className="banner-container h-auto lg:h-[85vh] px-12 py-10">
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                className="mySwiper"
            >
                <SwiperSlide>
                    <div className="banner-slide-background swiper-slide">
                        <div className="banner-content content flex flex-col lg:flex-row items-center justify-center gap-4">
                            <div className="banner-image-container">
                                <img src="https://i.ibb.co/sVHhL3d/Image.png" alt="Fresh & Healthy Organic Food" className="banner-image" />
                            </div>
                            <div className='text-start nunito_sans'>
                                <span className='text-[#00B307] uppercase font-bold tracking-wider text-[16px]'>Welcome to shopery</span>
                                <h1 className='text-[30px] lg:text-[60px] text-[#1A1A1A] capitalize font-bold my-2 leading-tight'>Fresh & Healthy <br /> Organic Food</h1>
                                <p className='text-[23px] font-bold'>Sale up to <span className='text-[#FF8A00] '>30% OFF</span></p>
                                <p className="text-[16px] text-[#A6A6A6] my-3">Free shipping on all your orders. You deliver, we enjoy.</p>
                                <button className="px-14 py-3 mt-6 rounded-[35px] bg-[#00B307] text-[#fff] flex items-center gap-2">Shop now <MdArrowRightAlt className="text-[30px]" /></button>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="banner-slide-background swiper-slide">
                        <div className="banner-content content flex flex-col lg:flex-row items-center justify-center gap-4">
                            <div className="banner-image-container">
                                <img src="https://i.ibb.co/c1xRzNy/food-transparent-9.png" alt="Organic Vegetables" className="banner-image" />
                            </div>
                            <div className='text-start nunito_sans'>
                                <span className='text-[#00B307] uppercase font-bold tracking-wider text-[16px]'>Welcome to shopery</span>
                                <h1 className='text-[30px] lg:text-[60px] text-[#1A1A1A] capitalize font-bold my-2 leading-tight'>Fresh & Healthy <br /> Organic Vegetables</h1>
                                <p className='text-[23px] font-bold'>Get the best deals on <span className='text-[#FF8A00] '>organic veggies</span></p>
                                <p className="text-[16px] text-[#A6A6A6] my-3">Free shipping on all your orders. You deliver, we enjoy.</p>
                                <button className="px-14 py-3 mt-6 rounded-[35px] bg-[#00B307] text-[#fff] flex items-center gap-2">Shop now <MdArrowRightAlt className="text-[30px]" /></button>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div className="banner-slide-background swiper-slide">
                        <div className="banner-content content flex flex-col lg:flex-row items-center justify-center gap-4">
                            <div className="banner-image-container">
                                <img src="https://i.ibb.co/47PJ1dt/ways-for-kids-eat-their-fruits-and-vegetables-13.png" alt="Healthy Fruits" className="banner-image" />
                            </div>
                            <div className='text-start nunito_sans'>
                                <span className='text-[#00B307] uppercase font-bold tracking-wider text-[16px]'>Welcome to shopery</span>
                                <h1 className='text-[30px] lg:text-[60px] text-[#1A1A1A] capitalize font-bold my-2 leading-tight'>Fresh & Healthy <br /> Organic Fruits</h1>
                                <p className='text-[23px] font-bold'>Save up to <span className='text-[#FF8A00] '>40% OFF</span> on fruits</p>
                                <p className="text-[16px] text-[#A6A6A6] my-3">Free shipping on all your orders. You deliver, we enjoy.</p>
                                <button className="px-14 py-3 mt-6 rounded-[35px] bg-[#00B307] text-[#fff] flex items-center gap-2">Shop now <MdArrowRightAlt className="text-[30px]" /></button>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>

            <div className="custom-swiper-button-prev ">
                <FaLongArrowAltLeft />
            </div>
            <div className="custom-swiper-button-next">
                <FaLongArrowAltRight />
            </div>
        </div>
    );
};

export default Banner;
