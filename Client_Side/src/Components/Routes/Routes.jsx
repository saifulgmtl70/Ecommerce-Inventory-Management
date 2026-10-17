import {
    createBrowserRouter,
} from "react-router-dom";
import Layout from "../Layout/Layout";
import ErrorPage from "../ErrorPage/ErrorPage";
import Home from "../Pages/Home/Home";
import Login from "../Authentication/Login/Login";
import Signup from "../Authentication/Signup/Signup";
import Shop from "../Pages/Shop/Shop";
import SeeProduct from "../Pages/Shop/SeeProduct/SeeProduct";
import Checkout from "../Pages/Checkout/Checkout";
import Cart from "../Pages/Cart/Cart";
import Contact from "../Pages/Contact/Contact";
import Wishlist from "../Pages/Wishlist/Wishlist";
import About from "../Pages/About/About";
import Blogs from "../Pages/Blog/Blogs";
import SeeBlog from "../Pages/Blog/SeeBlog";
import Userdashboard from "../UserDashboard/Userdashboard";
import Userhome from "../UserDashboard/Userhome/Userhome";
import OrderHistory from "../UserDashboard/OrderHistory/OrderHistory";
import Settings from "../UserDashboard/Settings/Settings";
import AdminDashboard from "../AdminDashboard/AdminDashboard";
import AdminHome from "../AdminDashboard/AdminHome/AdminHome";
import AllUsers from "../AdminDashboard/AllUsers/AllUsers";
import AddProduct from "../AdminDashboard/AddProduct/AddProduct";
import ManageProduct from "../AdminDashboard/ManageProduct/ManageProduct";
import AddCategory from "../AdminDashboard/AddCategory/AddCategory";
import ManageCategory from "../AdminDashboard/ManageCategory/ManageCategory";
import AdminRoute from "./‎AdminRoute";
import UpdateProdut from "../AdminDashboard/ManageProduct/UpdateProdut";
import ManageOrders from "../AdminDashboard/ManageOrders/ManageOrders";










export const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      errorElement: <ErrorPage/>,
      children: [
        {
            path: '/',
            element: <Home/>
        },

        {
          path: '/shop',
          element: <Shop/>
        },

        {
          path: '/product/:id',
          element: <SeeProduct/>,
          loader: () => fetch(`http://localhost:5000/products`)
        },

        {
          path:'/seeblog/:id',
          element: <SeeBlog></SeeBlog>,
          loader: () => fetch(`http://localhost:5000/blogs`) 

        },


        {
          path: '/checkout',
          element: <Checkout/>
        },

        {
          path: '/cart',
          element: <Cart/>
        },

        {
          path: '/wishlist',
          element: <Wishlist/>
        },

        {
          path: '/about',
          element: <About/>
        },

        {
          path: '/blog',
          element: <Blogs/>
        },

        {
          path: '/contact',
          element: <Contact/>
        },

        {
          path: "/login",
          element: <Login/>
        },

        {
          path: "/signup",
          element: <Signup/>
        }

      ]
      
       
      
       
       

       
        
      
    },

    {
      path: 'userdashboard',
      element: <Userdashboard/>,
      children:[
        {
          path:'userhome',
          element: <Userhome/>
        },

        {
          path:"orderhistory",
          element: <OrderHistory/>
        },
        {
          path:"settings",
          element: <Settings/>
        }
      ]
    },

    {
      path: 'admindashboard',
      element: <AdminRoute> <AdminDashboard/> </AdminRoute>,
      children:[
        {
          path: 'adminhome',
          element: <AdminHome/>
        },

        {
          path: 'allusers',
          element: <AllUsers/>
        },

        {
          path: 'addproduct',
          element: <AddProduct/>
        },

        {
          path: 'manageproduct',
          element: <ManageProduct/>
        },

        {
          path: 'manageorders',
          element: <ManageOrders/>
        },

        {
          path: 'updateProduct/:id',
          element: <AdminRoute> <UpdateProdut/> </AdminRoute>,
          loader: () => fetch(`http://localhost:5000/products`) 
        },

        {
          path: 'addcategory',
          element: <AddCategory/>
        },

        {
          path: 'managecategory',
          element: <ManageCategory/>
        },

      ]
    }





  ]);