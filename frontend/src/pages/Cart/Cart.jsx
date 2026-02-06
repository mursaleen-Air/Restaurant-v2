import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import Button from "../../components/ui/Button";

const Cart = () => {
    const {
        cart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        getCartTotal
    } = useContext(CartContext);
    const navigate = useNavigate();

    const handleCheckout = () => {
        navigate("/checkout");
    };

    if (cart.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link to="/menu">
                    <Button>Browse Menu</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 space-y-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                                <div className="flex items-center gap-4 flex-grow">
                                    {item.image_url && (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-md bg-gray-100"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
                                        <p className="text-gray-500 text-sm">${item.price.toFixed(2)} per item</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center bg-gray-50 rounded-lg">
                                        <button
                                            onClick={() => decreaseQuantity(item.id)}
                                            className="px-3 py-1 text-gray-600 hover:text-primary transition"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                                        <button
                                            onClick={() => increaseQuantity(item.id)}
                                            className="px-3 py-1 text-gray-600 hover:text-primary transition"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="min-w-[80px] text-right font-bold text-gray-900">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                        title="Remove item"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-fit p-6">
                    <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Tax (Example 5%)</span>
                            <span>${(getCartTotal() * 0.05).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-4 flex justify-between font-bold text-lg text-gray-900">
                            <span>Total</span>
                            <span>${(getCartTotal() * 1.05).toFixed(2)}</span>
                        </div>
                    </div>
                    <Button onClick={handleCheckout} className="w-full justify-center py-3 text-lg">
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default Cart;
