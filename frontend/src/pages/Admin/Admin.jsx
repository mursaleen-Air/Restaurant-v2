import { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

const Admin = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // State
    const [activeTab, setActiveTab] = useState("menu");
    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Modal states
    const [showItemModal, setShowItemModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    // Image upload states
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    // Form states
    const [itemForm, setItemForm] = useState({
        name: "",
        description: "",
        price: "",
        category_id: "",
        image_url: "",
        is_available: true
    });

    const [categoryForm, setCategoryForm] = useState({
        name: "",
        description: ""
    });

    // Fetch data on mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [catsRes, itemsRes, ordersRes] = await Promise.all([
                api.get("/categories/"),
                api.get("/menu/"),
                api.get("/orders/all").catch(() => ({ data: [] }))
            ]);
            setCategories(catsRes.data);
            setMenuItems(itemsRes.data);
            setOrders(ordersRes.data || []);
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    // ===== IMAGE UPLOAD =====
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError("Please select a valid image file (JPG, PNG, GIF, WEBP)");
            return;
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5MB");
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);

        // Upload file
        setUploading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/upload/image", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Set the image URL from the response
            const imageUrl = `http://localhost:8000${response.data.url}`;
            setItemForm(prev => ({ ...prev, image_url: imageUrl }));
            setSuccess("Image uploaded successfully!");
        } catch (err) {
            console.error("Upload error:", err);
            setError("Failed to upload image. Please try again.");
            setImagePreview(null);
        } finally {
            setUploading(false);
        }
    };

    // ===== MENU ITEMS CRUD =====
    const openAddItemModal = () => {
        setEditingItem(null);
        setItemForm({
            name: "",
            description: "",
            price: "",
            category_id: categories[0]?.id || "",
            image_url: "",
            is_available: true
        });
        setImagePreview(null);
        setShowItemModal(true);
    };

    const openEditItemModal = (item) => {
        setEditingItem(item);
        setItemForm({
            name: item.name,
            description: item.description || "",
            price: item.price.toString(),
            category_id: item.category_id,
            image_url: item.image_url || "",
            is_available: item.is_available
        });
        setImagePreview(item.image_url || null);
        setShowItemModal(true);
    };

    const handleItemSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const payload = {
            ...itemForm,
            price: parseFloat(itemForm.price),
            category_id: parseInt(itemForm.category_id)
        };

        try {
            if (editingItem) {
                await api.put(`/menu/${editingItem.id}`, payload);
                setSuccess("Menu item updated successfully!");
            } else {
                await api.post("/menu/", payload);
                setSuccess("Menu item added successfully!");
            }
            setShowItemModal(false);
            fetchData();
        } catch (err) {
            console.error("Error saving item:", err);
            setError(err.response?.data?.detail || "Failed to save menu item");
        }
    };

    const deleteItem = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            await api.delete(`/menu/${id}`);
            setSuccess("Menu item deleted!");
            fetchData();
        } catch (err) {
            setError("Failed to delete item");
        }
    };

    // ===== CATEGORIES CRUD =====
    const openAddCategoryModal = () => {
        setEditingCategory(null);
        setCategoryForm({ name: "", description: "" });
        setShowCategoryModal(true);
    };

    const openEditCategoryModal = (category) => {
        setEditingCategory(category);
        setCategoryForm({
            name: category.name,
            description: category.description || ""
        });
        setShowCategoryModal(true);
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory.id}`, categoryForm);
                setSuccess("Category updated successfully!");
            } else {
                await api.post("/categories/", categoryForm);
                setSuccess("Category added successfully!");
            }
            setShowCategoryModal(false);
            fetchData();
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to save category");
        }
    };

    const deleteCategory = async (id) => {
        if (!confirm("Are you sure? This will affect menu items in this category.")) return;

        try {
            await api.delete(`/categories/${id}`);
            setSuccess("Category deleted!");
            fetchData();
        } catch (err) {
            setError("Failed to delete category");
        }
    };

    // ===== ORDER STATUS UPDATE =====
    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: newStatus });
            setSuccess("Order status updated!");
            fetchData();
        } catch (err) {
            setError("Failed to update order status");
        }
    };

    const statusColors = {
        "pending": "bg-yellow-100 text-yellow-700",
        "processing": "bg-blue-100 text-blue-700",
        "completed": "bg-green-100 text-green-700",
        "cancelled": "bg-red-100 text-red-700"
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fade-in-down">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-500">Manage your restaurant's menu, categories, and orders</p>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-fade-in">
                        {error}
                        <button onClick={() => setError("")} className="float-right font-bold">&times;</button>
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 animate-fade-in">
                        {success}
                        <button onClick={() => setSuccess("")} className="float-right font-bold">&times;</button>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
                                <p className="text-gray-500 text-sm">Menu Items</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                                <p className="text-gray-500 text-sm">Categories</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                                <p className="text-gray-500 text-sm">Total Orders</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === 'pending').length}</p>
                                <p className="text-gray-500 text-sm">Pending Orders</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 overflow-x-auto">
                    {["menu", "categories", "orders"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-medium capitalize whitespace-nowrap transition-all ${activeTab === tab
                                    ? "gradient-bg text-white shadow-lg"
                                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                                }`}
                        >
                            {tab === "menu" ? "Menu Items" : tab}
                        </button>
                    ))}
                </div>

                {/* ===== MENU ITEMS TAB ===== */}
                {activeTab === "menu" && (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
                            <button
                                onClick={openAddItemModal}
                                className="btn-primary flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add Item
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-gray-600">Image</th>
                                        <th className="text-left p-4 font-medium text-gray-600">Name</th>
                                        <th className="text-left p-4 font-medium text-gray-600">Category</th>
                                        <th className="text-left p-4 font-medium text-gray-600">Price</th>
                                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                                        <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menuItems.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-500">
                                                No menu items yet. Click "Add Item" to create one.
                                            </td>
                                        </tr>
                                    ) : (
                                        menuItems.map(item => (
                                            <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                                                <td className="p-4">
                                                    <img
                                                        src={item.image_url || "https://via.placeholder.com/60"}
                                                        alt={item.name}
                                                        className="w-14 h-14 rounded-lg object-cover"
                                                    />
                                                </td>
                                                <td className="p-4">
                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-sm text-gray-500 truncate max-w-xs">{item.description}</p>
                                                </td>
                                                <td className="p-4 text-gray-600">
                                                    {categories.find(c => c.id === item.category_id)?.name || "N/A"}
                                                </td>
                                                <td className="p-4 font-medium text-gray-900">${item.price.toFixed(2)}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.is_available
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                        }`}>
                                                        {item.is_available ? "Available" : "Unavailable"}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openEditItemModal(item)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => deleteItem(item.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ===== CATEGORIES TAB ===== */}
                {activeTab === "categories" && (
                    <div className="animate-fade-in-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
                            <button
                                onClick={openAddCategoryModal}
                                className="btn-primary flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add Category
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.length === 0 ? (
                                <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-2xl border border-gray-100">
                                    No categories yet. Click "Add Category" to create one.
                                </div>
                            ) : (
                                categories.map(category => (
                                    <div key={category.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                                                <p className="text-gray-500 text-sm mt-1">{category.description || "No description"}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                                                {menuItems.filter(i => i.category_id === category.id).length} items
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openEditCategoryModal(category)}
                                                className="flex-1 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(category.id)}
                                                className="flex-1 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* ===== ORDERS TAB ===== */}
                {activeTab === "orders" && (
                    <div className="animate-fade-in-up">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Orders</h2>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left p-4 font-medium text-gray-600">Order ID</th>
                                        <th className="text-left p-4 font-medium text-gray-600">Customer</th>
                                        <th className="text-left p-4 font-medium text-gray-600">Items</th>
                                        <th className="text-left p-4 font-medium text-gray-600">Total</th>
                                        <th className="text-left p-4 font-medium text-gray-600">Status</th>
                                        <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="p-8 text-center text-gray-500">
                                                No orders yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map(order => (
                                            <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                                                <td className="p-4 font-medium text-gray-900">#{order.id}</td>
                                                <td className="p-4 text-gray-600">{order.user_id}</td>
                                                <td className="p-4 text-gray-600">{order.items?.length || 0} items</td>
                                                <td className="p-4 font-medium text-gray-900">${order.total_price?.toFixed(2) || "0.00"}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* ===== ADD/EDIT ITEM MODAL ===== */}
            {showItemModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
                            </h3>
                        </div>

                        <form onSubmit={handleItemSubmit} className="p-6 space-y-4">
                            {/* Image Upload Section */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-primary transition-colors">
                                    {imagePreview ? (
                                        <div className="relative">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImagePreview(null);
                                                    setItemForm(prev => ({ ...prev, image_url: "" }));
                                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                                }}
                                                className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="py-8 cursor-pointer"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {uploading ? (
                                                <div className="flex flex-col items-center">
                                                    <div className="spinner mb-2"></div>
                                                    <p className="text-gray-500">Uploading...</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-gray-400 mb-2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                                    </svg>
                                                    <p className="text-gray-600 font-medium">Click to upload image</p>
                                                    <p className="text-gray-400 text-sm mt-1">JPG, PNG, GIF, WEBP (max 5MB)</p>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>

                                {/* Or use URL */}
                                <div className="mt-3">
                                    <p className="text-sm text-gray-500 mb-2">Or paste an image URL:</p>
                                    <input
                                        type="url"
                                        value={itemForm.image_url}
                                        onChange={(e) => {
                                            setItemForm({ ...itemForm, image_url: e.target.value });
                                            setImagePreview(e.target.value);
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={itemForm.name}
                                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g., Grilled Salmon"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={itemForm.description}
                                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    placeholder="Describe the dish..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={itemForm.price}
                                        onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="24.99"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                                    <select
                                        value={itemForm.category_id}
                                        onChange={(e) => setItemForm({ ...itemForm, category_id: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    >
                                        <option value="">Select category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_available"
                                    checked={itemForm.is_available}
                                    onChange={(e) => setItemForm({ ...itemForm, is_available: e.target.checked })}
                                    className="w-5 h-5 rounded text-primary"
                                />
                                <label htmlFor="is_available" className="text-gray-700">Available for ordering</label>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowItemModal(false)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 gradient-bg text-white rounded-xl font-medium hover:opacity-90 transition-all"
                                >
                                    {editingItem ? "Update Item" : "Add Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ===== ADD/EDIT CATEGORY MODAL ===== */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scale-in">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900">
                                {editingCategory ? "Edit Category" : "Add New Category"}
                            </h3>
                        </div>

                        <form onSubmit={handleCategorySubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={categoryForm.name}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                                    placeholder="e.g., Appetizers"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea
                                    value={categoryForm.description}
                                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    placeholder="Describe this category..."
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryModal(false)}
                                    className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 gradient-bg text-white rounded-xl font-medium hover:opacity-90 transition-all"
                                >
                                    {editingCategory ? "Update" : "Add Category"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
