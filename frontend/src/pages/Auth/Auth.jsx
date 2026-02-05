const Auth = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Login / Register</h2>
                <form>
                    <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-4" />
                    <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-6" />
                    <button className="w-full bg-primary text-white p-2 rounded">Login</button>
                </form>
            </div>
        </div>
    );
};
export default Auth;
