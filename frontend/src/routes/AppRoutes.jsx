import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import RestaurantLayout from '../components/layout/RestaurantLayout';

// Existing pages
import Landing from '../pages/Landing/Landing';
import Menu from '../pages/Menu/Menu';
import Cart from '../pages/Cart/Cart';
import Checkout from '../pages/Checkout/Checkout';
import Auth from '../pages/Auth/Auth';
import Profile from '../pages/Profile/Profile';
import Admin from '../pages/Admin/Admin';

// Platform pages
import PlatformLanding from '../pages/Platform/PlatformLanding';
import RestaurantSignup from '../pages/Platform/RestaurantSignup';
import Onboarding from '../pages/Onboarding/Onboarding';

// Public restaurant pages
import PublicMenu from '../pages/Restaurant/PublicMenu';
import GuestCheckout from '../pages/Restaurant/GuestCheckout';
import OrderTracking from '../pages/Restaurant/OrderTracking';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Platform Routes (for SaaS landing, signup, etc.) */}
            <Route path="/platform" element={<PlatformLanding />} />
            <Route path="/signup" element={<RestaurantSignup />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Public Restaurant Routes - accessible to customers */}
            <Route path="/r/:slug" element={<RestaurantLayout />}>
                <Route index element={<PublicMenu />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<GuestCheckout />} />
                <Route path="track/:orderId" element={<OrderTracking />} />
            </Route>

            {/* Existing app routes (for demo/admin) */}
            <Route element={<Layout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<Admin />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;

