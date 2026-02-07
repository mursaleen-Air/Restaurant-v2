import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

// Fake order history for demo
const FAKE_ORDERS = [
    {
        id: "ORD-001",
        date: "2024-02-05",
        status: "Delivered",
        items: [
            { name: "Grilled Salmon", quantity: 1, price: 24.99 },
            { name: "Fresh Lemonade", quantity: 2, price: 4.99 }
        ],
        total: 34.97
    },
    {
        id: "ORD-002",
        date: "2024-02-01",
        status: "Delivered",
        items: [
            { name: "Beef Steak", quantity: 2, price: 29.99 },
            { name: "Garlic Bread", quantity: 1, price: 5.99 }
        ],
        total: 65.97
    },
    {
        id: "ORD-003",
        date: "2024-01-28",
        status: "Delivered",
        items: [
            { name: "Pasta Carbonara", quantity: 1, price: 16.99 },
            { name: "Tiramisu", quantity: 1, price: 7.99 },
            { name: "Iced Coffee", quantity: 1, price: 5.49 }
        ],
        total: 30.47
    }
];

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("orders");

    const statusColors = {
        "Delivered": "bg-green-100 text-green-700",
        "Processing": "bg-yellow-100 text-yellow-700",
        "Cancelled": "bg-red-100 text-red-700"
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 mb-8 relative overflow-hidden animate-fade-in-down">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>

                    <div className="relative flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl gradient-bg flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-bold text-white mb-1">
                                {user?.name || "Welcome!"}
                            </h1>
                            <p className="text-gray-400">{user?.email || "guest@example.com"}</p>
                            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                                <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">
                                    🍽️ {FAKE_ORDERS.length} Orders
                                </span>
                                <span className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80">
                                    ⭐ Loyal Customer
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="md:ml-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-all"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 animate-fade-in-up">
                    <button
                        onClick={() => setActiveTab("orders")}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "orders"
                                ? "gradient-bg text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        Order History
                    </button>
                    <button
                        onClick={() => setActiveTab("settings")}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${activeTab === "settings"
                                ? "gradient-bg text-white shadow-lg"
                                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                            }`}
                    >
                        Settings
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === "orders" && (
                    <div className="space-y-4 animate-fade-in-up">
                        {FAKE_ORDERS.map((order, index) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-gray-900">{order.id}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {new Date(order.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold gradient-text">${order.total.toFixed(2)}</p>
                                        <p className="text-sm text-gray-500">{order.items.length} items</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex flex-wrap gap-2">
                                        {order.items.map((item, i) => (
                                            <span key={i} className="px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-700">
                                                {item.quantity}x {item.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-4">
                                    <button className="px-4 py-2 text-primary hover:bg-primary/5 rounded-lg font-medium transition-all text-sm">
                                        View Details
                                    </button>
                                    <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-all text-sm">
                                        Reorder
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-fade-in-up">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue={user?.name || ""}
                                    placeholder="Your name"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    defaultValue={user?.email || ""}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Default Delivery Address</label>
                                <textarea
                                    placeholder="123 Main Street, Apt 4B, New York"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <button className="btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
