
import { MdOutlineArrowRightAlt } from 'react-icons/md';
import './Discount.css';

const Discount = () => {
    return (
        <div className='discount px-5 lg:px-12 py-10 nunito_sans m-5 lg:m-10 bg-transparent '>
            <div className="flex items-center justify-end mx-2 lg:mx-14">
                <div className=''>
                    <h4 className='uppercase text-[#fff] font-bold'>Summer Sale</h4>
                    <h1 className='text-[40px] text-[#fff] font-bold mb-2'> <span className='text-[#FF8A00]'>37%</span> OFF</h1>
                    <p className='text-[#cccaca] leading-7 tracking-wider'>Free on all your order, Free shipping and 30 days <br/> money-back Guarantee</p>
                    <div className="my-6">
                        <button className='px-12 py-3 rounded-[25px] flex items-center gap-3 bg-[#00B307] text-[#FFF]'> Show Now <MdOutlineArrowRightAlt /> </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discount;