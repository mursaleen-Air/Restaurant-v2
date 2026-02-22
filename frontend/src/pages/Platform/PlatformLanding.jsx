import { Link } from 'react-router-dom';

const PlatformLanding = () => {
    const features = [
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                </svg>
            ),
            title: "Restaurant Management",
            description: "Manage your menu, categories, and orders all in one place with our intuitive dashboard."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
            ),
            title: "Mobile Ordering",
            description: "Your customers can browse your menu and place orders from any device, anywhere."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                </svg>
            ),
            title: "Real-time Analytics",
            description: "Track your orders, revenue, and customer trends with powerful analytics."
        },
        {
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
            ),
            title: "Secure & Reliable",
            description: "Your data is protected with enterprise-grade security and 99.9% uptime."
        }
    ];

    const plans = [
        {
            name: "Free",
            price: "0",
            description: "Perfect for getting started",
            features: ["Up to 10 menu items", "50 orders per month", "Basic dashboard", "Email support"],
            popular: false
        },
        {
            name: "Pro",
            price: "29",
            description: "For growing restaurants",
            features: ["Up to 50 menu items", "Unlimited orders", "Analytics dashboard", "Priority support", "Custom branding"],
            popular: true
        },
        {
            name: "Enterprise",
            price: "99",
            description: "For large operations",
            features: ["Unlimited menu items", "Unlimited orders", "Advanced analytics", "24/7 priority support", "Custom domain", "API access"],
            popular: false
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>

                <div className="relative max-w-7xl mx-auto px-4 py-24 sm:py-32">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 animate-fade-in-down">
                            Your Restaurant,<br />Digitized
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto animate-fade-in">
                            Launch your online restaurant in minutes. Accept orders, manage your menu,
                            and grow your business with our powerful SaaS platform.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
                            <Link
                                to="/signup"
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-lg font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Start Free Trial
                            </Link>
                            <Link
                                to="/pricing"
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "500+", label: "Restaurants" },
                            { value: "50K+", label: "Orders Processed" },
                            { value: "99.9%", label: "Uptime" },
                            { value: "4.9/5", label: "Customer Rating" }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-4xl md:text-5xl font-bold text-orange-400">{stat.value}</p>
                                <p className="text-gray-400 mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Features Section */}
            < section className="py-24 bg-white" >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Powerful tools to run your restaurant online with ease
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Pricing Section */}
            < section className="py-24 bg-gradient-to-b from-gray-50 to-white" id="pricing" >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-gray-600">Choose the plan that fits your restaurant</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                className={`relative p-8 rounded-3xl ${plan.popular
                                    ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-2xl scale-105'
                                    : 'bg-white border border-gray-200 shadow-lg'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-sm font-medium text-white">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className={`text-sm mb-6 ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                                    {plan.description}
                                </p>
                                <div className="mb-8">
                                    <span className="text-5xl font-bold">${plan.price}</span>
                                    <span className={`${plan.popular ? 'text-gray-400' : 'text-gray-500'}`}>/month</span>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {plan.features.map((feature, fi) => (
                                        <li key={fi} className="flex items-center gap-3">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-5 h-5 ${plan.popular ? 'text-orange-400' : 'text-green-500'}`}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                            </svg>
                                            <span className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/signup"
                                    className={`block w-full py-4 rounded-xl font-semibold text-center transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:opacity-90'
                                        : 'bg-gray-900 text-white hover:bg-gray-800'
                                        }`}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* CTA Section */}
            < section className="py-24 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" >
                <div className="max-w-4xl mx-auto text-center px-4">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Transform Your Restaurant?
                    </h2>
                    <p className="text-xl text-white/90 mb-10">
                        Join hundreds of restaurants already using our platform to grow their business.
                    </p>
                    <Link
                        to="/signup"
                        className="inline-block px-10 py-5 bg-white text-gray-900 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Start Your Free Trial Today
                    </Link>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-gray-900 text-gray-400 py-12" >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <h3 className="text-2xl font-bold text-white mb-2">Gourmet Haven</h3>
                            <p className="text-sm">Restaurant Management Platform</p>
                        </div>
                        <div className="flex gap-8">
                            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                            <Link to="/signup" className="hover:text-white transition-colors">Sign Up</Link>
                            <Link to="/auth" className="hover:text-white transition-colors">Login</Link>
                        </div>
                    </div>
                    <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
                        © 2024 Gourmet Haven. All rights reserved.
                    </div>
                </div>
            </footer >
        </div >
    );
};

export default PlatformLanding;
