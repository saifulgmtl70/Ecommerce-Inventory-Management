import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { CiSearch, CiUser, CiHeart, CiShoppingCart } from 'react-icons/ci';
import { FiShoppingCart } from 'react-icons/fi';
import { IoCloseOutline, IoLeaf } from 'react-icons/io5';
import { AiOutlineClose } from 'react-icons/ai';
import { RiMenuFold2Fill } from 'react-icons/ri';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../Hooks/useAuth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Header.css';
import useCart from '../Hooks/useCart';
import useAxiosPublic from '../Hooks/useAxiosPublic';
import useWishlist from '../Hooks/useWishlist';
import useAdmin from '../Hooks/useAdmin';

import { MdManageAccounts } from "react-icons/md";

import { IoLogOutOutline } from "react-icons/io5";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false); // New state for cart menu
  const [wishListOpen, setWlishListOpen] = useState(false); // New state for Wishlist menu
  const [cart, setCart] = useCart();
  const [wishlist, refetch] = useWishlist()
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const [isAdmin] = useAdmin();
  // console.log(isAdmin);

    const handleMenuItemClick = () => {
      setMenuOpen(false);
    };


    const handleCloseCart = () =>{
      setCartOpen(false);
    }

    const handleCloseWishList = () =>{
      setWlishListOpen(false);
    }


  const axiosPublic = useAxiosPublic();

  const handleLogout = () => {
    logOut().then(() => {
      toast.success("Logged Out Successfully", {
        position: "top-center",
        autoClose: 1000, // এক সেকেন্ডের মধ্যে বন্ধ হবে
        // টোস্ট বন্ধ হওয়ার পরে নেভিগেট করুন
        onClose: () => navigate('/login')
      });
    });
    setDropdownOpen(false);
  };


  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      const itemPrice = Number(item.price);
      return !isNaN(itemPrice) ? total + itemPrice : total;
    }, 0).toFixed(2);
  };

  const totalPrice = calculateTotalPrice();


 

    const handleDeleteItem = (id) =>{
      axiosPublic.delete(`/carts/${id}`)
      .then(res =>{
          if(res.data.deletedCount > 0){
            setCart(cart.filter(item => item._id !== id));
              toast.success("Deleted Successfully", {
                position: "top-center",
                autoClose: 3000,
                onClose: () =>  navigate('/')
              });
              
              
          }
      })
    }
 

    const handleDeleteWishlistItem = (id) =>{
      axiosPublic.delete(`/wishlist/${id}`)
      .then(res =>{
          if(res.data.deletedCount > 0){
            // setWishlist(cart.filter(item => item._id !== id));
              toast.success("Deleted an Wishlsit item Successfully", {
                position: "top-center",
                autoClose: 3000,
                onClose: () =>  navigate('/')
              });
              refetch();
              
              
          }
      })
    }




  return (
    <div className="bg-[#fff] z-50 shadow-sm top-0 sticky nunito_sans">
      <ToastContainer/>
      <div>
        <div className="lg:flex justify-between hidden items-center px-4 md:px-12 py-2 bg-[#EDF2EE]">
          <div className="text-sm text-[#84D187]">
            <span>Store location: Lincoln 144, Illinois, Chicago, USA</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button className="text-[#84D187]">Eng</button>
              <button className="text-[#84D187]">USD</button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center navmenu px-4 md:px-12 py-4">
          <Link to="/" className="text-[30px] poetsen_one tracking-wide flex items-center font-bold text-[#00B207]">
            <IoLeaf />
            Ecobazaar
          </Link>

          <nav className="hidden md:flex space-x-8">
            <NavLink to="/" className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]">Home</NavLink>
            <NavLink to="/shop" className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]">Shop</NavLink>
            <NavLink to="/blog" className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]">Blog</NavLink>
            <NavLink to="/about" className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]">About Us</NavLink>
            <NavLink to="/contact" className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]">Contact Us</NavLink>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <CiSearch className="text-[#222] text-[20px] cursor-pointer" />
            <div className='relative'>
              <CiHeart onClick={() => setWlishListOpen(true)} className="text-[#222] text-[20px] cursor-pointer" />
              {
                wishlist.length === 0 ? <span ></span> : 
                <span className="text-[#00B307] absolute font-bold -top-3 -right-1 rounded-full ">
                  {wishlist.length}
                </span>
              }
            </div>
            <div className='relative'>
              <CiShoppingCart  className="text-[#222] text-[20px] cursor-pointer" onClick={() => setCartOpen(true)} />
              {
                cart.length === 0 ? <span ></span> : 
                <span className="text-[#00B307] absolute font-bold -top-3 -right-1 rounded-full ">
                  {cart.length}
                </span>
              }
            </div>
            {/* Add onClick handler */}
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
                  <img src={user.photoURL} alt="user" className="w-8 h-8 rounded-full" />
                  <span className="ml-2 text-[#444]">{user.displayName}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2  h-auto w-auto lg:w-72 bg-white border rounded shadow-lg z-50">
                    <div className="">

                      <div className="flex items-center justify-center pt-3">
                          <img src={user.photoURL} alt="user" className="w-16 h-16 rounded-full" />
                      </div>

                      <div className="p-3 text-center" >
                        <p className="font-bold text-[23px]">{user.displayName}</p>
                        <p className="text-[16px]  text-gray-600">{user.email}</p>
                      </div>
                      {/* 
                       */}

                      {
                        isAdmin ? <Link to="admindashboard/adminhome" className='py-3'><button className="w-full text-left px-4 py-2 bg-gray-100">Admin Dashboard</button></Link> 

                        :

                        <Link to="userdashboard/userhome" className='w-full text-[18px] bg-gray-100 px-3 py-3 flex items-center gap-[5px]'> <MdManageAccounts /> <button className=" text-left">Your Profile</button></Link>

                      }

                    </div>
                    <div className="border-t w-full text-[18px] cursor-pointer bg-gray-100 px-3 py-3 flex items-center gap-[5px]">
                      <IoLogOutOutline />
                      <button onClick={handleLogout} className=" ">Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"><CiUser className="text-[#222] text-[20px] cursor-pointer" /></Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <div className=' relative'>
              <CiShoppingCart  className="text-[#222] text-[20px] cursor-pointer" onClick={() => setCartOpen(true)} />
              {
                cart.length === 0 ? <span ></span> : 
                <span className="text-[#00B307] absolute font-bold -top-3 -right-1 rounded-full ">
                  {cart.length}
                </span>
              }
            </div> {/* Add onClick handler */}
            {user ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center focus:outline-none">
                  <img src={user.photoURL} alt="user" className="w-8 h-8 rounded-full" />
                </button>
                {dropdownOpen && (
                      <div className="absolute right-0 mt-2 h-auto w-64 bg-white border rounded shadow-lg z-50">
                         <div className="flex items-center  justify-center pt-3">
                          <img src={user.photoURL} alt="user" className="w-16 h-16 rounded-full" />
                      </div>
                    <div className="">
                      <div className="p-3 text-center" >
                          <p className="font-bold text-[18px]">{user.displayName}</p>
                          <p className="text-[15px]  text-gray-600">{user.email}</p>
                      </div>
                      {
                        isAdmin ? <Link to="admindashboard/adminhome" className='py-3'><button className="w-full text-left px-4 py-2 bg-gray-100">Admin Dashboard</button></Link> 
                        
                        :

                        <Link to="userdashboard/userhome" className='text-[17px] w-full bg-gray-100 px-3 py-3 flex items-center gap-[5px]'> <MdManageAccounts /> <button className="text-left ">Your Profile</button></Link>

                      }
                    </div>
                    <div className="border-t w-full cursor-pointer text-[17px] bg-gray-100 px-3 py-3 flex items-center gap-[5px]">
                      <IoLogOutOutline />
                      <button onClick={handleLogout} className="  ">Logout</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"><CiUser className="text-[#444] text-[20px] cursor-pointer" /></Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <AiOutlineClose className="text-[#444] text-[20px] cursor-pointer z-50" /> : <RiMenuFold2Fill className="text-[#444] cursor-pointer text-[20px]" />}
            </button>
          </div>
        </div>

        <div
          className={`md:hidden bg-[#EDF2EE] navmenu fixed top-0 right-0 h-full w-full max-w-xs transition-transform duration-300 ease-in-out transform ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <button
            className="absolute top-4 right-4 cursor-pointer text-[#444] text-[20px]"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <AiOutlineClose />
          </button>

          <nav className="flex flex-col items-center space-y-4 py-4 mt-16">
            <NavLink onClick={handleMenuItemClick} to="/" className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]">Home</NavLink>
            <NavLink onClick={handleMenuItemClick} to="/shop" className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]">Shop</NavLink>
            <NavLink onClick={handleMenuItemClick} to="/blog" className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]">Blog</NavLink>
            <NavLink onClick={handleMenuItemClick} to="/about" className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]">About Us</NavLink>
            <NavLink onClick={handleMenuItemClick} to="/contact" className="text-[#666666] hover:text-[#333333] text-[15px] font-[600]">Contact Us</NavLink>
          </nav>

          <div className="flex justify-center space-x-4 pb-4">
            <CiSearch className="text-[#222] text-[20px] cursor-pointer" />
            <div className='relative'>
              <CiHeart onClick={() => setWlishListOpen(true)} className="text-[#222] text-[20px] cursor-pointer" />
              {
                wishlist.length === 0 ? <span ></span> : 
                <span className="text-[#00B307] absolute font-bold -top-3 -right-1 rounded-full ">
                  {wishlist.length}
                </span>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Cart Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white transition-transform duration-300 ease-in-out transform ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center px-4 py-4 bg-[#f9f8f8]">
          <h2 className="text-lg text-[#00B307] font-bold">Your Shopping Cart ({cart.length})</h2>
          <button onClick={() => setCartOpen(false)} className="text-[#00B307] ">
            <FaTimes />
          </button>
        </div>
        <div className="scrollable-container p-4">
          {/* Cart items will go here */}
          <ul className="mb-14">
            {
              cart.map((item) => (
                <li key={item._id} className='border-b pb-3 flex items-center justify-between px-3 py-2'>
                  <div className='flex items-center gap-2'>
                    <div>
                      <img src={item.image} alt="" className='w-[80px] h-[80px]'/>
                    </div>
                    <div>
                      <h3 className='text-[18px] text-[#191919] font-[600] mb-1'>{item.product}</h3>
                      <p className='text-[15px] text-[#999]'>1kg = <span className='text-[#222] font-bold'>৳{item.price}</span></p>
                    </div>
                  </div>
                    <button onClick={() => handleDeleteItem(item._id)} className='text-[#6d5656] text-[23px] p-[6px] border rounded-full'>
                      <IoCloseOutline />
                    </button>
                </li>
              ))
            }
          </ul>

          

          <div className="fixed bottom-0 left-0 w-full p-4 bg-white">
            <div className="flex items-center justify-between px-2 my-2">
              <h2 className='text-[#444] font-[500]'> {cart.length} Product </h2>
              <h1 className='text-[#191919] font-bold'>৳{totalPrice}</h1>

            </div>

            <div className="flex flex-col gap-3 justify-around">
              <Link onClick={handleCloseCart} to="/checkout" className='px-12 py-3 text-center rounded-[24px] bg-[#00B207] text-[#fff]'><button >Checkout</button></Link>
              <Link onClick={handleCloseCart} to="/cart" className='px-12 py-3 text-center rounded-[24px] bg-[#d2e7d2] text-[#00B207] font-bold'><button >Go to Cart</button></Link>
            </div>
          </div>

        </div>
      </div>


      {/* Wishlist Menu */}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white transition-transform duration-300 ease-in-out transform ${
          wishListOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center px-4 py-4 bg-[#f9f8f8]">
          <h2 className="text-lg text-[#00B307] font-bold">Your Wishlist ({wishlist.length}) </h2>
          <button onClick={() => setWlishListOpen(false)} className="text-[#00B307]">
            <FaTimes />
          </button>
        </div>
        <div className="scrollable-container p-4">
          {/* Cart items will go here */}
          <ul className="mb-14">
            {
              wishlist.map((item) => (
                <li key={item._id} className='border-b pb-3 flex items-center justify-between px-3 py-2'>
                  <div className='flex items-center gap-2'>
                    <div>
                      <img src={item.image} alt="" className='w-[80px] h-[80px]'/>
                    </div>
                    <div>
                      <h3 className='text-[18px] text-[#191919] font-[600] mb-1'>{item.product}</h3>
                      <p className='text-[15px] text-[#999]'>1kg = <span className='text-[#222] font-bold'>৳{item.price}</span></p>
                    </div>
                  </div>
                    <button onClick={() => handleDeleteWishlistItem(item._id)} className='text-[#6d5656] text-[23px] p-[6px] border rounded-full'>
                      <IoCloseOutline />
                    </button>
                </li>
              ))
            }
          </ul>

          

          <div className="fixed bottom-0 left-0 w-full p-4 bg-white">
            

            <div className="flex flex-col gap-3 justify-around">
              
              <Link onClick={handleCloseWishList} to="/cart" className='px-12 py-3 text-center rounded-[24px] bg-[#00B207] text-[#fff]'><button >Go to Cart</button></Link>

              <Link onClick={handleCloseWishList} to="/wishlist" className='px-12 py-3 text-center rounded-[24px] bg-[#d2e7d2] text-[#00B207] font-bold'><button >Go to Wishlist</button></Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Header;
