const Button = ({ children, onClick, className = "", variant = "primary", disabled = false, type = "button" }) => {
    const baseStyle = "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
        primary: "bg-gradient-to-r from-primary to-orange-400 text-white hover:from-primary-dark hover:to-orange-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-primary/50",
        secondary: "bg-gradient-to-r from-secondary to-teal-400 text-white hover:from-secondary-dark hover:to-teal-500 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:ring-secondary/50",
        outline: "border-2 border-gray-200 text-gray-700 hover:border-primary hover:text-primary bg-white focus:ring-gray-200",
        ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-100",
        dark: "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl focus:ring-gray-900/50",
        danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl focus:ring-red-500/50"
    };

    const disabledStyle = "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-lg";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${disabled ? disabledStyle : ""} ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
