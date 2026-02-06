import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";

const Layout = ({ children }) => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/" className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Gourmet Haven
                        </Link>

                        <div className="flex items-center space-x-6">
                            <Link to="/menu" className="font-medium text-gray-700 hover:text-primary transition-colors">
                                Menu
                            </Link>

                            <Link to="/cart" className="relative group p-2">
                                <span className="sr-only">Cart</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700 group-hover:text-primary transition-colors">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/profile" className="font-medium text-gray-700 hover:text-primary transition-colors">
                                        {user.name || "Profile"}
                                    </Link>
                                    <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 font-medium transition-colors">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link to="/auth" className="px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="flex-grow bg-gray-50/50">
                {children}
            </main>
            <footer className="bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-400 text-sm">
                        &copy; 2024 Gourmet Haven. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};
export default Layout;
