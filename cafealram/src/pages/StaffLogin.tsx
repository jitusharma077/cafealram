import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Lock } from 'lucide-react';

export default function StaffLogin() {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const { loginStaff, setRestaurantId } = useApp();
    const navigate = useNavigate();

    // Get restaurantId from URL
    const query = new URLSearchParams(window.location.search);
    const urlRestaurantId = query.get('restaurantId');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginStaff(code)) {
            if (urlRestaurantId) {
                setRestaurantId(urlRestaurantId);
            }
            navigate('/staff/dashboard');
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white">
            <div className="mb-8 flex flex-col items-center">
                <div className="bg-gray-800 p-4 rounded-full mb-4">
                    <Lock size={40} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold">Staff Access</h1>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4">
                <div>
                    <input
                        type="password"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter Code (1234)"
                        className="w-full text-center text-2xl tracking-widest bg-gray-800 border-2 border-gray-700 text-white rounded-xl py-4 px-4 focus:outline-none focus:border-blue-500 transition-colors"
                        maxLength={4}
                    />
                </div>

                {error && (
                    <div className="text-red-400 text-center text-sm font-medium animate-pulse">
                        Incorrect Code
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95"
                >
                    Enter
                </button>
            </form>
        </div>
    );
}
