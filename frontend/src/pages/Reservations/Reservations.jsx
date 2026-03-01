import { useState } from "react";
import { motion } from "framer-motion";

const Reservations = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: 2,
        occasion: "None",
        seating: "No Preference",
        requests: ""
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Reservation requested:", formData);
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: "",
                email: "",
                phone: "",
                date: "",
                time: "",
                guests: 2,
                occasion: "None",
                seating: "No Preference",
                requests: ""
            });
        }, 5000);
    };

    const occasions = ["None", "Birthday", "Anniversary", "Date Night", "Business Deal", "Celebration"];
    const seatingOptions = ["No Preference", "Standard", "Window Seat", "Outdoor Patio", "Bar Area", "Private Room"];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header Section */}
            <div className="relative pt-32 pb-20 px-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)' }}>
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-10 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-20 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative max-w-4xl mx-auto text-center z-10"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium mb-6 border border-white/20">
                        ✨ Fine Dining Experience
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                        Book your <span className="gradient-text">Table</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Reserve your spot for an unforgettable culinary journey at Gourmet Haven.
                        Experience world-class dining with exceptional service.
                    </p>
                </motion.div>

                {/* Wave bottom */}
                <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ height: '60px', transform: 'translateY(1px)' }}>
                    <path d="M0,0 V46.29 c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#f9fafb"></path>
                    <path d="M0,0 V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#f9fafb"></path>
                    <path d="M0,0 V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#f9fafb"></path>
                </svg>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20">
                <div className="grid lg:grid-cols-12 gap-8">

                    {/* Left Info Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-4 space-y-6"
                    >
                        {/* Info Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Reservation Info</h3>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Opening Hours</h4>
                                        <p className="text-sm text-gray-500 mt-1">Mon - Fri: 11:00 AM - 10:00 PM</p>
                                        <p className="text-sm text-gray-500">Sat - Sun: 10:00 AM - 11:00 PM</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Contact directly</h4>
                                        <p className="text-sm text-gray-500 mt-1">For parties larger than 10</p>
                                        <p className="font-semibold text-primary mt-1">+1 (555) 123-4567</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">Location</h4>
                                        <p className="text-sm text-gray-500 mt-1">123 Gourmet Street</p>
                                        <p className="text-sm text-gray-500">Food City, FC 12345</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Image decoration */}
                        <div className="rounded-3xl overflow-hidden shadow-xl h-64 relative group hidden lg:block">
                            <img
                                src="https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80"
                                alt="Dining"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                                <p className="text-white font-medium text-lg">Elevated Dining Experience</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form Panel */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="lg:col-span-8"
                    >
                        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden">
                            {/* Decorative background element */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            {isSubmitted ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="h-full min-h-[500px] flex flex-col items-center justify-center text-center py-12"
                                >
                                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-12 h-12 text-green-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Reservation Confirmed!</h3>
                                    <p className="text-lg text-gray-600 max-w-md">
                                        Thank you, <span className="font-bold">{formData.name || 'Guest'}</span>! Your table for <span className="font-bold">{formData.guests}</span> is reserved for <span className="font-bold">{formData.date}</span> at <span className="font-bold">{formData.time}</span>.
                                    </p>
                                    <p className="text-md text-gray-500 mt-4">
                                        We've sent a detailed confirmation to your email.
                                    </p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="mt-8 text-primary font-medium hover:underline"
                                    >
                                        Make another reservation
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                    <div>
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Details</h2>
                                        <p className="text-gray-500 mb-6">Let us know who we're preparing a table for.</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 block">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="e.g. Jane Doe"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 block">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="jane@example.com"
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2 lg:col-span-1">
                                                <label className="text-sm font-semibold text-gray-700 block">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                            <div className="space-y-2 md:col-span-2 lg:col-span-1">
                                                <label className="text-sm font-semibold text-gray-700 block">Number of Guests</label>
                                                <div className="relative">
                                                    <select
                                                        name="guests"
                                                        value={formData.guests}
                                                        onChange={handleChange}
                                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer text-gray-700"
                                                    >
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "10+"].map(num => (
                                                            <option key={num} value={num}>{num} Person{num !== 1 ? 's' : ''}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reservation Time</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 block">Date</label>
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-gray-700 bg-gray-50 focus:bg-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 block">Time</label>
                                                <input
                                                    type="time"
                                                    name="time"
                                                    value={formData.time}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-gray-700 bg-gray-50 focus:bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-gray-100">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Preferences</h2>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 block">Occasion</label>
                                                <div className="relative">
                                                    <select
                                                        name="occasion"
                                                        value={formData.occasion}
                                                        onChange={handleChange}
                                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer text-gray-700"
                                                    >
                                                        {occasions.map(occ => (
                                                            <option key={occ} value={occ}>{occ}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700 block">Seating Preference</label>
                                                <div className="relative">
                                                    <select
                                                        name="seating"
                                                        value={formData.seating}
                                                        onChange={handleChange}
                                                        className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-gray-50 focus:bg-white appearance-none cursor-pointer text-gray-700"
                                                    >
                                                        {seatingOptions.map(seat => (
                                                            <option key={seat} value={seat}>{seat}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700 block">Special Requests / Allergies</label>
                                            <textarea
                                                name="requests"
                                                value={formData.requests}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all resize-none bg-gray-50 focus:bg-white"
                                                placeholder="Please let us know if you have any dietary restrictions or special requests..."
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            className="w-full btn-primary py-5 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3"
                                        >
                                            <span>Complete Reservation</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                            </svg>
                                        </motion.button>
                                        <p className="text-center text-sm text-gray-400 mt-4">
                                            By confirming, you agree to our cancellation policy.
                                        </p>
                                    </div>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Reservations;
