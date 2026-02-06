import { Link } from "react-router-dom";
import Button from "../../components/ui/Button";

const Landing = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h1 className="text-5xl font-extrabold text-primary mb-6">Welcome to Gourmet Haven</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Experience the finest cuisine delivered straight to your table.
                Fresh ingredients, exquisite flavors, and unforgettable moments.
            </p>
            <div className="space-x-4">
                <Link to="/menu">
                    <Button className="text-lg px-8 py-3">View Menu</Button>
                </Link>
                <Link to="/auth">
                    <Button variant="outline" className="text-lg px-8 py-3">Login / Register</Button>
                </Link>
            </div>
        </div>
    );
};
export default Landing;
