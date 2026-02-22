import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const Onboarding = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        description: '',
        address: '',
        phone: '',
        logo_url: '',
        business_hours: {
            monday: { open: '09:00', close: '22:00', closed: false },
            tuesday: { open: '09:00', close: '22:00', closed: false },
            wednesday: { open: '09:00', close: '22:00', closed: false },
            thursday: { open: '09:00', close: '22:00', closed: false },
            friday: { open: '09:00', close: '23:00', closed: false },
            saturday: { open: '10:00', close: '23:00', closed: false },
            sunday: { open: '10:00', close: '21:00', closed: false }
        }
    });

    const totalSteps = 3;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleComplete = async () => {
        setLoading(true);
        setError('');

        try {
            await api.post('/tenants/onboarding/complete', formData);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to complete onboarding');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const response = await api.post('/upload/image', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = `${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${response.data.url}`;
            setFormData({ ...formData, logo_url: imageUrl });
        } catch (err) {
            setError('Failed to upload logo');
        }
    };

    const updateBusinessHours = (day, field, value) => {
        setFormData({
            ...formData,
            business_hours: {
                ...formData.business_hours,
                [day]: {
                    ...formData.business_hours[day],
                    [field]: value
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Step {step} of {totalSteps}</span>
                        <span className="text-sm text-gray-500">{Math.round((step / totalSteps) * 100)}% complete</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                                {error}
                            </div>
                        )}

                        {/* Step 1: Description */}
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your restaurant</h2>
                                <p className="text-gray-600 mb-8">This information will be displayed on your public menu page.</p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"
                                            placeholder="Tell customers what makes your restaurant special..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Logo</label>
                                        <div className="flex items-center gap-6">
                                            {formData.logo_url ? (
                                                <div className="relative">
                                                    <img
                                                        src={formData.logo_url}
                                                        alt="Logo"
                                                        className="w-24 h-24 rounded-2xl object-cover"
                                                    />
                                                    <button
                                                        onClick={() => setFormData({ ...formData, logo_url: '' })}
                                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ) : (
                                                <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-orange-500 transition-colors">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleLogoUpload}
                                                        className="hidden"
                                                    />
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                    </svg>
                                                </label>
                                            )}
                                            <div className="text-sm text-gray-500">
                                                <p>Upload your restaurant logo</p>
                                                <p className="text-gray-400">PNG, JPG up to 5MB</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Contact Info */}
                        {step === 2 && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
                                <p className="text-gray-600 mb-8">How can customers reach you?</p>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows={2}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"
                                            placeholder="123 Main Street, City, Country"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                            placeholder="+92 300 1234567"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Business Hours */}
                        {step === 3 && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Business Hours</h2>
                                <p className="text-gray-600 mb-8">When is your restaurant open?</p>

                                <div className="space-y-4">
                                    {Object.entries(formData.business_hours).map(([day, hours]) => (
                                        <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                            <span className="w-24 font-medium text-gray-700 capitalize">{day}</span>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!hours.closed}
                                                    onChange={(e) => updateBusinessHours(day, 'closed', !e.target.checked)}
                                                    className="w-4 h-4 rounded text-orange-500"
                                                />
                                                <span className="text-sm text-gray-600">Open</span>
                                            </label>

                                            {!hours.closed && (
                                                <>
                                                    <input
                                                        type="time"
                                                        value={hours.open}
                                                        onChange={(e) => updateBusinessHours(day, 'open', e.target.value)}
                                                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                                    />
                                                    <span className="text-gray-400">to</span>
                                                    <input
                                                        type="time"
                                                        value={hours.close}
                                                        onChange={(e) => updateBusinessHours(day, 'close', e.target.value)}
                                                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                                    />
                                                </>
                                            )}

                                            {hours.closed && (
                                                <span className="text-gray-400 text-sm">Closed</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between">
                        {step > 1 ? (
                            <button
                                onClick={handleBack}
                                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                            >
                                ← Back
                            </button>
                        ) : (
                            <div></div>
                        )}

                        {step < totalSteps ? (
                            <button
                                onClick={handleNext}
                                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
                            >
                                Continue →
                            </button>
                        ) : (
                            <button
                                onClick={handleComplete}
                                disabled={loading}
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Saving...
                                    </>
                                ) : (
                                    'Complete Setup ✓'
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Skip Option */}
                <p className="text-center mt-6 text-gray-500">
                    <button
                        onClick={() => navigate('/admin')}
                        className="hover:text-gray-700 underline"
                    >
                        Skip for now
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Onboarding;
