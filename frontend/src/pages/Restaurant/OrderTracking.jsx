import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';

const OrderTracking = () => {
    const { slug, orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: '📝' },
        { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
        { key: 'ready', label: 'Ready', icon: '✅' },
        { key: 'completed', label: 'Completed', icon: '🎉' }
    ];

    useEffect(() => {
        fetchOrder();
        // Poll for updates every 30 seconds
        const interval = setInterval(fetchOrder, 30000);
        return () => clearInterval(interval);
    }, [orderId]);

    const fetchOrder = async () => {
        try {
            const response = await api.get(`/orders/${orderId}`, {
                headers: { 'X-Tenant-Slug': slug }
            });
            setOrder(response.data);
            setError('');
        } catch (err) {
            setError('Failed to load order. Please check your order ID.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIndex = () => {
        const index = statusSteps.findIndex(s => s.key === order?.status);
        return index >= 0 ? index : 0;
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500">Loading order...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                <p className="text-gray-600 mb-6">{error || "We couldn't find this order."}</p>
                <Link
                    to={`/r/${slug}`}
                    className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                >
                    Back to Menu
                </Link>
            </div>
        );
    }

    const isCancelled = order.status === 'cancelled';

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-orange-100 to-red-100 mb-4">
                    <span className="text-4xl">{isCancelled ? '❌' : statusSteps[getStatusIndex()]?.icon || '📝'}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {isCancelled ? 'Order Cancelled' : 'Order Confirmed!'}
                </h1>
                <p className="text-gray-600">
                    Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
                </p>
            </div>

            {/* Status Progress */}
            {!isCancelled && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>

                    <div className="relative">
                        {/* Progress Line */}
                        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                                style={{ width: `${(getStatusIndex() / (statusSteps.length - 1)) * 100}%` }}
                            ></div>
                        </div>

                        {/* Steps */}
                        <div className="relative flex justify-between">
                            {statusSteps.map((step, index) => (
                                <div key={step.key} className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl z-10 transition-all ${index <= getStatusIndex()
                                            ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-400'
                                        }`}>
                                        {step.icon}
                                    </div>
                                    <span className={`mt-3 text-sm font-medium ${index <= getStatusIndex() ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-center mt-6 text-gray-500 text-sm">
                        We'll update this page as your order progresses
                    </p>
                </div>
            )}

            {/* Order Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Order Details</h2>

                <div className="space-y-4">
                    {order.items?.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                                🍽️
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{item.menu_item?.name || `Item ${item.menu_item_id}`}</h4>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <span className="font-medium text-gray-900">
                                Rs. {(item.price * item.quantity).toFixed(0)}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                        <span>Total</span>
                        <span>Rs. {order.total_amount?.toFixed(0) || '0'}</span>
                    </div>
                </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Delivery Info</h2>

                <div className="space-y-3 text-gray-600">
                    <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                        <span>{order.customer_name || 'Guest'}</span>
                    </div>
                    <div className="flex items-start gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                        </svg>
                        <span>{order.customer_phone || 'N/A'}</span>
                    </div>
                    {order.customer_address && (
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <span>{order.customer_address}</span>
                        </div>
                    )}
                    {order.notes && (
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                            </svg>
                            <span className="italic">{order.notes}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Back to Menu */}
            <div className="text-center mt-8">
                <Link
                    to={`/r/${slug}`}
                    className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
                >
                    Order More
                </Link>
            </div>
        </div>
    );
};

export default OrderTracking;
