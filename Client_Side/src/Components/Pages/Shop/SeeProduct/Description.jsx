import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { IoPlay, IoPlayCircleSharp } from "react-icons/io5";

const Description = () => {

    const [activeTab, setActiveTab] = useState("Descriptions"); // Initial active tab

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };




    return (
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
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-12 mt-16">
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
                <div className="mt-16">
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
                <div className="mt-16">
                    
                </div>
            )}




        </div>
    );
};

export default Description;