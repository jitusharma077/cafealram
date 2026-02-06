import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ServiceRequest, RequestType } from '../types';

interface AppContextType {
    requests: ServiceRequest[];
    addRequest: (tableId: string, type: RequestType) => void;
    completeRequest: (requestId: string) => void;
    activeTableRequest: (tableId: string) => ServiceRequest | undefined;
    staffAuthenticated: boolean;
    loginStaff: (code: string) => boolean;
    adminAuthenticated: boolean;
    loginAdmin: (password: string) => boolean;
    restaurantId: string | null;
    setRestaurantId: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STAFF_CODE = '1234';

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);

    const [staffAuthenticated, setStaffAuthenticated] = useState(() => {
        return localStorage.getItem('tableping_staff_auth') === 'true';
    });

    const [adminAuthenticated, setAdminAuthenticated] = useState(() => {
        return localStorage.getItem('tableping_admin_auth') === 'true';
    });

    // Fetch requests from backend
    const fetchRequests = async () => {
        // If no restaurantId is set, we might be in Admin mode or just initializing.
        // The backend returns ALL requests if no restaurantId is provided, which is what we want for Admin?
        // Or maybe we should only fetch if we are sure? 
        // For now, let's allow fetching all if no ID is set, OR we could enforce it.
        // Given the requirement "Admin dashboard... view multiple restaurants", fetching all is probably intended.
        try {
            const url = restaurantId ? `/api/requests?restaurantId=${restaurantId}` : '/api/requests';
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Failed to fetch requests:', error);
        }
    };

    // Poll for updates
    useEffect(() => {
        fetchRequests();
        const interval = setInterval(fetchRequests, 1000);
        return () => clearInterval(interval);
    }, [restaurantId]);

    const addRequest = async (tableId: string, type: RequestType) => {
        if (!restaurantId) return;

        // Allow concurrent requests (no blocking check)

        try {
            await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tableId, type, restaurantId })
            });
            // Immediate fetch to update UI
            fetchRequests();
        } catch (error) {
            console.error('Failed to add request:', error);
        }
    };

    const completeRequest = async (requestId: string) => {
        try {
            await fetch(`/api/requests/${requestId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'COMPLETED' })
            });
            fetchRequests();
        } catch (error) {
            console.error('Failed to complete request:', error);
        }
    };

    const activeTableRequest = (tableId: string) => {
        // Return latest pending request if any, useful for UI status
        return requests.find(r => r.tableId === tableId && r.status === 'PENDING');
    };

    const loginStaff = (code: string) => {
        // Simple global staff code for MVP
        if (code === STAFF_CODE) {
            setStaffAuthenticated(true);
            localStorage.setItem('tableping_staff_auth', 'true');
            return true;
        }
        return false;
    };

    const loginAdmin = (password: string) => {
        // Simple admin password
        if (password === 'admin') {
            setAdminAuthenticated(true);
            localStorage.setItem('tableping_admin_auth', 'true');
            return true;
        }
        return false;
    };

    return (
        <AppContext.Provider value={{
            requests,
            addRequest,
            completeRequest,
            activeTableRequest,
            staffAuthenticated,
            loginStaff,
            adminAuthenticated,
            loginAdmin,
            restaurantId,
            setRestaurantId
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};
