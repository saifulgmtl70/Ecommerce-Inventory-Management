
import { Outlet } from 'react-router-dom';
import './Layout.css';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { useEffect, useState } from 'react';
import Loader from './Loader';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Layout = () => {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init();
        // Simulate loading delay
        setTimeout(() => {
            setLoading(false);
        }, 3000); // Adjust the timeout duration as needed
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <main className=''>
            <Header/>
            <Outlet/>
            <Footer/>
        </main>
    );
};

export default Layout;