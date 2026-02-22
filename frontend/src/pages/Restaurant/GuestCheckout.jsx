import { useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { TenantContext } from '../../context/TenantContext';
import api from '../../services/api';

const GuestCheckout = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { cart, clearCart, getCartTotal } = useContext(CartContext);
    const { tenant } = useContext(TenantContext);

    const [formData, setFormData] = useState({
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (cart.length === 0) {
            setError('Your cart is empty');
            return;
        }

        if (!formData.customer_name || !formData.customer_phone) {
            setError('Please fill in your name and phone number');
            return;
        }

        setLoading(true);
        try {
            // Create order
            const orderData = {
                customer_name: formData.customer_name,
                customer_phone: formData.customer_phone,
                customer_address: formData.customer_address,
                notes: formData.notes,
                items: cart.map(item => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                    price: item.price
                })),
                total_amount: getCartTotal()
            };

            const response = await api.post('/orders/guest', orderData, {
                headers: { 'X-Tenant-Slug': slug }
            });

            clearCart();
            navigate(`/r/${slug}/track/${response.data.id}`);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-6">Add some items before checking out</p>
                <Link
                    to={`/r/${slug}`}
                    className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                >
                    Browse Menu
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link
                to={`/r/${slug}/cart`}
                className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
                Back to Cart
            </Link>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Order Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Your Details</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                            <input
                                type="text"
                                value={formData.customer_name}
                                onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                            <input
                                type="tel"
                                value={formData.customer_phone}
                                onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                placeholder="+92 300 1234567"
                            />
                            <p className="mt-1 text-sm text-gray-500">We'll call you when your order is ready</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address (Optional)</label>
                            <textarea
                                value={formData.customer_address}
                                onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"
                                placeholder="Enter your delivery address"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Special Instructions</label>
                            <textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={2}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"
                                placeholder="Any special requests for your order?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Placing Order...
                                </>
                            ) : (
                                <>
                                    Place Order - Rs. {getCartTotal().toFixed(0)}
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                    <div className="space-y-4 mb-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                                <img
                                    src={item.image_url || 'https://via.placeholder.com/60'}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                </div>
                                <span className="font-medium text-gray-900">
                                    Rs. {(item.price * item.quantity).toFixed(0)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-100 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>Rs. {getCartTotal().toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery</span>
                            <span className="text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t border-gray-100">
                            <span>Total</span>
                            <span>Rs. {getCartTotal().toFixed(0)}</span>
                        </div>
                    </div>

                    {tenant?.phone && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                            <p className="text-sm text-gray-600">
                                Questions? Call us at{' '}
                                <a href={`tel:${tenant.phone}`} className="text-orange-500 font-medium">
                                    {tenant.phone}
                                </a>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GuestCheckout;
