const Button = ({ children, onClick, className = "", variant = "primary" }) => {
    const baseStyle = "px-4 py-2 rounded focus:outline-none transition py-2";
    const variants = {
        primary: "bg-primary text-white hover:bg-opacity-90",
        secondary: "bg-secondary text-white hover:bg-opacity-90",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
        ghost: "text-gray-600 hover:bg-gray-100"
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};
export default Button;
