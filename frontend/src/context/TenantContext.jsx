import { createContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export const TenantContext = createContext();

export const TenantProvider = ({ children }) => {
    const { slug } = useParams();
    const [tenant, setTenant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (slug) {
            fetchTenant();
        } else {
            setLoading(false);
        }
    }, [slug]);

    const fetchTenant = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/tenants/${slug}`);
            setTenant(response.data);
        } catch (err) {
            console.error('Failed to fetch tenant:', err);
            setError(err.response?.status === 404 ? 'Restaurant not found' : 'Failed to load restaurant');
            setTenant(null);
        } finally {
            setLoading(false);
        }
    };

    const refreshTenant = () => {
        if (slug) fetchTenant();
    };

    return (
        <TenantContext.Provider value={{ tenant, loading, error, refreshTenant, slug }}>
            {children}
        </TenantContext.Provider>
    );
};
