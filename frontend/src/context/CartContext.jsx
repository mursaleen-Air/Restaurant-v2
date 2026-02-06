import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart(prev => {
            const existingItem = prev.find(i => i.id === item.id);
            if (existingItem) {
                return prev.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(item => item.id !== itemId));
    };

    const increaseQuantity = (itemId) => {
        setCart(prev => prev.map(item =>
            item.id === itemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
        ));
    };

    const decreaseQuantity = (itemId) => {
        setCart(prev => prev.map(item => {
            if (item.id === itemId) {
                return item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item;
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            increaseQuantity,
            decreaseQuantity,
            clearCart,
            getCartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
