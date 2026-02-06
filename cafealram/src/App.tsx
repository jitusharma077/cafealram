import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import CustomerView from './pages/CustomerView';
import StaffLogin from './pages/StaffLogin';
import StaffDashboard from './pages/StaffDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import MenuManager from './pages/MenuManager';

function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 flex flex-col items-center justify-center p-6 text-white text-center">
            <h1 className="text-5xl font-bold mb-4">TablePing</h1>
            <p className="text-xl opacity-90 mb-12">The simplest restaurant service system.</p>

            <div className="space-y-4 w-full max-w-xs">
                <Link to="/r/cafe-alram/table/12" className="block w-full bg-white text-blue-600 font-bold py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-colors">
                    Simulate Customer (Table 12)
                </Link>
                <Link to="/staff?restaurantId=cafe-alram" className="block w-full bg-blue-500 bg-opacity-30 border-2 border-white/20 text-white font-bold py-4 rounded-xl hover:bg-opacity-40 transition-colors">
                    Staff Access
                </Link>
                <Link to="/admin" className="block w-full bg-gray-900 bg-opacity-50 border-2 border-gray-700 text-gray-200 font-bold py-4 rounded-xl hover:bg-opacity-70 transition-colors">
                    Admin Portal
                </Link>
            </div>

            <p className="mt-12 text-sm opacity-50">v0.1.0 MVP Demo</p>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/admin" element={<AdminDashboard />} />
                {/* Legacy route fallback or redirect? For now, we keep it simple or redirect to admin */}
                <Route path="/table/:tableId" element={<Navigate to="/" replace />} />

                {/* New Multi-tenant Route */}
                <Route path="/r/:restaurantId/table/:tableId" element={<CustomerView />} />

                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/menu/:restaurantId" element={<MenuManager />} />
                <Route path="/staff" element={<StaffLogin />} />
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
