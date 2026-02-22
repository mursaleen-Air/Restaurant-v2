import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const RestaurantSignup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [slugAvailable, setSlugAvailable] = useState(null);

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 50);
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        const slug = generateSlug(name);
        setFormData({ ...formData, name, slug });
        setSlugAvailable(null);
    };

    const handleSlugChange = (e) => {
        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setFormData({ ...formData, slug });
        setSlugAvailable(null);
    };

    const checkSlugAvailability = async () => {
        if (formData.slug.length < 3) return;
        try {
            await api.get(`/tenants/${formData.slug}`);
            setSlugAvailable(false); // Restaurant exists
        } catch (err) {
            if (err.response?.status === 404) {
                setSlugAvailable(true); // Available
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.slug.length < 3) {
            setError('Restaurant URL must be at least 3 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/tenants/register', {
                name: formData.name,
                slug: formData.slug,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || null
            });

            // Auto-login after registration
            const loginRes = await api.post('/auth/login-json', {
                email: formData.email,
                password: formData.password
            });
            localStorage.setItem('token', loginRes.data.access_token);

            // Navigate to onboarding
            navigate('/onboarding');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md animate-fade-in">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        Back to Home
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Restaurant</h1>
                    <p className="text-gray-600 mb-8">Start accepting online orders in minutes</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 animate-fade-in">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleNameChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                placeholder="e.g., Pizza Palace"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant URL *</label>
                            <div className="flex items-center">
                                <span className="px-4 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-gray-500 text-sm">
                                    /r/
                                </span>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={handleSlugChange}
                                    onBlur={checkSlugAvailability}
                                    required
                                    className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                    placeholder="pizza-palace"
                                />
                            </div>
                            {slugAvailable !== null && (
                                <p className={`mt-2 text-sm ${slugAvailable ? 'text-green-600' : 'text-red-600'}`}>
                                    {slugAvailable ? '✓ This URL is available' : '✗ This URL is already taken'}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                placeholder="you@restaurant.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone (Optional)</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                placeholder="+92 300 1234567"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm *</label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Creating...
                                </>
                            ) : (
                                'Create Restaurant'
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link to="/auth" className="text-orange-500 font-medium hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Panel - Graphics */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 items-center justify-center p-12">
                <div className="text-white text-center max-w-lg">
                    <div className="w-24 h-24 mx-auto mb-8 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold mb-4">Launch in Minutes</h2>
                    <p className="text-xl text-white/90 mb-8">
                        Set up your restaurant's online presence with our easy-to-use platform.
                        No technical skills required.
                    </p>
                    <div className="space-y-4 text-left">
                        {[
                            "Create your menu in minutes",
                            "Accept orders 24/7",
                            "Manage everything from one dashboard"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </div>
                                <span className="text-lg">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RestaurantSignup;
