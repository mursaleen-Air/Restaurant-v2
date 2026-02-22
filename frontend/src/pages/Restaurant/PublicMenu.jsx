import { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { TenantContext } from '../../context/TenantContext';
import { CartContext } from '../../context/CartContext';
import api from '../../services/api';

const PublicMenu = () => {
    const { slug } = useParams();
    const { tenant } = useContext(TenantContext);
    const { addToCart, cart } = useContext(CartContext);

    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);
    const [addedItem, setAddedItem] = useState(null);

    useEffect(() => {
        fetchMenu();
    }, [slug]);

    const fetchMenu = async () => {
        setLoading(true);
        try {
            // Fetch menu items and categories for this restaurant
            const [catsRes, itemsRes] = await Promise.all([
                api.get('/categories/', { headers: { 'X-Tenant-Slug': slug } }),
                api.get('/menu/', { headers: { 'X-Tenant-Slug': slug } })
            ]);
            setCategories(catsRes.data);
            setMenuItems(itemsRes.data.filter(item => item.is_available));
            if (catsRes.data.length > 0) {
                setActiveCategory(catsRes.data[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch menu:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (item) => {
        addToCart(item);
        setAddedItem(item.id);
        setTimeout(() => setAddedItem(null), 1500);
    };

    const getItemsByCategory = (categoryId) => {
        return menuItems.filter(item => item.category_id === categoryId);
    };

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                            <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Restaurant Info */}
            {tenant?.description && (
                <div className="mb-8 p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl border border-orange-100">
                    <p className="text-gray-700">{tenant.description}</p>
                </div>
            )}

            {/* Category Tabs */}
            {categories.length > 0 && (
                <div className="mb-8 sticky top-[73px] bg-gray-50 z-30 py-4 -mx-4 px-4">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                    }`}
                            >
                                {cat.name}
                                <span className={`ml-2 text-sm ${activeCategory === cat.id ? 'text-white/80' : 'text-gray-400'}`}>
                                    ({getItemsByCategory(cat.id).length})
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Menu Items */}
            {categories.length === 0 || menuItems.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Menu Coming Soon</h2>
                    <p className="text-gray-600">This restaurant hasn't added any menu items yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {getItemsByCategory(activeCategory).map(item => (
                        <div
                            key={item.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={item.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-bold text-orange-600">
                                        Rs. {item.price.toFixed(0)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${addedItem === item.id
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
                                        }`}
                                >
                                    {addedItem === item.id ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                            Added!
                                        </>
                                    ) : (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Floating Cart Button */}
            {cartItemCount > 0 && (
                <Link
                    to={`/r/${slug}/cart`}
                    className="fixed bottom-6 right-6 px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-2xl flex items-center gap-3 hover:scale-105 transition-transform animate-fade-in-up"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    <span className="font-bold">View Cart ({cartItemCount})</span>
                </Link>
            )}
        </div>
    );
};

export default PublicMenu;
