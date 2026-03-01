import { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const isHomePage = location.pathname === "/";

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || !isHomePage
                ? "bg-white/95 backdrop-blur-lg shadow-lg"
                : "bg-transparent"
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12" />
                                </svg>
                            </div>
                            <span className={`text-2xl font-black ${isScrolled || !isHomePage ? "gradient-text" : "text-white"
                                }`}>
                                Gourmet Haven
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link
                                to="/"
                                className={`font-medium transition-all hover:text-primary ${isScrolled || !isHomePage ? "text-gray-700" : "text-white/90 hover:text-white"
                                    } ${location.pathname === "/" ? "text-primary" : ""}`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/menu"
                                className={`font-medium transition-all hover:text-primary ${isScrolled || !isHomePage ? "text-gray-700" : "text-white/90 hover:text-white"
                                    } ${location.pathname === "/menu" ? "text-primary" : ""}`}
                            >
                                Menu
                            </Link>
                            <Link
                                to="/reservations"
                                className={`font-medium transition-all hover:text-primary ${isScrolled || !isHomePage ? "text-gray-700" : "text-white/90 hover:text-white"
                                    } ${location.pathname === "/reservations" ? "text-primary" : ""}`}
                            >
                                Reservations
                            </Link>

                            {/* Cart */}
                            <Link to="/cart" className="relative group">
                                <div className={`p-2 rounded-xl transition-all ${isScrolled || !isHomePage
                                    ? "hover:bg-gray-100"
                                    : "hover:bg-white/10"
                                    }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 transition-colors ${isScrolled || !isHomePage ? "text-gray-700 group-hover:text-primary" : "text-white"
                                        }`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold text-white gradient-bg rounded-full animate-scale-in">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            {/* Auth */}
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                                            {(user.name || user.email || "U").charAt(0).toUpperCase()}
                                        </div>
                                        <span className={`font-medium ${isScrolled || !isHomePage ? "text-gray-700" : "text-white"
                                            }`}>
                                            {user.name || "User"}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${isScrolled || !isHomePage
                                            ? "text-gray-500 hover:text-red-500 hover:bg-red-50"
                                            : "text-white/80 hover:text-white hover:bg-white/10"
                                            }`}
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    to="/auth"
                                    className="btn-primary px-6 py-2.5"
                                >
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 ${isScrolled || !isHomePage ? "text-gray-900" : "text-white"}`}>
                                {isMobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-xl transition-all duration-300 ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
                    }`}>
                    <div className="p-6 space-y-4">
                        <Link to="/" className="block py-3 text-lg font-medium text-gray-900 hover:text-primary">Home</Link>
                        <Link to="/menu" className="block py-3 text-lg font-medium text-gray-900 hover:text-primary">Menu</Link>
                        <Link to="/reservations" className="block py-3 text-lg font-medium text-gray-900 hover:text-primary">Reservations</Link>
                        <Link to="/cart" className="flex items-center gap-3 py-3 text-lg font-medium text-gray-900 hover:text-primary">
                            Cart
                            {cartCount > 0 && (
                                <span className="px-2 py-1 text-xs font-bold text-white gradient-bg rounded-full">{cartCount}</span>
                            )}
                        </Link>
                        <div className="pt-4 border-t border-gray-100">
                            {user ? (
                                <button onClick={handleLogout} className="w-full py-3 text-lg font-medium text-red-500">Logout</button>
                            ) : (
                                <Link to="/auth" className="block w-full text-center py-3 gradient-bg text-white font-bold rounded-xl">Sign In</Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className={`flex-grow ${isHomePage ? "" : "pt-20"}`}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        {/* Brand */}
                        <div className="md:col-span-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12" />
                                    </svg>
                                </div>
                                <span className="text-xl font-bold">Gourmet Haven</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Experience culinary excellence with our handcrafted dishes, made from the finest ingredients.
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-bold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/menu" className="hover:text-white transition-colors">Menu</Link></li>
                                <li><Link to="/cart" className="hover:text-white transition-colors">Cart</Link></li>
                                <li><Link to="/auth" className="hover:text-white transition-colors">Sign In</Link></li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h4 className="font-bold mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                    123 Gourmet Street, Food City
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                    +1 (555) 123-4567
                                </li>
                                <li className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                    hello@gourmethaven.com
                                </li>
                            </ul>
                        </div>

                        {/* Hours */}
                        <div>
                            <h4 className="font-bold mb-4">Opening Hours</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>Mon - Fri: 11am - 10pm</li>
                                <li>Saturday: 10am - 11pm</li>
                                <li>Sunday: 10am - 9pm</li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            © 2024 Gourmet Haven. All rights reserved.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
