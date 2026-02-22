import { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { TenantContext, TenantProvider } from '../../context/TenantContext';
import { CartProvider } from '../../context/CartContext';

const RestaurantLayoutContent = () => {
    const { tenant, loading, error, slug } = useContext(TenantContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading restaurant...</p>
                </div>
            </div>
        );
    }

    if (error || !tenant) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md px-4">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Restaurant Not Found</h1>
                    <p className="text-gray-600 mb-6">
                        {error || "The restaurant you're looking for doesn't exist or may have been removed."}
                    </p>
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Restaurant Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to={`/r/${slug}`} className="flex items-center gap-4">
                            {tenant.logo_url ? (
                                <img
                                    src={tenant.logo_url}
                                    alt={tenant.name}
                                    className="w-12 h-12 rounded-xl object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl">
                                    {tenant.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{tenant.name}</h1>
                                {tenant.address && (
                                    <p className="text-sm text-gray-500 truncate max-w-xs">{tenant.address}</p>
                                )}
                            </div>
                        </Link>

                        <div className="flex items-center gap-4">
                            {tenant.phone && (
                                <a
                                    href={`tel:${tenant.phone}`}
                                    className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                    {tenant.phone}
                                </a>
                            )}

                            <Link
                                to={`/r/${slug}/cart`}
                                className="relative p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500 text-sm">© {new Date().getFullYear()} {tenant.name}. Powered by Gourmet Haven</p>
                </div>
            </footer>
        </div>
    );
};

const RestaurantLayout = () => {
    return (
        <TenantProvider>
            <CartProvider>
                <RestaurantLayoutContent />
            </CartProvider>
        </TenantProvider>
    );
};

export default RestaurantLayout;
