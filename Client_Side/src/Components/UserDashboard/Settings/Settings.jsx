

import React, { useEffect, useRef, useState } from 'react';

import { Helmet } from 'react-helmet-async';

import { useNavigate } from 'react-router-dom';



import useAuth from '../../Hooks/useAuth';

import useAxiosPublic from '../../Hooks/useAxiosPublic';

import useAxiosSecure from '../../Hooks/useAxiosSecure';



import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';



const IMGBB_API_KEY = "d8071d1fd460bb31d496e9077fef1917";



const DEFAULT_AVATAR =

    "https://i.ibb.co/4pDNDk1/avatar.png";



const Settings = () => {

    const axiosPublic = useAxiosPublic();

    const axiosSecure = useAxiosSecure();

    const navigate = useNavigate();

    const fileInputRef = useRef(null);



    const { user, loading, updateUserProfile } = useAuth();



    const [imageFile, setImageFile] = useState(null);

    const [imagePreview, setImagePreview] = useState('');

    const [profileLoading, setProfileLoading] = useState(false);

    const [billingLoading, setBillingLoading] = useState(false);



    const [billingAddress, setBillingAddress] = useState(null);

    const [billingFetchLoading, setBillingFetchLoading] = useState(false);



    const [profileForm, setProfileForm] = useState({

        firstName: '',

        lastName: '',

        phone: ''

    });



    const [billingForm, setBillingForm] = useState({

        firstName: '',

        lastName: '',

        companyname: '',

        streetaddress: '',

        division: '',

        district: '',

        zipcode: '',

        phone: ''

    });



    const email = user?.email || '';



    const divisions = [

        'Barisal',

        'Chattogram',

        'Dhaka',

        'Khulna',

        'Mymensingh',

        'Rajshahi',

        'Rangpur',

        'Sylhet'

    ];



    const districts = [

        'Bagerhat',

        'Bandarban',

        'Barguna',

        'Barishal',

        'Bhola',

        'Bogura',

        'Brahmanbaria',

        'Chandpur',

        'Chapainawabganj',

        'Chattogram',

        'Chuadanga',

        "Cox's Bazar",

        'Cumilla',

        'Dhaka',

        'Dinajpur',

        'Faridpur',

        'Feni',

        'Gaibandha',

        'Gazipur',

        'Gopalganj',

        'Habiganj',

        'Jamalpur',

        'Jashore',

        'Jhalokati',

        'Jhenaidah',

        'Joypurhat',

        'Khagrachari',

        'Khulna',

        'Kishoreganj',

        'Kurigram',

        'Kushtia',

        'Lakshmipur',

        'Lalmonirhat',

        'Madaripur',

        'Magura',

        'Manikganj',

        'Meherpur',

        'Moulvibazar',

        'Munshiganj',

        'Mymensingh',

        'Naogaon',

        'Narail',

        'Narayanganj',

        'Narsingdi',

        'Natore',

        'Netrokona',

        'Nilphamari',

        'Noakhali',

        'Pabna',

        'Panchagarh',

        'Patuakhali',

        'Pirojpur',

        'Rajbari',

        'Rajshahi',

        'Rangamati',

        'Rangpur',

        'Satkhira',

        'Shariatpur',

        'Sherpur',

        'Sirajganj',

        'Sunamganj',

        'Sylhet',

        'Tangail',

        'Thakurgaon'

    ];



    // Load existing Firebase profile information

    useEffect(() => {

        if (!user) return;


        const nameParts = (user.displayName || '').trim().split(/\s+/);


        setProfileForm({

            firstName: nameParts[0] || '',

            lastName: nameParts.slice(1).join(' ') || '',

            phone: ''

        });



        setImagePreview(user.photoURL || '');

    }, [user]);



    // Fetch saved billing address
    useEffect(() => {
        if (!user?.email) {
            setBillingAddress(null);
            setBillingFetchLoading(false);
            return;
        }

        let active = true;

        const fetchBillingAddress = async () => {
            setBillingFetchLoading(true);

            try {
                const response = await axiosPublic.get('/billings', {
                    params: { email: user.email }
                });

                if (!active) return;

                const result = response.data;
                const address = Array.isArray(result)
                    ? result[0]
                    : Array.isArray(result?.billings)
                        ? result.billings[0]
                        : result;

                if (!address?._id) {
                    setBillingAddress(null);
                    return;
                }

                setBillingAddress(address);

                const nameParts = (address.fullname || '').trim().split(/\s+/);
                setBillingForm({
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || '',
                    companyname: address.companyname || '',
                    streetaddress: address.streetaddress || '',
                    division: address.division || '',
                    district: address.district || '',
                    zipcode: address.zipcode || '',
                    phone: address.phone || ''
                });
            } catch (error) {
                if (!active) return;
                console.error('Error fetching billing address:', error);
                toast.error(error.response?.data?.message || 'Failed to load billing address.');
            } finally {
                if (active) setBillingFetchLoading(false);
            }
        };

        fetchBillingAddress();
        return () => { active = false; };
    }, [user?.email, axiosPublic]);

    // Clean up image preview URL

    useEffect(() => {

        if (!imageFile) return;



        const previewURL = URL.createObjectURL(imageFile);

        setImagePreview(previewURL);



        return () => {

            URL.revokeObjectURL(previewURL);

        };

    }, [imageFile]);



    const handleImageClick = () => {

        fileInputRef.current?.click();

    };



    const handleFileChange = (event) => {

        const file = event.target.files?.[0];



        if (!file) return;



        if (!file.type.startsWith('image/')) {

            toast.error('Please select a valid image file.');

            event.target.value = '';

            return;

        }



        if (file.size > 5 * 1024 * 1024) {

            toast.error('Image size must be less than 5 MB.');

            event.target.value = '';

            return;

        }



        setImageFile(file);

    };



    const uploadImageToImgbb = async (file) => {
        if (!file) {
            throw new Error('Please select an image.');
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(
                `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            const result = await response.json();

            if (!response.ok || !result?.success) {
                console.error('ImgBB API Error:', result);
                throw new Error(result?.error?.message || 'Image upload failed.');
            }

            if (!result?.data?.url) {
                throw new Error('Image URL not found.');
            }

            return result.data.url;
        } catch (error) {
            console.error('Image Upload Error:', error);
            throw error;
        }
    };



    const handleProfileInputChange = (event) => {

        const { name, value } = event.target;



        setProfileForm((previous) => ({

            ...previous,

            [name]: value

        }));

    };



    const handleBillingInputChange = (event) => {

        const { name, value } = event.target;



        setBillingForm((previous) => ({

            ...previous,

            [name]: value

        }));

    };



    // Update user profile

    const handleUpdateUser = async (event) => {

        event.preventDefault();



        if (!user?.email) {

            toast.error('Please login before updating your profile.');

            return;

        }



        const firstName = profileForm.firstName.trim();

        const lastName = profileForm.lastName.trim();

        const phone = profileForm.phone.trim();



        if (!firstName) {

            toast.error('First name is required.');

            return;

        }



        if (!lastName) {

            toast.error('Last name is required.');

            return;

        }



        setProfileLoading(true);



        try {

            const displayName = `${firstName} ${lastName}`.trim();



            let photoURL = user.photoURL || '';



            if (imageFile) {

                photoURL = await uploadImageToImgbb(imageFile);

            }



            await updateUserProfile(displayName, photoURL);



            const userInfo = {

                displayName,

                photoURL,

                phone,

                email: user.email

            };



            /*

             * This assumes PATCH /users updates the current user

             * identified by the authenticated JWT on the backend.

             * Do not trust the email sent in the request body alone.

             */

            await axiosPublic.patch('/users', userInfo);



            setImageFile(null);



            toast.success('Profile updated successfully!', {

                position: 'top-center',

                autoClose: 1500,

                onClose: () => navigate('/userdashboard/userhome')

            });

        } catch (error) {

            console.error('Profile update error:', error);



            toast.error(

                error.response?.data?.error?.message ||
                error.response?.data?.message ||
                error.message ||
                'Failed to update profile. Please try again.',

                {

                    position: 'top-center',

                    autoClose: 2500

                }

            );

        } finally {

            setProfileLoading(false);

        }

    };



    // Save or update billing address

    const handleBillingAddress = async (event) => {

        event.preventDefault();



        if (!user?.email) {

            toast.error('Please login before saving your address.');

            return;

        }



        const firstName = billingForm.firstName.trim();

        const lastName = billingForm.lastName.trim();

        const companyname = billingForm.companyname.trim();

        const streetaddress = billingForm.streetaddress.trim();

        const division = billingForm.division;

        const district = billingForm.district;

        const zipcode = billingForm.zipcode.trim();

        const phone = billingForm.phone.trim();



        if (!firstName || !lastName) {

            toast.error('First name and last name are required.');

            return;

        }



        if (!streetaddress) {

            toast.error('Street address is required.');

            return;

        }



        if (!division || !district) {

            toast.error('Please select division and district.');

            return;

        }



        if (!phone) {

            toast.error('Phone number is required.');

            return;

        }



        setBillingLoading(true);



        try {

            const billingInfo = {

                fullname: `${firstName} ${lastName}`.trim(),

                email: user.email,

                companyname,

                streetaddress,

                division,

                district,

                zipcode,

                phone

            };



            let response;



            if (billingAddress?._id) {

                /*

                 * Assumes your backend supports:

                 * PATCH /billings/:id

                 *

                 * This route must verify ownership on the server.

                 */

                response = await axiosSecure.patch(

                    `/billings/${billingAddress._id}`,

                    billingInfo

                );

            } else {

                response = await axiosPublic.post(

                    '/billings',

                    billingInfo

                );

            }



            const savedAddress = response.data?.billing ||

                response.data?.result ||

                response.data;



            if (savedAddress?._id) {

                setBillingAddress(savedAddress);

            } else if (!billingAddress?._id) {

                /*

                 * If the backend returns no document ID,

                 * reload the address to obtain its ID.

                 */

                try {

                    const reloadResponse = await axiosPublic.get(

                        `/billings?email=${encodeURIComponent(user.email)}`

                    );



                    const result = reloadResponse.data;



                    const address = Array.isArray(result)

                        ? result[0]

                        : Array.isArray(result?.billings)

                            ? result.billings[0]

                            : result;



                    if (address?._id) {

                        setBillingAddress(address);

                    }

                } catch (reloadError) {

                    console.error(

                        'Error reloading billing address:',

                        reloadError

                    );

                }

            }



            toast.success('Billing address saved successfully!', {

                position: 'top-center',

                autoClose: 1500,
                onClose: () => navigate('/userdashboard/userhome')

            });

        } catch (error) {

            console.error('Billing address error:', error);



            toast.error(

                error.response?.data?.message ||

                'Failed to save billing address. Please try again.',

                {

                    position: 'top-center',

                    autoClose: 2500

                }

            );

        } finally {

            setBillingLoading(false);

        }

    };



    if (loading) {

        return (

            <div className="flex min-h-[400px] items-center justify-center">

                <p className="text-lg font-semibold text-[#00B207]">

                    Loading user information...

                </p>

            </div>

        );

    }



    if (!user) {

        return (

            <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">

                <p className="text-lg font-semibold text-gray-600">

                    Please login to access account settings.

                </p>



                <button

                    type="button"

                    onClick={() => navigate('/login')}

                    className="rounded-full bg-[#00B207] px-6 py-2 font-semibold text-white"

                >

                    Login

                </button>

            </div>

        );

    }



    const inputClass =

        'w-full rounded-[4px] border px-4 py-[10px] focus:border-[#00B207] focus:outline-none';



    const labelClass =

        'mb-2 font-medium text-[#555]';



    return (

        <div className="h-auto">

            <Helmet>

                <title>Shopery | Settings</title>

            </Helmet>



            <ToastContainer />



            <h2 className="mb-6 text-xl font-semibold">

                Account Settings

            </h2>



            {/* Profile Settings */}

            <form

                onSubmit={handleUpdateUser}

                className="mb-8 rounded-lg border bg-white p-4 shadow-sm"

            >

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                    <div>

                        <div className="mb-4 flex flex-col">

                            <label className={labelClass} htmlFor="profileFirstName">

                                First name

                            </label>



                            <input

                                className={inputClass}

                                type="text"

                                name="firstName"

                                id="profileFirstName"

                                placeholder="First Name"

                                value={profileForm.firstName}

                                onChange={handleProfileInputChange}

                                required

                            />

                        </div>



                        <div className="mb-4 flex flex-col">

                            <label className={labelClass} htmlFor="profileLastName">

                                Last name

                            </label>



                            <input

                                className={inputClass}

                                type="text"

                                name="lastName"

                                id="profileLastName"

                                placeholder="Last Name"

                                value={profileForm.lastName}

                                onChange={handleProfileInputChange}

                                required

                            />

                        </div>



                        <div className="mb-4 flex flex-col">

                            <label className={labelClass} htmlFor="profileEmail">

                                Email

                            </label>



                            <input

                                className={`${inputClass} bg-gray-100`}

                                type="email"

                                id="profileEmail"

                                value={email}

                                readOnly

                            />

                        </div>



                        <div className="mb-4 flex flex-col">

                            <label className={labelClass} htmlFor="profilePhone">

                                Phone number

                            </label>



                            <input

                                className={inputClass}

                                type="tel"

                                name="phone"

                                id="profilePhone"

                                placeholder="Phone Number"

                                value={profileForm.phone}

                                onChange={handleProfileInputChange}

                            />

                        </div>

                    </div>



                    <div>

                        <div className="my-3 flex flex-col items-center lg:my-14">

                            <img

                                src={imagePreview || DEFAULT_AVATAR}

                                alt="User profile"

                                className="mb-4 h-[130px] w-[130px] rounded-full border object-cover"

                            />



                            <button

                                type="button"

                                onClick={handleImageClick}

                                className="rounded-[26px] border-[3px] border-[#00B207] px-7 py-[10px] font-bold text-[#00B207] transition-all hover:bg-[#00B207] hover:text-white"

                            >

                                Choose Image

                            </button>



                            <input

                                type="file"

                                ref={fileInputRef}

                                className="hidden"

                                accept="image/png,image/jpeg,image/webp"

                                name="image"

                                onChange={handleFileChange}

                            />



                            {imageFile && (

                                <p className="mt-2 text-sm text-gray-500">

                                    Selected: {imageFile.name}

                                </p>

                            )}

                        </div>

                    </div>



                    <div className="mx-auto lg:col-span-2 lg:mx-0">

                        <button

                            type="submit"

                            disabled={profileLoading}

                            className="rounded-[26px] bg-[#00B207] px-7 py-[10px] text-white disabled:cursor-not-allowed disabled:opacity-60"

                        >

                            {profileLoading ? 'Saving...' : 'Save Changes'}

                        </button>

                    </div>

                </div>

            </form>



            {/* Billing Address */}

            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">

                <h2 className="text-xl font-semibold">

                    Billing Address

                </h2>



                {billingFetchLoading && (

                    <span className="text-sm text-gray-500">

                        Loading saved address...

                    </span>

                )}

            </div>



            <form

                onSubmit={handleBillingAddress}

                className="mb-6 rounded-lg border bg-white p-4 shadow-sm"

            >

                <div className="mb-3 flex flex-col items-center gap-3 lg:flex-row">

                    <div className="mb-4 flex w-full flex-col">

                        <label className={labelClass} htmlFor="billingFirstName">

                            First name

                        </label>



                        <input

                            className={inputClass}

                            name="firstName"

                            type="text"

                            id="billingFirstName"

                            placeholder="First Name"

                            value={billingForm.firstName}

                            onChange={handleBillingInputChange}

                            required

                        />

                    </div>



                    <div className="mb-4 flex w-full flex-col">

                        <label className={labelClass} htmlFor="billingLastName">

                            Last name

                        </label>



                        <input

                            className={inputClass}

                            name="lastName"

                            type="text"

                            id="billingLastName"

                            placeholder="Last Name"

                            value={billingForm.lastName}

                            onChange={handleBillingInputChange}

                            required

                        />

                    </div>



                    <div className="mb-4 flex w-full flex-col">

                        <label className={labelClass} htmlFor="companyname">

                            Company name (optional)

                        </label>



                        <input

                            className={inputClass}

                            name="companyname"

                            type="text"

                            id="companyname"

                            placeholder="Company Name"

                            value={billingForm.companyname}

                            onChange={handleBillingInputChange}

                        />

                    </div>

                </div>



                <div className="mb-4 flex flex-col">

                    <label className={labelClass} htmlFor="streetaddress">

                        Street address

                    </label>



                    <input

                        className={inputClass}

                        name="streetaddress"

                        type="text"

                        id="streetaddress"

                        placeholder="House number, road, area"

                        value={billingForm.streetaddress}

                        onChange={handleBillingInputChange}

                        required

                    />

                </div>



                <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div>

                        <label className="mb-2 block font-semibold text-[#222]" htmlFor="division">

                            Division

                        </label>



                        <select

                            name="division"

                            id="division"

                            value={billingForm.division}

                            onChange={(event) => {

                                const division = event.target.value;



                                setBillingForm((previous) => ({

                                    ...previous,

                                    division,

                                    district: ''

                                }));

                            }}

                            className="w-full rounded-[6px] border px-4 py-3 focus:outline-none"

                            required

                        >

                            <option value="">Select Division</option>



                            {divisions.map((division) => (

                                <option key={division} value={division}>

                                    {division}

                                </option>

                            ))}

                        </select>

                    </div>



                    <div>

                        <label className="mb-2 block font-semibold text-[#222]" htmlFor="district">

                            District

                        </label>



                        <select

                            name="district"

                            id="district"

                            value={billingForm.district}

                            onChange={handleBillingInputChange}

                            className="w-full rounded-[6px] border px-4 py-3 focus:outline-none"

                            required

                        >

                            <option value="">Select District</option>



                            {districts.map((district) => (

                                <option key={district} value={district}>

                                    {district}

                                </option>

                            ))}

                        </select>

                    </div>



                    <div>

                        <label className="mb-2 block font-semibold text-[#222]" htmlFor="zipcode">

                            Zip code

                        </label>



                        <input

                            type="text"

                            inputMode="numeric"

                            maxLength={10}

                            placeholder="Zip Code"

                            name="zipcode"

                            id="zipcode"

                            value={billingForm.zipcode}

                            onChange={handleBillingInputChange}

                            className={inputClass}

                        />

                    </div>

                </div>



                <div className="mb-3 flex flex-col items-center gap-3 lg:flex-row">

                    <div className="mb-4 flex w-full flex-col">

                        <label className={labelClass} htmlFor="billingEmail">

                            Email

                        </label>



                        <input

                            className={`${inputClass} bg-gray-100`}

                            type="email"

                            id="billingEmail"

                            value={email}

                            readOnly

                        />

                    </div>



                    <div className="mb-4 flex w-full flex-col">

                        <label className={labelClass} htmlFor="billingPhone">

                            Phone

                        </label>



                        <input

                            className={inputClass}

                            name="phone"

                            type="tel"

                            id="billingPhone"

                            placeholder="Phone Number"

                            value={billingForm.phone}

                            onChange={handleBillingInputChange}

                            required

                        />

                    </div>

                </div>



                <div>

                    <button

                        type="submit"

                        disabled={billingLoading || billingFetchLoading}

                        className="rounded-[26px] bg-[#00B207] px-7 py-[10px] text-white disabled:cursor-not-allowed disabled:opacity-60"

                    >

                        {billingLoading

                            ? 'Saving...'

                            : billingAddress?._id

                                ? 'Update Billing Address'

                                : 'Save Billing Address'}

                    </button>

                </div>

            </form>

        </div>

    );

};



export default Settings;
