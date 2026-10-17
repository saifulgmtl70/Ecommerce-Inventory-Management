import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/useAxiosPublic';

import { useNavigate } from 'react-router-dom';



import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Settings = () => {


    const axiosPublic = useAxiosPublic();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const { user, updateUserProfile } = useAuth();
    const [imageFile, setImageFile] = useState(null);

    const email = user.email;

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const imgbbAPIKey = "d8071d1fd460bb31d496e9077fef1917"; // Replace with your imgbb API key

    const uploadImageToImgbb = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const response = await axiosPublic.post(`https://api.imgbb.com/1/upload?key=${imgbbAPIKey}`, formData);
        return response.data.data.url; // Return the URL of the uploaded image
    };

    const handleFileChange = (event) => {
        setImageFile(event.target.files[0]);
    };


    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const form = e.target;
        const firstname = form.firstName.value;
        const lastname = form.lastName.value;
        const displayName = `${firstname} ${lastname}`;
        const phone = form.phone.value;
        let photoURL = user.photoURL;
    
        if (imageFile) {
            try {
                photoURL = await uploadImageToImgbb(imageFile);
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Error uploading image. Please try again.", {
                    position: "top-center",
                    autoClose: 1000,
                });
                return;
            }
        }
    
        const userInfo = { displayName, photoURL, phone, email };
        console.log("User info to be updated:", userInfo);
    
        // Update user profile
        try {
            await updateUserProfile(displayName, photoURL);
            await axiosPublic.patch('/users', userInfo);
            console.log("Profile updated successfully");
            toast.success("Profile updated successfully!", {
                position: "top-center",
                autoClose: 1000,
                onClose: () =>  navigate('/userdashboard/userhome')
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Error updating profile. Please try again.", {
                position: "top-center",
                autoClose: 1000,
            });
        }

        form.reset();

    };
    



    const handleBillingAddress = async(e) =>{

        e.preventDefault();
        const form = e.target;

        const firstname = form.firstName.value;
        const lastname = form.lastName.value;
        const fullname = `${firstname} ${lastname}`;
        const companyname = form.companyname.value;
        const streetaddress = form.streetaddress.value;
        const division = form.division.value;
        const district = form.district.value;
        const zipcode = form.zipcode.value;
        const phone = form.phone.value; 


       


        

        try {
            

            const billingInfo = { fullname, email, companyname, streetaddress, division, district, zipcode, phone };
            console.log(billingInfo);

            // Send productItem to your server
            const response = await axiosPublic.post('/billings', billingInfo);
            console.log("Server Response:", response.data);
    

            // Show success toast
            // toast.success("Product added successfully!");
            toast.success("Billing Address Updated successfully!", {
                position: "top-center",
                autoClose: 1500, // এক সেকেন্ডের মধ্যে বন্ধ হবে
                onClose: () =>  navigate('/userdashboard/userhome')
            });
        } catch (error) {
            console.error("Error updating billing Address product:", error);
            // toast.error("Failed to add product. Please try again.");
            toast.error("Failed to update billing address. Please try again.", {
                position: "top-center",
                autoClose: 1000, // এক সেকেন্ডের মধ্যে বন্ধ হবে

            });

        }





    }




    


    return (
        <div className="h-auto ">
            <Helmet>
                <title>Shopery | Settings </title>
                
            </Helmet>
            <ToastContainer/>
            <h2 className="text-xl font-semibold mb-6">Account Settings</h2>
            <form onSubmit={handleUpdateUser} className="mb-6 border p-4 rounded-lg bg-white shadow-sm">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    
                    <div>
                        <div className="flex flex-col mb-4">
                            <label className="mb-2 font-medium text-[#555]" htmlFor="firstName">First name</label>
                            <input className="border focus:outline-none placeholder:text-[#555] focus:border-[#00B307] rounded-[4px] px-4 py-[10px]" type="text" name="firstName" id="firstName" placeholder="First Name" />
                        </div>

                        <div className="flex flex-col mb-4">
                            <label className="mb-2 font-medium text-[#555]" htmlFor="lastName">Last Name</label>
                            <input className="border focus:outline-none placeholder:text-[#555] focus:border-[#00B307] rounded-[4px] px-4 py-[10px]" type="text" name="lastName" id="lastName" placeholder="Last Name" />
                        </div>
                        
                        <div className="flex flex-col mb-4 lg:col-span-2">
                            <label className="mb-2 font-medium text-[#555]" htmlFor="email">Email</label>
                            <input className="border focus:outline-none placeholder:text-[#555] focus:border-[#00B307] rounded-[4px] px-4 py-[10px]" defaultValue={email}  type="email" id="email" placeholder="Email Address" />
                        </div>
                        
                        <div className="flex flex-col mb-4 lg:col-span-2">
                            <label className="mb-2 font-medium text-[#555]" htmlFor="phone">Phone Number</label>
                            <input className="border focus:outline-none placeholder:text-[#555] focus:border-[#00B307] rounded-[4px] px-4 py-[10px]"  type="tel" name="phone" id="phone" placeholder="Phone Number" />
                        </div>

                    </div>

                    <div>
                        <div className="flex flex-col items-center my-3 lg:my-14">
                            <img src={user.photoURL} alt="user" className="w-[130px] h-[130px] rounded-full mb-4" />
                            <button type="button" onClick={handleImageClick} className="border-[3px] border-[#00B207] transition-all delay-200 hover:bg-[#00B207] text-[#00B207] hover:text-[#fff] font-bold rounded-[26px] px-7 py-[10px]">
                                Choose Image
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                name='image'
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    
                    <div className="col-span-1 mx-auto lg:mx-0 lg:col-span-2">
                        <button type="submit" className="bg-[#00B207] text-white rounded-[26px] px-7 py-[10px] ">Save Changes</button>
                    </div>

                </div>
            </form>



            <h2 className="text-xl font-semibold mb-6">Billing Address</h2>
            <form onSubmit={handleBillingAddress} className="mb-6 border p-4 rounded-lg bg-white shadow-sm ">
     
                <div>
                    <div className="flex flex-col lg:flex-row items-center gap-3 mb-3">
                        <div className="flex flex-col w-full mb-4">
                            <label className="mb-2 font-medium text-[#555]" htmlFor="firstName">First name</label>
                            <input className="border focus:outline-none placeholder:text-[#555] focus:border-[#00B307] rounded-[4px] px-4 py-[10px] " name='firstname' type="text" id="firstName" placeholder="First Name" />
                        </div>

                        <div className="flex flex-col w-full mb-4">
                            <label className="mb-2 font-medium text-[#555]" htmlFor="lastName">Last Name</label>
                            <input className="border focus:outline-none placeholder:text-[#555] focus:border-[#00B307] rounded-[4px] px-4 py-[10px] "  name='lastname' type="text" id="lastName" placeholder="Last Name" />
                        </div>
                        
                        <div className="flex flex-col w-full mb-4 lg:col-span-2">
                            <label className="mb-2 font-medium text-[#555]" htmlFor="email">Company Name</label>
                            <input className="border focus:outline-none placeholder:text-[#555] focus:border-[#00B307] rounded-[4px] px-4 py-[10px]" name='companyname' type="text" id="companyname" placeholder="Company Name" />
                        </div>
                    </div>
                    
                    <div className="flex flex-col mb-4 lg:col-span-2">
                        <label className="mb-2 font-medium text-[#555]" htmlFor="phone">Street Address</label>
                        <input className="border focus:outline-none placeholder:text-[#555] focus:border-[#00B307] rounded-[4px] px-4 py-[10px] w-full" name='streetaddress'  type="text" id="streetaddress" placeholder="Street Address" />
                    </div>



                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                        <div>
                            <h3 className="text-[#222] font-[600] text-[18px] mb-[4px]">Division</h3>
                            <select name="division" defaultValue="Select Division" className="w-full border focus:outline-none px-4 py-3 rounded-[6px]">
                                <option disabled>Select Division</option>
                                <option value="Barisal">Barisal</option>
                                <option value="Chattogram">Chattogram</option>
                                <option value="Dhaka">Dhaka</option>
                                <option value="Khulna">Khulna</option>
                                <option value="Mymensingh">Mymensingh</option>
                                <option value="Rajshahi">Rajshahi</option>
                                <option value="Rangpur">Rangpur</option>
                                <option value="Sylhet">Sylhet</option>
                            </select>
                        </div>

                        <div>
                            <h3 className="text-[#222] font-[600] text-[18px] mb-[4px]">District</h3>
                            <select name="district" defaultValue="Select District" className="w-full border focus:outline-none px-4 py-3 rounded-[6px]">
                                <option disabled>Select District</option>
                                <option value="Bagerhat">Bagerhat</option>
                                <option value="Bandarban">Bandarban</option>
                                <option value="Barguna">Barguna</option>
                                <option value="Barishal">Barishal</option>
                                <option value="Bhola">Bhola</option>
                                <option value="Bogra">Bogra</option>
                                <option value="Brahmanbaria">Brahmanbaria</option>
                                <option value="Chandpur">Chandpur</option>
                                <option value="Chapainawabganj">Chapainawabganj</option>
                                <option value="Chattogram">Chattogram</option>
                                <option value="Chuadanga">Chuadanga</option>
                                <option value="Comilla">Comilla</option>
                                <option value="Cox's Bazar">Cox's Bazar</option>
                                <option value="Dhaka">Dhaka</option>
                                <option value="Dinajpur">Dinajpur</option>
                                <option value="Faridpur">Faridpur</option>
                                <option value="Feni">Feni</option>
                                <option value="Gaibandha">Gaibandha</option>
                                <option value="Gazipur">Gazipur</option>
                                <option value="Gopalganj">Gopalganj</option>
                                <option value="Habiganj">Habiganj</option>
                                <option value="Jamalpur">Jamalpur</option>
                                <option value="Jashore">Jashore</option>
                                <option value="Jhalokati">Jhalokati</option>
                                <option value="Jhenaidah">Jhenaidah</option>
                                <option value="Joypurhat">Joypurhat</option>
                                <option value="Khagrachari">Khagrachari</option>
                                <option value="Khulna">Khulna</option>
                                <option value="Kishoreganj">Kishoreganj</option>
                                <option value="Kurigram">Kurigram</option>
                                <option value="Kushtia">Kushtia</option>
                                <option value="Lakshmipur">Lakshmipur</option>
                                <option value="Lalmonirhat">Lalmonirhat</option>
                                <option value="Madaripur">Madaripur</option>
                                <option value="Magura">Magura</option>
                                <option value="Manikganj">Manikganj</option>
                                <option value="Meherpur">Meherpur</option>
                                <option value="Moulvibazar">Moulvibazar</option>
                                <option value="Munshiganj">Munshiganj</option>
                                <option value="Mymensingh">Mymensingh</option>
                                <option value="Naogaon">Naogaon</option>
                                <option value="Narail">Narail</option>
                                <option value="Narayanganj">Narayanganj</option>
                                <option value="Narsingdi">Narsingdi</option>
                                <option value="Natore">Natore</option>
                                <option value="Netrokona">Netrokona</option>
                                <option value="Nilphamari">Nilphamari</option>
                                <option value="Noakhali">Noakhali</option>
                                <option value="Pabna">Pabna</option>
                                <option value="Panchagarh">Panchagarh</option>
                                <option value="Patuakhali">Patuakhali</option>
                                <option value="Pirojpur">Pirojpur</option>
                                <option value="Rajbari">Rajbari</option>
                                <option value="Rajshahi">Rajshahi</option>
                                <option value="Rangamati">Rangamati</option>
                                <option value="Rangpur">Rangpur</option>
                                <option value="Satkhira">Satkhira</option>
                                <option value="Shariatpur">Shariatpur</option>
                                <option value="Sherpur">Sherpur</option>
                                <option value="Sirajganj">Sirajganj</option>
                                <option value="Sunamganj">Sunamganj</option>
                                <option value="Sylhet">Sylhet</option>
                                <option value="Tangail">Tangail</option>
                                <option value="Thakurgaon">Thakurgaon</option>
                            </select>
                        </div>

                        <div>
                            <h3 className="text-[#222] font-[600] text-[18px] mb-[4px]">Zip Code</h3>
                            <input type="number" placeholder="Zip Code" name="zipcode" className="w-full border focus:outline-none px-4 py-3 rounded-[6px]" />
                        </div>
                    </div>



                    <div className="flex flex-col lg:flex-row items-center gap-3 mb-3">
                        
                        <div className="flex flex-col w-full mb-4 lg:col-span-2">
                            <label className="mb-2 font-medium text-[#555]" htmlFor="email">Email</label>
                            <input className="border focus:outline-none placeholder:text-[#555] focus:border-[#00B307] rounded-[4px] px-4 py-[10px]" defaultValue={email} type="email" id="email" placeholder="Email address" />
                        </div>


                        <div className="flex flex-col w-full mb-4">
                            <label className="mb-2 font-medium text-[#555]" htmlFor="firstName">Phone</label>
                            <input className="border focus:outline-none placeholder:text-[#555] focus:border-[#00B307] rounded-[4px] px-4 py-[10px] " name='phone' type="text" id="phone" placeholder="Phone Number" />
                        </div>

                    </div>
                </div>

                
                
                <div className="col-span-1 mx-auto lg:mx-0 lg:col-span-2">
                    <button type="submit" className="bg-[#00B207] text-white rounded-[26px] px-7 py-[10px] ">Save Changes</button>
                </div>


            </form>



            




        </div>
    );
};

export default Settings;
