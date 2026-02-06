import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Landing from '../pages/Landing/Landing';
import Menu from '../pages/Menu/Menu';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import Auth from '../pages/Auth/Auth';
import Profile from '../pages/Profile/Profile';
import Admin from '../pages/Admin/Admin';

const AppRoutes = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Layout>
    );
};
export default AppRoutes;
