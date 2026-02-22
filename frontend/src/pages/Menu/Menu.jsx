import { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { CartContext } from "../../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

// Fake data for beautiful display when API is empty or fails
const FAKE_MENU_DATA = {
    categories: [
        { id: 1, name: "Appetizers", description: "Start your meal right" },
        { id: 2, name: "Main Course", description: "Hearty and satisfying" },
        { id: 3, name: "Desserts", description: "Sweet endings" },
        { id: 4, name: "Beverages", description: "Refreshing drinks" }
    ],
    items: [
        { id: 1, name: "Garlic Bread", description: "Toasted bread with garlic butter and fresh herbs", price: 5.99, category_id: 1, is_available: true, image_url: "https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=400&q=80" },
        { id: 2, name: "Mozzarella Sticks", description: "Crispy fried mozzarella with marinara sauce", price: 8.99, category_id: 1, is_available: true, image_url: "https://images.unsplash.com/photo-1531749668029-2db88e4276c7?w=400&q=80" },
        { id: 3, name: "Bruschetta", description: "Grilled bread topped with tomatoes and basil", price: 7.99, category_id: 1, is_available: true, image_url: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=400&q=80" },
        { id: 4, name: "Grilled Salmon", description: "Fresh Atlantic salmon with lemon butter sauce", price: 24.99, category_id: 2, is_available: true, image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80" },
        { id: 5, name: "Beef Steak", description: "12oz ribeye steak cooked to perfection", price: 29.99, category_id: 2, is_available: true, image_url: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80" },
        { id: 6, name: "Chicken Parmesan", description: "Breaded chicken with marinara and mozzarella", price: 18.99, category_id: 2, is_available: true, image_url: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400&q=80" },
        { id: 7, name: "Pasta Carbonara", description: "Creamy pasta with bacon and parmesan", price: 16.99, category_id: 2, is_available: true, image_url: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400&q=80" },
        { id: 8, name: "Chocolate Lava Cake", description: "Warm chocolate cake with molten center", price: 8.99, category_id: 3, is_available: true, image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" },
        { id: 9, name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: 7.99, category_id: 3, is_available: true, image_url: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=80" },
        { id: 10, name: "Fresh Lemonade", description: "House-made lemonade with fresh lemons", price: 4.99, category_id: 4, is_available: true, image_url: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&q=80" },
        { id: 11, name: "Iced Coffee", description: "Premium cold brew coffee", price: 5.49, category_id: 4, is_available: true, image_url: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&q=80" },
    ]
};

const Menu = () => {
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);
    const [addedItems, setAddedItems] = useState({});
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, itemsRes] = await Promise.all([
                    api.get("/categories/"),
                    api.get("/menu/")
                ]);

                if (catsRes.data.length > 0 && itemsRes.data.length > 0) {
                    setCategories(catsRes.data);
                    setMenuItems(itemsRes.data);
                } else {
                    setCategories(FAKE_MENU_DATA.categories);
                    setMenuItems(FAKE_MENU_DATA.items);
                }
            } catch (err) {
                console.error("Error fetching menu, using demo data:", err);
                setCategories(FAKE_MENU_DATA.categories);
                setMenuItems(FAKE_MENU_DATA.items);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getItemsByCategory = (categoryId) => {
        return menuItems.filter(item => item.category_id === categoryId && item.is_available);
    };

    const handleAddToCart = (item) => {
        addToCart(item);
        setAddedItems(prev => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            setAddedItems(prev => ({ ...prev, [item.id]: false }));
        }, 1500);
    };

    const filteredCategories = activeCategory
        ? categories.filter(c => c.id === activeCategory)
        : categories;

    // All category buttons including "All"
    const allCategoryButtons = [
        { id: null, name: "All" },
        ...categories
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="spinner mx-auto mb-4"></div>
                    <p className="text-gray-500 animate-pulse">Loading delicious dishes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header Section */}
            <div className="relative">
                {/* Dark Background */}
                <div
                    className="pt-20 pb-8 px-4"
                    style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)'
                    }}
                >
                    {/* Background decorations */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                        <div className="absolute top-20 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="relative max-w-7xl mx-auto text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
                            Our <span className="gradient-text">Menu</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Discover our carefully crafted dishes, made with passion and the finest ingredients
                        </p>
                    </motion.div>
                </div>

                {/* Sine Wave Container */}
                <div className="relative h-24 md:h-28 overflow-visible" style={{ marginTop: '-1px' }}>
                    {/* SVG Sine Wave */}
                    <svg
                        className="absolute top-0 left-0 w-full"
                        viewBox="0 0 1200 100"
                        preserveAspectRatio="none"
                        style={{ height: '100%' }}
                    >
                        <path
                            d={`M0,0 L0,50 C100,50 140,100 200,100 C260,100 300,50 400,50 C500,50 540,100 600,100 C660,100 700,50 800,50 C900,50 940,100 1000,100 C1060,100 1100,50 1200,50 L1200,0 Z`}
                            fill="#1a1a2e"
                        />
                    </svg>

                    {/* Buttons */}
                    <div className="absolute inset-0 flex items-start justify-around px-4 md:px-12 pt-2 md:pt-4">
                        {allCategoryButtons.map((cat, index) => {
                            const isActive = activeCategory === cat.id;

                            return (
                                <motion.button
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    key={cat.id ?? 'all'}
                                    onClick={() => setActiveCategory(cat.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`
                                        w-16 h-16 md:w-20 md:h-20 rounded-full 
                                        flex items-center justify-center
                                        text-[10px] md:text-xs font-bold text-center
                                        leading-tight px-1 shadow-lg transition-colors
                                        ${isActive
                                            ? 'bg-gradient-to-br from-primary to-orange-500 text-white shadow-xl shadow-primary/40 scale-110'
                                            : 'bg-white text-gray-700 hover:text-primary'
                                        }
                                    `}
                                >
                                    {cat.name}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Spacer */}
            <div className="h-4"></div>

            {/* Menu Items */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <AnimatePresence>
                    {filteredCategories.map((category, catIndex) => {
                        const items = getItemsByCategory(category.id);
                        if (items.length === 0) return null;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                                key={category.id}
                                className="mb-16"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <h2 className="text-3xl font-bold text-gray-900">
                                        {category.name}
                                    </h2>
                                    <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                                        {items.length} items
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {items.map((item, itemIndex) => (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.4, delay: itemIndex * 0.05 }}
                                            key={item.id}
                                            className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100"
                                        >
                                            {/* Image */}
                                            <div className="relative h-56 overflow-hidden">
                                                <img
                                                    src={item.image_url || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                                {/* Quick Add Button */}
                                                <button
                                                    onClick={() => handleAddToCart(item)}
                                                    className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform ${addedItems[item.id]
                                                        ? "bg-green-500 scale-110"
                                                        : "bg-white shadow-lg opacity-0 group-hover:opacity-100 hover:scale-110"
                                                        }`}
                                                >
                                                    {addedItems[item.id] ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="white" className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-primary">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <span className="text-xl font-bold gradient-text">
                                                        ${item.price.toFixed(2)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mb-5 line-clamp-2">
                                                    {item.description}
                                                </p>
                                                <button
                                                    onClick={() => handleAddToCart(item)}
                                                    className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${addedItems[item.id]
                                                        ? "bg-green-500 text-white"
                                                        : "bg-gray-100 text-gray-900 hover:gradient-bg hover:text-white"
                                                        }`}
                                                >
                                                    {addedItems[item.id] ? "✓ Added!" : "Add to Cart"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Menu;
