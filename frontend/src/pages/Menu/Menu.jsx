import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { CartContext } from "../../context/CartContext";
import Button from "../../components/ui/Button";

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, itemsRes] = await Promise.all([
                    api.get("/categories/"),
                    api.get("/menu/")
                ]);
                setCategories(catsRes.data);
                setMenuItems(itemsRes.data);
            } catch (err) {
                console.error("Error fetching menu:", err);
                setError("Failed to load menu. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getItemsByCategory = (categoryId) => {
        return menuItems.filter(item => item.category_id === categoryId && item.is_available);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading menu...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">Our Menu</h1>
            <p className="text-center text-gray-500 mb-12">Delicious dishes crafted with passion</p>

            {categories.map(category => {
                const items = getItemsByCategory(category.id);
                if (items.length === 0) return null;

                return (
                    <div key={category.id} className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2 border-gray-200">
                            {category.name}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {items.map(item => (
                                <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="h-48 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-48 w-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <span>No Image</span>
                                        </div>
                                    )}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                                            <span className="text-lg font-bold text-primary">${item.price.toFixed(2)}</span>
                                        </div>
                                        <p className="text-gray-600 mb-6 flex-grow">{item.description}</p>
                                        <Button
                                            onClick={() => addToCart(item)}
                                            className="w-full justify-center"
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
export default Menu;
