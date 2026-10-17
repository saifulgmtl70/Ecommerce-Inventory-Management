import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { HiOutlineHome } from 'react-icons/hi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '../../Hooks/useAuth';
import useAxiosPublic from '../../Hooks/useAxiosPublic';
import useCart from '../../Hooks/useCart';
//mport OrderHistory from "../Pages/UserDashboard/OrderHistory/OrderHistory";
import OrderHistory from '../../UserDashboard/OrderHistory/OrderHistory'

const Checkout = () => {
    const location = useLocation();
    const axiosPublic = useAxiosPublic();
    const [cart, setCart, refetch] = useCart();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const email = user?.email;
    const { quantities = {}, totalPrice = 0 } = location.state || {};

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (isSubmitting || !email || !cart?.length) return;

        const form = e.currentTarget;
        const firstname = form.firstname.value;
        const lastname = form.lastname.value;
        const name = `${firstname} ${lastname}`;
        const companyname = form.companyname.value;
        const streetaddress = form.streetaddress.value;
        const division = form.division.value;
        const district = form.district.value;
        const zipcode = form.zipcode.value;
        const phonenumber = form.phonenumber.value;
        const ordernotes = form.ordernotes.value;
        const paymentMethod = form.paymentMethod.value;

        const orderData = {
            email, name, companyname, streetaddress, division, district,
            zipcode, phonenumber, ordernotes, paymentMethod,
            cart: cart.map(item => ({
                productId: item._id,
                productName: item.product,
                quantity: quantities[item._id] ?? 1,
                price: item.price,
                image: item.image,
                total: Number(item.price) * (quantities[item._id] ?? 1)
            })),
            totalPrice,
            status: 'pending'
        };

        setIsSubmitting(true);
        let orderSaved = false;
        try {
            const response = await axiosPublic.post('/orders', orderData);
            if (response.status !== 201 || !response.data?.insertedId) {
                throw new Error('Order was not confirmed by the server');
            }
            orderSaved = true;

            // Delete only after the order has been saved successfully.
            // If deletion fails, don't submit the order again.
            try {
                await axiosPublic.delete(`/carts?email=${encodeURIComponent(email)}`);
                if (typeof setCart === 'function') setCart([]);
                if (typeof refetch === 'function') await refetch();
            } catch (cartError) {
                console.error('Order saved, but cart cleanup failed:', cartError);
                toast.warn('Order saved, but cart could not be cleared.', {
                    position: 'top-center', autoClose: 2500
                });
            }

            toast.success('Order placed successfully!', {
                position: 'top-center', autoClose: 1800
            });
            form.reset();
            setTimeout(() => navigate('/userdashboard/orderhistory'), 2200); // Change to your actual orders route
        } catch (error) {
            console.error('Checkout error:', error);
            if (!orderSaved) {
                toast.error('Order placement failed. Please try again.', {
                    position: 'top-center', autoClose: 3000
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!email) return <div>Loading...</div>;

    return (

        <section className="nunito_sans">

            <Helmet>

                <title>Shopery | Checkout </title>

            </Helmet>

            <ToastContainer />

            <div className="specific_product_banner h-full lg:h-[30vh] mb-2">

                <div className="text-[17px] text-white breadcrumbs px-12 py-10 mb-5">

                    <ul>

                        <li><Link to="/" className="flex items-center gap-1"><HiOutlineHome />Home</Link></li>

                        <li><Link to="/cart" className="flex items-center gap-1">Shopping Cart</Link></li>

                        <li className="text-[#00B207] font-bold">Checkout</li>

                    </ul>

                </div>

            </div>



            <div className="px-5 lg:px-14 py-10">

                <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">

                    <div className="h-auto lg:col-span-2">

                        <div className="bg-white p-8 rounded-[2px] border shadow-sm">

                            <h2 className="text-[26px] font-bold mb-6">Billing Information</h2>

                            <div className="space-y-4">

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

                                    <div>

                                        <h3 className="text-[#222] font-[600] text-[18px] mb-[4px]">First Name</h3>

                                        <input type="text" placeholder="First name" name="firstname" className="w-full border focus:outline-none px-4 py-3 rounded-[6px]" />

                                    </div>

                                    <div>

                                        <h3 className="text-[#222] font-[600] text-[18px] mb-[4px]">Last Name</h3>

                                        <input type="text" placeholder="Last name" name="lastname" className="w-full border focus:outline-none px-4 py-3 rounded-[6px]" />

                                    </div>

                                    <div>

                                        <h3 className="text-[#222] font-[600] text-[18px] mb-[4px]">Company Name (Optional)</h3>

                                        <input type="text" placeholder="Company Name (optional)" name="companyname" className="w-full border focus:outline-none px-4 py-3 rounded-[6px]" />

                                    </div>

                                </div>



                                <div>

                                    <h3 className="text-[#222] font-[600] text-[18px] mb-[4px]">Street Address</h3>

                                    <input type="text" placeholder="Street Address" name="streetaddress" className="w-full border focus:outline-none px-4 py-3 rounded-[6px]" />

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



                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>

                                        <h3 className="text-[#222] font-[600] text-[18px] mb-[4px]">Email Address</h3>

                                        <input type="email" placeholder="Email Address" defaultValue={email} name="email" className="w-full border focus:outline-none px-4 py-3 rounded-[6px]" />

                                    </div>



                                    <div>

                                        <h3 className="text-[#222] font-[600] text-[18px] mb-[4px]">Phone Number</h3>

                                        <input type="number" placeholder="Phone Number" name="phonenumber" className="w-full border focus:outline-none px-4 py-3 rounded-[6px]" />

                                    </div>

                                </div>



                                <div className="flex flex-col w-full">



                                    <div className="divider"></div> 



                                </div>



                                <div className="mt-10">

                                    <h3 className="text-[#222] font-[600] text-[26px] mb-[4px]">Additional Info</h3>

                                    <p className="text-[#666] text-[16px] mb-4"> Order Notes(Optional)</p>

                                    <textarea placeholder="Order Notes (Optional)" name="ordernotes" className="w-full border focus:outline-none px-4 py-3 rounded-[6px] h-32 resize-none"></textarea>

                                </div>



                            </div>

                        </div>

                    </div>



                    <div className="h-auto lg:col-span-1">

                        <div className="bg-white p-8 rounded-[2px] border shadow-sm">

                            <h2 className="text-[26px] font-bold mb-6">Your Order</h2>

                            <div className="space-y-4">

                                <div className="flex justify-between mb-4">

                                    <h3 className="text-[18px] font-[600]">Product</h3>

                                    <h3 className="text-[18px] font-[600]">Total</h3>

                                </div>



                                {cart.length === 0 ? (

                                    <div className="text-center py-10 text-gray-500">Your cart is empty</div>

                                ) : (

                                    cart.map((item) => (

                                        <div key={item._id} className="flex items-center justify-between mb-4 border-b pb-3">

                                            <div className="flex items-center gap-2">

                                                <img src={item.image} alt="" className='w-full lg:w-[50px] h-full lg:h-[50px]' />

                                                <span>{item.product} x {quantities[item._id]}</span>

                                            </div>

                                            <div>

                                                <span>৳{item.price * quantities[item._id]}</span>

                                            </div>

                                        </div>

                                    ))

                                )}



                                {cart.length > 0 && (

                                    <>

                                        <div className="flex justify-between mb-4">

                                            <h3 className="text-[18px] font-[600]">Subtotal</h3>

                                            <h3 className="text-[18px] font-[600]">৳{totalPrice.toFixed(2)}</h3>

                                        </div>

                                        <div className="flex justify-between mb-4">

                                            <h3 className="text-[18px] font-[600]">Total</h3>

                                            <h3 className="text-[18px] font-[600]">৳{totalPrice.toFixed(2)}</h3>

                                        </div>

                                    </>

                                )}

                            </div>

                            <div className="space-y-4 mt-6">

                                <h3 className="text-[18px] font-[600] mb-[4px]">Payment Method</h3>

                                <div className="flex items-center mb-4">

                                    <input type="radio" name="paymentMethod" value="cash" id="cash" className="mr-2" defaultChecked />

                                    <label htmlFor="cash" className="text-[16px]">Cash on Delivery</label>

                                </div>

                                <div className="flex items-center mb-4">

                                    <input type="radio" name="paymentMethod" value="card" id="card" className="mr-2" />

                                    <label htmlFor="card" className="text-[16px]">Credit/Debit Card</label>

                                </div>

                            </div>



                            {

                                (cart.length === 0 || isSubmitting) ? <button disabled type="submit" className="bg-[#eee] cursor-not-allowed text-[#00B207] py-3 px-6 rounded-[6px] w-full mt-4">{isSubmitting ? "Placing Order..." : "Place Order"}</button>

                                :

                                <button type="submit" className="bg-[#00B207] text-white py-3 px-6 rounded-[6px] w-full mt-4">{isSubmitting ? "Placing Order..." : "Place Order"}</button>

                            }



                        </div>

                    </div>

                </form>

            </div>

        </section>

    );

};



export default Checkout;
