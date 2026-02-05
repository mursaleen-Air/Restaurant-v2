import { Link } from "react-router-dom";

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <nav className="p-4 bg-white shadow flex justify-between items-center">
                <Link to="/" className="text-xl font-bold text-primary">Gourmet Haven</Link>
                <div className="space-x-4">
                    <Link to="/menu" className="hover:text-primary">Menu</Link>
                    <Link to="/cart" className="hover:text-primary">Cart</Link>
                    <Link to="/auth" className="hover:text-primary">Login</Link>
                </div>
            </nav>
            <main className="flex-grow">
                {children}
            </main>
            <footer className="p-4 bg-gray-800 text-white text-center">
                &copy; 2024 Gourmet Haven
            </footer>
        </div>
    );
};
export default Layout;
